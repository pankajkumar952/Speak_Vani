package com.speakvaani.repository;

import com.speakvaani.entity.PracticeSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PracticeSessionRepository extends JpaRepository<PracticeSession, String> {
    List<PracticeSession> findByUserIdOrderByCreatedAtDesc(String userId);
    List<PracticeSession> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, PracticeSession.SessionStatus status);
    long countByUserId(String userId);
}
