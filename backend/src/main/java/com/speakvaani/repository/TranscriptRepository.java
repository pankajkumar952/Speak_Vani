package com.speakvaani.repository;

import com.speakvaani.entity.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TranscriptRepository extends JpaRepository<Transcript, String> {
    Optional<Transcript> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
