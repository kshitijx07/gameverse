package com.gameverse.repository;

import com.gameverse.entity.MatchHistory;
import com.gameverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchHistoryRepository extends JpaRepository<MatchHistory, Long> {

    @Query("SELECT m FROM MatchHistory m WHERE m.player1 = :user OR m.player2 = :user ORDER BY m.matchDate DESC")
    List<MatchHistory> findByUser(User user);

    @Query("SELECT m FROM MatchHistory m WHERE (m.player1 = :user OR m.player2 = :user) AND m.matchDate >= :startDate")
    List<MatchHistory> findByUserAndDateAfter(User user, LocalDateTime startDate);
}
