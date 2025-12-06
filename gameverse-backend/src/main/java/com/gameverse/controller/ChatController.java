package com.gameverse.controller;

import com.gameverse.dto.ChatMessageDTO;
import com.gameverse.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * Get all messages for a room
     */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(@PathVariable Long roomId) {
        List<ChatMessageDTO> messages = chatService.getRoomMessages(roomId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get new messages after a timestamp (for polling)
     */
    @GetMapping("/room/{roomId}/since")
    public ResponseEntity<List<ChatMessageDTO>> getNewMessages(
            @PathVariable Long roomId,
            @RequestParam String timestamp) {
        LocalDateTime since = LocalDateTime.parse(timestamp);
        List<ChatMessageDTO> messages = chatService.getMessagesSince(roomId, since);
        return ResponseEntity.ok(messages);
    }

    /**
     * Send a message to a room
     */
    @PostMapping("/room/{roomId}")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> request) {

        String sender = request.get("sender");
        String content = request.get("content");

        ChatMessageDTO message = chatService.sendMessage(roomId, sender, content);
        return ResponseEntity.ok(message);
    }
}
