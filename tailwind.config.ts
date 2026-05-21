import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          "00": "#020203",
          "01": "#050508",
          "02": "#0C0C12",
          "03": "#14141C",
          "04": "#1E1E28",
          "05": "#2C2C3A",
        },
        ink: {
          primary: "#F0F0F8",
          secondary: "#8A8A9A",
          tertiary: "#4A4A5A",
        },
        accent: "#6C63FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
