




/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        /* Premium Forest Green Theme */
        primary: {
          50: '#F0F7F2',
          100: '#DCEBE2',
          200: '#C0D9CA',
          300: '#96BDA6',
          400: '#6B9E81',
          500: '#4B8265',
          600: '#35694F',
          700: '#285541',
          800: '#24483F',
          900: '#1B382F',
        },

        /* Neutral Colors */
        dark: {
          50: '#F8FAF9',
          100: '#F1F5F2',
          200: '#E2E9E4',
          300: '#CAD5CD',
          400: '#94A49A',
          500: '#66776D',
          600: '#4D5D53',
          700: '#35463C',
          800: '#26372E',
          900: '#18271F',
          950: '#101A14',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },

      boxShadow: {
        'soft-green': '0 4px 20px rgba(36, 72, 63, 0.08)',
        'card-hover': '0 12px 32px rgba(36, 72, 63, 0.12)',
      },

      borderRadius: {
        '4xl': '2rem',
      },
    },
  },

  plugins: [],
};   