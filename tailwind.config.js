/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff66',
        'neon-blue': '#00b4ff',
        'neon-cyan': '#00f0ff',
        'neon-red': '#ff3b5c',
        'neon-purple': '#a855f7',
        'neon-orange': '#ff8c00',
        'dark-void': '#030508',
        'dark-panel': '#0a0e17',
        'dark-card': '#0d1220',
        'dark-border': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 102, 0.35)',
        'neon-blue': '0 0 20px rgba(0, 180, 255, 0.35)',
        'neon-red': '0 0 20px rgba(255, 59, 92, 0.35)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'neon-cyan': '0 0 30px rgba(0, 240, 255, 0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #00b4ff 0%, #a855f7 100%)',
        'entry-gradient': 'linear-gradient(135deg, #00ff66 0%, #00b4ff 100%)',
        'danger-gradient': 'linear-gradient(135deg, #ff3b5c 0%, #ff6b35 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scan': 'scan 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scan: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(60px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
