package com.speakvaani.dto;

import java.time.OffsetDateTime;

public record SessionDto(
    String sessionId,
    String categoryId,
    String categoryName,
    String topicId,
    String topicName,
    String mode,
    String difficulty,
    Integer timeLimitSeconds,
    String audience,
    String status,
    Integer durationSeconds,
    OffsetDateTime createdAt,
    OffsetDateTime completedAt
) {}
