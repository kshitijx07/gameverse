import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, glow = false, sciFi = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
        glass rounded-xl p-6 neon-border
        ${hover ? 'card-hover cursor-pointer holographic-hover' : ''}
        ${glow ? 'shadow-neon pulse-ring' : ''}
        ${sciFi ? 'corner-brackets hex-grid' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};

export default Card;
