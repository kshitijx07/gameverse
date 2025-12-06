import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { IoTrophy } from 'react-icons/io5';

const MatchmakingPage = () => {
    const { user } = useAuth();
    const [inQueue, setInQueue] = useState(false);

    const handleFindMatch = () => {
        setInQueue(true);
        // Simulate finding a match after 3 seconds
        setTimeout(() => {
            setInQueue(false);
            alert('Match found! (This is a demo - WebSocket integration coming soon)');
        }, 3000);
    };

    const handleLeaveQueue = () => {
        setInQueue(false);
    };

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-bold gradient-text mb-4">Matchmaking</h1>
                    <p className="text-xl text-gray-400">Find your perfect opponent</p>
                </motion.div>

                <Card glow className="text-center">
                    {!inQueue ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="mb-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                                    <IoTrophy size={60} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Ready to compete?</h2>
                                <p className="text-gray-400 mb-8">
                                    Our ELO-based matchmaking system will find you an opponent with similar skill level
                                </p>
                                <p className="text-neon-cyan mb-4">Your ELO: {user?.elo || 1000}</p>
                            </div>

                            <Button size="lg" onClick={handleFindMatch}>
                                Find Match
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="mb-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-neon-cyan to-neon-green rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                                    <div className="spinner w-16 h-16 border-4"></div>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Searching for opponent...</h2>
                                <p className="text-gray-400 mb-4">
                                    Please wait while we find you a match
                                </p>
                            </div>

                            <Button variant="danger" onClick={handleLeaveQueue}>
                                Cancel Search
                            </Button>
                        </motion.div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MatchmakingPage;
