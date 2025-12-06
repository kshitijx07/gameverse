import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    sciFi = true // Enable sci-fi effects by default
}) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-300 relative overflow-hidden';

    const variants = {
        primary: 'neon-button holographic-hover energy-border',
        secondary: 'bg-dark-700 hover:bg-dark-600 border border-neon-cyan/30 hover:border-neon-cyan text-white',
        danger: 'bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300',
        ghost: 'bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const handleClick = (e) => {
        if (disabled) return;

        // Create ripple effect on click
        if (sciFi) {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        if (onClick) onClick(e);
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={handleClick}
            disabled={disabled}
            className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${sciFi ? 'scan-lines' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
};

// Add ripple styles
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 240, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default Button;
