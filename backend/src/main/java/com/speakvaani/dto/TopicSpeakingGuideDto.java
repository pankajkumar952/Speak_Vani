package com.speakvaani.dto;

import java.util.List;

public record TopicSpeakingGuideDto(
    String topicName,
    String angleName,
    int angleIndex,
    int totalAngles,
    String fullParagraph,
    List<SpeakingSectionDto> sections
) {
    public record SpeakingSectionDto(
        String title,
        String content
    ) {}
}
