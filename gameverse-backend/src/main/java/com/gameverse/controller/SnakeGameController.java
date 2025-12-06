package com.gameverse.controller;

import com.gameverse.entity.SnakeScore;
import com.gameverse.service.SnakeGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games/snake")
@RequiredArgsConstructor
public class SnakeGameController {

    private final SnakeGameService snakeGameService;

    @PostMapping("/score")
    public ResponseEntity<SnakeScore> submitScore(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Integer score = (Integer) request.get("score");
        Integer duration = request.get("duration") != null ? (Integer) request.get("duration") : 0;

        SnakeScore snakeScore = snakeGameService.submitScore(userId, score, duration);
        return ResponseEntity.ok(snakeScore);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<SnakeScore>> getLeaderboard() {
        return ResponseEntity.ok(snakeGameService.getLeaderboard());
    }

    @GetMapping("/best/{userId}")
    public ResponseEntity<SnakeScore> getUserBestScore(@PathVariable Long userId) {
        SnakeScore bestScore = snakeGameService.getUserBestScore(userId);
        if (bestScore == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bestScore);
    }

    @GetMapping("/scores/{userId}")
    public ResponseEntity<List<SnakeScore>> getUserScores(@PathVariable Long userId) {
        return ResponseEntity.ok(snakeGameService.getUserScores(userId));
    }
}
