/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#0F172A",
          elevated: "#1E293B",
          overlay: "#334155",
          border: "rgba(255,255,255,0.08)",
        },
        accent: {
          purple: "#A78BFA",
          blue: "#60A5FA",
          cyan: "#22D3EE",
          glow: "rgba(139, 92, 246, 0.4)",
        },
        gradient: {
          start: "#8B5CF6",
          mid: "#6366F1",
          end: "#22D3EE",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(96, 165, 250, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(34, 211, 238, 0.08) 0px, transparent 50%)",
        "gradient-glow":
          "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(96, 165, 250, 0.15) 50%, rgba(34, 211, 238, 0.1) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255,255,255,0.05)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255,255,255,0.06)",
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.4), 0 0 80px -20px rgba(96, 165, 250, 0.2)",
        "glow-sm": "0 0 20px -5px rgba(139, 92, 246, 0.3)",
        "inner-glow": "inset 0 0 60px -20px rgba(139, 92, 246, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", boxShadow: "0 0 40px -10px rgba(139, 92, 246, 0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 60px -10px rgba(139, 92, 246, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundSize: {
        "200": "200%",
      },
      backgroundPosition: {
        "shimmer-start": "-200% 0",
        "shimmer-end": "200% 0",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
        glass: "12px",
        "glass-lg": "24px",
      },
    },
  },
  plugins: [],
};
