package com.gameverse.service;

import com.gameverse.entity.Game;
import com.gameverse.entity.Review;
import com.gameverse.entity.User;
import com.gameverse.repository.GameRepository;
import com.gameverse.repository.ReviewRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Transactional
    public Review createReview(Long gameId, Long userId, Integer rating, String reviewText) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already reviewed this game
        reviewRepository.findByGameAndUser(game, user)
                .ifPresent(r -> {
                    throw new RuntimeException("You have already reviewed this game");
                });

        Review review = new Review();
        review.setGame(game);
        review.setUser(user);
        review.setRating(rating);
        review.setReviewText(reviewText);

        Review savedReview = reviewRepository.save(review);

        // Update game average rating
        updateGameRating(game);

        return savedReview;
    }

    @Transactional
    public Review updateReview(Long reviewId, Long userId, Integer rating, String reviewText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only edit your own reviews");
        }

        review.setRating(rating);
        review.setReviewText(reviewText);

        Review updatedReview = reviewRepository.save(review);
        updateGameRating(review.getGame());

        return updatedReview;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        Game game = review.getGame();
        reviewRepository.delete(review);
        updateGameRating(game);
    }

    public List<Review> getGameReviews(Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return reviewRepository.findByGameOrderByCreatedAtDesc(game);
    }

    @Transactional
    public void likeReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setLikes(review.getLikes() + 1);
        reviewRepository.save(review);
    }

    @Transactional
    public void unlikeReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (review.getLikes() > 0) {
            review.setLikes(review.getLikes() - 1);
            reviewRepository.save(review);
        }
    }

    private void updateGameRating(Game game) {
        Double avgRating = reviewRepository.calculateAverageRating(game);
        game.setAverageRating(avgRating != null ? avgRating : 0.0);

        List<Review> reviews = reviewRepository.findByGameOrderByCreatedAtDesc(game);
        game.setReviewCount(reviews.size());

        gameRepository.save(game);
    }
}
