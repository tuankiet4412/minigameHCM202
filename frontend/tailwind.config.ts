import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: "#C41E3A",
          "red-dark": "#8B0000",
          gold: "#D4AF37",
          "gold-light": "#F4E4BC",
          "gold-dark": "#C89B3C",
          cream: "#FAF7F2",
          charcoal: "#0A0A0B",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-source)", "system-ui", "sans-serif"],
        sans: ["var(--font-source)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "clamp(4rem, 10vw, 8rem)",
      },
      borderRadius: {
        glass: "1.25rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-heritage":
          "linear-gradient(135deg, #C41E3A 0%, #8B0000 50%, #1A1A2E 100%)",
        "gradient-museum":
          "linear-gradient(180deg, transparent 0%, rgba(10,10,11,0.95) 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
        elevated: "0 24px 48px -12px rgba(196,30,58,0.15)",
        glow: "0 0 60px rgba(212,175,55,0.25)",
        "glow-red": "0 0 40px rgba(196,30,58,0.3)",
        "glow-gold": "0 0 80px rgba(212,175,55,0.3), 0 0 200px rgba(212,175,55,0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "drift": "drift 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-8px) translateX(6px)" },
          "66%": { transform: "translateY(4px) translateX(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
