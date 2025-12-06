package com.gameverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private Long userId;
    private String username;
    private String avatar;
    private Integer elo;
    private Integer wins;
    private Integer losses;
    private Double winRate;
    private Integer xp;
    private Integer rank;
}
