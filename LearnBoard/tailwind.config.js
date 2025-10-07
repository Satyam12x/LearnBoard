/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4caf50", // Green for actions
        secondary: "#2196f3", // Blue for accents
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable if you add dark mode later
};
