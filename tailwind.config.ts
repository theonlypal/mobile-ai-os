import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}",
    "./core/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        personal: {
          DEFAULT: "#0d9488",
        },
        creator: {
          DEFAULT: "#8b5cf6",
        },
        business: {
          DEFAULT: "#0ea5e9",
        },
        surface: "#0f172a",
        panel: "#111827",
      },
      boxShadow: {
        card: "0 10px 25px -15px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
