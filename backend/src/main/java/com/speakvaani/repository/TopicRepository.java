package com.speakvaani.repository;

import com.speakvaani.entity.Topic;
import com.speakvaani.entity.Topic.Audience;
import com.speakvaani.entity.Topic.TopicDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, String> {
    List<Topic> findByCategoryId(String categoryId);

    List<Topic> findByCategoryIdAndDifficulty(String categoryId, TopicDifficulty difficulty);

    List<Topic> findByCategoryIdAndAudience(String categoryId, Audience audience);

    List<Topic> findByCategoryIdAndDifficultyAndAudience(String categoryId, TopicDifficulty difficulty, Audience audience);

    List<Topic> findByAudience(Audience audience);

    List<Topic> findByAudienceAndDifficulty(Audience audience, TopicDifficulty difficulty);

    @Query(value = "SELECT * FROM topics WHERE category_id = :categoryId AND difficulty = :difficulty AND audience = :audience ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Topic findRandomByCategoryIdAndDifficultyAndAudience(
        @Param("categoryId") String categoryId,
        @Param("difficulty") String difficulty,
        @Param("audience") String audience
    );

    @Query(value = "SELECT * FROM topics WHERE category_id = :categoryId AND audience = :audience ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Topic findRandomByCategoryIdAndAudience(
        @Param("categoryId") String categoryId,
        @Param("audience") String audience
    );
}
