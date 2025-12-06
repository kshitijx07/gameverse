/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: '#00f0ff',
                    purple: '#b026ff',
                    pink: '#ff006e',
                    cyan: '#00ffff',
                    green: '#39ff14',
                },
                dark: {
                    900: '#0a0a0f',
                    800: '#12121a',
                    700: '#1a1a2e',
                    600: '#252538',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-gaming': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-neon': 'linear-gradient(90deg, #00f0ff 0%, #b026ff 50%, #ff006e 100%)',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 15px #00f0ff' },
                    '100%': { boxShadow: '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 30px #b026ff' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'neon': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.3)',
                'neon-strong': '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(176, 38, 255, 0.6)',
            }
        },
    },
    plugins: [],
}
