package com.speakvaani.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeechMetricsDto {
    private int wordCount;
    private int characterCount;
    private int sentenceCount;
    private int durationSeconds;
    private double wordsPerMinute;
    private double averageWordsPerSentence;
    private int fillerWordCount;
    private double fillerWordsPerMinute;
    private FillerWordStatsDto fillerStats;
}
