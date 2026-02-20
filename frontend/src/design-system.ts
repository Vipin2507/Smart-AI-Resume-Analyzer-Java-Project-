/**
 * Design system tokens — single source of truth for colors, spacing, and motion.
 * Use with Tailwind via CSS variables or direct reference.
 */
export const tokens = {
  colors: {
    surface: "#0F172A",
    surfaceElevated: "#1E293B",
    surfaceOverlay: "#334155",
    accentPurple: "#A78BFA",
    accentBlue: "#60A5FA",
    accentCyan: "#22D3EE",
    textPrimary: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "rgba(255,255,255,0.08)",
    success: "#34D399",
    error: "#F87171",
    warning: "#FBBF24",
  },
  motion: {
    durationFast: 0.15,
    durationNormal: 0.3,
    durationSlow: 0.5,
    easeOut: [0.16, 1, 0.3, 1],
    easeInOut: [0.65, 0, 0.35, 1],
  },
  radius: {
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  shadow: {
    glow: "0 0 40px -10px rgba(139, 92, 246, 0.4)",
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
  },
} as const;

/** Page-specific accent for dynamic theme shift */
export const pageAccents: Record<string, { from: string; to: string }> = {
  dashboard: { from: "#8B5CF6", to: "#6366F1" },
  analyze: { from: "#6366F1", to: "#22D3EE" },
  history: { from: "#22D3EE", to: "#34D399" },
  profile: { from: "#A78BFA", to: "#60A5FA" },
  login: { from: "#8B5CF6", to: "#22D3EE" },
  register: { from: "#6366F1", to: "#A78BFA" },
};
