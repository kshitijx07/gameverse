import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const StatsPage = () => {
    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>
            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-6xl font-bold gradient-text mb-4">My Stats</h1>
                    <p className="text-xl text-gray-400">Track your performance over time</p>
                </motion.div>
                <Card glow className="text-center p-12">
                    <p className="text-2xl text-gray-400">Stats page with performance graphs coming soon!</p>
                </Card>
            </div>
        </div>
    );
};

export default StatsPage;
