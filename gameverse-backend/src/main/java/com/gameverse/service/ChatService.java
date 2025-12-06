package com.gameverse.service;

import com.gameverse.dto.ChatMessageDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ChatService {

    // In-memory storage: roomId -> list of messages
    private final Map<Long, List<ChatMessageDTO>> roomMessages = new ConcurrentHashMap<>();

    /**
     * Send a message to a room
     */
    public ChatMessageDTO sendMessage(Long roomId, String sender, String content) {
        ChatMessageDTO message = new ChatMessageDTO();
        message.setRoomId(roomId);
        message.setSender(sender);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        roomMessages.computeIfAbsent(roomId, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(message);

        return message;
    }

    /**
     * Get all messages for a room
     */
    public List<ChatMessageDTO> getRoomMessages(Long roomId) {
        return new ArrayList<>(roomMessages.getOrDefault(roomId, Collections.emptyList()));
    }

    /**
     * Get messages after a specific timestamp (for polling)
     */
    public List<ChatMessageDTO> getMessagesSince(Long roomId, LocalDateTime since) {
        List<ChatMessageDTO> messages = roomMessages.getOrDefault(roomId, Collections.emptyList());

        return messages.stream()
                .filter(msg -> msg.getTimestamp().isAfter(since))
                .collect(Collectors.toList());
    }

    /**
     * Clear messages for a room (optional cleanup)
     */
    public void clearRoomMessages(Long roomId) {
        roomMessages.remove(roomId);
    }
}
