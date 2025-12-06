package com.gameverse.controller;

import com.gameverse.entity.MatchHistory;
import com.gameverse.entity.User;
import com.gameverse.repository.MatchHistoryRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository userRepository;
    private final MatchHistoryRepository matchHistoryRepository;

    @GetMapping("/user/{id}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("username", user.getUsername());
        stats.put("avatar", user.getAvatar());
        stats.put("bio", user.getBio());
        stats.put("elo", user.getElo());
        stats.put("wins", user.getWins());
        stats.put("losses", user.getLosses());
        stats.put("winRate", user.getWinRate());
        stats.put("xp", user.getXp());
        stats.put("totalGames", user.getWins() + user.getLosses());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<List<MatchHistory>> getMatchHistory(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchHistory> matches = matchHistoryRepository.findByUser(user);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/performance/{id}")
    public ResponseEntity<Map<String, Object>> getPerformance(
            @PathVariable Long id,
            @RequestParam(defaultValue = "weekly") String period) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startDate = switch (period) {
            case "daily" -> LocalDateTime.now().minusDays(1);
            case "weekly" -> LocalDateTime.now().minusWeeks(1);
            case "monthly" -> LocalDateTime.now().minusMonths(1);
            default -> LocalDateTime.now().minusWeeks(1);
        };

        List<MatchHistory> matches = matchHistoryRepository.findByUserAndDateAfter(user, startDate);

        int wins = (int) matches.stream()
                .filter(m -> m.getWinner().getId().equals(id))
                .count();
        int losses = matches.size() - wins;

        Map<String, Object> performance = new HashMap<>();
        performance.put("period", period);
        performance.put("totalGames", matches.size());
        performance.put("wins", wins);
        performance.put("losses", losses);
        performance.put("winRate", matches.isEmpty() ? 0.0 : (double) wins / matches.size() * 100);

        return ResponseEntity.ok(performance);
    }
}
