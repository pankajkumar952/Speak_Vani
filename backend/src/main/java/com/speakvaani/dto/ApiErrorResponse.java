package com.speakvaani.dto;

import java.time.OffsetDateTime;

public record ApiErrorResponse(
    OffsetDateTime timestamp,
    int status,
    String code,
    String message
) {}
