package com.speakvaani.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSessionRequest(
    @NotBlank(message = "categoryId is required")
    String categoryId,

    @NotBlank(message = "topicId is required")
    String topicId,

    @NotBlank(message = "mode is required")
    String mode, // 'SELF', 'AI', 'STORY'

    String difficulty, // 'EASY', 'MEDIUM', 'HARD'

    Integer timeLimitSeconds, // 30, 60, 120, 180, 300

    String audience // 'GENERAL', 'KIDS_5_7', 'KIDS_8_10', 'KIDS_11_13'
) {}
