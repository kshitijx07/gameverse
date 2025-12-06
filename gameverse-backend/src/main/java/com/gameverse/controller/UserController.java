package com.gameverse.controller;

import com.gameverse.entity.User;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}/friends")
    public ResponseEntity<Set<User>> getFriends(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getFriends());
    }

    @PostMapping("/{id}/friends/{friendId}")
    public ResponseEntity<Map<String, String>> addFriend(@PathVariable Long id, @PathVariable Long friendId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        user.getFriends().add(friend);
        friend.getFriends().add(user);

        userRepository.save(user);
        userRepository.save(friend);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Friend added successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/friends/{friendId}")
    public ResponseEntity<Map<String, String>> removeFriend(@PathVariable Long id, @PathVariable Long friendId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Friend removed successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("avatar")) {
            user.setAvatar(updates.get("avatar"));
        }
        if (updates.containsKey("bio")) {
            user.setBio(updates.get("bio"));
        }

        return ResponseEntity.ok(userRepository.save(user));
    }
}
