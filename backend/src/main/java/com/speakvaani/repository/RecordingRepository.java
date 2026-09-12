package com.speakvaani.repository;

import com.speakvaani.entity.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecordingRepository extends JpaRepository<Recording, String> {
    Optional<Recording> findBySessionId(String sessionId);
}
