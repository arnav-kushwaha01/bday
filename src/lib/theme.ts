/**
 * Detective / Murder-Mystery Archive Theme Tokens
 * Palette: Manila Kraft Brown, Evidence Caution Yellow, Classified Red, Noir Black
 */

export const THEME = {
  // Brown (Manila dossier folder, aged kraft paper, dark mahogany desk)
  folder: {
    base: "#9c7a4c",
    dark: "#6e4f2b",
    light: "#b89358",
    tab: "#a38050",
    desk: "#1f150e",
    deskSurface: "#2a1c13",
  },
  // Yellow (Crime scene markers, evidence tags, caution accents)
  evidence: {
    primary: "#eab308",
    bright: "#facc15",
    amber: "#d97706",
    glow: "rgba(234, 179, 8, 0.25)",
  },
  // Red (Top secret / classified stamps, red string investigation lines, seals)
  classified: {
    stamp: "#b91c1c",
    bright: "#dc2626",
    dark: "#7f1d1d",
    string: "#ef4444",
    wax: "#881337",
  },
  // Black & Stone (Noir shadows, detective archives, typewriter ink)
  noir: {
    pitch: "#080605",
    surface: "#100d0b",
    stone: "#1a1614",
    shadow: "#050403",
    typewriter: "#0f0d0b",
  },
  // Aged paper
  paper: {
    bg: "#e8deca",
    aged: "#d6c7ac",
    text: "#1c1815",
  },
} as const;
