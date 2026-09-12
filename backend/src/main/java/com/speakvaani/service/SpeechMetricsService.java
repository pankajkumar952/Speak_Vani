package com.speakvaani.service;

import com.speakvaani.dto.FillerWordStatsDto;
import com.speakvaani.dto.SpeechMetricsDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class SpeechMetricsService {

    // Configurable filler dictionary
    private static final List<String> MULTI_WORD_FILLERS = List.of(
        "you know", "i mean", "sort of", "kind of"
    );

    private static final List<String> SINGLE_WORD_FILLERS = List.of(
        "um", "uh", "actually", "basically", "so"
    );

    /**
     * Compute deterministic speech metrics from transcript text and recording duration.
     *
     * @param transcript The transcribed speech text.
     * @param durationSeconds Measured recording duration in seconds.
     * @return Fully calculated SpeechMetricsDto.
     */
    public SpeechMetricsDto calculateMetrics(String transcript, int durationSeconds) {
        if (transcript == null || transcript.isBlank()) {
            return SpeechMetricsDto.builder()
                .wordCount(0)
                .characterCount(0)
                .sentenceCount(0)
                .durationSeconds(Math.max(1, durationSeconds))
                .wordsPerMinute(0.0)
                .averageWordsPerSentence(0.0)
                .fillerWordCount(0)
                .fillerWordsPerMinute(0.0)
                .fillerStats(new FillerWordStatsDto(0, 0.0, Map.of(), "No speech detected."))
                .build();
        }

        String trimmed = transcript.trim();
        int safeDuration = Math.max(1, durationSeconds);

        // 1. Word Count & Character Count
        String[] wordsArray = trimmed.split("\\s+");
        int wordCount = 0;
        int characterCount = 0;
        for (String w : wordsArray) {
            String cleaned = w.replaceAll("[^a-zA-Z0-9'-]", "");
            if (!cleaned.isBlank()) {
                wordCount++;
                characterCount += cleaned.length();
            }
        }
        if (wordCount == 0 && wordsArray.length > 0) {
            wordCount = wordsArray.length;
            characterCount = trimmed.length();
        }

        // 2. Sentence Count
        String[] sentences = trimmed.split("[.!?]+");
        int sentenceCount = 0;
        for (String s : sentences) {
            if (!s.trim().isEmpty()) {
                sentenceCount++;
            }
        }
        if (sentenceCount == 0) {
            sentenceCount = 1;
        }

        // 3. Words Per Minute (WPM)
        double minutes = safeDuration / 60.0;
        double rawWpm = (double) wordCount / minutes;
        double wordsPerMinute = roundToOneDecimal(rawWpm);

        // 4. Average Words Per Sentence
        double rawAwps = (double) wordCount / (double) sentenceCount;
        double avgWordsPerSentence = roundToOneDecimal(rawAwps);

        // 5. Filler Word Detection with Contextual Filtering
        FillerWordStatsDto fillerStats = analyzeFillerWords(trimmed, safeDuration);

        return SpeechMetricsDto.builder()
            .wordCount(wordCount)
            .characterCount(characterCount)
            .sentenceCount(sentenceCount)
            .durationSeconds(safeDuration)
            .wordsPerMinute(wordsPerMinute)
            .averageWordsPerSentence(avgWordsPerSentence)
            .fillerWordCount(fillerStats.getTotal())
            .fillerWordsPerMinute(fillerStats.getRatePerMinute())
            .fillerStats(fillerStats)
            .build();
    }

    private FillerWordStatsDto analyzeFillerWords(String text, int durationSeconds) {
        String lower = text.toLowerCase(Locale.ROOT);
        Map<String, Integer> counts = new LinkedHashMap<>();

        // Match multi-word fillers first
        String workingText = lower;
        for (String mw : MULTI_WORD_FILLERS) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(mw) + "\\b");
            Matcher matcher = pattern.matcher(workingText);
            int count = 0;
            while (matcher.find()) {
                count++;
            }
            if (count > 0) {
                counts.put(mw, count);
                // Replace matched occurrences with placeholders to prevent double-counting
                workingText = matcher.replaceAll("___");
            }
        }

        // Match single-word fillers
        for (String sw : SINGLE_WORD_FILLERS) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(sw) + "\\b");
            Matcher matcher = pattern.matcher(workingText);
            int count = 0;
            while (matcher.find()) {
                count++;
            }
            if (count > 0) {
                counts.put(sw, count);
            }
        }

        // Contextual analysis for "like" (filter out legitimate "would like", "looks like", "I like")
        int likeCount = countContextualLikeFillers(lower);
        if (likeCount > 0) {
            counts.put("like", likeCount);
        }

        int totalFillers = counts.values().stream().mapToInt(Integer::intValue).sum();
        double minutes = Math.max(1, durationSeconds) / 60.0;
        double ratePerMinute = roundToOneDecimal((double) totalFillers / minutes);

        String feedback;
        if (ratePerMinute <= 1.0) {
            feedback = "Exceptional verbal economy! Extremely crisp delivery with almost zero filler words.";
        } else if (ratePerMinute <= 3.0) {
            feedback = "Solid pacing. Minor filler usage that does not disrupt your listener's comprehension.";
        } else if (ratePerMinute <= 6.0) {
            feedback = "Moderate filler usage detected. Try pausing intentionally rather than using filler words.";
        } else {
            feedback = "High filler word density. Focus on deliberate 1-second pauses when transitioning thoughts.";
        }

        return FillerWordStatsDto.builder()
            .total(totalFillers)
            .ratePerMinute(ratePerMinute)
            .words(counts)
            .feedback(feedback)
            .build();
    }

    private int countContextualLikeFillers(String lower) {
        // Pattern matches standalone "like"
        Pattern pattern = Pattern.compile("\\b(like)\\b");
        Matcher matcher = pattern.matcher(lower);
        int fillerLike = 0;

        while (matcher.find()) {
            int start = matcher.start();
            int end = matcher.end();

            String prefix = lower.substring(Math.max(0, start - 15), start).trim();
            String suffix = lower.substring(end, Math.min(lower.length(), end + 15)).trim();

            // Legitimate usages: "i like", "would like", "feel like", "look like", "looks like", "sound like", "such as"
            boolean isLegitimateVerb = prefix.endsWith("i") || prefix.endsWith("would") ||
                prefix.endsWith("we") || prefix.endsWith("they") || prefix.endsWith("to") ||
                prefix.endsWith("feel") || prefix.endsWith("looks") || prefix.endsWith("look") ||
                prefix.endsWith("sound") || prefix.endsWith("sounds");

            boolean isComparison = suffix.startsWith("a ") || suffix.startsWith("an ") || suffix.startsWith("the ") || suffix.startsWith("this ");

            if (!isLegitimateVerb && !isComparison) {
                fillerLike++;
            }
        }
        return fillerLike;
    }

    private double roundToOneDecimal(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return 0.0;
        return BigDecimal.valueOf(val).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}
