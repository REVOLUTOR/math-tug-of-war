import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teamA: '#1E6FD9',
        teamB: '#E84C1E',
      },
      animation: {
        'flash-green': 'flashGreen 0.5s ease-out',
        'shake': 'shake 0.4s ease-out',
        'pulse-red': 'pulseRed 1s ease-in-out infinite',
        'confetti-fall': 'confettiFall 3s linear forwards',
        'rope-sway': 'ropeSway 2s ease-in-out infinite',
      },
      keyframes: {
        flashGreen: {
          '0%': { backgroundColor: '#22c55e' },
          '100%': { backgroundColor: 'transparent' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        pulseRed: {
          '0%, 100%': { color: '#ef4444', transform: 'scale(1)' },
          '50%': { color: '#dc2626', transform: 'scale(1.05)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        ropeSway: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.02)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
