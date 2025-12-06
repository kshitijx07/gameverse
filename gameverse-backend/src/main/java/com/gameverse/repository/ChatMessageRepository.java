package com.gameverse.repository;

import com.gameverse.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Get all messages for a room
    List<ChatMessage> findByRoomIdOrderByTimestampAsc(Long roomId);

    // Get messages after a certain timestamp (for polling)
    List<ChatMessage> findByRoomIdAndTimestampAfterOrderByTimestampAsc(Long roomId, LocalDateTime timestamp);

    // Delete old messages (optional cleanup)
    void deleteByRoomId(Long roomId);
}
