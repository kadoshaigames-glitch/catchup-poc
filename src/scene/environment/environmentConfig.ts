import { Color3, Color4 } from "@babylonjs/core";

export type ModuleThemeId =
  | "module-1"
  | "module-2"
  | "module-3"
  | "module-4"
  | "module-5"
  | "module-6";

export function normalizeModuleId(raw?: string): ModuleThemeId {
  if (!raw) return "module-1";
  const lower = raw.trim().toLowerCase();
  if (lower.includes("6") || lower.includes("six") || lower.includes("practice")) return "module-6";
  if (lower.includes("5") || lower.includes("five") || lower.includes("ethics") || lower.includes("security")) return "module-5";
  if (lower.includes("4") || lower.includes("four") || lower.includes("presentation") || lower.includes("report")) return "module-4";
  if (lower.includes("3") || lower.includes("three") || lower.includes("agent")) return "module-3";
  if (lower.includes("2") || lower.includes("two") || lower.includes("comparison")) return "module-2";
  return "module-1";
}

export interface EnvironmentThemeConfig {
  id: ModuleThemeId;
  name: string;
  themeTitle: string;
  // Scene clear & fog
  clearColor: Color4;
  fogColor: Color3;
  fogDensity: number;

  // Lighting
  hemiDiffuse: Color3;
  hemiGround: Color3;
  hemiIntensity: number;
  keyDiffuse: Color3;
  keyIntensity: number;
  rimDiffuse: Color3;
  rimIntensity: number;
  accentColor: Color3;
  accentIntensity: number;

  // Materials
  floorColor: Color3;
  floorSpecular: Color3;
  floorRoughness: number;
  wallColor: Color3;
  wallSpecular: Color3;
  trimColor: Color3;
  plinthColor: Color3;
  tableColor: Color3;
  accentPrimary: Color3;
  accentPrimaryEmissive: Color3;
  accentSecondary: Color3;
  accentSecondaryEmissive: Color3;

  // Clerestory panoramic vista gradient
  skyTopColor: string;
  skyMidColor: string;
  skyHorizonColor: string;

  // Particles
  particleColor1: Color4;
  particleColor2: Color4;
  particleRate: number;
  particleSpeed: number;
}

export const MODULE_ENVIRONMENTS: Record<ModuleThemeId, EnvironmentThemeConfig> = {
  // =========================================================================
  // MODULE 1 — AI BASICS: "Intelligent Learning Atrium"
  // Bright, luminous, elegant discovery atmosphere with blue + warm gold accents
  // =========================================================================
  "module-1": {
    id: "module-1",
    name: "AI Basics",
    themeTitle: "Intelligent Learning Atrium",
    clearColor: new Color4(0.18, 0.22, 0.28, 1.0),
    fogColor: new Color3(0.20, 0.24, 0.30),
    fogDensity: 0.008,

    hemiDiffuse: new Color3(0.72, 0.80, 0.92),
    hemiGround: new Color3(0.32, 0.30, 0.28),
    hemiIntensity: 0.78,
    keyDiffuse: new Color3(1.0, 0.95, 0.88),
    keyIntensity: 0.95,
    rimDiffuse: new Color3(0.65, 0.78, 0.95),
    rimIntensity: 0.50,
    accentColor: new Color3(1.0, 0.85, 0.55),
    accentIntensity: 1.4,

    floorColor: new Color3(0.32, 0.36, 0.42),
    floorSpecular: new Color3(0.18, 0.20, 0.24),
    floorRoughness: 0.25,
    wallColor: new Color3(0.48, 0.52, 0.58),
    wallSpecular: new Color3(0.15, 0.15, 0.18),
    trimColor: new Color3(0.24, 0.27, 0.32),
    plinthColor: new Color3(0.22, 0.25, 0.30),
    tableColor: new Color3(0.28, 0.26, 0.24),
    accentPrimary: new Color3(0.92, 0.76, 0.38),
    accentPrimaryEmissive: new Color3(0.65, 0.50, 0.20),
    accentSecondary: new Color3(0.35, 0.65, 0.95),
    accentSecondaryEmissive: new Color3(0.25, 0.45, 0.75),

    skyTopColor: "#254e7b",
    skyMidColor: "#5a8bbd",
    skyHorizonColor: "#ffd79e",

    particleColor1: new Color4(1.0, 0.90, 0.65, 0.75),
    particleColor2: new Color4(0.80, 0.68, 0.40, 0.40),
    particleRate: 20,
    particleSpeed: 0.008,
  },

  // =========================================================================
  // MODULE 2 — SMART COMPARISON: "Comparison & Analysis Studio"
  // Balanced architectural symmetry, dual-panel visual language, cyan + amber
  // =========================================================================
  "module-2": {
    id: "module-2",
    name: "Smart Comparison",
    themeTitle: "Comparison & Analysis Studio",
    clearColor: new Color4(0.11, 0.14, 0.19, 1.0),
    fogColor: new Color3(0.13, 0.16, 0.22),
    fogDensity: 0.010,

    hemiDiffuse: new Color3(0.55, 0.68, 0.82),
    hemiGround: new Color3(0.18, 0.18, 0.20),
    hemiIntensity: 0.72,
    keyDiffuse: new Color3(0.95, 0.96, 1.0),
    keyIntensity: 0.98,
    rimDiffuse: new Color3(0.95, 0.80, 0.55),
    rimIntensity: 0.55,
    accentColor: new Color3(0.35, 0.85, 0.95),
    accentIntensity: 1.4,

    floorColor: new Color3(0.20, 0.24, 0.30),
    floorSpecular: new Color3(0.16, 0.18, 0.22),
    floorRoughness: 0.25,
    wallColor: new Color3(0.32, 0.36, 0.44),
    wallSpecular: new Color3(0.18, 0.18, 0.22),
    trimColor: new Color3(0.16, 0.20, 0.26),
    plinthColor: new Color3(0.18, 0.22, 0.28),
    tableColor: new Color3(0.22, 0.24, 0.28),
    accentPrimary: new Color3(0.15, 0.78, 0.94),
    accentPrimaryEmissive: new Color3(0.20, 0.68, 0.85),
    accentSecondary: new Color3(0.95, 0.75, 0.35),
    accentSecondaryEmissive: new Color3(0.85, 0.60, 0.20),

    skyTopColor: "#102a43",
    skyMidColor: "#243b53",
    skyHorizonColor: "#486581",

    particleColor1: new Color4(0.40, 0.85, 1.0, 0.70),
    particleColor2: new Color4(1.0, 0.80, 0.40, 0.45),
    particleRate: 22,
    particleSpeed: 0.009,
  },

  // =========================================================================
  // MODULE 3 — AI AGENTS: "AI Systems Lab"
  // Interconnected network conduits, system architecture, emerald + electric cyan
  // =========================================================================
  "module-3": {
    id: "module-3",
    name: "AI Agents",
    themeTitle: "AI Systems Lab",
    clearColor: new Color4(0.08, 0.12, 0.16, 1.0),
    fogColor: new Color3(0.10, 0.14, 0.18),
    fogDensity: 0.012,

    hemiDiffuse: new Color3(0.45, 0.65, 0.70),
    hemiGround: new Color3(0.12, 0.16, 0.16),
    hemiIntensity: 0.68,
    keyDiffuse: new Color3(0.92, 0.98, 0.95),
    keyIntensity: 0.95,
    rimDiffuse: new Color3(0.20, 0.90, 0.75),
    rimIntensity: 0.60,
    accentColor: new Color3(0.10, 0.85, 0.65),
    accentIntensity: 1.4,

    floorColor: new Color3(0.15, 0.18, 0.22),
    floorSpecular: new Color3(0.14, 0.18, 0.20),
    floorRoughness: 0.25,
    wallColor: new Color3(0.25, 0.29, 0.34),
    wallSpecular: new Color3(0.16, 0.18, 0.20),
    trimColor: new Color3(0.12, 0.15, 0.18),
    plinthColor: new Color3(0.15, 0.19, 0.22),
    tableColor: new Color3(0.16, 0.20, 0.23),
    accentPrimary: new Color3(0.08, 0.82, 0.58),
    accentPrimaryEmissive: new Color3(0.12, 0.75, 0.52),
    accentSecondary: new Color3(0.10, 0.70, 0.90),
    accentSecondaryEmissive: new Color3(0.15, 0.60, 0.85),

    skyTopColor: "#061a1e",
    skyMidColor: "#0f333a",
    skyHorizonColor: "#1d5861",

    particleColor1: new Color4(0.20, 0.90, 0.70, 0.75),
    particleColor2: new Color4(0.10, 0.75, 0.95, 0.45),
    particleRate: 24,
    particleSpeed: 0.010,
  },

  // =========================================================================
  // MODULE 4 — PRESENTATION & REPORT: "Executive Presentation Studio"
  // Refined stage space, dark walnut acoustic baffles, warm champagne lighting
  // =========================================================================
  "module-4": {
    id: "module-4",
    name: "Presentation & Report",
    themeTitle: "Executive Presentation Studio",
    clearColor: new Color4(0.11, 0.10, 0.13, 1.0),
    fogColor: new Color3(0.14, 0.12, 0.15),
    fogDensity: 0.010,

    hemiDiffuse: new Color3(0.70, 0.65, 0.60),
    hemiGround: new Color3(0.22, 0.16, 0.12),
    hemiIntensity: 0.75,
    keyDiffuse: new Color3(1.0, 0.92, 0.80),
    keyIntensity: 1.05,
    rimDiffuse: new Color3(0.95, 0.82, 0.65),
    rimIntensity: 0.50,
    accentColor: new Color3(1.0, 0.82, 0.55),
    accentIntensity: 1.4,

    floorColor: new Color3(0.20, 0.18, 0.20),
    floorSpecular: new Color3(0.18, 0.16, 0.15),
    floorRoughness: 0.25,
    wallColor: new Color3(0.36, 0.30, 0.26),
    wallSpecular: new Color3(0.16, 0.14, 0.12),
    trimColor: new Color3(0.22, 0.15, 0.10),
    plinthColor: new Color3(0.24, 0.16, 0.12),
    tableColor: new Color3(0.28, 0.18, 0.13),
    accentPrimary: new Color3(0.88, 0.72, 0.45),
    accentPrimaryEmissive: new Color3(0.65, 0.50, 0.25),
    accentSecondary: new Color3(0.95, 0.85, 0.68),
    accentSecondaryEmissive: new Color3(0.70, 0.58, 0.38),

    skyTopColor: "#1a1218",
    skyMidColor: "#36222b",
    skyHorizonColor: "#6b473b",

    particleColor1: new Color4(1.0, 0.90, 0.72, 0.70),
    particleColor2: new Color4(0.85, 0.70, 0.45, 0.40),
    particleRate: 18,
    particleSpeed: 0.007,
  },

  // =========================================================================
  // MODULE 5 — ETHICS, PRIVACY & SECURITY: "Trust & Governance Chamber"
  // Calm, trustworthy rotunda, geometric shield motifs, regal cobalt + gold
  // =========================================================================
  "module-5": {
    id: "module-5",
    name: "Ethics & Governance",
    themeTitle: "Trust & Governance Chamber",
    clearColor: new Color4(0.09, 0.12, 0.18, 1.0),
    fogColor: new Color3(0.11, 0.14, 0.20),
    fogDensity: 0.010,

    hemiDiffuse: new Color3(0.58, 0.68, 0.85),
    hemiGround: new Color3(0.16, 0.16, 0.20),
    hemiIntensity: 0.72,
    keyDiffuse: new Color3(0.95, 0.96, 1.0),
    keyIntensity: 0.98,
    rimDiffuse: new Color3(0.40, 0.70, 1.0),
    rimIntensity: 0.55,
    accentColor: new Color3(0.25, 0.60, 0.95),
    accentIntensity: 1.4,

    floorColor: new Color3(0.18, 0.22, 0.28),
    floorSpecular: new Color3(0.16, 0.18, 0.22),
    floorRoughness: 0.25,
    wallColor: new Color3(0.38, 0.42, 0.50),
    wallSpecular: new Color3(0.18, 0.20, 0.24),
    trimColor: new Color3(0.15, 0.18, 0.24),
    plinthColor: new Color3(0.18, 0.22, 0.28),
    tableColor: new Color3(0.20, 0.22, 0.26),
    accentPrimary: new Color3(0.25, 0.62, 0.96),
    accentPrimaryEmissive: new Color3(0.20, 0.52, 0.88),
    accentSecondary: new Color3(0.92, 0.75, 0.38),
    accentSecondaryEmissive: new Color3(0.72, 0.55, 0.22),

    skyTopColor: "#0b1526",
    skyMidColor: "#172d4d",
    skyHorizonColor: "#33557e",

    particleColor1: new Color4(0.35, 0.70, 1.0, 0.75),
    particleColor2: new Color4(0.95, 0.80, 0.45, 0.45),
    particleRate: 20,
    particleSpeed: 0.008,
  },

  // =========================================================================
  // MODULE 6 — PUTTING AI INTO PRACTICE: "AI Innovation Workspace"
  // Bright, optimistic modern campus, blonde oak slats, dynamic momentum
  // =========================================================================
  "module-6": {
    id: "module-6",
    name: "AI in Practice",
    themeTitle: "AI Innovation Workspace",
    clearColor: new Color4(0.18, 0.20, 0.23, 1.0),
    fogColor: new Color3(0.20, 0.22, 0.25),
    fogDensity: 0.008,

    hemiDiffuse: new Color3(0.82, 0.82, 0.86),
    hemiGround: new Color3(0.35, 0.30, 0.25),
    hemiIntensity: 0.78,
    keyDiffuse: new Color3(1.0, 0.95, 0.86),
    keyIntensity: 0.98,
    rimDiffuse: new Color3(0.98, 0.82, 0.60),
    rimIntensity: 0.52,
    accentColor: new Color3(0.98, 0.75, 0.42),
    accentIntensity: 1.4,

    floorColor: new Color3(0.34, 0.34, 0.36),
    floorSpecular: new Color3(0.16, 0.15, 0.14),
    floorRoughness: 0.25,
    wallColor: new Color3(0.46, 0.46, 0.48),
    wallSpecular: new Color3(0.15, 0.14, 0.13),
    trimColor: new Color3(0.38, 0.28, 0.20),
    plinthColor: new Color3(0.30, 0.22, 0.16),
    tableColor: new Color3(0.34, 0.25, 0.18),
    accentPrimary: new Color3(0.95, 0.65, 0.28),
    accentPrimaryEmissive: new Color3(0.75, 0.45, 0.18),
    accentSecondary: new Color3(0.92, 0.80, 0.42),
    accentSecondaryEmissive: new Color3(0.70, 0.58, 0.24),

    skyTopColor: "#2a5584",
    skyMidColor: "#5987b5",
    skyHorizonColor: "#ffd69e",

    particleColor1: new Color4(1.0, 0.85, 0.55, 0.75),
    particleColor2: new Color4(0.98, 0.65, 0.35, 0.45),
    particleRate: 22,
    particleSpeed: 0.009,
  },
};
