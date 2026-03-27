/**
 * Design Tokens – single source of truth for all spacing, colors, radii & type.
 * Consumed by components and Tailwind arbitrary-value utilities.
 */

export const colors = {
  // Core dark backgrounds
  void: "#050508",
  surface0: "#0d0d14",
  surface1: "#13131f",
  surface2: "#1a1a2e",
  surface3: "#21213d",

  // Glass overlays
  glass4: "rgba(255,255,255,0.04)",
  glass8: "rgba(255,255,255,0.08)",
  glass12: "rgba(255,255,255,0.12)",

  // Neon accents
  neonCyan: "#00e5ff",
  neonViolet: "#9d4edd",
  neonGold: "#ffc300",
  neonRose: "#ff2d78",
  neonGreen: "#39ff14",

  // Text
  text100: "#f0f0ff",
  text60: "rgba(240,240,255,0.6)",
  text30: "rgba(240,240,255,0.3)",
} as const;

export const shadows = {
  neonCyan: "0 0 24px rgba(0,229,255,0.45), 0 0 60px rgba(0,229,255,0.12)",
  neonViolet: "0 0 24px rgba(157,78,221,0.5), 0 0 60px rgba(157,78,221,0.12)",
  neonGold: "0 0 24px rgba(255,195,0,0.45), 0 0 60px rgba(255,195,0,0.10)",
  neonRose: "0 0 24px rgba(255,45,120,0.45), 0 0 60px rgba(255,45,120,0.10)",
  glass: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
} as const;

export const timing = {
  spring: { type: "spring", stiffness: 400, damping: 30 } as const,
  smooth: { type: "spring", stiffness: 200, damping: 40 } as const,
  reveal: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
} as const;
