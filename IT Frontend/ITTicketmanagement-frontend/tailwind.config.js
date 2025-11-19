/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'employee': {
          'primary': '#14b8a6',
          'secondary': '#0d9488',
          'light': '#5eead4'
        },
        'manager': {
          'primary': '#1e40af',
          'secondary': '#1e3a8a',
          'light': '#60a5fa'
        },
        'coo': {
          'primary': '#475569',
          'secondary': '#334155',
          'light': '#94a3b8'
        }
      }
    },
  },
  plugins: [],
}

