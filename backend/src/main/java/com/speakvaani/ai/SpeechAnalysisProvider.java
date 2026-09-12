package com.speakvaani.ai;

import com.speakvaani.dto.SpeechAnalysisDto;

public interface SpeechAnalysisProvider {
    SpeechAnalysisDto analyzeSpeech(
        String topicName,
        String categoryName,
        String transcript,
        int durationSeconds,
        String mode,
        String audience
    );

    boolean isAvailable();
}
