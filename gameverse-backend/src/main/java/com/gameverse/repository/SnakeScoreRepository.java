package com.gameverse.repository;

import com.gameverse.entity.SnakeScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SnakeScoreRepository extends JpaRepository<SnakeScore, Long> {

    // Get top scores for leaderboard
    // Get top scores for leaderboard (unique users)
    @Query("SELECT s FROM SnakeScore s WHERE s.score = (SELECT MAX(s2.score) FROM SnakeScore s2 WHERE s2.user = s.user) "
            +
            "AND s.playedAt = (SELECT MAX(s3.playedAt) FROM SnakeScore s3 WHERE s3.user = s.user AND s3.score = s.score) "
            +
            "ORDER BY s.score DESC LIMIT 10")
    List<SnakeScore> findTop10HighScores();

    // Get user's best score
    @Query("SELECT s FROM SnakeScore s WHERE s.user.id = :userId ORDER BY s.score DESC LIMIT 1")
    Optional<SnakeScore> findBestScoreByUserId(Long userId);

    // Get all scores for a user
    List<SnakeScore> findByUserIdOrderByScoreDesc(Long userId);
}
