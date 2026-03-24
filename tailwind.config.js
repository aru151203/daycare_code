/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where to look for class names
  // Without this being correct, Tailwind generates empty CSS = everything unstyled
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./*.{js,jsx,ts,tsx}",        // catches root-level files
    "./components/**/*.{js,jsx}", // catches any components outside src
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ff6d34",
          green:  "#00bea3",
          dark:   "#2D3436",
        },
      },
    },
  },
  plugins: [],
};