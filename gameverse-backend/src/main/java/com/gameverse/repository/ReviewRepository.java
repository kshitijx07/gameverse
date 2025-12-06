package com.gameverse.repository;

import com.gameverse.entity.Game;
import com.gameverse.entity.Review;
import com.gameverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByGameOrderByCreatedAtDesc(Game game);

    List<Review> findByUserOrderByCreatedAtDesc(User user);

    Optional<Review> findByGameAndUser(Game game, User user);

    @Query("SELECT r FROM Review r WHERE r.createdAt >= :startDate ORDER BY r.createdAt DESC")
    List<Review> findRecentReviews(LocalDateTime startDate);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.game = :game")
    Double calculateAverageRating(Game game);
}
