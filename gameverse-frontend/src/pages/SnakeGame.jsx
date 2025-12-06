import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { IoPlay, IoPause, IoRefresh, IoTrophy, IoArrowBack } from 'react-icons/io5';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

const SnakeGame = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [bestScore, setBestScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const gameLoopRef = useRef(null);
    const nextDirectionRef = useRef(INITIAL_DIRECTION);

    // Fetch best score and leaderboard
    useEffect(() => {
        if (user && user.id) {
            fetchBestScore();
            fetchLeaderboard();
        }
    }, [user]);

    const fetchBestScore = async () => {
        try {
            const response = await api.get(`/games/snake/best/${user.id}`);
            if (response.data) {
                setBestScore(response.data.score);
            }
        } catch (err) {
            console.error('Error fetching best score:', err);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/games/snake/leaderboard');
            setLeaderboard(response.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        }
    };

    // Generate random food position
    const generateFood = useCallback(() => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }, [snake]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (direction.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (direction.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                    break;
                case ' ':
                    e.preventDefault();
                    setIsPaused(prev => !prev);
                    break;
                case 'r':
                case 'R':
                    restartGame();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, gameOver]);

    // Game loop
    useEffect(() => {
        if (isPaused || gameOver) {
            if (gameLoopRef.current) {
                clearTimeout(gameLoopRef.current);
            }
            return;
        }

        if (!startTime) {
            setStartTime(Date.now());
        }

        gameLoopRef.current = setTimeout(() => {
            moveSnake();
        }, speed);

        return () => {
            if (gameLoopRef.current) {
                clearTimeout(gameLoopRef.current);
            }
        };
    }, [snake, isPaused, gameOver, speed, startTime]);

    const moveSnake = () => {
        setDirection(nextDirectionRef.current);

        const newSnake = [...snake];
        const head = {
            x: newSnake[0].x + nextDirectionRef.current.x,
            y: newSnake[0].y + nextDirectionRef.current.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            endGame();
            return;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            setScore(prev => prev + 10);
            setFood(generateFood());
            // Increase speed slightly
            setSpeed(prev => Math.max(50, prev - 2));
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const endGame = async () => {
        setGameOver(true);
        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

        // Submit score to backend
        try {
            await api.post('/games/snake/score', {
                userId: user.id,
                score: score,
                duration: duration
            });

            // Refresh leaderboard and best score
            await fetchBestScore();
            await fetchLeaderboard();
        } catch (err) {
            console.error('Error submitting score:', err);
        }
    };

    const restartGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        nextDirectionRef.current = INITIAL_DIRECTION;
        setFood({ x: 15, y: 15 });
        setScore(0);
        setGameOver(false);
        setIsPaused(true);
        setSpeed(INITIAL_SPEED);
        setStartTime(null);
    };

    // Draw game on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
            ctx.stroke();
        }

        // Draw snake with glow
        snake.forEach((segment, index) => {
            const alpha = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
        });

        // Draw food with glow
        ctx.fillStyle = '#ff006e';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff006e';
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.shadowBlur = 0;
    }, [snake, food]);

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold holographic-text title-glow">🐍 Snake Game</h1>
                            <p className="text-gray-400 mt-2">Use arrow keys to move • Space to pause • R to restart</p>
                        </div>
                        <Button onClick={() => navigate('/dashboard')}>
                            <IoArrowBack className="mr-2" /> Back to Dashboard
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Game Canvas */}
                    <div className="lg:col-span-2">
                        <Card glow className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold gradient-text">Score: {score}</h2>
                                    <p className="text-sm text-gray-400">Best: {bestScore}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!gameOver && (
                                        <Button onClick={() => setIsPaused(!isPaused)}>
                                            {isPaused ? <IoPlay /> : <IoPause />}
                                        </Button>
                                    )}
                                    <Button onClick={restartGame}>
                                        <IoRefresh />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <canvas
                                    ref={canvasRef}
                                    width={GRID_SIZE * CELL_SIZE}
                                    height={GRID_SIZE * CELL_SIZE}
                                    className="border-2 border-neon-cyan rounded-lg mx-auto energy-border"
                                    style={{ background: 'rgba(10, 14, 39, 0.8)' }}
                                />

                                {(isPaused || gameOver) && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                        <div className="text-center">
                                            {gameOver ? (
                                                <>
                                                    <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h3>
                                                    <p className="text-xl text-white mb-2">Final Score: {score}</p>
                                                    <p className="text-gray-400 mb-4">
                                                        {score > bestScore ? '🎉 New Best Score!' : `Best: ${bestScore}`}
                                                    </p>
                                                    <Button onClick={restartGame}>
                                                        <IoRefresh className="mr-2" /> Play Again
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-3xl font-bold text-neon-cyan mb-4">Ready?</h3>
                                                    <p className="text-gray-400 mb-4">Press Space or click Play to start</p>
                                                    <Button onClick={() => setIsPaused(false)}>
                                                        <IoPlay className="mr-2" /> Start Game
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div className="glass rounded-lg p-3">
                                    <p className="text-sm text-gray-400">Length</p>
                                    <p className="text-2xl font-bold text-neon-cyan">{snake.length}</p>
                                </div>
                                <div className="glass rounded-lg p-3">
                                    <p className="text-sm text-gray-400">Speed</p>
                                    <p className="text-2xl font-bold text-neon-purple">{Math.floor((200 - speed) / 10)}</p>
                                </div>
                                <div className="glass rounded-lg p-3">
                                    <p className="text-sm text-gray-400">Time</p>
                                    <p className="text-2xl font-bold text-neon-green">
                                        {startTime && !isPaused ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <div className="lg:col-span-1">
                        <Card glow>
                            <div className="flex items-center gap-2 mb-4">
                                <IoTrophy size={24} className="text-yellow-500" />
                                <h2 className="text-2xl font-bold">Leaderboard</h2>
                            </div>
                            <div className="space-y-2">
                                {leaderboard.length > 0 ? (
                                    leaderboard.map((entry, index) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex items-center justify-between p-3 rounded-lg ${entry.user.id === user?.id
                                                    ? 'bg-neon-cyan/20 border border-neon-cyan'
                                                    : 'bg-dark-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' :
                                                        index === 1 ? 'text-gray-400' :
                                                            index === 2 ? 'text-orange-600' :
                                                                'text-gray-500'
                                                    }`}>
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <p className="font-semibold">{entry.user.username}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(entry.playedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-neon-cyan">{entry.score}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-8">No scores yet. Be the first!</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakeGame;
