package com.gameverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResult {
    private Long matchId;
    private Long winnerId;
    private String winnerUsername;
    private Long loserId;
    private String loserUsername;
    private Integer eloChange;
    private Integer xpGained;
}
