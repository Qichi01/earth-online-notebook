import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        "earth-bg": "#f7f4ef",
        "earth-card": "#ffffff",
        "earth-text": "#2b2b2b",
        "earth-muted": "#6b6b6b",
        "earth-accent": "#5a7a6f",
        "earth-accent-soft": "#d9e5df"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xl: "16px"
      }
    }
  },
  plugins: []
};

export default config;
