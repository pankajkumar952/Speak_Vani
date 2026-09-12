package com.speakvaani.dto;

import java.util.List;

public record TopicInformationDto(
    String topic,
    String summary,
    List<String> keyPoints,
    List<String> talkingPoints,
    List<String> thinkingPrompts,
    String example
) {
    public TopicInformationDto(String topic, String summary, List<String> keyPoints, List<String> talkingPoints, String example) {
        this(topic, summary, keyPoints, talkingPoints, talkingPoints, example);
    }
}
