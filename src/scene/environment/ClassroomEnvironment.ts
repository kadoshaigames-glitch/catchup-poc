import {
  Color3,
  DirectionalLight,
  DynamicTexture,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  PointLight,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import {
  MODULE_ENVIRONMENTS,
  normalizeModuleId,
  type EnvironmentThemeConfig,
  type ModuleThemeId,
} from "./environmentConfig";

export class ClassroomEnvironment {
  private readonly scene: Scene;
  private currentThemeId: ModuleThemeId | null = null;

  // Base materials
  private floorMat!: StandardMaterial;
  private wallMat!: StandardMaterial;
  private trimMat!: StandardMaterial;
  private plinthMat!: StandardMaterial;
  private tableMat!: StandardMaterial;
  private stageDaisMat!: StandardMaterial;
  private boardBezelMat!: StandardMaterial;
  private neonPrimaryMat!: StandardMaterial;
  private neonSecondaryMat!: StandardMaterial;
  private hologramMat!: StandardMaterial;
  private hudReticleMat!: StandardMaterial;
  private clerestoryMat!: StandardMaterial;
  private clerestoryTex!: DynamicTexture;

  // Lights
  private hemiLight!: HemisphericLight;
  private fillLight!: HemisphericLight;
  private keyLight!: DirectionalLight;
  private rimLight!: DirectionalLight;
  private accentPointLight!: PointLight;

  // Glow & Particles
  private glowLayer: GlowLayer | null = null;
  private particles: ParticleSystem | null = null;

  // Module-specific decorative feature nodes
  private readonly moduleFeatureNodes = new Map<ModuleThemeId, TransformNode>();

  // Animated continuous motion elements
  private floorPulses: Mesh[] = [];
  private boardCornerHUDs: Mesh[] = [];
  private dataBarSegments: Mesh[] = [];
  private awangHaloOuter: Mesh | null = null;
  private awangHaloInner: Mesh | null = null;

  // Module 1 items
  private m1RingOuter: Mesh | null = null;
  private m1RingInner: Mesh | null = null;
  private m1Satellites: Mesh[] = [];

  // Module 2 items
  private m2ScanBarL: Mesh | null = null;
  private m2ScanBarR: Mesh | null = null;

  // Module 3 items
  private m3NeuralRing: Mesh | null = null;
  private m3StatusLeds: Mesh[] = [];

  // Module 4 items
  private m4MediaFrame: Mesh | null = null;
  private m4TargetReticle: Mesh | null = null;

  // Module 5 items
  private m5ShieldTorus: Mesh | null = null;
  private m5GuardNodes: Mesh[] = [];

  // Module 6 items
  private m6MilestoneRing1: Mesh | null = null;
  private m6MilestoneRing2: Mesh | null = null;

  // Continuous animation state & entrance curve
  private time = 0;
  private entranceProgress = 1.0;

  constructor(scene: Scene, initialModuleId = "module-1") {
    this.scene = scene;

    this.createMaterials();
    this.createBaseArchitecture();
    this.createLighting();
    this.createClerestoryWindow();
    this.createBoardFrameAndHUD();
    this.createModuleSpecificArchitecture();
    this.createParticleSystem();

    this.glowLayer = new GlowLayer("classroomGlow", this.scene, {
      blurKernelSize: 28,
    });
    this.glowLayer.intensity = 0.50;

    this.setModule(initialModuleId);
  }

  private createMaterials(): void {
    // 1. Polished Architectural Floor (Obsidian Terrazzo / High Specular Reflectivity)
    this.floorMat = new StandardMaterial("envFloorMat", this.scene);
    this.floorMat.specularPower = 72;
    this.floorMat.roughness = 0.06;

    // 2. Stage Dais Platform
    this.stageDaisMat = new StandardMaterial("envStageDaisMat", this.scene);
    this.stageDaisMat.specularPower = 48;
    this.stageDaisMat.roughness = 0.10;

    // 3. Architectural Matte Wall Panels
    this.wallMat = new StandardMaterial("envWallMat", this.scene);
    this.wallMat.specularPower = 20;

    // 4. Anodized Titanium Mullions & Trim
    this.trimMat = new StandardMaterial("envTrimMat", this.scene);
    this.trimMat.specularPower = 40;

    // 5. Console Plinth
    this.plinthMat = new StandardMaterial("envPlinthMat", this.scene);
    this.plinthMat.specularPower = 32;

    // 6. Smart Executive Lectern
    this.tableMat = new StandardMaterial("envTableMat", this.scene);
    this.tableMat.specularPower = 36;

    // 7. Presentation Board Neon Bezel
    this.boardBezelMat = new StandardMaterial("envBoardBezelMat", this.scene);
    this.boardBezelMat.disableLighting = true;

    // 8. Primary Neon Material (High-intensity emissive glow)
    this.neonPrimaryMat = new StandardMaterial("envNeonPrimaryMat", this.scene);
    this.neonPrimaryMat.disableLighting = true;

    // 9. Secondary Neon Material (Complementary emissive glow)
    this.neonSecondaryMat = new StandardMaterial("envNeonSecondaryMat", this.scene);
    this.neonSecondaryMat.disableLighting = true;

    // 10. Floating Hologram Material (Semi-transparent additive glow)
    this.hologramMat = new StandardMaterial("envHologramMat", this.scene);
    this.hologramMat.disableLighting = true;
    this.hologramMat.alpha = 0.78;
    this.hologramMat.backFaceCulling = false;

    // 11. HUD Reticle Emissive Material
    this.hudReticleMat = new StandardMaterial("envHudReticleMat", this.scene);
    this.hudReticleMat.disableLighting = true;

    // 12. Clerestory Panoramic Skyline Vista Dynamic Texture
    this.clerestoryTex = new DynamicTexture(
      "clerestorySkyTex",
      { width: 1024, height: 256 },
      this.scene,
      false,
    );
    this.clerestoryMat = new StandardMaterial("envClerestoryMat", this.scene);
    this.clerestoryMat.diffuseTexture = this.clerestoryTex;
    this.clerestoryMat.emissiveTexture = this.clerestoryTex;
    this.clerestoryMat.disableLighting = true;
    this.clerestoryMat.backFaceCulling = false;
  }

  private createBaseArchitecture(): void {
    // 1. Polished Main Floor (flush at y = 0)
    const floor = MeshBuilder.CreateGround(
      "floor",
      { width: 13.0, height: 13.0 },
      this.scene,
    );
    floor.position = new Vector3(0, 0, 1.5);
    floor.material = this.floorMat;

    // 2. Raised Presentation Stage Dais (Awang and Board anchor)
    // Low profile height = 0.040m, flush for feet contact, defined rim
    const stageDais = MeshBuilder.CreateBox(
      "stageDais",
      { width: 9.2, height: 0.040, depth: 4.8 },
      this.scene,
    );
    stageDais.position = new Vector3(0, 0.020, -0.2);
    stageDais.material = this.stageDaisMat;

    // Luminous Stage Front Perimeter Rim
    const stageRim = MeshBuilder.CreateBox(
      "stageRim",
      { width: 9.22, height: 0.042, depth: 0.045 },
      this.scene,
    );
    stageRim.position = new Vector3(0, 0.021, 2.2);
    stageRim.material = this.neonPrimaryMat;

    // Side Stage Luminous Rims
    const stageRimL = MeshBuilder.CreateBox(
      "stageRimL",
      { width: 0.045, height: 0.042, depth: 4.8 },
      this.scene,
    );
    stageRimL.position = new Vector3(-4.6, 0.021, -0.2);
    stageRimL.material = this.neonPrimaryMat;

    const stageRimR = MeshBuilder.CreateBox(
      "stageRimR",
      { width: 0.045, height: 0.042, depth: 4.8 },
      this.scene,
    );
    stageRimR.position = new Vector3(4.6, 0.021, -0.2);
    stageRimR.material = this.neonPrimaryMat;

    // Awang Instructor Dais Halo: speaker halo discs flat on the floor at PODIUM_POS (1.55, 0.042, 0.35)
    this.awangHaloOuter = MeshBuilder.CreateTorus(
      "awangHaloOuter",
      { diameter: 1.45, thickness: 0.020, tessellation: 48 },
      this.scene,
    );
    this.awangHaloOuter.position = new Vector3(1.55, 0.042, 0.35);
    this.awangHaloOuter.rotation.x = 0; // Flat on dais floor
    this.awangHaloOuter.material = this.neonPrimaryMat;

    this.awangHaloInner = MeshBuilder.CreateTorus(
      "awangHaloInner",
      { diameter: 1.10, thickness: 0.015, tessellation: 36 },
      this.scene,
    );
    this.awangHaloInner.position = new Vector3(1.55, 0.042, 0.35);
    this.awangHaloInner.rotation.x = 0; // Flat on dais floor
    this.awangHaloInner.material = this.neonSecondaryMat;

    // 3. Back Wall Structure & Architectural Fluted Slats
    const back = MeshBuilder.CreateBox(
      "backWall",
      { width: 11.6, height: 4.4, depth: 0.12 },
      this.scene,
    );
    back.position = new Vector3(0, 2.2, -2.15);
    back.material = this.wallMat;

    // Continuous Horizontal Glowing Dado Channel across back wall
    const backDado = MeshBuilder.CreateBox(
      "backDadoChannel",
      { width: 11.6, height: 0.035, depth: 0.14 },
      this.scene,
    );
    backDado.position = new Vector3(0, 1.05, -2.14);
    backDado.material = this.neonPrimaryMat;

    // Lower Wainscot / Base Trim along back wall
    const backTrim = MeshBuilder.CreateBox(
      "backTrim",
      { width: 11.6, height: 0.24, depth: 0.16 },
      this.scene,
    );
    backTrim.position = new Vector3(0, 0.12, -2.13);
    backTrim.material = this.trimMat;

    // Architectural Fluted Acoustic Slats flanking the presentation zone
    const slatPositions = [-4.6, -4.3, -4.0, -3.7, 3.7, 4.0, 4.3, 4.6];
    slatPositions.forEach((x, idx) => {
      const slat = MeshBuilder.CreateBox(
        `backSlat_${idx}`,
        { width: 0.14, height: 3.4, depth: 0.05 },
        this.scene,
      );
      slat.position = new Vector3(x, 1.85, -2.10);
      slat.material = this.trimMat;

      if (idx % 2 === 0) {
        const slatLight = MeshBuilder.CreateBox(
          `backSlatLight_${idx}`,
          { width: 0.02, height: 3.3, depth: 0.06 },
          this.scene,
        );
        slatLight.position = new Vector3(x, 1.85, -2.09);
        slatLight.material = this.neonSecondaryMat;
      }
    });

    // 4. Left and Right Lateral Walls with Inset Neon Blades
    const left = MeshBuilder.CreateBox(
      "leftWall",
      { width: 0.12, height: 4.4, depth: 10.8 },
      this.scene,
    );
    left.position = new Vector3(-5.7, 2.2, 2.2);
    left.material = this.wallMat;

    const right = MeshBuilder.CreateBox(
      "rightWall",
      { width: 0.12, height: 4.4, depth: 10.8 },
      this.scene,
    );
    right.position = new Vector3(5.7, 2.2, 2.2);
    right.material = this.wallMat;

    // Angled Architectural Wall Blades with Inset Neon Lines
    [-1.0, 1.5, 4.0].forEach((z, idx) => {
      // Left acoustic blade
      const bladeL = MeshBuilder.CreateBox(
        `bladeL_${idx}`,
        { width: 0.16, height: 3.8, depth: 0.65 },
        this.scene,
      );
      bladeL.position = new Vector3(-5.58, 2.1, z);
      bladeL.rotation.y = 0.25;
      bladeL.material = this.trimMat;

      const neonL = MeshBuilder.CreateBox(
        `bladeNeonL_${idx}`,
        { width: 0.025, height: 3.8, depth: 0.035 },
        this.scene,
      );
      neonL.position = new Vector3(-5.50, 2.1, z);
      neonL.material = this.neonSecondaryMat;

      // Right acoustic blade
      const bladeR = MeshBuilder.CreateBox(
        `bladeR_${idx}`,
        { width: 0.16, height: 3.8, depth: 0.65 },
        this.scene,
      );
      bladeR.position = new Vector3(5.58, 2.1, z);
      bladeR.rotation.y = -0.25;
      bladeR.material = this.trimMat;

      const neonR = MeshBuilder.CreateBox(
        `bladeNeonR_${idx}`,
        { width: 0.025, height: 3.8, depth: 0.035 },
        this.scene,
      );
      neonR.position = new Vector3(5.50, 2.1, z);
      neonR.material = this.neonSecondaryMat;
    });

    // 5. Floating Acoustic Ceiling Raft
    const ceilingRaft = MeshBuilder.CreateBox(
      "ceilingRaft",
      { width: 10.2, height: 0.08, depth: 8.4 },
      this.scene,
    );
    ceilingRaft.position = new Vector3(0, 4.32, 2.2);
    ceilingRaft.material = this.trimMat;

    // Perimeter Neon Cove Troughs
    [-2.6, 2.6].forEach((x, idx) => {
      const ceilingStrip = MeshBuilder.CreateBox(
        `ceilingStrip_${idx}`,
        { width: 0.18, height: 0.04, depth: 8.8 },
        this.scene,
      );
      ceilingStrip.position = new Vector3(x, 4.26, 2.2);
      ceilingStrip.material = this.neonPrimaryMat;
    });

    // 6. Presentation Board Plinth & Audio/Data Spectrum Analyzer
    const plinth = MeshBuilder.CreateBox(
      "plinth",
      { width: 3.52, height: 0.88, depth: 0.45 },
      this.scene,
    );
    plinth.position = new Vector3(-0.85, 0.44, -1.55);
    plinth.material = this.plinthMat;

    // Plinth Upper Luminous Reveal Strip
    const plinthTrim = MeshBuilder.CreateBox(
      "plinthTrim",
      { width: 3.54, height: 0.03, depth: 0.47 },
      this.scene,
    );
    plinthTrim.position = new Vector3(-0.85, 0.89, -1.55);
    plinthTrim.material = this.neonPrimaryMat;

    // Under-Board Live Equalizer / Neural Frequency Data Bars (10 micro-bars)
    this.dataBarSegments = [];
    for (let i = 0; i < 10; i++) {
      const barX = -2.15 + i * 0.29;
      const bar = MeshBuilder.CreateBox(
        `dataBar_${i}`,
        { width: 0.12, height: 0.065, depth: 0.02 },
        this.scene,
      );
      bar.position = new Vector3(barX, 0.84, -1.31);
      bar.material = i % 2 === 0 ? this.neonPrimaryMat : this.neonSecondaryMat;
      this.dataBarSegments.push(bar);
    }

    // 7. Smart Executive Lectern / Digital Console (positioned elegantly to Awang's side at x: 2.50, z: 0.35)
    const lectern = MeshBuilder.CreateBox(
      "sideTable",
      { width: 0.65, height: 0.74, depth: 0.38 },
      this.scene,
    );
    lectern.position = new Vector3(2.50, 0.37, 0.35);
    lectern.material = this.tableMat;

    // Lectern Front Corporate Chevron Emblem
    const chevron = MeshBuilder.CreateBox(
      "lecternChevron",
      { width: 0.22, height: 0.025, depth: 0.015 },
      this.scene,
    );
    chevron.position = new Vector3(2.50, 0.46, 0.15);
    chevron.material = this.neonPrimaryMat;

    // Lectern Angled Top Surface / Titanium Glass Trim
    const tableAccent = MeshBuilder.CreateBox(
      "tableAccent",
      { width: 0.67, height: 0.018, depth: 0.40 },
      this.scene,
    );
    tableAccent.position = new Vector3(2.50, 0.75, 0.35);
    tableAccent.material = this.trimMat;

    // 8. Continuous Floor Runway Tracks & Traveling Light Pulses
    const trackXs = [-2.2, -0.85, 0.85, 2.2];
    this.floorPulses = [];

    trackXs.forEach((x, idx) => {
      // Base static recessed floor track
      const track = MeshBuilder.CreateBox(
        `floorTrack_${idx}`,
        { width: 0.045, height: 0.008, depth: 7.8 },
        this.scene,
      );
      track.position = new Vector3(x, 0.004, 1.8);
      track.material = this.neonPrimaryMat;

      // Active animated light pulse traveling forward
      const pulse = MeshBuilder.CreateBox(
        `floorPulse_${idx}`,
        { width: 0.09, height: 0.025, depth: 0.90 },
        this.scene,
      );
      pulse.position = new Vector3(x, 0.015, -1.5 + idx * 1.6);
      pulse.material = idx % 2 === 0 ? this.neonPrimaryMat : this.neonSecondaryMat;
      this.floorPulses.push(pulse);
    });
  }

  private createBoardFrameAndHUD(): void {
    const bx = -0.85;
    const by = 1.92;
    const bz = -1.815;
    const bw = 3.24;
    const bh = 1.84;
    const thick = 0.034;

    // 0. Recessed Ambient Halo Backplate behind Presentation Board
    const backplate = MeshBuilder.CreateBox(
      "boardBackplate",
      { width: bw + 0.16, height: bh + 0.16, depth: 0.02 },
      this.scene,
    );
    backplate.position = new Vector3(bx, by, bz - 0.025);
    backplate.material = this.trimMat;

    // Perimeter halo glow strip
    const haloStrip = MeshBuilder.CreateBox(
      "boardHaloStrip",
      { width: bw + 0.22, height: bh + 0.22, depth: 0.01 },
      this.scene,
    );
    haloStrip.position = new Vector3(bx, by, bz - 0.035);
    haloStrip.material = this.neonPrimaryMat;

    // 1. Neon Video Wall Bezel Frame
    const topBezel = MeshBuilder.CreateBox(
      "boardBezelTop",
      { width: bw, height: thick, depth: 0.035 },
      this.scene,
    );
    topBezel.position = new Vector3(bx, by + bh / 2 + thick / 2, bz);
    topBezel.material = this.boardBezelMat;

    const bottomBezel = MeshBuilder.CreateBox(
      "boardBezelBottom",
      { width: bw, height: thick, depth: 0.035 },
      this.scene,
    );
    bottomBezel.position = new Vector3(bx, by - bh / 2 - thick / 2, bz);
    bottomBezel.material = this.boardBezelMat;

    const leftBezel = MeshBuilder.CreateBox(
      "boardBezelLeft",
      { width: thick, height: bh, depth: 0.035 },
      this.scene,
    );
    leftBezel.position = new Vector3(bx - bw / 2 - thick / 2, by, bz);
    leftBezel.material = this.boardBezelMat;

    const rightBezel = MeshBuilder.CreateBox(
      "boardBezelRight",
      { width: thick, height: bh, depth: 0.035 },
      this.scene,
    );
    rightBezel.position = new Vector3(bx + bw / 2 + thick / 2, by, bz);
    rightBezel.material = this.boardBezelMat;

    // 2. Holographic Top Telemetry Header Bar
    const telemetryBar = MeshBuilder.CreateBox(
      "boardTelemetryBar",
      { width: 1.8, height: 0.022, depth: 0.02 },
      this.scene,
    );
    telemetryBar.position = new Vector3(bx, by + bh / 2 + 0.065, bz);
    telemetryBar.material = this.hudReticleMat;

    // 3. 4 Holographic HUD Corner Brackets around Video Wall
    this.boardCornerHUDs = [];
    const corners = [
      { x: bx - bw / 2 - 0.04, y: by + bh / 2 + 0.04 }, // Top-Left
      { x: bx + bw / 2 + 0.04, y: by + bh / 2 + 0.04 }, // Top-Right
      { x: bx - bw / 2 - 0.04, y: by - bh / 2 - 0.04 }, // Bottom-Left
      { x: bx + bw / 2 + 0.04, y: by - bh / 2 - 0.04 }, // Bottom-Right
    ];

    corners.forEach((c, idx) => {
      const bracket = MeshBuilder.CreateBox(
        `boardCorner_${idx}`,
        { width: 0.12, height: 0.12, depth: 0.025 },
        this.scene,
      );
      bracket.position = new Vector3(c.x, c.y, bz + 0.01);
      bracket.material = this.hudReticleMat;
      this.boardCornerHUDs.push(bracket);
    });
  }

  private createLighting(): void {
    // 1. Ambient Skylight (Soft fill without washing out walls)
    this.hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
    this.hemiLight.intensity = 0.50;

    // 2. Soft Fill Light
    this.fillLight = new HemisphericLight("fill", new Vector3(-0.4, 0.8, 0.6), this.scene);
    this.fillLight.intensity = 0.30;

    // 3. Directional Key Light pointing at instructor from front-left
    this.keyLight = new DirectionalLight(
      "instructorKeyLight",
      new Vector3(-0.6, -0.8, -0.8),
      this.scene,
    );
    this.keyLight.position = new Vector3(2.5, 3.5, 2.5);
    this.keyLight.intensity = 1.30;

    // 4. Directional Rim Light from behind for sharp silhouette depth & separation
    this.rimLight = new DirectionalLight(
      "instructorRimLight",
      new Vector3(0.5, 0.3, 1.0),
      this.scene,
    );
    this.rimLight.position = new Vector3(0.5, 2.2, -1.0);
    this.rimLight.intensity = 1.05;

    // 5. Environmental Accent Point Light radiating on the back wall and floor
    this.accentPointLight = new PointLight(
      "envAccentPointLight",
      new Vector3(0.5, 3.2, -1.8),
      this.scene,
    );
    this.accentPointLight.range = 14;
    this.accentPointLight.intensity = 2.1;
    this.accentPointLight.specular = new Color3(0.4, 0.4, 0.4);
  }

  private createClerestoryWindow(): void {
    const clerestory = MeshBuilder.CreatePlane(
      "clerestoryWindow",
      { width: 10.0, height: 1.15 },
      this.scene,
    );
    clerestory.position = new Vector3(0, 3.45, -2.08);
    clerestory.material = this.clerestoryMat;

    const sill = MeshBuilder.CreateBox(
      "clerestorySill",
      { width: 10.1, height: 0.05, depth: 0.08 },
      this.scene,
    );
    sill.position = new Vector3(0, 2.85, -2.06);
    sill.material = this.trimMat;

    [-3.3, 0, 3.3].forEach((x, i) => {
      const mullion = MeshBuilder.CreateBox(
        `clerestoryMullion_${i}`,
        { width: 0.06, height: 1.15, depth: 0.06 },
        this.scene,
      );
      mullion.position = new Vector3(x, 3.45, -2.06);
      mullion.material = this.trimMat;
    });
  }

  private updateClerestorySkyline(cfg: EnvironmentThemeConfig): void {
    const ctx = this.clerestoryTex.getContext() as CanvasRenderingContext2D;
    const w = 1024;
    const h = 256;

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, cfg.skyTopColor);
    skyGrad.addColorStop(0.55, cfg.skyMidColor);
    skyGrad.addColorStop(1, cfg.skyHorizonColor);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Distant Ambient Stars & Data Constellations
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    for (let s = 0; s < 45; s++) {
      const sx = (s * 89 + 37) % w;
      const sy = (s * 43 + 19) % Math.floor(h * 0.45);
      const sr = (s % 3 === 0) ? 1.5 : 1.0;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Layer 1: Distant City Skyline Silhouettes
    ctx.fillStyle = "rgba(10, 16, 26, 0.55)";
    const bldCount1 = 28;
    for (let i = 0; i < bldCount1; i++) {
      const bx = (i * w) / bldCount1;
      const bw = w / bldCount1 + 4;
      const bh = 50 + ((i * 37) % 75);
      const by = h - bh;
      ctx.fillRect(bx, by, bw, bh);

      // Spires on select towers
      if (i % 3 === 0) {
        ctx.fillRect(bx + bw / 2 - 1, by - 24, 2, 24);
        ctx.fillStyle = "rgba(255, 80, 80, 0.9)";
        ctx.fillRect(bx + bw / 2 - 1.5, by - 26, 3, 3);
        ctx.fillStyle = "rgba(10, 16, 26, 0.55)";
      }
    }

    // 4. Layer 2: Mid-distance Executive Towers with Lit Office Windows
    ctx.fillStyle = "rgba(5, 8, 14, 0.85)";
    const bldCount2 = 18;
    for (let i = 0; i < bldCount2; i++) {
      const bx = (i * w) / bldCount2 + 8;
      const bw = w / bldCount2 - 14;
      const bh = 70 + ((i * 53) % 95);
      const by = h - bh;
      ctx.fillRect(bx, by, bw, bh);

      // Lit corporate window matrix
      ctx.fillStyle = (i % 2 === 0) ? "rgba(255, 235, 180, 0.35)" : "rgba(120, 220, 255, 0.35)";
      for (let wy = by + 12; wy < h - 15; wy += 10) {
        for (let wx = bx + 5; wx < bx + bw - 5; wx += 8) {
          if ((wx + wy) % 3 === 0) {
            ctx.fillRect(wx, wy, 4, 5);
          }
        }
      }
      ctx.fillStyle = "rgba(5, 8, 14, 0.85)";
    }

    // 5. Atmospheric Horizon Glow Wash
    const hazeGrad = ctx.createLinearGradient(0, h - 45, 0, h);
    hazeGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    hazeGrad.addColorStop(1, cfg.skyHorizonColor);
    ctx.fillStyle = hazeGrad;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(0, h - 45, w, 45);
    ctx.globalAlpha = 1.0;

    this.clerestoryTex.update();
  }

  private createModuleSpecificArchitecture(): void {
    // =========================================================================
    // MODULE 1: Intelligent Learning Atrium
    // Fluted pilasters with dual gold/cyan light channels, counter-rotating
    // concentric prompt token HUD rings with orbiting satellite energy nodes.
    // =========================================================================
    const node1 = new TransformNode("module1_atrium", this.scene);
    this.moduleFeatureNodes.set("module-1", node1);

    [-4.4, -3.2, 3.2, 4.4].forEach((x, i) => {
      const pylon = MeshBuilder.CreateBox(
        `m1_pylon_${i}`,
        { width: 0.28, height: 2.7, depth: 0.08 },
        this.scene,
      );
      pylon.position = new Vector3(x, 1.4, -2.08);
      pylon.material = this.wallMat;
      pylon.parent = node1;

      const lightChannel = MeshBuilder.CreateBox(
        `m1_goldStrip_${i}`,
        { width: 0.04, height: 2.65, depth: 0.10 },
        this.scene,
      );
      lightChannel.position = new Vector3(x, 1.4, -2.07);
      lightChannel.material = i % 2 === 0 ? this.neonPrimaryMat : this.neonSecondaryMat;
      lightChannel.parent = node1;
    });

    // Concentric prompt token HUD ring system at x = -3.2 (balanced in display wing)
    this.m1RingOuter = MeshBuilder.CreateTorus(
      "m1_ringOuter",
      { diameter: 1.15, thickness: 0.026, tessellation: 48 },
      this.scene,
    );
    this.m1RingOuter.position = new Vector3(-3.2, 2.4, -1.6);
    this.m1RingOuter.rotation.x = Math.PI / 2;
    this.m1RingOuter.material = this.neonPrimaryMat;
    this.m1RingOuter.parent = node1;

    this.m1RingInner = MeshBuilder.CreateTorus(
      "m1_ringInner",
      { diameter: 0.82, thickness: 0.020, tessellation: 36 },
      this.scene,
    );
    this.m1RingInner.position = new Vector3(-3.2, 2.4, -1.6);
    this.m1RingInner.rotation.x = Math.PI / 2;
    this.m1RingInner.material = this.neonSecondaryMat;
    this.m1RingInner.parent = node1;

    // 4 Orbiting satellite energy beads
    this.m1Satellites = [];
    for (let s = 0; s < 4; s++) {
      const sat = MeshBuilder.CreateSphere(
        `m1_satellite_${s}`,
        { diameter: 0.070, segments: 16 },
        this.scene,
      );
      sat.material = s % 2 === 0 ? this.neonPrimaryMat : this.neonSecondaryMat;
      sat.parent = node1;
      this.m1Satellites.push(sat);
    }

    // =========================================================================
    // MODULE 2: Comparison & Variance Analytics Studio
    // Symmetrical analytical comparison towers with counter-oscillating laser
    // scanning bars and paired dual-channel floor tracks.
    // =========================================================================
    const node2 = new TransformNode("module2_comparison", this.scene);
    this.moduleFeatureNodes.set("module-2", node2);

    const towerL = MeshBuilder.CreateBox("m2_towerL", { width: 0.45, height: 2.8, depth: 0.14 }, this.scene);
    towerL.position = new Vector3(-3.5, 1.4, -2.06);
    towerL.material = this.trimMat;
    towerL.parent = node2;

    const crossBarL = MeshBuilder.CreateBox("m2_crossBarL", { width: 1.15, height: 0.05, depth: 0.16 }, this.scene);
    crossBarL.position = new Vector3(-3.5, 1.7, -2.04);
    crossBarL.material = this.neonSecondaryMat;
    crossBarL.parent = node2;

    const towerR = MeshBuilder.CreateBox("m2_towerR", { width: 0.45, height: 2.8, depth: 0.14 }, this.scene);
    towerR.position = new Vector3(3.5, 1.4, -2.06);
    towerR.material = this.trimMat;
    towerR.parent = node2;

    const crossBarR = MeshBuilder.CreateBox("m2_crossBarR", { width: 1.15, height: 0.05, depth: 0.16 }, this.scene);
    crossBarR.position = new Vector3(3.5, 1.7, -2.04);
    crossBarR.material = this.neonPrimaryMat;
    crossBarR.parent = node2;

    // Moving laser scanning bars
    this.m2ScanBarL = MeshBuilder.CreateBox("m2_scanBarL", { width: 0.55, height: 0.04, depth: 0.18 }, this.scene);
    this.m2ScanBarL.position = new Vector3(-3.5, 1.4, -2.02);
    this.m2ScanBarL.material = this.neonSecondaryMat; // Comparative Amber
    this.m2ScanBarL.parent = node2;

    this.m2ScanBarR = MeshBuilder.CreateBox("m2_scanBarR", { width: 0.55, height: 0.04, depth: 0.18 }, this.scene);
    this.m2ScanBarR.position = new Vector3(3.5, 1.4, -2.02);
    this.m2ScanBarR.material = this.neonPrimaryMat; // Laser Cyan
    this.m2ScanBarR.parent = node2;

    // Dual comparison floor tracks
    const trackCyan = MeshBuilder.CreateBox("m2_trackCyan", { width: 0.05, height: 0.012, depth: 7.5 }, this.scene);
    trackCyan.position = new Vector3(-0.4, 0.006, 1.5);
    trackCyan.material = this.neonPrimaryMat;
    trackCyan.parent = node2;

    const trackAmber = MeshBuilder.CreateBox("m2_trackAmber", { width: 0.05, height: 0.012, depth: 7.5 }, this.scene);
    trackAmber.position = new Vector3(0.4, 0.006, 1.5);
    trackAmber.material = this.neonSecondaryMat;
    trackAmber.parent = node2;

    // =========================================================================
    // MODULE 3: Neural Systems & Agent Architecture Lab
    // Server telemetry fins with cascading status LEDs, branching circuit
    // conduits with illuminated junction nodes, and spinning neural orbital ring.
    // =========================================================================
    const node3 = new TransformNode("module3_systems", this.scene);
    this.moduleFeatureNodes.set("module-3", node3);

    [3.5, 4.1].forEach((x, idx) => {
      const fin = MeshBuilder.CreateBox(`m3_serverFin_${idx}`, { width: 0.15, height: 2.7, depth: 0.24 }, this.scene);
      fin.position = new Vector3(x, 1.38, -2.02);
      fin.material = this.trimMat;
      fin.parent = node3;
    });

    this.m3StatusLeds = [];
    for (let i = 0; i < 8; i++) {
      const ledY = 0.45 + i * 0.28;
      const led = MeshBuilder.CreateSphere(`m3_led_${i}`, { diameter: 0.055, segments: 14 }, this.scene);
      led.position = new Vector3(3.5, ledY, -1.89);
      led.material = i % 2 === 0 ? this.neonPrimaryMat : this.neonSecondaryMat;
      led.parent = node3;
      this.m3StatusLeds.push(led);
    }

    // Branching circuit conduits with junction nodes across back wall
    const hTrace = MeshBuilder.CreateBox("m3_traceH", { width: 6.8, height: 0.025, depth: 0.03 }, this.scene);
    hTrace.position = new Vector3(0.5, 2.0, -2.12);
    hTrace.material = this.neonPrimaryMat;
    hTrace.parent = node3;

    [-3.2, 2.0].forEach((x, idx) => {
      const vTrace = MeshBuilder.CreateBox(`m3_traceV_${idx}`, { width: 0.025, height: 1.8, depth: 0.03 }, this.scene);
      vTrace.position = new Vector3(x, 1.9, -2.12);
      vTrace.material = this.neonPrimaryMat;
      vTrace.parent = node3;

      const nodeSphere = MeshBuilder.CreateSphere(`m3_node_${idx}`, { diameter: 0.090, segments: 14 }, this.scene);
      nodeSphere.position = new Vector3(x, 2.0, -2.11);
      nodeSphere.material = this.neonSecondaryMat;
      nodeSphere.parent = node3;
    });

    // 3D Gyroscopic Neural Orbital Ring at x = -3.2
    this.m3NeuralRing = MeshBuilder.CreateTorus(
      "m3_neuralRing",
      { diameter: 0.90, thickness: 0.028, tessellation: 40 },
      this.scene,
    );
    this.m3NeuralRing.position = new Vector3(-3.2, 2.4, -1.5);
    this.m3NeuralRing.material = this.neonPrimaryMat;
    this.m3NeuralRing.parent = node3;

    // =========================================================================
    // MODULE 4: Executive Presentation & Media Studio
    // Tiered acoustic wood baffles, champagne bronze edges, stage perimeter reveals,
    // and floating 16:9 holographic media aspect frame with rotating target reticle.
    // =========================================================================
    const node4 = new TransformNode("module4_presentation", this.scene);
    this.moduleFeatureNodes.set("module-4", node4);

    [-4.5, -4.1, -3.7, 3.7, 4.1, 4.5].forEach((x, idx) => {
      const baffle = MeshBuilder.CreateBox(`m4_baffle_${idx}`, { width: 0.16, height: 2.7, depth: 0.08 }, this.scene);
      baffle.position = new Vector3(x, 1.38, -2.08);
      baffle.material = this.trimMat;
      baffle.parent = node4;

      const edge = MeshBuilder.CreateBox(`m4_baffleEdge_${idx}`, { width: 0.02, height: 2.7, depth: 0.09 }, this.scene);
      edge.position = new Vector3(x, 1.38, -2.07);
      edge.material = this.neonPrimaryMat;
      edge.parent = node4;
    });

    // Floating 16:9 holographic media aspect frame at x = -3.2
    this.m4MediaFrame = MeshBuilder.CreateBox("m4_mediaFrame", { width: 1.15, height: 0.65, depth: 0.02 }, this.scene);
    this.m4MediaFrame.position = new Vector3(-3.2, 2.3, -1.45);
    this.m4MediaFrame.material = this.hologramMat;
    this.m4MediaFrame.parent = node4;

    this.m4TargetReticle = MeshBuilder.CreateTorus("m4_reticle", { diameter: 0.45, thickness: 0.020, tessellation: 28 }, this.scene);
    this.m4TargetReticle.position = new Vector3(-3.2, 2.3, -1.43);
    this.m4TargetReticle.material = this.neonSecondaryMat;
    this.m4TargetReticle.parent = node4;

    // =========================================================================
    // MODULE 5: Trust, Ethics & AI Governance Chamber
    // Hexagonal security buttresses, vertical governance battens,
    // and rotating multifaceted holographic security shield torus with satellite guard nodes.
    // =========================================================================
    const node5 = new TransformNode("module5_governance", this.scene);
    this.moduleFeatureNodes.set("module-5", node5);

    [-4.2, 4.2].forEach((x, idx) => {
      const buttress = MeshBuilder.CreateCylinder(`m5_buttress_${idx}`, { height: 2.8, diameter: 0.52, tessellation: 6 }, this.scene);
      buttress.position = new Vector3(x, 1.4, -2.02);
      buttress.material = this.wallMat;
      buttress.parent = node5;

      const rib = MeshBuilder.CreateBox(`m5_rib_${idx}`, { width: 0.06, height: 2.75, depth: 0.54 }, this.scene);
      rib.position = new Vector3(x, 1.4, -2.02);
      rib.material = this.neonPrimaryMat;
      rib.parent = node5;
    });

    [-3.6, -3.2, 3.2, 3.6].forEach((x, idx) => {
      const batten = MeshBuilder.CreateBox(`m5_batten_${idx}`, { width: 0.08, height: 2.7, depth: 0.06 }, this.scene);
      batten.position = new Vector3(x, 1.4, -2.08);
      batten.material = this.trimMat;
      batten.parent = node5;

      const light = MeshBuilder.CreateBox(`m5_battenLight_${idx}`, { width: 0.015, height: 2.65, depth: 0.08 }, this.scene);
      light.position = new Vector3(x, 1.4, -2.07);
      light.material = this.neonSecondaryMat;
      light.parent = node5;
    });

    // Holographic security shield ring with guard nodes at x = -3.2
    this.m5ShieldTorus = MeshBuilder.CreateTorus("m5_shieldTorus", { diameter: 1.05, thickness: 0.032, tessellation: 36 }, this.scene);
    this.m5ShieldTorus.position = new Vector3(-3.2, 2.4, -1.6);
    this.m5ShieldTorus.material = this.neonPrimaryMat;
    this.m5ShieldTorus.parent = node5;

    this.m5GuardNodes = [];
    for (let g = 0; g < 3; g++) {
      const guard = MeshBuilder.CreateSphere(`m5_guard_${g}`, { diameter: 0.065, segments: 14 }, this.scene);
      guard.material = this.neonSecondaryMat;
      guard.parent = node5;
      this.m5GuardNodes.push(guard);
    }

    // =========================================================================
    // MODULE 6: Workplace AI Innovation Accelerator
    // Dynamic forward-raked momentum louvers, kinetic orange chevrons,
    // and nested 30-day milestone habit acceleration rings.
    // =========================================================================
    const node6 = new TransformNode("module6_innovation", this.scene);
    this.moduleFeatureNodes.set("module-6", node6);

    [-4.5, -4.0, -3.5, 3.5, 4.0, 4.5].forEach((x, idx) => {
      const fin = MeshBuilder.CreateBox(`m6_fin_${idx}`, { width: 0.12, height: 2.7, depth: 0.16 }, this.scene);
      fin.position = new Vector3(x, 1.4, -2.06);
      fin.rotation.y = 0.42;
      fin.material = this.trimMat;
      fin.parent = node6;

      const edge = MeshBuilder.CreateBox(`m6_edge_${idx}`, { width: 0.025, height: 2.7, depth: 0.18 }, this.scene);
      edge.position = new Vector3(x + 0.04, 1.4, -2.05);
      edge.rotation.y = 0.42;
      edge.material = this.neonPrimaryMat;
      edge.parent = node6;
    });

    this.m6MilestoneRing1 = MeshBuilder.CreateTorus("m6_milestoneRing1", { diameter: 0.95, thickness: 0.030, tessellation: 36 }, this.scene);
    this.m6MilestoneRing1.position = new Vector3(-3.2, 2.2, -1.4);
    this.m6MilestoneRing1.material = this.neonPrimaryMat;
    this.m6MilestoneRing1.parent = node6;

    this.m6MilestoneRing2 = MeshBuilder.CreateTorus("m6_milestoneRing2", { diameter: 0.68, thickness: 0.024, tessellation: 32 }, this.scene);
    this.m6MilestoneRing2.position = new Vector3(-3.2, 2.2, -1.4);
    this.m6MilestoneRing2.material = this.neonSecondaryMat;
    this.m6MilestoneRing2.parent = node6;
  }

  private createParticleSystem(): void {
    const tex = new DynamicTexture("envMoteTex", 64, this.scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    grad.addColorStop(0.3, "rgba(255, 235, 180, 0.8)");
    grad.addColorStop(0.7, "rgba(230, 200, 140, 0.2)");
    grad.addColorStop(1, "rgba(230, 200, 140, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();

    const ps = new ParticleSystem("envAmbientMotes", 90, this.scene);
    ps.particleTexture = tex;
    ps.emitter = new Vector3(0, 0.4, 0);
    ps.minEmitBox = new Vector3(-5.0, 0.1, -1.8);
    ps.maxEmitBox = new Vector3(5.0, 4.0, 3.8);

    ps.minSize = 0.06;
    ps.maxSize = 0.16;

    ps.minLifeTime = 4.0;
    ps.maxLifeTime = 8.0;

    ps.emitRate = 30;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;

    ps.gravity = new Vector3(0, 0.012, 0);
    ps.direction1 = new Vector3(-0.08, 0.10, -0.05);
    ps.direction2 = new Vector3(0.08, 0.22, 0.05);

    ps.minEmitPower = 0.04;
    ps.maxEmitPower = 0.09;
    ps.updateSpeed = 0.009;

    ps.start();
    this.particles = ps;
  }

  public setModule(rawModuleId?: string): void {
    const themeId = normalizeModuleId(rawModuleId);
    if (themeId === this.currentThemeId) {
      return;
    }
    this.currentThemeId = themeId;
    this.entranceProgress = 0.0; // Trigger smooth entrance power-on curve
    const cfg = MODULE_ENVIRONMENTS[themeId];

    // 1. Atmosphere & Fog
    this.scene.clearColor = cfg.clearColor;
    this.scene.fogMode = Scene.FOGMODE_NONE;

    // 2. Lighting
    this.hemiLight.diffuse = cfg.hemiDiffuse;
    this.hemiLight.groundColor = cfg.hemiGround;
    this.hemiLight.intensity = cfg.hemiIntensity;

    this.fillLight.intensity = cfg.fillIntensity;

    this.keyLight.diffuse = cfg.keyDiffuse;
    this.keyLight.intensity = cfg.keyIntensity;

    this.rimLight.diffuse = cfg.rimDiffuse;
    this.rimLight.intensity = cfg.rimIntensity;

    this.accentPointLight.diffuse = cfg.accentColor;
    this.accentPointLight.intensity = cfg.accentIntensity;

    // 3. Materials
    this.floorMat.diffuseColor = cfg.floorColor;
    this.floorMat.specularColor = cfg.floorSpecular;
    this.floorMat.roughness = cfg.floorRoughness;

    this.stageDaisMat.diffuseColor = cfg.floorColor.scale(1.2);
    this.stageDaisMat.specularColor = cfg.floorSpecular;

    this.wallMat.diffuseColor = cfg.wallColor;
    this.wallMat.specularColor = cfg.wallSpecular;

    this.trimMat.diffuseColor = cfg.trimColor;
    this.plinthMat.diffuseColor = cfg.plinthColor;
    this.tableMat.diffuseColor = cfg.tableColor;

    if (cfg.boardBezelColor) {
      this.boardBezelMat.emissiveColor = cfg.boardBezelColor;
    }

    if (cfg.accentPrimary) {
      this.neonPrimaryMat.diffuseColor = cfg.accentPrimary;
    }
    if (cfg.accentPrimaryEmissive) {
      this.neonPrimaryMat.emissiveColor.copyFrom(cfg.accentPrimaryEmissive);
    }

    if (cfg.accentSecondary) {
      this.neonSecondaryMat.diffuseColor = cfg.accentSecondary;
    }
    if (cfg.accentSecondaryEmissive) {
      this.neonSecondaryMat.emissiveColor.copyFrom(cfg.accentSecondaryEmissive);
    }

    if (cfg.hologramColor) {
      this.hologramMat.emissiveColor = cfg.hologramColor;
      this.hudReticleMat.emissiveColor = cfg.hologramColor;
    }

    // 4. Update Clerestory Panoramic 2026 Smart-City Skyline Vista
    this.updateClerestorySkyline(cfg);

    // 5. Update Atmospheric Particles
    if (this.particles) {
      this.particles.color1 = cfg.particleColor1;
      this.particles.color2 = cfg.particleColor2;
      this.particles.emitRate = cfg.particleRate;
      this.particles.updateSpeed = cfg.particleSpeed;
    }

    // 6. Toggle Module-Specific Feature Nodes & Child Mesh Visibility
    // Explicitly set isVisible and isEnabled to false on descendants so they never leak into GlowLayer or scene!
    for (const [id, node] of this.moduleFeatureNodes.entries()) {
      const isMatch = id === themeId;
      node.setEnabled(isMatch);
      const childMeshes = node.getChildMeshes();
      for (const m of childMeshes) {
        m.setEnabled(isMatch);
        m.isVisible = isMatch;
      }
    }
  }

  public update(dt: number): void {
    this.time += dt;

    if (!this.currentThemeId) return;
    const cfg = MODULE_ENVIRONMENTS[this.currentThemeId];

    // Smooth Entrance Reveal curve (0 -> 1 over 1.0s)
    if (this.entranceProgress < 1.0) {
      this.entranceProgress = Math.min(1.0, this.entranceProgress + dt * 1.5);
    }
    const entranceFactor = 0.70 + 0.30 * Math.sin((this.entranceProgress * Math.PI) / 2);

    // 1. Dynamic sweeping accent light casting moving reflections on floor & dais
    this.accentPointLight.position.x = 0.5 + Math.sin(this.time * 0.75) * 1.6;
    this.accentPointLight.position.y = 2.9 + Math.cos(this.time * 0.50) * 0.35;
    this.accentPointLight.intensity = (cfg.accentIntensity + Math.sin(this.time * 0.9) * 0.32) * entranceFactor;

    // 2. Continuous Traveling Light Pulses along Floor Runway Tracks
    // Moves smoothly forward toward the viewer from -1.8 to 5.5, then loops
    this.floorPulses.forEach((pulse) => {
      pulse.position.z += dt * 1.85;
      if (pulse.position.z > 5.5) {
        pulse.position.z = -1.8;
      }
    });

    // 3. Presentation Board HUD Corner Reticles Pulse & Scale
    const hudScale = 1.0 + Math.sin(this.time * 2.8) * 0.12;
    this.boardCornerHUDs.forEach((b) => {
      b.scaling.set(hudScale, hudScale, 1.0);
    });

    // 4. Live Under-Board Neural Frequency Data Visualizer Bars
    this.dataBarSegments.forEach((bar, idx) => {
      const osc = 0.50 + 0.50 * Math.sin(this.time * 4.5 + idx * 0.75);
      bar.scaling.y = Math.max(0.18, osc);
    });

    // 5. Awang Instructor Halo Dais Slow Floor Rotation (rotating around Y axis on the ground)
    if (this.awangHaloOuter) {
      this.awangHaloOuter.rotation.y += dt * 0.35;
    }
    if (this.awangHaloInner) {
      this.awangHaloInner.rotation.y -= dt * 0.45;
    }

    // 6. Active pulsing neon emissive glow across trims & strips
    if (cfg?.accentPrimaryEmissive) {
      const pulse1 = (0.88 + 0.20 * Math.sin(this.time * 2.4)) * entranceFactor;
      this.neonPrimaryMat.emissiveColor.copyFrom(cfg.accentPrimaryEmissive).scaleInPlace(pulse1);
    }

    if (cfg?.accentSecondaryEmissive) {
      const pulse2 = (0.90 + 0.18 * Math.cos(this.time * 1.9)) * entranceFactor;
      this.neonSecondaryMat.emissiveColor.copyFrom(cfg.accentSecondaryEmissive).scaleInPlace(pulse2);
    }

    // 7. Module-specific dynamic animations (ONLY active module is calculated)
    switch (this.currentThemeId) {
      case "module-1":
        if (this.m1RingOuter) {
          this.m1RingOuter.rotation.y += dt * 0.95;
        }
        if (this.m1RingInner) {
          this.m1RingInner.rotation.x += dt * 0.75;
        }
        // Orbiting satellite energy beads
        this.m1Satellites.forEach((sat, idx) => {
          const angle = this.time * 1.5 + (idx * Math.PI * 2) / 4;
          sat.position.x = -3.2 + Math.cos(angle) * 0.68;
          sat.position.y = 2.4 + Math.sin(angle) * 0.68;
          sat.position.z = -1.6 + Math.sin(angle * 2) * 0.15;
        });
        break;

      case "module-2":
        // Twin comparison towers scanning laser bars in counter-phase
        if (this.m2ScanBarL) {
          this.m2ScanBarL.position.y = 1.4 + Math.sin(this.time * 2.2) * 0.85;
        }
        if (this.m2ScanBarR) {
          this.m2ScanBarR.position.y = 1.4 - Math.sin(this.time * 2.2) * 0.85;
        }
        break;

      case "module-3":
        if (this.m3NeuralRing) {
          this.m3NeuralRing.rotation.y += dt * 1.3;
          this.m3NeuralRing.rotation.z += dt * 0.65;
        }
        // Chasing server telemetry LEDs
        if (this.m3StatusLeds.length > 0) {
          const step = Math.floor(this.time * 6.0) % this.m3StatusLeds.length;
          this.m3StatusLeds.forEach((led, i) => {
            const isBright = Math.abs(i - step) <= 1;
            led.scaling.setAll(isBright ? 1.30 : 0.85);
          });
        }
        break;

      case "module-4":
        if (this.m4MediaFrame) {
          const scale = 1.0 + Math.sin(this.time * 1.6) * 0.04;
          this.m4MediaFrame.scaling.set(scale, scale, 1.0);
        }
        if (this.m4TargetReticle) {
          this.m4TargetReticle.rotation.z += dt * 1.4;
        }
        break;

      case "module-5":
        if (this.m5ShieldTorus) {
          this.m5ShieldTorus.rotation.z += dt * 0.55;
        }
        // Orbiting guard nodes around shield
        this.m5GuardNodes.forEach((node, idx) => {
          const angle = this.time * 1.2 + (idx * Math.PI * 2) / 3;
          node.position.x = -3.2 + Math.cos(angle) * 0.62;
          node.position.y = 2.4 + Math.sin(angle) * 0.62;
          node.position.z = -1.6;
        });
        break;

      case "module-6":
        if (this.m6MilestoneRing1) {
          this.m6MilestoneRing1.rotation.y += dt * 1.4;
        }
        if (this.m6MilestoneRing2) {
          this.m6MilestoneRing2.rotation.y -= dt * 1.8;
          this.m6MilestoneRing2.rotation.x += dt * 0.6;
        }
        break;
    }
  }

  public setFocusMode(isBoardFocus: boolean): void {
    if (this.hemiLight) {
      this.hemiLight.intensity = isBoardFocus ? 0.38 : 0.50;
    }
    if (this.fillLight) {
      this.fillLight.intensity = isBoardFocus ? 0.22 : 0.30;
    }
  }

  public getActiveThemeId(): ModuleThemeId | null {
    return this.currentThemeId;
  }

  public dispose(): void {
    this.particles?.dispose();
    this.glowLayer?.dispose();
    for (const node of this.moduleFeatureNodes.values()) {
      node.dispose();
    }
    this.moduleFeatureNodes.clear();
  }
}
