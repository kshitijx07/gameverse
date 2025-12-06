package com.gameverse.service;

import com.gameverse.entity.Room;
import com.gameverse.entity.User;
import com.gameverse.repository.RoomRepository;
import com.gameverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Room createRoom(String roomName, Integer maxPlayers, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();
        room.setRoomName(roomName);
        room.setMaxPlayers(maxPlayers != null ? maxPlayers : 10);
        room.setCreatedBy(creator);
        room.setStatus("WAITING");
        room.getPlayers().add(creator);

        return roomRepository.save(room);
    }

    @Transactional
    public Room joinRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!room.canJoin()) {
            throw new RuntimeException("Room is full or closed");
        }

        room.getPlayers().add(user);
        Room savedRoom = roomRepository.save(room);

        // Broadcast join event
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/players",
                user.getUsername() + " joined the room");

        return savedRoom;
    }

    @Transactional
    public void leaveRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        room.getPlayers().remove(user);

        if (room.getPlayers().isEmpty()) {
            room.setStatus("CLOSED");
        }

        roomRepository.save(room);

        // Broadcast leave event
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/players",
                user.getUsername() + " left the room");
    }

    public List<Room> getActiveRooms() {
        return roomRepository.findByStatusOrderByCreatedAtDesc("WAITING");
    }

    public Room getRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Transactional
    public void deleteRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Only room creator can delete the room
        if (!room.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only room creator can delete the room");
        }

        roomRepository.delete(room);
    }
}
