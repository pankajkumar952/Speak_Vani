package com.speakvaani.repository;

import com.speakvaani.entity.SpeechAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpeechAnalysisRepository extends JpaRepository<SpeechAnalysis, String> {
    Optional<SpeechAnalysis> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
