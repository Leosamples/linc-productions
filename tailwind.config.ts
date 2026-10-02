import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        panel: "#0c0c0c",
        line: "rgba(245,242,234,0.10)",
        paper: "#F5F2EA",
        muted: "#9C9890",
        signal: "#35B7FF",
        rust: "#C1502E",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        serif: ["var(--font-instrument)", "serif"],
        sans: ["var(--font-grotesk)", "sans-serif"],
      },
      maxWidth: {
        copy: "38rem",
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
    },
  },
  plugins: [],
};

export default config;
