package com.speakvaani.controller;

import com.speakvaani.dto.UserProgressDto;
import com.speakvaani.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final SessionService sessionService;

    @GetMapping("/me/progress")
    public ResponseEntity<UserProgressDto> getProgress(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(sessionService.getUserProgress(userId));
    }
}
