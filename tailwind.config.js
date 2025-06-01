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
        'particle-highlight': '#60a5fa', // A nice blue for highlighting
      },
      animation: {
        'wave': 'wave 1s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
        'kde-particle': 'kdePulse 2s ease-in-out infinite alternate',
        'kde-settle': 'kdeSettle 0.5s ease-out forwards',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'scaleY(1)' },
          '10%': { transform: 'scaleY(1.05)' },
          '20%': { transform: 'scaleY(1.1)' },
          '30%': { transform: 'scaleY(1.2)' },
          '40%': { transform: 'scaleY(1.3)' },
          '50%': { transform: 'scaleY(1.4)' },
          '60%': { transform: 'scaleY(1.3)' },
          '70%': { transform: 'scaleY(1.2)' },
          '80%': { transform: 'scaleY(1.1)' },
          '90%': { transform: 'scaleY(1.05)' },
          '100%': { transform: 'scaleY(1)' },
        },
        kdePulse: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0.5 },
          '50%': { transform: 'translateY(var(--peak-y, -10px))', opacity: 1 },
        },
        kdeSettle: {
          '0%': { transform: 'translateY(var(--peak-y-settle-start, -5px))', opacity: 0.7 },
          '100%': { transform: 'translateY(0)', opacity: 0.5 },
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    // Timeline dot colors
    'bg-blue-500',
    'bg-amber-300',
    'bg-green-500',
    'bg-red-500',

    // Project tech tag colors - solid backgrounds
    {
      pattern: /bg-(blue|cyan|green|emerald|sky|purple|neutral|indigo|violet|amber|red|yellow|black|orange)-500/,
    },

    // Nav bubble colors
    'bg-gray-100',
    'dark:bg-gray-800',
    'hover:bg-gray-200',
    'dark:hover:bg-gray-700'
  ],
} 