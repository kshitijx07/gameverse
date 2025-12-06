package com.gameverse.controller;

import com.gameverse.entity.Review;
import com.gameverse.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, Object> request) {
        Long gameId = Long.valueOf(request.get("gameId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        Integer rating = Integer.valueOf(request.get("rating").toString());
        String reviewText = (String) request.get("reviewText");

        Review review = reviewService.createReview(gameId, userId, rating, reviewText);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Map<String, Object> request) {

        Integer rating = Integer.valueOf(request.get("rating").toString());
        String reviewText = (String) request.get("reviewText");

        Review review = reviewService.updateReview(id, userId, rating, reviewText);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @RequestParam Long userId) {
        reviewService.deleteReview(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<Review>> getGameReviews(@PathVariable Long gameId) {
        return ResponseEntity.ok(reviewService.getGameReviews(gameId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeReview(@PathVariable Long id) {
        reviewService.likeReview(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long id) {
        reviewService.unlikeReview(id);
        return ResponseEntity.ok().build();
    }
}
