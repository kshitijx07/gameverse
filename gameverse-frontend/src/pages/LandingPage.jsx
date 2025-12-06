import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoGameController, IoTrophy, IoPeople, IoStar } from 'react-icons/io5';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const features = [
        {
            icon: <IoGameController size={40} />,
            title: 'Matchmaking',
            description: 'ELO-based matchmaking system finds you the perfect opponent'
        },
        {
            icon: <IoTrophy size={40} />,
            title: 'Leaderboards',
            description: 'Compete globally or with friends to reach the top'
        },
        {
            icon: <IoPeople size={40} />,
            title: 'Game Rooms',
            description: 'Create or join rooms with real-time chat'
        },
        {
            icon: <IoStar size={40} />,
            title: 'Game Reviews',
            description: 'Discover and review your favorite games'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-900 overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 animated-gradient opacity-20"></div>

            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center z-10"
                >
                    <h1 className="text-7xl md:text-9xl font-bold mb-6 gradient-text animate-float">
                        GameVerse Hub
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        The ultimate multiplayer gaming platform with matchmaking, leaderboards, and game reviews
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Login
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 text-neon-cyan"
                >
                    <p className="text-sm mb-2">Scroll to explore</p>
                    <div className="w-6 h-10 border-2 border-neon-cyan rounded-full mx-auto flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-2 bg-neon-cyan rounded-full"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16 gradient-text"
                    >
                        Features
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-xl p-6 neon-border card-hover text-center"
                            >
                                <div className="text-neon-cyan mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-strong rounded-2xl p-12 text-center neon-border"
                >
                    <h2 className="text-4xl font-bold mb-4 gradient-text">Ready to Play?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of gamers in the ultimate gaming experience
                    </p>
                    <Link to="/signup">
                        <Button size="lg">Create Account</Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
