package com.gameverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "player1_id", nullable = false)
    private User player1;
    
    @ManyToOne
    @JoinColumn(name = "player2_id", nullable = false)
    private User player2;
    
    @ManyToOne
    @JoinColumn(name = "winner_id", nullable = false)
    private User winner;
    
    @Column(name = "elo_change")
    private Integer eloChange;
    
    @CreationTimestamp
    @Column(name = "match_date", nullable = false, updatable = false)
    private LocalDateTime matchDate;
}
