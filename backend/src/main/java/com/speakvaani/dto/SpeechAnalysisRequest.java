package com.speakvaani.dto;

public record SpeechAnalysisRequest(
    String topicName,
    String categoryName,
    String transcript,
    Integer durationSeconds,
    String mode,
    String audience,
    String difficulty
) {}
