import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProfilePage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/stats/user/${user.id}`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <img
                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-neon-cyan shadow-neon"
                    />
                    <h1 className="text-5xl font-bold gradient-text mb-2">{stats?.username}</h1>
                    <p className="text-gray-400">{stats?.bio || 'No bio yet'}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card glow className="text-center">
                        <p className="text-gray-400 mb-2">ELO Rating</p>
                        <p className="text-4xl font-bold text-neon-cyan">{stats?.elo}</p>
                    </Card>

                    <Card glow className="text-center">
                        <p className="text-gray-400 mb-2">Wins</p>
                        <p className="text-4xl font-bold text-neon-green">{stats?.wins}</p>
                    </Card>

                    <Card glow className="text-center">
                        <p className="text-gray-400 mb-2">Losses</p>
                        <p className="text-4xl font-bold text-neon-pink">{stats?.losses}</p>
                    </Card>

                    <Card glow className="text-center">
                        <p className="text-gray-400 mb-2">Win Rate</p>
                        <p className="text-4xl font-bold text-neon-purple">{stats?.winRate?.toFixed(1)}%</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
