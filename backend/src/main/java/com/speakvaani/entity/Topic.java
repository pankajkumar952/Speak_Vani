package com.speakvaani.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    public enum TopicDifficulty {
        EASY, MEDIUM, HARD
    }

    public enum Audience {
        GENERAL, KIDS_5_7, KIDS_8_10, KIDS_11_13
    }

    public enum TopicType {
        SIMPLE_TOPIC, CREATIVE_PROMPT
    }

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TopicDifficulty difficulty = TopicDifficulty.EASY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Audience audience = Audience.GENERAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "topic_type", nullable = false)
    @Builder.Default
    private TopicType topicType = TopicType.SIMPLE_TOPIC;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
