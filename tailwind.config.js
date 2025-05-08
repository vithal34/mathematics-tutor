/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#f3f4f6',
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      }
    },
  },
  plugins: [],
} 