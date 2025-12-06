package com.gameverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private String role;

    public AuthResponse(String token, Long id, String username, String email, String avatar, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.role = role;
    }
}
