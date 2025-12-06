package com.gameverse.service;

import com.gameverse.dto.MatchmakingQueueEntry;
import com.gameverse.entity.User;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchmakingService {

    private final UserRepository userRepository;
    private final MatchSimulationService matchSimulationService;
    private final SimpMessagingTemplate messagingTemplate;

    private final ConcurrentLinkedQueue<MatchmakingQueueEntry> queue = new ConcurrentLinkedQueue<>();

    public void enqueue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already in queue
        boolean alreadyInQueue = queue.stream()
                .anyMatch(entry -> entry.getUserId().equals(userId));

        if (alreadyInQueue) {
            throw new RuntimeException("Already in matchmaking queue");
        }

        MatchmakingQueueEntry entry = new MatchmakingQueueEntry(
                user.getId(),
                user.getUsername(),
                user.getElo());

        queue.add(entry);
        log.info("User {} added to matchmaking queue. Queue size: {}", user.getUsername(), queue.size());
    }

    public void dequeue(Long userId) {
        queue.removeIf(entry -> entry.getUserId().equals(userId));
        log.info("User {} removed from matchmaking queue", userId);
    }

    public int getQueueSize() {
        return queue.size();
    }

    public boolean isInQueue(Long userId) {
        return queue.stream().anyMatch(entry -> entry.getUserId().equals(userId));
    }

    @Scheduled(fixedRate = 5000) // Run every 5 seconds
    public void processQueue() {
        if (queue.size() < 2) {
            return;
        }

        Iterator<MatchmakingQueueEntry> iterator = queue.iterator();

        while (iterator.hasNext()) {
            MatchmakingQueueEntry player1 = iterator.next();

            // Find a suitable opponent
            MatchmakingQueueEntry player2 = findOpponent(player1);

            if (player2 != null) {
                // Remove both players from queue
                queue.remove(player1);
                queue.remove(player2);

                log.info("Match found: {} vs {}", player1.getUsername(), player2.getUsername());

                // Notify players
                messagingTemplate.convertAndSendToUser(
                        player1.getUsername(),
                        "/queue/match-found",
                        "Match found! Opponent: " + player2.getUsername());

                messagingTemplate.convertAndSendToUser(
                        player2.getUsername(),
                        "/queue/match-found",
                        "Match found! Opponent: " + player1.getUsername());

                // Simulate match
                matchSimulationService.simulateMatch(player1.getUserId(), player2.getUserId());

                break; // Process one match at a time
            }
        }
    }

    private MatchmakingQueueEntry findOpponent(MatchmakingQueueEntry player) {
        int eloRange = 100; // Initial ELO range
        long waitTime = player.getWaitTime();

        // Expand ELO range based on wait time (every 10 seconds, expand by 50 ELO)
        eloRange += (int) (waitTime / 10000) * 50;

        for (MatchmakingQueueEntry opponent : queue) {
            if (opponent.getUserId().equals(player.getUserId())) {
                continue;
            }

            int eloDiff = Math.abs(opponent.getElo() - player.getElo());

            if (eloDiff <= eloRange) {
                return opponent;
            }
        }

        return null;
    }
}
