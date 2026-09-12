package com.speakvaani.repository;

import com.speakvaani.entity.AiInsights;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiInsightsRepository extends JpaRepository<AiInsights, String> {
    Optional<AiInsights> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
