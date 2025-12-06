package com.gameverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchmakingQueueEntry {
    private Long userId;
    private String username;
    private Integer elo;
    private Long queueTime;

    public MatchmakingQueueEntry(Long userId, String username, Integer elo) {
        this.userId = userId;
        this.username = username;
        this.elo = elo;
        this.queueTime = System.currentTimeMillis();
    }

    public long getWaitTime() {
        return System.currentTimeMillis() - queueTime;
    }
}
