package com.speakvaani.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpeechCoachingResponseDto {
    private String sessionId;
    private String recordingId;
    private String topicName;
    private String categoryName;
    private String mode;
    private String audience;
    private String status; // COMPLETED, INSUFFICIENT_DATA, FAILED, PARTIAL

    // Grounded score availability
    @Builder.Default
    private boolean scoreAvailable = true;
    private String scoreUnavailableReason;

    // Transcription details (Ground Truth)
    private String transcript;
    private String language;
    private boolean transcriptionSuccessful;
    private String transcriptionError;

    // Java Deterministic Metrics (Calculated by code, never by LLM)
    private SpeechMetricsDto metrics;

    // Holistic & Dimension Evaluations (Grounded in transcript)
    private Double overallScore;
    private DimensionEvaluationDto clarity;
    private DimensionEvaluationDto structure;
    private DimensionEvaluationDto vocabulary;
    private DimensionEvaluationDto grammar;
    private DimensionEvaluationDto argumentQuality;

    // Grounded Qualitative Insights (with direct transcript evidence citations)
    private List<GroundedFeedbackDto> strengths;
    private List<GroundedFeedbackDto> improvements;
    private List<GroundedBetterPhraseDto> betterPhrases;
    private String coachSummary;
    private String followUpChallenge;

    private boolean aiCoachingSuccessful;
    private String aiCoachingError;

    private Instant createdAt;
}
