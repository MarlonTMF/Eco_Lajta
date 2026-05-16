/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1B5E20",
        "primary-light": "#4CAF50",
        accent: "#00C853",
        bg: "#F9FAF5",
        surface: "#FFFFFF",
        text: "#1A1A2E",
        "text-muted": "#6B7280",
        border: "#E5E7EB",
        "primary-container": "#2e7d32",
        "on-primary-container": "#cbffc2",
        "on-surface-variant": "#40493d"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        base: "8px",
        "margin-desktop": "80px",
        gutter: "24px",
        sm: "12px",
        xs: "4px",
        xl: "64px",
        "margin-mobile": "16px",
        lg: "40px",
        md: "24px"
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      }
    }
  },
  plugins: [],
}
