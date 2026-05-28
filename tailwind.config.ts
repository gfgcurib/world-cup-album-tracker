import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        wc: {
          ink: "#0B1F3A",
          teal: "#0FB5A5",
          magenta: "#E6007E",
          gold: "#FFC72C",
          red: "#E4002B",
          purple: "#7A4DD6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
