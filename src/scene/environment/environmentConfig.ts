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
  moduleCode: string;
  badgeTag: string;

  // Scene clear & fog
  clearColor: Color4;
  fogColor: Color3;
  fogDensity: number;

  // Lighting (Calibrated for Awang separation & crisp corporate drama)
  hemiDiffuse: Color3;
  hemiGround: Color3;
  hemiIntensity: number;
  keyDiffuse: Color3;
  keyIntensity: number;
  rimDiffuse: Color3;
  rimIntensity: number;
  fillIntensity: number;
  accentColor: Color3;
  accentIntensity: number;

  // Architectural Materials
  floorColor: Color3;
  floorSpecular: Color3;
  floorRoughness: number;
  wallColor: Color3;
  wallSpecular: Color3;
  trimColor: Color3;
  plinthColor: Color3;
  tableColor: Color3;

  // Saturated Neon Accents & Holograms
  accentPrimary: Color3;
  accentPrimaryEmissive: Color3;
  accentSecondary: Color3;
  accentSecondaryEmissive: Color3;
  hologramColor: Color3;
  boardBezelColor: Color3;
  floorRunwayColor: Color3;

  // Panoramic Clerestory Vista & Skyline
  skyTopColor: string;
  skyMidColor: string;
  skyHorizonColor: string;

  // Atmospheric Particles
  particleColor1: Color4;
  particleColor2: Color4;
  particleRate: number;
  particleSpeed: number;
}

export const MODULE_ENVIRONMENTS: Record<ModuleThemeId, EnvironmentThemeConfig> = {
  // =========================================================================
  // MODULE 1 — AI BASICS: "Intelligent Learning Atrium"
  // Bright, luminous, aspirational discovery atrium with electric cyan + champagne gold
  // =========================================================================
  "module-1": {
    id: "module-1",
    name: "AI Basics & Prompting",
    themeTitle: "Intelligent Learning Atrium",
    moduleCode: "TTDA-M1",
    badgeTag: "PROMPT ENGINEERING // FOUNDATIONS",

    clearColor: new Color4(0.07, 0.09, 0.12, 1.0),
    fogColor: new Color3(0.08, 0.10, 0.14),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.68, 0.74, 0.85),
    hemiGround: new Color3(0.12, 0.13, 0.16),
    hemiIntensity: 0.50,
    keyDiffuse: new Color3(1.0, 0.97, 0.92),
    keyIntensity: 1.30,
    rimDiffuse: new Color3(0.0, 0.92, 1.0), // Electric cyan rim carving Awang
    rimIntensity: 1.05,
    fillIntensity: 0.30,
    accentColor: new Color3(0.0, 0.92, 1.0),
    accentIntensity: 2.1,

    floorColor: new Color3(0.08, 0.10, 0.13),
    floorSpecular: new Color3(0.38, 0.44, 0.52),
    floorRoughness: 0.06,
    wallColor: new Color3(0.13, 0.16, 0.20),
    wallSpecular: new Color3(0.18, 0.20, 0.24),
    trimColor: new Color3(0.16, 0.19, 0.24),
    plinthColor: new Color3(0.10, 0.12, 0.16),
    tableColor: new Color3(0.12, 0.14, 0.18),

    accentPrimary: new Color3(0.0, 0.92, 1.0), // Electric cyan
    accentPrimaryEmissive: new Color3(0.0, 0.90, 1.0),
    accentSecondary: new Color3(1.0, 0.80, 0.28), // Champagne gold
    accentSecondaryEmissive: new Color3(1.0, 0.76, 0.22),
    hologramColor: new Color3(0.0, 0.94, 1.0),
    boardBezelColor: new Color3(0.0, 0.90, 1.0),
    floorRunwayColor: new Color3(0.0, 0.90, 1.0),

    skyTopColor: "#0b192c",
    skyMidColor: "#1d3f66",
    skyHorizonColor: "#f3c26b",

    particleColor1: new Color4(0.0, 0.92, 1.0, 0.85),
    particleColor2: new Color4(1.0, 0.82, 0.30, 0.55),
    particleRate: 28,
    particleSpeed: 0.009,
  },

  // =========================================================================
  // MODULE 2 — SMART COMPARISON: "Comparison & Variance Analytics Studio"
  // Balanced architectural symmetry, dual-channel cyan + amber analytical studio
  // =========================================================================
  "module-2": {
    id: "module-2",
    name: "Smart Comparison",
    themeTitle: "Comparison & Variance Analytics Studio",
    moduleCode: "TTDA-M2",
    badgeTag: "MULTI-DOC VARIANCE AUDITOR",

    clearColor: new Color4(0.06, 0.08, 0.11, 1.0),
    fogColor: new Color3(0.07, 0.09, 0.13),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.65, 0.72, 0.82),
    hemiGround: new Color3(0.11, 0.12, 0.15),
    hemiIntensity: 0.48,
    keyDiffuse: new Color3(0.98, 0.98, 1.0),
    keyIntensity: 1.30,
    rimDiffuse: new Color3(1.0, 0.68, 0.16), // Radiant comparative amber rim
    rimIntensity: 1.05,
    fillIntensity: 0.28,
    accentColor: new Color3(0.08, 0.85, 0.98),
    accentIntensity: 2.1,

    floorColor: new Color3(0.07, 0.09, 0.12),
    floorSpecular: new Color3(0.36, 0.42, 0.50),
    floorRoughness: 0.06,
    wallColor: new Color3(0.12, 0.15, 0.19),
    wallSpecular: new Color3(0.18, 0.20, 0.24),
    trimColor: new Color3(0.15, 0.18, 0.23),
    plinthColor: new Color3(0.10, 0.12, 0.16),
    tableColor: new Color3(0.12, 0.14, 0.18),

    accentPrimary: new Color3(0.05, 0.88, 1.0), // Analytical laser cyan
    accentPrimaryEmissive: new Color3(0.05, 0.85, 0.98),
    accentSecondary: new Color3(1.0, 0.65, 0.14), // Comparative amber
    accentSecondaryEmissive: new Color3(0.98, 0.60, 0.10),
    hologramColor: new Color3(0.08, 0.88, 1.0),
    boardBezelColor: new Color3(1.0, 0.68, 0.16),
    floorRunwayColor: new Color3(0.05, 0.88, 1.0),

    skyTopColor: "#071322",
    skyMidColor: "#152a45",
    skyHorizonColor: "#4f729b",

    particleColor1: new Color4(0.08, 0.88, 1.0, 0.80),
    particleColor2: new Color4(1.0, 0.68, 0.16, 0.60),
    particleRate: 28,
    particleSpeed: 0.009,
  },

  // =========================================================================
  // MODULE 3 — AI AGENTS: "Neural Systems & Agent Architecture Lab"
  // Deep cybernetic enterprise lab, server telemetry fins, emerald + electric sapphire
  // =========================================================================
  "module-3": {
    id: "module-3",
    name: "Build AI Agents",
    themeTitle: "Neural Systems & Agent Architecture Lab",
    moduleCode: "TTDA-M3",
    badgeTag: "AUTONOMOUS SYSTEM ORCHESTRATION",

    clearColor: new Color4(0.05, 0.09, 0.09, 1.0),
    fogColor: new Color3(0.06, 0.10, 0.11),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.55, 0.74, 0.72),
    hemiGround: new Color3(0.09, 0.13, 0.13),
    hemiIntensity: 0.46,
    keyDiffuse: new Color3(0.96, 1.0, 0.98),
    keyIntensity: 1.30,
    rimDiffuse: new Color3(0.05, 0.96, 0.62), // Cyber emerald rim
    rimIntensity: 1.10,
    fillIntensity: 0.28,
    accentColor: new Color3(0.05, 0.96, 0.62),
    accentIntensity: 2.2,

    floorColor: new Color3(0.06, 0.09, 0.10),
    floorSpecular: new Color3(0.32, 0.46, 0.44),
    floorRoughness: 0.06,
    wallColor: new Color3(0.11, 0.15, 0.16),
    wallSpecular: new Color3(0.16, 0.22, 0.22),
    trimColor: new Color3(0.13, 0.18, 0.19),
    plinthColor: new Color3(0.09, 0.12, 0.13),
    tableColor: new Color3(0.10, 0.14, 0.15),

    accentPrimary: new Color3(0.05, 0.96, 0.60), // Cyber emerald mint
    accentPrimaryEmissive: new Color3(0.05, 0.92, 0.58),
    accentSecondary: new Color3(0.12, 0.68, 1.0), // System electric sapphire
    accentSecondaryEmissive: new Color3(0.10, 0.64, 0.98),
    hologramColor: new Color3(0.05, 0.96, 0.62),
    boardBezelColor: new Color3(0.05, 0.96, 0.60),
    floorRunwayColor: new Color3(0.12, 0.68, 1.0),

    skyTopColor: "#021316",
    skyMidColor: "#0a2b30",
    skyHorizonColor: "#1d6264",

    particleColor1: new Color4(0.05, 0.96, 0.62, 0.85),
    particleColor2: new Color4(0.12, 0.68, 1.0, 0.55),
    particleRate: 30,
    particleSpeed: 0.010,
  },

  // =========================================================================
  // MODULE 4 — PRESENTATION & REPORT: "Executive Presentation & Media Studio"
  // Refined media stage, rich dark acoustic baffles, warm champagne bronze lighting
  // =========================================================================
  "module-4": {
    id: "module-4",
    name: "Presentation & Report",
    themeTitle: "Executive Presentation & Media Studio",
    moduleCode: "TTDA-M4",
    badgeTag: "VISUAL STORYTELLING & SYNTHESIS",

    clearColor: new Color4(0.08, 0.06, 0.08, 1.0),
    fogColor: new Color3(0.09, 0.07, 0.09),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.70, 0.64, 0.62),
    hemiGround: new Color3(0.14, 0.10, 0.10),
    hemiIntensity: 0.50,
    keyDiffuse: new Color3(1.0, 0.95, 0.88),
    keyIntensity: 1.32,
    rimDiffuse: new Color3(1.0, 0.84, 0.44), // Warm champagne gold rim
    rimIntensity: 1.05,
    fillIntensity: 0.30,
    accentColor: new Color3(1.0, 0.82, 0.38),
    accentIntensity: 2.1,

    floorColor: new Color3(0.08, 0.07, 0.08),
    floorSpecular: new Color3(0.42, 0.38, 0.40),
    floorRoughness: 0.06,
    wallColor: new Color3(0.14, 0.12, 0.14),
    wallSpecular: new Color3(0.20, 0.18, 0.18),
    trimColor: new Color3(0.18, 0.14, 0.14),
    plinthColor: new Color3(0.11, 0.09, 0.10),
    tableColor: new Color3(0.14, 0.11, 0.12),

    accentPrimary: new Color3(1.0, 0.82, 0.38), // Radiant champagne bronze
    accentPrimaryEmissive: new Color3(0.98, 0.78, 0.32),
    accentSecondary: new Color3(0.90, 0.32, 0.98), // Amethyst media magenta
    accentSecondaryEmissive: new Color3(0.85, 0.26, 0.92),
    hologramColor: new Color3(1.0, 0.84, 0.42),
    boardBezelColor: new Color3(1.0, 0.82, 0.38),
    floorRunwayColor: new Color3(0.90, 0.32, 0.98),

    skyTopColor: "#170c17",
    skyMidColor: "#33182b",
    skyHorizonColor: "#7a4a39",

    particleColor1: new Color4(1.0, 0.85, 0.42, 0.80),
    particleColor2: new Color4(0.90, 0.32, 0.98, 0.50),
    particleRate: 26,
    particleSpeed: 0.008,
  },

  // =========================================================================
  // MODULE 5 — ETHICS, PRIVACY & SECURITY: "Trust, Ethics & AI Governance Chamber"
  // Dignified security rotunda, hexagonal pillars, regal cobalt + platinum gold
  // =========================================================================
  "module-5": {
    id: "module-5",
    name: "Ethics, Privacy & Security",
    themeTitle: "Trust, Ethics & AI Governance Chamber",
    moduleCode: "TTDA-M5",
    badgeTag: "COMPLIANCE & GOVERNANCE AUTHORITY",

    clearColor: new Color4(0.06, 0.08, 0.12, 1.0),
    fogColor: new Color3(0.07, 0.09, 0.13),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.64, 0.72, 0.85),
    hemiGround: new Color3(0.10, 0.12, 0.16),
    hemiIntensity: 0.48,
    keyDiffuse: new Color3(0.96, 0.98, 1.0),
    keyIntensity: 1.30,
    rimDiffuse: new Color3(0.20, 0.65, 1.0), // Deep regal cobalt rim
    rimIntensity: 1.10,
    fillIntensity: 0.28,
    accentColor: new Color3(0.20, 0.65, 1.0),
    accentIntensity: 2.1,

    floorColor: new Color3(0.07, 0.09, 0.13),
    floorSpecular: new Color3(0.36, 0.42, 0.54),
    floorRoughness: 0.06,
    wallColor: new Color3(0.12, 0.15, 0.20),
    wallSpecular: new Color3(0.18, 0.20, 0.26),
    trimColor: new Color3(0.15, 0.18, 0.24),
    plinthColor: new Color3(0.10, 0.12, 0.16),
    tableColor: new Color3(0.12, 0.14, 0.19),

    accentPrimary: new Color3(0.18, 0.65, 1.0), // Regal security cobalt
    accentPrimaryEmissive: new Color3(0.18, 0.60, 0.98),
    accentSecondary: new Color3(1.0, 0.88, 0.42), // Integrity platinum gold
    accentSecondaryEmissive: new Color3(0.96, 0.82, 0.35),
    hologramColor: new Color3(0.24, 0.70, 1.0),
    boardBezelColor: new Color3(0.18, 0.65, 1.0),
    floorRunwayColor: new Color3(1.0, 0.88, 0.42),

    skyTopColor: "#050d1a",
    skyMidColor: "#102344",
    skyHorizonColor: "#385e8e",

    particleColor1: new Color4(0.20, 0.68, 1.0, 0.85),
    particleColor2: new Color4(1.0, 0.88, 0.42, 0.55),
    particleRate: 28,
    particleSpeed: 0.009,
  },

  // =========================================================================
  // MODULE 6 — PUTTING AI INTO PRACTICE: "Workplace AI Innovation Accelerator"
  // High-energy transformation hub, angled momentum fins, kinetic orange + teal
  // =========================================================================
  "module-6": {
    id: "module-6",
    name: "Putting AI into Practice",
    themeTitle: "Workplace AI Innovation Accelerator",
    moduleCode: "TTDA-M6",
    badgeTag: "30-DAY OPERATIONAL TRANSFORMATION",

    clearColor: new Color4(0.08, 0.08, 0.09, 1.0),
    fogColor: new Color3(0.09, 0.09, 0.10),
    fogDensity: 0.003,

    hemiDiffuse: new Color3(0.72, 0.70, 0.68),
    hemiGround: new Color3(0.15, 0.13, 0.12),
    hemiIntensity: 0.50,
    keyDiffuse: new Color3(1.0, 0.96, 0.92),
    keyIntensity: 1.32,
    rimDiffuse: new Color3(1.0, 0.50, 0.10), // High-energy kinetic orange rim
    rimIntensity: 1.10,
    fillIntensity: 0.30,
    accentColor: new Color3(1.0, 0.48, 0.10),
    accentIntensity: 2.2,

    floorColor: new Color3(0.08, 0.08, 0.10),
    floorSpecular: new Color3(0.42, 0.40, 0.44),
    floorRoughness: 0.06,
    wallColor: new Color3(0.14, 0.14, 0.16),
    wallSpecular: new Color3(0.18, 0.18, 0.20),
    trimColor: new Color3(0.18, 0.15, 0.14),
    plinthColor: new Color3(0.11, 0.10, 0.10),
    tableColor: new Color3(0.13, 0.12, 0.12),

    accentPrimary: new Color3(1.0, 0.46, 0.08), // Kinetic neon orange
    accentPrimaryEmissive: new Color3(0.98, 0.40, 0.06),
    accentSecondary: new Color3(0.06, 0.88, 0.80), // Execution electric teal
    accentSecondaryEmissive: new Color3(0.06, 0.84, 0.74),
    hologramColor: new Color3(1.0, 0.50, 0.12),
    boardBezelColor: new Color3(1.0, 0.46, 0.08),
    floorRunwayColor: new Color3(0.06, 0.88, 0.80),

    skyTopColor: "#09131e",
    skyMidColor: "#173452",
    skyHorizonColor: "#ff8238",

    particleColor1: new Color4(1.0, 0.48, 0.10, 0.85),
    particleColor2: new Color4(0.06, 0.88, 0.80, 0.55),
    particleRate: 30,
    particleSpeed: 0.010,
  },
};
