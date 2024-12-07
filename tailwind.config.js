/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@ionic/react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        customOrange: "#D94908",
      },
      backgroundImage: {
        fondoBoton: 'linear-gradient(to bottom right, theme("colors.orange.400"), #D94908)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}