/* @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      colors: {
        mintcream: "#F5FFFA",
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  animation: {
    fadeIn: 'fadeIn 1s ease-in-out',
    slideIn: 'slideIn 1s ease-out',
    gradient: 'gradient 3s ease infinite',
  },
  keyframes: {
    fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
    slideIn: { '0%': { transform: 'translateX(100px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
    gradient: {
      '0%, 100%': { 'background-position': '0% 50%' },
      '50%': { 'background-position': '100% 50%' },
    },
  },
}

