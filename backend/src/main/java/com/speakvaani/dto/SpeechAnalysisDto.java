package com.speakvaani.dto;

import java.util.List;
import java.util.Map;

public record SpeechAnalysisDto(
    double overallScore,
    double fluency,
    double clarity,
    double grammar,
    double vocabulary,
    double structure,
    double confidence,
    double speakingPaceWpm,
    int speakingDurationSeconds,
    int wordCount,
    FillerWordStatsDto fillerWords,
    List<String> strengths,
    List<String> improvements,
    List<BetterPhraseDto> betterPhrases,
    List<VocabularySuggestionDto> vocabularySuggestions,
    String followUpChallenge,
    String transcript
) {
    public record FillerWordStatsDto(
        int total,
        double ratePerMinute,
        Map<String, Integer> breakdown,
        String coachingTip
    ) {}

    public record BetterPhraseDto(
        String original,
        String improved,
        String reason
    ) {}

    public record VocabularySuggestionDto(
        String overusedWord,
        String context,
        List<String> alternatives
    ) {}
}
