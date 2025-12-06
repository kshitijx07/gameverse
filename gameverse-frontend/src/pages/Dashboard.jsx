import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { IoGameController, IoTrophy, IoPeople, IoStatsChart, IoLogOut } from 'react-icons/io5';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ParticlesBackground from '../components/ParticlesBackground';
import DataStreams from '../components/DataStreams';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: <IoGameController size={30} />, title: 'Matchmaking', path: '/matchmaking', color: 'from-neon-blue to-neon-cyan' },
        { icon: <IoTrophy size={30} />, title: 'Leaderboard', path: '/leaderboard', color: 'from-neon-purple to-neon-pink' },
        { icon: <IoPeople size={30} />, title: 'Game Rooms', path: '/rooms', color: 'from-neon-cyan to-neon-green' },
        { icon: <IoStatsChart size={30} />, title: 'My Stats', path: '/stats', color: 'from-neon-pink to-neon-purple' },
    ];

    return (
        <div className="min-h-screen bg-dark-900">
            <ParticlesBackground />
            <DataStreams />
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            {/* Header */}
            <div className="relative z-10 glass-strong border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold holographic-text title-glow">GameVerse Hub</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/profile">
                            <div className="flex items-center gap-3 glass rounded-full px-4 py-2 hover:shadow-neon transition-all cursor-pointer">
                                <img
                                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="text-white font-semibold">{user?.username}</span>
                            </div>
                        </Link>
                        <Button variant="ghost" onClick={logout}>
                            <IoLogOut size={20} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-5xl font-bold mb-4">
                        Welcome back, <span className="gradient-text">{user?.username}</span>!
                    </h2>
                    <p className="text-xl text-gray-400">Choose your adventure</p>
                </motion.div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {menuItems.map((item, index) => (
                        <Link key={index} to={item.path}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card hover glow className="text-center">
                                    <div className={`bg-gradient-to-r ${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 icon-container-glow icon-float icon-rotate`}>
                                        <div className="icon-glow">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card glow>
                        <h3 className="text-2xl font-bold mb-4 gradient-text">Browse Games</h3>
                        <p className="text-gray-400 mb-6">Discover new games and read reviews from the community</p>
                        <Link to="/games">
                            <Button>Explore Games</Button>
                        </Link>
                    </Card>

                    <Card glow>
                        <h3 className="text-2xl font-bold mb-4 gradient-text">View Profile</h3>
                        <p className="text-gray-400 mb-6">Check your stats, manage friends, and customize your profile</p>
                        <Link to="/profile">
                            <Button variant="secondary">My Profile</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
