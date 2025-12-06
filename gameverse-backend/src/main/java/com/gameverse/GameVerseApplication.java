package com.gameverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GameVerseApplication {
    public static void main(String[] args) {
        SpringApplication.run(GameVerseApplication.class, args);
    }
}
