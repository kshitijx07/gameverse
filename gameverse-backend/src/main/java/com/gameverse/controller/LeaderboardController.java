package com.gameverse.controller;

import com.gameverse.dto.LeaderboardEntry;
import com.gameverse.entity.User;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final UserRepository userRepository;

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "elo") String sortBy) {

        List<User> users = userRepository.findTop100ByOrderByEloDesc();
        List<LeaderboardEntry> leaderboard = convertToLeaderboard(users);

        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/friends")
    public ResponseEntity<List<LeaderboardEntry>> getFriendsLeaderboard(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> friendIds = user.getFriends().stream()
                .map(User::getId)
                .collect(Collectors.toList());

        friendIds.add(userId); // Include the user themselves

        List<User> friends = userRepository.findFriendsLeaderboard(friendIds);
        List<LeaderboardEntry> leaderboard = convertToLeaderboard(friends);

        return ResponseEntity.ok(leaderboard);
    }

    private List<LeaderboardEntry> convertToLeaderboard(List<User> users) {
        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        int rank = 1;

        for (User user : users) {
            LeaderboardEntry entry = new LeaderboardEntry();
            entry.setUserId(user.getId());
            entry.setUsername(user.getUsername());
            entry.setAvatar(user.getAvatar());
            entry.setElo(user.getElo());
            entry.setWins(user.getWins());
            entry.setLosses(user.getLosses());
            entry.setWinRate(user.getWinRate());
            entry.setXp(user.getXp());
            entry.setRank(rank++);
            leaderboard.add(entry);
        }

        return leaderboard;
    }
}
