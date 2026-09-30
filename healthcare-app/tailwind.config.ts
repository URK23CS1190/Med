import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Medical Blue
        primary: {
          50: "#EBF5FF",
          100: "#D6EAFF",
          200: "#ADD5FF",
          300: "#85C0FF",
          400: "#5CABFF",
          500: "#1A6FD4",
          600: "#155BB0",
          700: "#10478C",
          800: "#0B3368",
          900: "#061F44",
        },
        // Secondary Teal
        secondary: {
          50: "#E6FAF9",
          100: "#CCF5F3",
          200: "#99EBE7",
          300: "#66E1DB",
          400: "#33D7CF",
          500: "#0EADA8",
          600: "#0B8A86",
          700: "#086865",
          800: "#064543",
          900: "#032322",
        },
        // Status colors
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          inactive: "#9CA3AF",
        },
        // Backgrounds
        surface: {
          primary: "#FFFFFF",
          secondary: "#F7FAFC",
          dark: "#0F172A",
          "dark-elevated": "#1E293B",
          "dark-card": "#1E293B",
        },
        // Text
        content: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
          inverse: "#FFFFFF",
          "dark-primary": "rgb(var(--text-primary) / <alpha-value>)",
          "dark-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "3.5rem",
          { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "2.5rem",
          { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
        "display-sm": [
          "2rem",
          { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
        "heading-lg": ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        chip: "999px",
        input: "10px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "card-dark": "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-dark-hover": "0 8px 32px rgba(0, 0, 0, 0.4)",
        elevated: "0 8px 40px rgba(0, 0, 0, 0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        sos: "0 0 0 4px rgba(239, 68, 68, 0.3), 0 4px 16px rgba(239, 68, 68, 0.25)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #1A6FD4 0%, #0EADA8 50%, #0EADA8 100%)",
        "gradient-hero-dark":
          "linear-gradient(135deg, #0B3368 0%, #064543 50%, #032322 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(26, 111, 212, 0.05) 0%, rgba(14, 173, 168, 0.05) 100%)",
        "gradient-card-dark":
          "linear-gradient(135deg, rgba(26, 111, 212, 0.15) 0%, rgba(14, 173, 168, 0.15) 100%)",
        "gradient-button":
          "linear-gradient(135deg, #1A6FD4 0%, #155BB0 100%)",
        "gradient-teal": "linear-gradient(135deg, #0EADA8 0%, #086865 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite linear",
        "slide-up": "slideUp 150ms ease-out",
        "slide-down": "slideDown 150ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
        "fade-in": "fadeIn 150ms ease-out",
        ripple: "ripple 600ms linear",
        "number-tick": "numberTick 300ms ease-out",
        "sos-pulse": "sosPulse 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        numberTick: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        sosPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(239, 68, 68, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;
