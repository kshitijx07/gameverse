package com.gameverse.controller;

import com.gameverse.entity.Room;
import com.gameverse.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Map<String, Object> request) {
        String roomName = (String) request.get("roomName");
        Integer maxPlayers = (Integer) request.get("maxPlayers");
        Long creatorId = Long.valueOf(request.get("creatorId").toString());

        Room room = roomService.createRoom(roomName, maxPlayers, creatorId);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Room> joinRoom(@PathVariable Long id, @RequestParam Long userId) {
        Room room = roomService.joinRoom(id, userId);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveRoom(@PathVariable Long id, @RequestParam Long userId) {
        roomService.leaveRoom(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Room>> getActiveRooms() {
        return ResponseEntity.ok(roomService.getActiveRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoom(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id, @RequestParam Long userId) {
        roomService.deleteRoom(id, userId);
        return ResponseEntity.ok().build();
    }
}
