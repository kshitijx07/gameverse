package com.gameverse.repository;

import com.gameverse.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByGenreContainingIgnoreCase(String genre);

    List<Game> findByTagsContainingIgnoreCase(String tag);

    @Query("SELECT g FROM Game g ORDER BY g.averageRating DESC, g.reviewCount DESC")
    List<Game> findTopRatedGames();

    @Query("SELECT g FROM Game g ORDER BY (g.averageRating * g.reviewCount) DESC")
    List<Game> findPopularGames();
}
