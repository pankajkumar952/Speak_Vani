package com.speakvaani.dto;

import java.time.OffsetDateTime;

public record UserDto(
    String id,
    String name,
    String email,
    OffsetDateTime createdAt
) {}
