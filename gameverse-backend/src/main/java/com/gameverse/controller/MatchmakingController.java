package com.gameverse.controller;

import com.gameverse.service.MatchmakingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/matchmaking")
@RequiredArgsConstructor
public class MatchmakingController {

    private final MatchmakingService matchmakingService;

    @PostMapping("/enqueue")
    public ResponseEntity<Map<String, String>> enqueue(@RequestParam Long userId) {
        matchmakingService.enqueue(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Added to matchmaking queue");
        response.put("queueSize", String.valueOf(matchmakingService.getQueueSize()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/dequeue")
    public ResponseEntity<Map<String, String>> dequeue(@RequestParam Long userId) {
        matchmakingService.dequeue(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Removed from matchmaking queue");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(@RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("inQueue", matchmakingService.isInQueue(userId));
        response.put("queueSize", matchmakingService.getQueueSize());
        return ResponseEntity.ok(response);
    }
}
