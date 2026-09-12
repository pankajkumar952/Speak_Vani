package com.speakvaani.controller;

import com.speakvaani.dto.TopicDto;
import com.speakvaani.dto.TopicInformationDto;
import com.speakvaani.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicDto>> getTopics(
        @RequestParam String categoryId,
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false, defaultValue = "GENERAL") String audience
    ) {
        return ResponseEntity.ok(topicService.getTopicsByCategory(categoryId, difficulty, audience));
    }

    @GetMapping("/random")
    public ResponseEntity<TopicDto> getRandomTopic(
        @RequestParam String categoryId,
        @RequestParam(required = false, defaultValue = "EASY") String difficulty,
        @RequestParam(required = false, defaultValue = "GENERAL") String audience
    ) {
        return ResponseEntity.ok(topicService.getRandomTopic(categoryId, difficulty, audience));
    }

    @PostMapping("/generate")
    public ResponseEntity<TopicDto> generateDynamicTopic(
        @RequestParam String categoryId,
        @RequestParam(required = false, defaultValue = "MEDIUM") String difficulty,
        @RequestParam(required = false, defaultValue = "GENERAL") String audience,
        @RequestParam(required = false, defaultValue = "SELF") String mode
    ) {
        return ResponseEntity.ok(topicService.generateDynamicTopic(categoryId, difficulty, audience, mode));
    }

    @GetMapping("/generate")
    public ResponseEntity<TopicDto> generateDynamicTopicGet(
        @RequestParam String categoryId,
        @RequestParam(required = false, defaultValue = "MEDIUM") String difficulty,
        @RequestParam(required = false, defaultValue = "GENERAL") String audience,
        @RequestParam(required = false, defaultValue = "SELF") String mode
    ) {
        return ResponseEntity.ok(topicService.generateDynamicTopic(categoryId, difficulty, audience, mode));
    }

    @GetMapping("/{topicId}/information")
    public ResponseEntity<TopicInformationDto> getTopicInformation(
        @PathVariable String topicId,
        @RequestParam(required = false, defaultValue = "GENERAL") String audience
    ) {
        return ResponseEntity.ok(topicService.getTopicInformation(topicId, audience));
    }

    @GetMapping("/{topicId}/script")
    public ResponseEntity<List<String>> getSpeechScript(
        @PathVariable String topicId,
        @RequestParam(required = false) String topicName
    ) {
        return ResponseEntity.ok(topicService.getSpeechScript(topicId, topicName));
    }

    @PostMapping("/speaking-guide")
    public ResponseEntity<com.speakvaani.dto.TopicSpeakingGuideDto> generateSpeakingGuide(
        @RequestParam String topicName,
        @RequestParam(required = false) String categoryName,
        @RequestParam(required = false, defaultValue = "MEDIUM") String difficulty,
        @RequestParam(required = false, defaultValue = "0") int angleIndex
    ) {
        return ResponseEntity.ok(topicService.generateSpeakingGuide(topicName, categoryName, difficulty, angleIndex));
    }

    @GetMapping("/speaking-guide")
    public ResponseEntity<com.speakvaani.dto.TopicSpeakingGuideDto> generateSpeakingGuideGet(
        @RequestParam String topicName,
        @RequestParam(required = false) String categoryName,
        @RequestParam(required = false, defaultValue = "MEDIUM") String difficulty,
        @RequestParam(required = false, defaultValue = "0") int angleIndex
    ) {
        return ResponseEntity.ok(topicService.generateSpeakingGuide(topicName, categoryName, difficulty, angleIndex));
    }
}
