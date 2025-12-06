package com.gameverse.service;

import com.gameverse.entity.Game;
import com.gameverse.entity.Review;
import com.gameverse.repository.GameRepository;
import com.gameverse.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final GameRepository gameRepository;
    private final ReviewRepository reviewRepository;

    public List<Game> getSimilarGames(Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Get users who rated this game highly (4-5 stars)
        List<Review> highRatings = reviewRepository.findByGameOrderByCreatedAtDesc(game).stream()
                .filter(r -> r.getRating() >= 4)
                .collect(Collectors.toList());

        // Get other games these users also rated highly
        Map<Long, Integer> gameScores = new HashMap<>();

        for (Review review : highRatings) {
            List<Review> userReviews = reviewRepository.findByUserOrderByCreatedAtDesc(review.getUser());

            for (Review userReview : userReviews) {
                if (!userReview.getGame().getId().equals(gameId) && userReview.getRating() >= 4) {
                    gameScores.merge(userReview.getGame().getId(), 1, Integer::sum);
                }
            }
        }

        // Sort by score and get top recommendations
        return gameScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(10)
                .map(entry -> gameRepository.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<Game> getPopularGames() {
        return gameRepository.findPopularGames().stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Game> getRecentlyReviewed() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Review> recentReviews = reviewRepository.findRecentReviews(thirtyDaysAgo);

        // Count reviews per game
        Map<Long, Long> gameCounts = recentReviews.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getGame().getId(),
                        Collectors.counting()));

        // Sort by review count and get games
        return gameCounts.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> gameRepository.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
