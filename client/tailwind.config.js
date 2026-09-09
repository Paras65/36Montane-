/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto','sans-serif'],
        serif:['Georgia', 'Cambria', 'serif']
      },
      colors: {
        chhattisgarh: {
          terracotta: '#C84B31',
          'terracotta-dark': '#9E321C',
          forest: '#1B4332',
          'forest-light': '#2D6A4F',
          'forest-dark': '#0D2319',
          gold: '#D4A373',
          'gold-light': '#E9C46A',
          sand: '#FAF6F0',
          'sand-dark': '#F0E5D3',
          charcoal: '#1A211D',
        }
      },
      gridTemplateColumns:{
        '70/30':'70% 28%',
      }
    },
  },
  plugins: [],
}