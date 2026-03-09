/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2edc6b",
        background: {
          light: "#f6f8f7",
          dark: "#122017",
        },
      },
      fontFamily: {
        manrope: ["Manrope"],
        "manrope-medium": ["Manrope-Medium"],
        "manrope-semibold": ["Manrope-SemiBold"],
        "manrope-bold": ["Manrope-Bold"],
        "manrope-extrabold": ["Manrope-ExtraBold"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
