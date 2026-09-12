package com.speakvaani.controller;

import com.speakvaani.dto.CategoryDto;
import com.speakvaani.dto.TopicDto;
import com.speakvaani.service.CategoryService;
import com.speakvaani.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable String categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @GetMapping("/{categoryId}/topics")
    public ResponseEntity<List<TopicDto>> getTopicsByCategory(
        @PathVariable String categoryId,
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false) String audience
    ) {
        return ResponseEntity.ok(topicService.getTopicsByCategory(categoryId, difficulty, audience));
    }
}

