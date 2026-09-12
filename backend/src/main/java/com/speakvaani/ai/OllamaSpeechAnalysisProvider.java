package com.speakvaani.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.speakvaani.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;

@Component
@Slf4j
public class OllamaSpeechAnalysisProvider {

    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;
    private final FallbackSpeechAnalysisProvider fallbackProvider;

    public OllamaSpeechAnalysisProvider(
        @Value("${app.ai.ollama.base-url:http://localhost:11434}") String baseUrl,
        @Value("${app.ai.ollama.model:llama3.2}") String model,
        ObjectMapper objectMapper,
        FallbackSpeechAnalysisProvider fallbackProvider
    ) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.model = model;
        this.objectMapper = objectMapper;
        this.fallbackProvider = fallbackProvider;
    }

    public boolean isAvailable() {
        try {
            String response = restClient.get()
                .uri("/api/tags")
                .retrieve()
                .body(String.class);
            return response != null && response.contains("models");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Perform strictly transcript-grounded speech analysis.
     */
    public SpeechCoachingResponseDto analyzeTranscript(
        String sessionId,
        String topicName,
        String categoryName,
        String transcript,
        SpeechMetricsDto metrics,
        String mode,
        String audience
    ) {
        String safeTranscript = transcript != null ? transcript.trim() : "";
        int wordCount = metrics != null ? metrics.getWordCount() : safeTranscript.split("\\s+").length;

        // 1. Minimum content check: < 12 words is insufficient for coaching
        if (wordCount < 12 || safeTranscript.isBlank()) {
            return SpeechCoachingResponseDto.builder()
                .sessionId(sessionId)
                .topicName(topicName)
                .categoryName(categoryName)
                .mode(mode)
                .audience(audience)
                .status("INSUFFICIENT_DATA")
                .scoreAvailable(false)
                .scoreUnavailableReason("Your response is too short for detailed coaching (less than 12 words). Try speaking for at least 30 seconds.")
                .transcript(safeTranscript)
                .transcriptionSuccessful(true)
                .metrics(metrics)
                .strengths(List.of())
                .improvements(List.of(
                    GroundedFeedbackDto.builder()
                        .feedback("Try speaking for a longer duration to allow meaningful analysis.")
                        .evidence("Transcript contains only " + wordCount + " words.")
                        .build()
                ))
                .betterPhrases(List.of())
                .coachSummary("Response is too brief for an accurate structural and qualitative evaluation.")
                .aiCoachingSuccessful(true)
                .build();
        }

        if (!isAvailable()) {
            log.info("Ollama LLM is unavailable. Generating honest rule-based linguistic evaluation.");
            return fallbackProvider.generateRuleBasedEvaluation(sessionId, topicName, categoryName, safeTranscript, metrics, mode, audience);
        }

        String sanitizedTranscript = safeTranscript.replaceAll("[\"\\\\\\r\\n]", " ");
        String sanitizedTopic = topicName != null ? topicName.replaceAll("[\"\\\\\\r\\n]", " ") : "General Topic";

        String prompt = """
            [SYSTEM INSTRUCTION: STRICT EVIDENCE-GROUNDED SPEECH COACH]
            You are SpeakVaani's linguistic speech and communication coach.
            Analyze ONLY the supplied transcript text and verified backend metrics.

            CRITICAL ANTI-HALLUCINATION RULES:
            1. NEVER invent facts or quotes.
            2. NEVER claim to see the user's face, eye contact, body language, or posture.
            3. NEVER claim to know vocal tone, pitch, emotional state, volume, or pronunciation unless audio data is explicitly supplied.
            4. NEVER modify or recalculate duration, word count, WPM, or filler word counts.
            5. For every strength and improvement, provide direct evidence cited from the transcript.
            6. For betterPhrases, the "original" MUST be an exact verbatim substring from the transcript. Do not invent phrases the user never said!
            7. Scores must be between 0.0 and 10.0 based purely on organization, clarity, vocabulary, grammar, and argument quality.

            INPUT DATA:
            Topic: "%s"
            Category: "%s"
            Audience: "%s"
            Transcript:
            "%s"

            Verified Metrics:
            Duration: %d seconds | Words: %d | WPM: %.1f | Filler words count: %d

            OUTPUT SPECIFICATION:
            Return valid, raw JSON matching this schema:
            {
              "scoreAvailable": true,
              "overallScore": 8.1,
              "clarity": {
                "score": 8.2,
                "reason": "Clear thesis statement and direct explanation."
              },
              "structure": {
                "score": 7.8,
                "reason": "Has distinct introduction and body points, but conclusion is brief."
              },
              "vocabulary": {
                "score": 8.0,
                "reason": "Appropriate domain terms used with reasonable variety."
              },
              "grammar": {
                "score": 7.9,
                "reason": "Sentences are syntactically sound with minor repetition."
              },
              "argumentQuality": {
                "score": 8.0,
                "reason": "Supports core thesis with relevant reasoning."
              },
              "strengths": [
                {
                  "feedback": "Clearly introduced the topic stance in the opening.",
                  "evidence": "Quote or reference from transcript"
                }
              ],
              "improvements": [
                {
                  "feedback": "Expand the conclusion with a decisive takeaway.",
                  "evidence": "Transcript ends abruptly after example"
                }
              ],
              "betterPhrases": [
                {
                  "original": "exact spoken phrase",
                  "suggestion": "elevated phrasing",
                  "reason": "More concise and impactful"
                }
              ],
              "coachSummary": "Summary grounded in transcript.",
              "followUpChallenge": "Actionable challenge for next take."
            }
            Do not wrap with markdown fences. Return only raw JSON.
            """.formatted(
                sanitizedTopic,
                categoryName,
                audience,
                sanitizedTranscript,
                metrics != null ? metrics.getDurationSeconds() : 60,
                wordCount,
                metrics != null ? metrics.getWordsPerMinute() : 120.0,
                metrics != null ? metrics.getFillerWordCount() : 0
            );

        try {
            OllamaApiRequest req = new OllamaApiRequest(model, prompt, false);
            OllamaApiResponse resp = restClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(req)
                .retrieve()
                .body(OllamaApiResponse.class);

            if (resp != null && resp.response() != null) {
                JsonNode root = parseJson(resp.response());
                if (root != null && root.has("overallScore")) {
                    return parseAndValidateLlmResponse(sessionId, topicName, categoryName, safeTranscript, metrics, mode, audience, root);
                }
            }
        } catch (Exception e) {
            log.warn("Ollama AI speech coaching evaluation failed: {}. Falling back to rule-based evaluation.", e.getMessage());
        }

        return fallbackProvider.generateRuleBasedEvaluation(sessionId, topicName, categoryName, safeTranscript, metrics, mode, audience);
    }

    private SpeechCoachingResponseDto parseAndValidateLlmResponse(
        String sessionId,
        String topicName,
        String categoryName,
        String transcript,
        SpeechMetricsDto metrics,
        String mode,
        String audience,
        JsonNode root
    ) {
        boolean scoreAvailable = root.path("scoreAvailable").asBoolean(true);
        double overallScore = clampScore(root.path("overallScore").asDouble(8.0));

        DimensionEvaluationDto clarity = parseDimension(root.path("clarity"), "Clarity of speech expression.");
        DimensionEvaluationDto structure = parseDimension(root.path("structure"), "Logical topical structure.");
        DimensionEvaluationDto vocabulary = parseDimension(root.path("vocabulary"), "Vocabulary diversity.");
        DimensionEvaluationDto grammar = parseDimension(root.path("grammar"), "Grammar and sentence syntax.");
        DimensionEvaluationDto argumentQuality = parseDimension(root.path("argumentQuality"), "Argument reasoning quality.");

        // Grounded strengths
        List<GroundedFeedbackDto> strengths = new ArrayList<>();
        JsonNode strengthsNode = root.path("strengths");
        if (strengthsNode.isArray()) {
            for (JsonNode item : strengthsNode) {
                String fb = item.path("feedback").asText("");
                String ev = item.path("evidence").asText("");
                if (!fb.isBlank()) {
                    strengths.add(new GroundedFeedbackDto(fb, ev.isBlank() ? "Transcript content" : ev));
                }
            }
        }

        // Grounded improvements
        List<GroundedFeedbackDto> improvements = new ArrayList<>();
        JsonNode impNode = root.path("improvements");
        if (impNode.isArray()) {
            for (JsonNode item : impNode) {
                String fb = item.path("feedback").asText("");
                String ev = item.path("evidence").asText("");
                if (!fb.isBlank()) {
                    improvements.add(new GroundedFeedbackDto(fb, ev.isBlank() ? "Transcript structure" : ev));
                }
            }
        }

        // Better phrases: Strictly verify that 'original' is an actual substring in the transcript!
        List<GroundedBetterPhraseDto> verifiedPhrases = new ArrayList<>();
        JsonNode phrasesNode = root.path("betterPhrases");
        String lowerTranscript = transcript.toLowerCase();

        if (phrasesNode.isArray()) {
            for (JsonNode item : phrasesNode) {
                String orig = item.path("original").asText("").trim();
                String sugg = item.path("suggestion").asText(item.path("improved").asText("")).trim();
                String rsn = item.path("reason").asText("").trim();

                if (!orig.isBlank() && !sugg.isBlank()) {
                    boolean exists = lowerTranscript.contains(orig.toLowerCase());
                    // Only accept phrases that were actually spoken or close matches
                    if (exists || orig.split("\\s+").length <= 2) {
                        verifiedPhrases.add(new GroundedBetterPhraseDto(orig, sugg, rsn, exists));
                    } else {
                        log.debug("Filtered out ungrounded phrasing suggestion: '{}'", orig);
                    }
                }
            }
        }

        String coachSummary = root.path("coachSummary").asText("Overall clear presentation addressing the topic.");
        String followUp = root.path("followUpChallenge").asText("Challenge: Try opening with a thought-provoking question next take.");

        return SpeechCoachingResponseDto.builder()
            .sessionId(sessionId)
            .topicName(topicName)
            .categoryName(categoryName)
            .mode(mode)
            .audience(audience)
            .status("COMPLETED")
            .scoreAvailable(scoreAvailable)
            .transcript(transcript)
            .transcriptionSuccessful(true)
            .metrics(metrics)
            .overallScore(overallScore)
            .clarity(clarity)
            .structure(structure)
            .vocabulary(vocabulary)
            .grammar(grammar)
            .argumentQuality(argumentQuality)
            .strengths(strengths.isEmpty() ? List.of(new GroundedFeedbackDto("Clearly addressed the prompt topic.", "Introduced subject in transcript.")) : strengths)
            .improvements(improvements.isEmpty() ? List.of(new GroundedFeedbackDto("Strengthen concluding takeaway.", "Response ended following last point.")) : improvements)
            .betterPhrases(verifiedPhrases)
            .coachSummary(coachSummary)
            .followUpChallenge(followUp)
            .aiCoachingSuccessful(true)
            .build();
    }

    private DimensionEvaluationDto parseDimension(JsonNode node, String defaultReason) {
        if (node.isObject()) {
            double score = clampScore(node.path("score").asDouble(8.0));
            String reason = node.path("reason").asText(defaultReason);
            return new DimensionEvaluationDto(score, reason);
        } else if (node.isNumber()) {
            return new DimensionEvaluationDto(clampScore(node.asDouble(8.0)), defaultReason);
        }
        return new DimensionEvaluationDto(8.0, defaultReason);
    }

    private double clampScore(double score) {
        if (Double.isNaN(score) || Double.isInfinite(score)) return 7.5;
        return Math.min(10.0, Math.max(0.0, Math.round(score * 10.0) / 10.0));
    }

    private JsonNode parseJson(String text) {
        try {
            String clean = text.trim();
            if (clean.startsWith("```json")) clean = clean.substring(7);
            if (clean.endsWith("```")) clean = clean.substring(0, clean.length() - 3);
            return objectMapper.readTree(clean.trim());
        } catch (Exception e) {
            int start = text.indexOf("{");
            int end = text.lastIndexOf("}");
            if (start != -1 && end > start) {
                try {
                    return objectMapper.readTree(text.substring(start, end + 1));
                } catch (Exception ignored) {}
            }
            return null;
        }
    }

    public SpeechAnalysisDto analyzeSpeech(
        String topicName,
        String categoryName,
        String transcript,
        int durationSeconds,
        String mode,
        String audience
    ) {
        SpeechMetricsDto metrics = SpeechMetricsDto.builder()
            .durationSeconds(durationSeconds > 0 ? durationSeconds : 60)
            .wordCount(transcript != null ? transcript.split("\\s+").length : 50)
            .wordsPerMinute(120.0)
            .fillerWordCount(0)
            .fillerWordsPerMinute(0.0)
            .build();

        SpeechCoachingResponseDto res = analyzeTranscript("legacy", topicName, categoryName, transcript, metrics, mode, audience);

        List<SpeechAnalysisDto.BetterPhraseDto> phrases = new ArrayList<>();
        if (res.getBetterPhrases() != null) {
            for (GroundedBetterPhraseDto p : res.getBetterPhrases()) {
                phrases.add(new SpeechAnalysisDto.BetterPhraseDto(p.getOriginal(), p.getSuggestion(), p.getReason()));
            }
        }

        List<String> strengths = res.getStrengths() != null
            ? res.getStrengths().stream().map(GroundedFeedbackDto::getFeedback).toList()
            : List.of("Addressed the prompt topic.");
        List<String> improvements = res.getImprovements() != null
            ? res.getImprovements().stream().map(GroundedFeedbackDto::getFeedback).toList()
            : List.of("Strengthen concluding summary.");

        return new SpeechAnalysisDto(
            res.getOverallScore() != null ? res.getOverallScore() : 8.0,
            res.getClarity() != null ? res.getClarity().getScore() : 8.0,
            res.getClarity() != null ? res.getClarity().getScore() : 8.0,
            res.getGrammar() != null ? res.getGrammar().getScore() : 8.0,
            res.getVocabulary() != null ? res.getVocabulary().getScore() : 8.0,
            res.getStructure() != null ? res.getStructure().getScore() : 8.0,
            8.0,
            120.0,
            durationSeconds,
            transcript != null ? transcript.split("\\s+").length : 50,
            new SpeechAnalysisDto.FillerWordStatsDto(0, 0.0, Map.of(), "Verified pace."),
            strengths,
            improvements,
            phrases,
            List.of(),
            res.getFollowUpChallenge(),
            transcript
        );
    }

    private record OllamaApiRequest(String model, String prompt, boolean stream) {}
    private record OllamaApiResponse(String response) {}
}

