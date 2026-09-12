package com.speakvaani.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "transcripts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transcript {

    @Id
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private PracticeSession session;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(name = "word_count")
    @Builder.Default
    private Integer wordCount = 0;

    @Column(name = "speaking_duration_seconds")
    @Builder.Default
    private Integer speakingDurationSeconds = 0;

    @Column(name = "words_per_minute")
    @Builder.Default
    private Double wordsPerMinute = 0.0;

    @Column(name = "language", length = 50)
    @Builder.Default
    private String language = "english";

    @Column(name = "provider", length = 100)
    @Builder.Default
    private String provider = "groq-whisper";

    @Column(name = "segments_json", columnDefinition = "TEXT")
    private String segmentsJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
