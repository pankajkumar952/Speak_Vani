package com.speakvaani.dto;

public record AuthResponse(
    String token,
    String id,
    String name,
    String email
) {}
