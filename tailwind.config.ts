import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          green: "#0c5d2a",
          lines: "#d7f2d8",
        },
        team: {
          a: "#0e84ff",
          b: "#ff6b6b",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        pitch: "0 30px 60px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
