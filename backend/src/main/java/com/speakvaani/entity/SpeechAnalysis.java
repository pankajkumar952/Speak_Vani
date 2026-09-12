package com.speakvaani.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "speech_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpeechAnalysis {

    public enum AnalysisStatus {
        PENDING, TRANSCRIBING, ANALYZING, COMPLETED, FAILED
    }

    @Id
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private PracticeSession session;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private AnalysisStatus status = AnalysisStatus.COMPLETED;

    @Column(name = "overall_score")
    @Builder.Default
    private Integer overallScore = 0; // Scaled 0-100 or 0-10

    @Column(name = "fluency_score")
    @Builder.Default
    private Integer fluencyScore = 0;

    @Column(name = "relevance_score")
    @Builder.Default
    private Integer relevanceScore = 0;

    @Column(name = "structure_score")
    @Builder.Default
    private Integer structureScore = 0;

    @Column(name = "vocabulary_score")
    @Builder.Default
    private Integer vocabularyScore = 0;

    @Column(name = "argument_score")
    @Builder.Default
    private Double argumentScore = 0.0;

    @Column(name = "conciseness_score")
    @Builder.Default
    private Double concisenessScore = 0.0;

    @Column(name = "filler_word_count")
    @Builder.Default
    private Integer fillerWordCount = 0;

    @Column(name = "character_count")
    @Builder.Default
    private Integer characterCount = 0;

    @Column(name = "sentence_count")
    @Builder.Default
    private Integer sentenceCount = 0;

    @Column(name = "pause_frequency")
    @Builder.Default
    private Double pauseFrequency = 0.0;

    @Column(name = "filler_words_json", columnDefinition = "TEXT")
    private String fillerWordsJson;

    @Column(name = "better_phrases_json", columnDefinition = "TEXT")
    private String betterPhrasesJson;

    @Column(name = "coach_summary", columnDefinition = "TEXT")
    private String coachSummary;

    @Column(name = "follow_up_challenge", columnDefinition = "TEXT")
    private String followUpChallenge;

    @Column(name = "provider", length = 100)
    @Builder.Default
    private String provider = "groq-whisper";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
