/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d86015',
        'background-light': '#f8fafc',
        'background-dark': '#0f172a',
        'card-light': '#ffffff',
        'card-dark': '#1f2937',
        'text-light': '#f8fafc',
        'text-dark': '#0f172a',
        'border-light': '#e2e8f0',
        'border-dark': '#334155',
        verde: '#16697A',
        azul: '#011a51',
        naranja: '#d86015',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'white-md': '0 4px 18px rgba(255,255,255,0.14)',
      },
    },
  },
  plugins: [],
}
