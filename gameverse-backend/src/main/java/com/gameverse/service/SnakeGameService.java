package com.gameverse.service;

import com.gameverse.entity.SnakeScore;
import com.gameverse.entity.User;
import com.gameverse.repository.SnakeScoreRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SnakeGameService {

    private final SnakeScoreRepository snakeScoreRepository;
    private final UserRepository userRepository;

    @Transactional
    public SnakeScore submitScore(Long userId, Integer score, Integer duration) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SnakeScore snakeScore = new SnakeScore();
        snakeScore.setUser(user);
        snakeScore.setScore(score);
        snakeScore.setDuration(duration);

        return snakeScoreRepository.save(snakeScore);
    }

    public List<SnakeScore> getLeaderboard() {
        return snakeScoreRepository.findTop10HighScores();
    }

    public SnakeScore getUserBestScore(Long userId) {
        return snakeScoreRepository.findBestScoreByUserId(userId)
                .orElse(null);
    }

    public List<SnakeScore> getUserScores(Long userId) {
        return snakeScoreRepository.findByUserIdOrderByScoreDesc(userId);
    }
}
