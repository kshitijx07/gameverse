package com.gameverse.service;

import com.gameverse.dto.AuthResponse;
import com.gameverse.dto.LoginRequest;
import com.gameverse.dto.SignupRequest;
import com.gameverse.entity.User;
import com.gameverse.repository.UserRepository;
import com.gameverse.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar(request.getAvatar() != null ? request.getAvatar()
                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getUsername());
        user.setBio(request.getBio());
        user.setRole("USER");

        userRepository.save(user);

        String token = tokenProvider.generateTokenFromUsername(user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getAvatar(),
                user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getAvatar(),
                user.getRole());
    }
}
