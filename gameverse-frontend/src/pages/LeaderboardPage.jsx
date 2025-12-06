import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'global'
                ? '/leaderboard/global'
                : `/leaderboard/friends?userId=${user.id}`;
            const response = await api.get(endpoint);
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-bold gradient-text mb-4">Leaderboard</h1>
                    <p className="text-xl text-gray-400">Top players worldwide</p>
                </motion.div>

                <div className="flex gap-4 mb-8 justify-center">
                    <Button
                        variant={activeTab === 'global' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('global')}
                    >
                        Global
                    </Button>
                    <Button
                        variant={activeTab === 'friends' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <Card glow>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-gray-400">Rank</th>
                                        <th className="px-4 py-3 text-left text-gray-400">Player</th>
                                        <th className="px-4 py-3 text-center text-gray-400">ELO</th>
                                        <th className="px-4 py-3 text-center text-gray-400">Wins</th>
                                        <th className="px-4 py-3 text-center text-gray-400">Losses</th>
                                        <th className="px-4 py-3 text-center text-gray-400">Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <motion.tr
                                            key={entry.userId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`border-b border-white/5 ${entry.userId === user.id ? 'bg-neon-cyan/10' : ''}`}
                                        >
                                            <td className="px-4 py-4">
                                                <span className={`text-2xl font-bold ${entry.rank === 1 ? 'text-yellow-400' :
                                                        entry.rank === 2 ? 'text-gray-300' :
                                                            entry.rank === 3 ? 'text-orange-400' :
                                                                'text-gray-500'
                                                    }`}>
                                                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={entry.avatar} alt={entry.username} className="w-10 h-10 rounded-full" />
                                                    <span className="font-semibold">{entry.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center font-bold text-neon-cyan">{entry.elo}</td>
                                            <td className="px-4 py-4 text-center text-neon-green">{entry.wins}</td>
                                            <td className="px-4 py-4 text-center text-neon-pink">{entry.losses}</td>
                                            <td className="px-4 py-4 text-center font-semibold">{entry.winRate?.toFixed(1)}%</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
