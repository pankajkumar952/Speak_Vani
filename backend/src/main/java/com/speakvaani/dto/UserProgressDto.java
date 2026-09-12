package com.speakvaani.dto;

import java.util.List;

public record UserProgressDto(
    long totalSessions,
    double averageScore,
    double averageWpm,
    long totalWords,
    double averageFillerWords,
    int bestScore,
    int currentStreak,
    List<Integer> scoreHistory,
    List<Integer> fluencyHistory,
    List<Integer> fillerWordHistory
) {}
