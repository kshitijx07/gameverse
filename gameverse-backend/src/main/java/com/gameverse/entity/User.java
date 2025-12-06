package com.gameverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;

    @Column(length = 500)
    private String bio;

    @Column(nullable = false)
    private Integer wins = 0;

    @Column(nullable = false)
    private Integer losses = 0;

    @Column(nullable = false)
    private Integer elo = 1000;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private String role = "USER";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(name = "friends", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<User> friends = new HashSet<>();

    // Helper methods
    public void addWin() {
        this.wins++;
    }

    public void addLoss() {
        this.losses++;
    }

    public void updateElo(int change) {
        this.elo += change;
        if (this.elo < 0)
            this.elo = 0;
    }

    public void addXp(int amount) {
        this.xp += amount;
    }

    public double getWinRate() {
        int totalGames = wins + losses;
        return totalGames == 0 ? 0.0 : (double) wins / totalGames * 100;
    }
}
