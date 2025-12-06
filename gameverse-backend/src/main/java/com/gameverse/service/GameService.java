package com.gameverse.service;

import com.gameverse.entity.Game;
import com.gameverse.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public List<Game> searchByGenre(String genre) {
        return gameRepository.findByGenreContainingIgnoreCase(genre);
    }

    public List<Game> searchByTag(String tag) {
        return gameRepository.findByTagsContainingIgnoreCase(tag);
    }

    public List<Game> getTopRated() {
        return gameRepository.findTopRatedGames();
    }

    public List<Game> getPopular() {
        return gameRepository.findPopularGames();
    }

    public Game createGame(Game game) {
        return gameRepository.save(game);
    }

    public Game updateGame(Long id, Game gameDetails) {
        Game game = getGameById(id);
        game.setTitle(gameDetails.getTitle());
        game.setGenre(gameDetails.getGenre());
        game.setTags(gameDetails.getTags());
        game.setReleaseYear(gameDetails.getReleaseYear());
        game.setCoverImage(gameDetails.getCoverImage());
        game.setDescription(gameDetails.getDescription());
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}
