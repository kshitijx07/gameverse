package com.gameverse.service;

import com.gameverse.dto.MatchResult;
import com.gameverse.entity.MatchHistory;
import com.gameverse.entity.User;
import com.gameverse.repository.MatchHistoryRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchSimulationService {

    private final UserRepository userRepository;
    private final MatchHistoryRepository matchHistoryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    @Transactional
    public void simulateMatch(Long player1Id, Long player2Id) {
        User player1 = userRepository.findById(player1Id)
                .orElseThrow(() -> new RuntimeException("Player 1 not found"));
        User player2 = userRepository.findById(player2Id)
                .orElseThrow(() -> new RuntimeException("Player 2 not found"));

        // Calculate win probability based on ELO
        double expectedScore1 = calculateExpectedScore(player1.getElo(), player2.getElo());

        // Determine winner
        boolean player1Wins = random.nextDouble() < expectedScore1;
        User winner = player1Wins ? player1 : player2;
        User loser = player1Wins ? player2 : player1;

        // Calculate ELO change (K-factor = 32)
        int kFactor = 32;
        int eloChange = calculateEloChange(winner.getElo(), loser.getElo(), kFactor);

        // Update stats
        winner.addWin();
        winner.updateElo(eloChange);
        winner.addXp(50); // Base XP for winning

        loser.addLoss();
        loser.updateElo(-eloChange);
        loser.addXp(20); // Consolation XP for losing

        userRepository.save(winner);
        userRepository.save(loser);

        // Save match history
        MatchHistory match = new MatchHistory();
        match.setPlayer1(player1);
        match.setPlayer2(player2);
        match.setWinner(winner);
        match.setEloChange(eloChange);
        matchHistoryRepository.save(match);

        log.info("Match completed: {} (ELO: {}) vs {} (ELO: {}). Winner: {}. ELO change: {}",
                player1.getUsername(), player1.getElo(),
                player2.getUsername(), player2.getElo(),
                winner.getUsername(), eloChange);

        // Broadcast results
        MatchResult result = new MatchResult(
                match.getId(),
                winner.getId(),
                winner.getUsername(),
                loser.getId(),
                loser.getUsername(),
                eloChange,
                50);

        messagingTemplate.convertAndSendToUser(
                player1.getUsername(),
                "/queue/match-result",
                createPlayerResult(result, player1.getId()));

        messagingTemplate.convertAndSendToUser(
                player2.getUsername(),
                "/queue/match-result",
                createPlayerResult(result, player2.getId()));
    }

    private double calculateExpectedScore(int elo1, int elo2) {
        return 1.0 / (1.0 + Math.pow(10, (elo2 - elo1) / 400.0));
    }

    private int calculateEloChange(int winnerElo, int loserElo, int kFactor) {
        double expectedScore = calculateExpectedScore(winnerElo, loserElo);
        return (int) Math.round(kFactor * (1 - expectedScore));
    }

    private MatchResult createPlayerResult(MatchResult result, Long playerId) {
        // Create a copy with player-specific perspective
        MatchResult playerResult = new MatchResult();
        playerResult.setMatchId(result.getMatchId());
        playerResult.setWinnerId(result.getWinnerId());
        playerResult.setWinnerUsername(result.getWinnerUsername());
        playerResult.setLoserId(result.getLoserId());
        playerResult.setLoserUsername(result.getLoserUsername());
        playerResult.setEloChange(result.getEloChange());
        playerResult.setXpGained(playerId.equals(result.getWinnerId()) ? 50 : 20);
        return playerResult;
    }
}
