package com.speakvaani.controller;

import com.speakvaani.ai.OllamaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final OllamaClient ollamaClient;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "SpeakVaani Backend API",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/ai")
    public ResponseEntity<Map<String, Object>> getAiHealth() {
        boolean available = ollamaClient.isAvailable();
        return ResponseEntity.ok(Map.of(
            "service", "Ollama AI Engine",
            "status", available ? "UP" : "DOWN",
            "available", available
        ));
    }
}
