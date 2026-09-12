package com.speakvaani.controller;

import com.speakvaani.dto.CreateSessionRequest;
import com.speakvaani.dto.SessionDto;
import com.speakvaani.dto.SpeechAnalysisDto;
import com.speakvaani.dto.SpeechAnalysisRequest;
import com.speakvaani.dto.SpeechCoachingResponseDto;
import com.speakvaani.service.SessionService;
import com.speakvaani.service.SpeechAnalysisService;
import com.speakvaani.service.SpeechCoachingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final SpeechAnalysisService speechAnalysisService;
    private final SpeechCoachingService speechCoachingService;

    @PostMapping
    public ResponseEntity<SessionDto> createSession(
        @Valid @RequestBody CreateSessionRequest request,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(sessionService.createSession(request, userId));
    }

    @PostMapping("/{sessionId}/recording")
    public ResponseEntity<SessionDto> uploadRecording(
        @PathVariable String sessionId,
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(sessionService.uploadRecording(sessionId, file, userId));
    }

    // Real AI Speech Coaching Pipeline (Groq Whisper STT -> Java Metrics -> Ollama -> DB Cache)
    @PostMapping("/{sessionId}/coach/analyze")
    public ResponseEntity<SpeechCoachingResponseDto> analyzeSpeechCoaching(
        @PathVariable String sessionId,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(speechCoachingService.analyzeSession(sessionId, userId, false));
    }

    @PostMapping("/{sessionId}/coach/reanalyze")
    public ResponseEntity<SpeechCoachingResponseDto> reanalyzeSpeechCoaching(
        @PathVariable String sessionId,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(speechCoachingService.analyzeSession(sessionId, userId, true));
    }

    @GetMapping("/{sessionId}/coach/analysis")
    public ResponseEntity<SpeechCoachingResponseDto> getSpeechCoaching(
        @PathVariable String sessionId,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(speechCoachingService.analyzeSession(sessionId, userId, false));
    }

    // Legacy / direct evaluation endpoints
    @PostMapping("/{sessionId}/analyze")
    public ResponseEntity<SpeechAnalysisDto> analyzeSession(
        @PathVariable String sessionId,
        @RequestBody SpeechAnalysisRequest request,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(speechAnalysisService.analyzeSession(sessionId, request, userId));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<SpeechAnalysisDto> evaluateSpeech(
        @RequestBody SpeechAnalysisRequest request
    ) {
        return ResponseEntity.ok(speechAnalysisService.evaluate(request));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDto> getSession(
        @PathVariable String sessionId,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(sessionService.getSession(sessionId, userId));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(
        @PathVariable String sessionId,
        @AuthenticationPrincipal String userId
    ) {
        sessionService.deleteSession(sessionId, userId);
        return ResponseEntity.noContent().build();
    }
}
