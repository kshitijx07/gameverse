package com.gameverse.repository;

import com.gameverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Leaderboard queries
    List<User> findTop100ByOrderByEloDesc();

    @Query("SELECT u FROM User u WHERE u.id IN :friendIds ORDER BY u.elo DESC")
    List<User> findFriendsLeaderboard(List<Long> friendIds);
}
