package com.speakvaani.dto;

public record TopicDto(
    String id,
    String name,
    String categoryId,
    String categoryName,
    String difficulty,
    String audience,
    String topicType
) {
    public TopicDto(String id, String name, String categoryId, String categoryName, String difficulty) {
        this(id, name, categoryId, categoryName, difficulty, "GENERAL", "SIMPLE_TOPIC");
    }
}
