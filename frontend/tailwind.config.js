/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        neon: {
          cyan: '#00ffff',
          blue: '#0ea5e9',
          purple: '#8b5cf6',
          magenta: '#ff00ff',
          pink: '#ec4899',
          lime: '#00ff00',
          green: '#10b981',
          amber: '#f59e0b',
        },
        cyber: {
          dark: '#0a0e27',
          darker: '#050816',
          slate: '#1e293b',
          'slate-light': '#334155',
        }
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        heading: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
            opacity: '0.8'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00ffff 0%, #8b5cf6 50%, #ff00ff 100%)',
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00ffff, 0 0 20px #00ffff',
        'neon-purple': '0 0 5px #8b5cf6, 0 0 20px #8b5cf6',
        'neon-green': '0 0 5px #10b981, 0 0 20px #10b981',
        'neon-pink': '0 0 5px #ec4899, 0 0 20px #ec4899',
        'cyber': '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
      }
    },
  },
  plugins: [],
}