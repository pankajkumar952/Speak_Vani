package com.speakvaani.service;

import com.speakvaani.ai.OllamaSpeechAnalysisProvider;
import com.speakvaani.dto.SpeechAnalysisDto;
import com.speakvaani.dto.SpeechAnalysisRequest;
import com.speakvaani.entity.PracticeSession;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.PracticeSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpeechAnalysisService {

    private final OllamaSpeechAnalysisProvider ollamaProvider;
    private final PracticeSessionRepository sessionRepository;

    public SpeechAnalysisDto evaluate(SpeechAnalysisRequest request) {
        String topic = request.topicName() != null ? request.topicName() : "General Speech";
        String category = request.categoryName() != null ? request.categoryName() : "General";
        int duration = request.durationSeconds() != null ? request.durationSeconds() : 60;
        String mode = request.mode() != null ? request.mode() : "SELF";
        String audience = request.audience() != null ? request.audience() : "GENERAL";

        return ollamaProvider.analyzeSpeech(topic, category, request.transcript(), duration, mode, audience);
    }

    @Transactional
    public SpeechAnalysisDto analyzeSession(String sessionId, SpeechAnalysisRequest request, String userId) {
        PracticeSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Session not found"));

        SpeechAnalysisDto result = evaluate(request);

        session.setDurationSeconds(result.speakingDurationSeconds());
        session.setStatus(PracticeSession.SessionStatus.COMPLETED);
        sessionRepository.save(session);

        return result;
    }
}
