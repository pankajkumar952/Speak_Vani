package com.speakvaani.service;

import com.speakvaani.dto.CreateSessionRequest;
import com.speakvaani.dto.SessionDto;
import com.speakvaani.dto.UserProgressDto;
import com.speakvaani.entity.*;
import com.speakvaani.entity.Topic.Audience;
import com.speakvaani.entity.Topic.TopicDifficulty;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final PracticeSessionRepository sessionRepository;
    private final CategoryRepository categoryRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final RecordingRepository recordingRepository;

    private static final Set<Integer> ALLOWED_TIME_LIMITS = Set.of(30, 60, 120, 180, 300);

    @Value("${app.storage.recordings-path:./recordings}")
    private String recordingsStoragePath;

    @Transactional
    public SessionDto createSession(CreateSessionRequest request, String userId) {
        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found"));

        Topic topic = topicRepository.findById(request.topicId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "TOPIC_NOT_FOUND", "Topic not found"));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        PracticeSession.PracticeMode mode;
        try {
            mode = PracticeSession.PracticeMode.valueOf(request.mode().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_MODE", "Mode must be 'SELF', 'AI', or 'STORY'");
        }

        TopicDifficulty difficulty = TopicDifficulty.EASY;
        if (request.difficulty() != null && !request.difficulty().isBlank()) {
            try {
                difficulty = TopicDifficulty.valueOf(request.difficulty().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DIFFICULTY", "Difficulty must be 'EASY', 'MEDIUM', or 'HARD'");
            }
        }

        Audience audience = Audience.GENERAL;
        if (request.audience() != null && !request.audience().isBlank()) {
            try {
                audience = Audience.valueOf(request.audience().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid audience: {}, defaulting to GENERAL", request.audience());
            }
        }

        int timeLimitSeconds = 120;
        if (request.timeLimitSeconds() != null) {
            if (!ALLOWED_TIME_LIMITS.contains(request.timeLimitSeconds())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_TIME_LIMIT", "timeLimitSeconds must be one of: 30, 60, 120, 180, 300");
            }
            timeLimitSeconds = request.timeLimitSeconds();
        }

        PracticeSession session = PracticeSession.builder()
            .id(UUID.randomUUID().toString())
            .user(user)
            .category(category)
            .topic(topic)
            .mode(mode)
            .difficulty(difficulty)
            .audience(audience)
            .timeLimitSeconds(timeLimitSeconds)
            .status(PracticeSession.SessionStatus.RECORDING)
            .createdAt(OffsetDateTime.now())
            .build();

        session = sessionRepository.save(session);
        return mapToSessionDto(session);
    }

    @Transactional
    public SessionDto uploadRecording(String sessionId, MultipartFile file, String userId) {
        PracticeSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Session not found"));

        if (file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Uploaded recording is empty");
        }

        try {
            Path storageDir = Paths.get(recordingsStoragePath);
            if (!Files.exists(storageDir)) {
                Files.createDirectories(storageDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } else {
                extension = ".webm";
            }

            String fileName = sessionId + "_" + System.currentTimeMillis() + extension;
            Path filePath = storageDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Recording recording = Recording.builder()
                .id(UUID.randomUUID().toString())
                .session(session)
                .filePath(filePath.toString())
                .mimeType(file.getContentType() != null ? file.getContentType() : "video/webm")
                .createdAt(OffsetDateTime.now())
                .build();

            recordingRepository.save(recording);

            session.setStatus(PracticeSession.SessionStatus.COMPLETED);
            session.setCompletedAt(OffsetDateTime.now());
            session = sessionRepository.save(session);

            return mapToSessionDto(session);
        } catch (IOException e) {
            log.error("Failed to store recording for session {}: {}", sessionId, e.getMessage());
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "STORAGE_ERROR", "Failed to save recording file");
        }
    }

    @Transactional(readOnly = true)
    public SessionDto getSession(String sessionId, String userId) {
        PracticeSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Session not found"));

        return mapToSessionDto(session);
    }

    @Transactional(readOnly = true)
    public UserProgressDto getUserProgress(String userId) {
        long sessionCount = 0;
        if (userId != null) {
            sessionCount = sessionRepository.countByUserId(userId);
        } else {
            sessionCount = sessionRepository.count();
        }

        return new UserProgressDto(
            sessionCount,
            0.0,
            0.0,
            0L,
            0.0,
            0,
            (int) Math.min(sessionCount, 7),
            List.of(),
            List.of(),
            List.of()
        );
    }

    @Transactional
    public void deleteSession(String sessionId, String userId) {
        PracticeSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Session not found"));

        recordingRepository.findBySessionId(sessionId).ifPresent(recording -> {
            try {
                Files.deleteIfExists(Paths.get(recording.getFilePath()));
            } catch (IOException e) {
                log.warn("Failed to delete recording file for session {}: {}", sessionId, e.getMessage());
            }
            recordingRepository.delete(recording);
        });

        sessionRepository.delete(session);
    }

    private SessionDto mapToSessionDto(PracticeSession session) {
        return new SessionDto(
            session.getId(),
            session.getCategory().getId(),
            session.getCategory().getName(),
            session.getTopic().getId(),
            session.getTopic().getName(),
            session.getMode().name(),
            session.getDifficulty() != null ? session.getDifficulty().name() : "EASY",
            session.getTimeLimitSeconds() != null ? session.getTimeLimitSeconds() : 120,
            session.getAudience() != null ? session.getAudience().name() : "GENERAL",
            session.getStatus().name(),
            session.getDurationSeconds(),
            session.getCreatedAt(),
            session.getCompletedAt()
        );
    }
}
