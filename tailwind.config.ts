import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-page": "var(--bg-page)",
        "bg-surface": "var(--bg-surface)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-accent": "var(--text-accent)",
        "bg-accent": "var(--bg-accent)",
        "border-accent": "var(--border-accent)",
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#ffffff",
          hover: "var(--accent-hover)",
          muted: "var(--bg-accent)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "#ffffff",
          hover: "var(--accent-hover)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--text-secondary)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "#ffffff",
        },
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--accent)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", "system-ui", "sans-serif"],
        display: ["Inter", "var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        elevated: "0 4px 16px -2px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
