package com.gameverse.controller;

import com.gameverse.entity.Game;
import com.gameverse.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/similar/{gameId}")
    public ResponseEntity<List<Game>> getSimilarGames(@PathVariable Long gameId) {
        return ResponseEntity.ok(recommendationService.getSimilarGames(gameId));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Game>> getPopularGames() {
        return ResponseEntity.ok(recommendationService.getPopularGames());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Game>> getRecentlyReviewed() {
        return ResponseEntity.ok(recommendationService.getRecentlyReviewed());
    }
}
