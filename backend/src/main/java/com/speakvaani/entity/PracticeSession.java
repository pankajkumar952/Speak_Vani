package com.speakvaani.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "practice_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticeSession {

    public enum PracticeMode {
        SELF, AI, STORY
    }

    public enum SessionStatus {
        CREATED, RECORDING, COMPLETED, FAILED
    }

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeMode mode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty")
    @Builder.Default
    private Topic.TopicDifficulty difficulty = Topic.TopicDifficulty.EASY;

    @Enumerated(EnumType.STRING)
    @Column(name = "audience")
    @Builder.Default
    private Topic.Audience audience = Topic.Audience.GENERAL;

    @Column(name = "time_limit_seconds")
    @Builder.Default
    private Integer timeLimitSeconds = 120;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private Recording recording;
}
