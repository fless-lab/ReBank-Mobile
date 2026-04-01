/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8B6F47",
        background: {
          light: "#FFFFFF",
          dark: "#FAF8F5",
        },
        foreground: "#1E1810",
        muted: "#8C7B6B",
        "muted-light": "#B5A99D",
        surface: "#FFFFFF",
        "surface-hover": "#F3EDE7",
        border: "#E8E0D8",
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
