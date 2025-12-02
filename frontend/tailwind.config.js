/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-night': '#0a0a0a',
        'neon-emerald': '#00ff7f',
        'light-emerald': '#7fffbf',
        'dark-emerald': '#008040',
        'primary-text': '#e0e0e0',
        'secondary-text': '#a0a0a0',
        'accent-1': '#ff00ff',
        'accent-2': '#00ffff',
      },
      boxShadow: {
        'neon-emerald': '0 0 5px #00ff7f, 0 0 10px #00ff7f, 0 0 20px #00ff7f, 0 0 40px #00ff7f',
        'neon-accent-1': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
        'neon-accent-2': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff',
      }
    },
  },
  plugins: [],
}
