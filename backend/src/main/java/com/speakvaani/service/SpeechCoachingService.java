package com.speakvaani.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.speakvaani.ai.GroqSpeechToTextProvider;
import com.speakvaani.ai.MockSpeechToTextProvider;
import com.speakvaani.ai.OllamaSpeechAnalysisProvider;
import com.speakvaani.ai.SpeechToTextProvider;
import com.speakvaani.dto.*;
import com.speakvaani.entity.*;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@Slf4j
public class SpeechCoachingService {

    private final PracticeSessionRepository sessionRepository;
    private final RecordingRepository recordingRepository;
    private final TranscriptRepository transcriptRepository;
    private final SpeechAnalysisRepository speechAnalysisRepository;
    private final AiInsightsRepository aiInsightsRepository;

    private final GroqSpeechToTextProvider groqProvider;
    private final MockSpeechToTextProvider mockProvider;
    private final SpeechMetricsService speechMetricsService;
    private final OllamaSpeechAnalysisProvider ollamaProvider;
    private final ObjectMapper objectMapper;

    @Value("${app.stt.provider:groq}")
    private String configuredSttProvider;

    public SpeechCoachingService(
        PracticeSessionRepository sessionRepository,
        RecordingRepository recordingRepository,
        TranscriptRepository transcriptRepository,
        SpeechAnalysisRepository speechAnalysisRepository,
        AiInsightsRepository aiInsightsRepository,
        GroqSpeechToTextProvider groqProvider,
        MockSpeechToTextProvider mockProvider,
        SpeechMetricsService speechMetricsService,
        OllamaSpeechAnalysisProvider ollamaProvider,
        ObjectMapper objectMapper
    ) {
        this.sessionRepository = sessionRepository;
        this.recordingRepository = recordingRepository;
        this.transcriptRepository = transcriptRepository;
        this.speechAnalysisRepository = speechAnalysisRepository;
        this.aiInsightsRepository = aiInsightsRepository;
        this.groqProvider = groqProvider;
        this.mockProvider = mockProvider;
        this.speechMetricsService = speechMetricsService;
        this.ollamaProvider = ollamaProvider;
        this.objectMapper = objectMapper;
    }

    private SpeechToTextProvider getActiveSttProvider() {
        if ("mock".equalsIgnoreCase(configuredSttProvider)) {
            return mockProvider;
        }
        if (groqProvider.isAvailable()) {
            return groqProvider;
        }
        log.warn("Groq STT not available (missing key), falling back to mock provider in dev mode.");
        return mockProvider;
    }

    /**
     * Analyze or retrieve cached speech coaching results for a practice session.
     */
    @Transactional
    public SpeechCoachingResponseDto analyzeSession(String sessionId, String authenticatedUserId, boolean forceReanalyze) {
        PracticeSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Practice session not found: " + sessionId));

        // Ownership verification (if user is authenticated)
        if (authenticatedUserId != null && session.getUser() != null) {
            if (!session.getUser().getId().equals(authenticatedUserId)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You do not have access to this session.");
            }
        }

        // 1. Rate Limit & Cost Control: Check if analysis is already cached
        if (!forceReanalyze) {
            Optional<SpeechAnalysis> existingAnalysis = speechAnalysisRepository.findBySessionId(sessionId);
            Optional<Transcript> existingTranscript = transcriptRepository.findBySessionId(sessionId);
            Optional<AiInsights> existingInsights = aiInsightsRepository.findBySessionId(sessionId);

            if (existingAnalysis.isPresent() && existingTranscript.isPresent()) {
                log.info("Returning cached speech coaching analysis for session {}", sessionId);
                return mapToResponseDto(session, existingAnalysis.get(), existingTranscript.get(), existingInsights.orElse(null));
            }
        }

        // 2. Locate recording file
        Recording recording = recordingRepository.findBySessionId(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RECORDING_NOT_FOUND", "Recording not found for session: " + sessionId));

        Path recordingPath = Paths.get(recording.getFilePath());
        if (!recordingPath.isAbsolute()) {
            recordingPath = Paths.get(System.getProperty("user.dir")).resolve(recordingPath);
        }

        // 3. Transcribe speech using active STT provider (Groq Whisper)
        SpeechToTextProvider sttProvider = getActiveSttProvider();
        SpeechTranscriptionDto transcription = sttProvider.transcribe(recordingPath, "en");

        if (!transcription.isSuccessful() || transcription.getText() == null || transcription.getText().isBlank()) {
            log.warn("Speech transcription failed for session {}: {}", sessionId, transcription.getErrorMessage());

            return SpeechCoachingResponseDto.builder()
                .sessionId(sessionId)
                .recordingId(recording.getId())
                .topicName(session.getTopic().getName())
                .categoryName(session.getCategory().getName())
                .mode(session.getMode().name())
                .audience(session.getAudience().name())
                .status("FAILED")
                .scoreAvailable(false)
                .transcript("")
                .transcriptionSuccessful(false)
                .transcriptionError(transcription.getErrorMessage() != null ? transcription.getErrorMessage() : "Transcription unavailable")
                .aiCoachingSuccessful(false)
                .createdAt(Instant.now())
                .build();
        }

        // 4. Calculate deterministic speech metrics in Java
        int durationSeconds = recording.getDurationSeconds() != null && recording.getDurationSeconds() > 0
            ? recording.getDurationSeconds()
            : (transcription.getDurationSeconds() != null ? transcription.getDurationSeconds().intValue() : 45);

        SpeechMetricsDto metrics = speechMetricsService.calculateMetrics(transcription.getText(), durationSeconds);

        // 5. Run Ollama LLM qualitative coaching evaluation on transcript (strictly grounded)
        SpeechCoachingResponseDto evaluation = ollamaProvider.analyzeTranscript(
            sessionId,
            session.getTopic().getName(),
            session.getCategory().getName(),
            transcription.getText(),
            metrics,
            session.getMode().name(),
            session.getAudience().name()
        );

        evaluation.setRecordingId(recording.getId());

        // 6. Persist results in PostgreSQL database
        transcriptRepository.deleteBySessionId(sessionId);
        speechAnalysisRepository.deleteBySessionId(sessionId);
        aiInsightsRepository.deleteBySessionId(sessionId);

        String segmentsJson = null;
        try {
            if (transcription.getSegments() != null) {
                segmentsJson = objectMapper.writeValueAsString(transcription.getSegments());
            }
        } catch (Exception ignored) {}

        Transcript transcriptEntity = Transcript.builder()
            .id(UUID.randomUUID().toString())
            .session(session)
            .text(transcription.getText())
            .wordCount(metrics.getWordCount())
            .speakingDurationSeconds(metrics.getDurationSeconds())
            .wordsPerMinute(metrics.getWordsPerMinute())
            .language(transcription.getLanguage() != null ? transcription.getLanguage() : "english")
            .provider(transcription.getProvider())
            .segmentsJson(segmentsJson)
            .build();
        transcriptRepository.save(transcriptEntity);

        // Save SpeechAnalysis
        String fillerWordsJson = null;
        String betterPhrasesJson = null;
        try {
            if (metrics.getFillerStats() != null && metrics.getFillerStats().getWords() != null) {
                fillerWordsJson = objectMapper.writeValueAsString(metrics.getFillerStats().getWords());
            }
            if (evaluation.getBetterPhrases() != null) {
                betterPhrasesJson = objectMapper.writeValueAsString(evaluation.getBetterPhrases());
            }
        } catch (Exception ignored) {}

        double overall = evaluation.getOverallScore() != null ? evaluation.getOverallScore() : 8.0;
        double clarity = evaluation.getClarity() != null ? evaluation.getClarity().getScore() : 8.0;
        double structure = evaluation.getStructure() != null ? evaluation.getStructure().getScore() : 8.0;
        double vocab = evaluation.getVocabulary() != null ? evaluation.getVocabulary().getScore() : 8.0;
        double grammar = evaluation.getGrammar() != null ? evaluation.getGrammar().getScore() : 8.0;
        double arg = evaluation.getArgumentQuality() != null ? evaluation.getArgumentQuality().getScore() : 8.0;

        SpeechAnalysis speechAnalysisEntity = SpeechAnalysis.builder()
            .id(UUID.randomUUID().toString())
            .session(session)
            .status(evaluation.isScoreAvailable() ? SpeechAnalysis.AnalysisStatus.COMPLETED : SpeechAnalysis.AnalysisStatus.FAILED)
            .overallScore((int) Math.round(overall * 10))
            .fluencyScore((int) Math.round(clarity * 10))
            .relevanceScore((int) Math.round(clarity * 10))
            .structureScore((int) Math.round(structure * 10))
            .vocabularyScore((int) Math.round(vocab * 10))
            .argumentScore(arg)
            .concisenessScore(grammar)
            .fillerWordCount(metrics.getFillerWordCount())
            .characterCount(metrics.getCharacterCount())
            .sentenceCount(metrics.getSentenceCount())
            .fillerWordsJson(fillerWordsJson)
            .betterPhrasesJson(betterPhrasesJson)
            .coachSummary(evaluation.getCoachSummary())
            .followUpChallenge(evaluation.getFollowUpChallenge())
            .provider(transcription.getProvider())
            .build();
        speechAnalysisRepository.save(speechAnalysisEntity);

        // Save AiInsights
        List<String> strengthStrings = evaluation.getStrengths() != null
            ? evaluation.getStrengths().stream().map(GroundedFeedbackDto::getFeedback).toList()
            : List.of();
        List<String> improvementStrings = evaluation.getImprovements() != null
            ? evaluation.getImprovements().stream().map(GroundedFeedbackDto::getFeedback).toList()
            : List.of();

        AiInsights aiInsightsEntity = AiInsights.builder()
            .id(UUID.randomUUID().toString())
            .session(session)
            .strengths(strengthStrings.toArray(new String[0]))
            .weaknesses(improvementStrings.toArray(new String[0]))
            .suggestions(improvementStrings.toArray(new String[0]))
            .improvedAnswer(evaluation.getFollowUpChallenge())
            .build();
        aiInsightsRepository.save(aiInsightsEntity);

        // Update session status
        session.setStatus(PracticeSession.SessionStatus.COMPLETED);
        session.setDurationSeconds(metrics.getDurationSeconds());
        session.setCompletedAt(OffsetDateTime.now());
        sessionRepository.save(session);

        return evaluation;
    }

    /**
     * Map persisted JPA entities back into the API response DTO.
     */
    private SpeechCoachingResponseDto mapToResponseDto(
        PracticeSession session,
        SpeechAnalysis analysis,
        Transcript transcript,
        AiInsights insights
    ) {
        int duration = transcript.getSpeakingDurationSeconds() != null ? transcript.getSpeakingDurationSeconds() : 45;
        SpeechMetricsDto metrics = speechMetricsService.calculateMetrics(transcript.getText(), duration);

        List<GroundedBetterPhraseDto> betterPhrases = new ArrayList<>();
        if (analysis.getBetterPhrasesJson() != null && !analysis.getBetterPhrasesJson().isBlank()) {
            try {
                betterPhrases = objectMapper.readValue(analysis.getBetterPhrasesJson(), new TypeReference<List<GroundedBetterPhraseDto>>() {});
            } catch (Exception ignored) {}
        }

        List<GroundedFeedbackDto> strengths = new ArrayList<>();
        if (insights != null && insights.getStrengths() != null) {
            for (String s : insights.getStrengths()) {
                strengths.add(new GroundedFeedbackDto(s, "Observed in spoken transcript."));
            }
        }

        List<GroundedFeedbackDto> improvements = new ArrayList<>();
        if (insights != null && insights.getWeaknesses() != null) {
            for (String w : insights.getWeaknesses()) {
                improvements.add(new GroundedFeedbackDto(w, "Identified from transcript progression."));
            }
        }

        double overall = analysis.getOverallScore() != null ? analysis.getOverallScore() / 10.0 : 8.0;
        double clarity = analysis.getRelevanceScore() != null ? analysis.getRelevanceScore() / 10.0 : 8.2;
        double structure = analysis.getStructureScore() != null ? analysis.getStructureScore() / 10.0 : 8.0;
        double grammar = analysis.getConcisenessScore() != null ? analysis.getConcisenessScore() : 7.9;
        double vocab = analysis.getVocabularyScore() != null ? analysis.getVocabularyScore() / 10.0 : 8.1;
        double arg = analysis.getArgumentScore() != null ? analysis.getArgumentScore() : 8.0;

        return SpeechCoachingResponseDto.builder()
            .sessionId(session.getId())
            .recordingId(session.getRecording() != null ? session.getRecording().getId() : null)
            .topicName(session.getTopic().getName())
            .categoryName(session.getCategory().getName())
            .mode(session.getMode().name())
            .audience(session.getAudience().name())
            .status(analysis.getStatus().name())
            .scoreAvailable(analysis.getStatus() != SpeechAnalysis.AnalysisStatus.FAILED)
            .transcript(transcript.getText())
            .language(transcript.getLanguage())
            .transcriptionSuccessful(true)
            .metrics(metrics)
            .overallScore(overall)
            .clarity(new DimensionEvaluationDto(clarity, "Communication clarity based on spoken pace & diction."))
            .structure(new DimensionEvaluationDto(structure, "Topical structure and progression."))
            .vocabulary(new DimensionEvaluationDto(vocab, "Vocabulary variety index."))
            .grammar(new DimensionEvaluationDto(grammar, "Grammatical sentence construction."))
            .argumentQuality(new DimensionEvaluationDto(arg, "Argument persuasiveness and thesis support."))
            .strengths(strengths)
            .improvements(improvements)
            .betterPhrases(betterPhrases)
            .coachSummary(analysis.getCoachSummary())
            .followUpChallenge(analysis.getFollowUpChallenge())
            .aiCoachingSuccessful(true)
            .createdAt(analysis.getCreatedAt() != null ? analysis.getCreatedAt().toInstant() : Instant.now())
            .build();
    }
}
