/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //No me esta tomando los colores del tailwind.config.js - Consultar con los chicos.
        'verde': '#16697A',
        'azul':'#011a51',
        'naranja':'#d86015',
      },
    },
  },
  plugins: [],
}
