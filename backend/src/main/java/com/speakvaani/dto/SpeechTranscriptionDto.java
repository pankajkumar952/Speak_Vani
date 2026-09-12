package com.speakvaani.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpeechTranscriptionDto {
    private String text;
    private String language;
    private Double durationSeconds;
    private List<TranscriptSegmentDto> segments;
    private String provider; // e.g. "groq-whisper-large-v3-turbo", "mock"
    private boolean successful;
    private String errorMessage;
}
