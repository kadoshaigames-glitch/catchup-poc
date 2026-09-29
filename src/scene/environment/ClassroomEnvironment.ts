import {
  Color3,
  DirectionalLight,
  DynamicTexture,
  GlowLayer,
  HemisphericLight,
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
  private accentPrimaryMat!: StandardMaterial;
  private accentSecondaryMat!: StandardMaterial;
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

  // Continuous animation state
  private time = 0;

  constructor(scene: Scene, initialModuleId = "module-1") {
    this.scene = scene;

    this.createMaterials();
    this.createBaseArchitecture();
    this.createLighting();
    this.createClerestoryWindow();
    this.createModuleSpecificArchitecture();
    this.createParticleSystem();

    this.glowLayer = new GlowLayer("classroomGlow", this.scene, {
      blurKernelSize: 24,
    });
    this.glowLayer.intensity = 0.38;

    this.setModule(initialModuleId);
  }

  private createMaterials(): void {
    // 1. Polished Architectural Floor (Glossy reflection)
    this.floorMat = new StandardMaterial("envFloorMat", this.scene);
    this.floorMat.specularPower = 48;
    this.floorMat.roughness = 0.15;

    // 2. Architectural Wall Panels
    this.wallMat = new StandardMaterial("envWallMat", this.scene);
    this.wallMat.specularPower = 20;

    // 3. Trim / Fascia
    this.trimMat = new StandardMaterial("envTrimMat", this.scene);
    this.trimMat.specularPower = 24;

    // 4. Console Plinth (under presentation board)
    this.plinthMat = new StandardMaterial("envPlinthMat", this.scene);
    this.plinthMat.specularPower = 24;

    // 5. Side Table (instructor podium)
    this.tableMat = new StandardMaterial("envTableMat", this.scene);
    this.tableMat.specularPower = 20;

    // 6. Accent Primary (Warm / Gold / Tech / Security)
    this.accentPrimaryMat = new StandardMaterial("envAccentPrimaryMat", this.scene);
    this.accentPrimaryMat.specularPower = 32;

    // 7. Accent Secondary (Azure / Cyan / Gold / Slate)
    this.accentSecondaryMat = new StandardMaterial("envAccentSecondaryMat", this.scene);
    this.accentSecondaryMat.specularPower = 32;

    // 8. Clerestory Skyline Vista
    this.clerestoryTex = new DynamicTexture(
      "clerestorySkyTex",
      { width: 256, height: 128 },
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
    // Floor
    const floor = MeshBuilder.CreateGround(
      "floor",
      { width: 12, height: 12 },
      this.scene,
    );
    floor.position = new Vector3(0, 0, 1.5);
    floor.material = this.floorMat;

    // Back Wall
    const back = MeshBuilder.CreateBox(
      "backWall",
      { width: 11.2, height: 4.4, depth: 0.12 },
      this.scene,
    );
    back.position = new Vector3(0, 2.2, -2.15);
    back.material = this.wallMat;

    // Lower Wainscot / Base Trim along back wall
    const backTrim = MeshBuilder.CreateBox(
      "backTrim",
      { width: 11.2, height: 0.25, depth: 0.16 },
      this.scene,
    );
    backTrim.position = new Vector3(0, 0.125, -2.13);
    backTrim.material = this.trimMat;

    // Left Wall
    const left = MeshBuilder.CreateBox(
      "leftWall",
      { width: 0.12, height: 4.4, depth: 10.5 },
      this.scene,
    );
    left.position = new Vector3(-5.5, 2.2, 2.2);
    left.material = this.wallMat;

    // Right Wall
    const right = MeshBuilder.CreateBox(
      "rightWall",
      { width: 0.12, height: 4.4, depth: 10.5 },
      this.scene,
    );
    right.position = new Vector3(5.5, 2.2, 2.2);
    right.material = this.wallMat;

    // Ceiling
    const ceiling = MeshBuilder.CreateBox(
      "ceiling",
      { width: 11.2, height: 0.12, depth: 10.5 },
      this.scene,
    );
    ceiling.position = new Vector3(0, 4.4, 2.2);
    ceiling.material = this.trimMat;

    // Recessed Ceiling Light Troughs
    [-2.2, 2.2].forEach((x, idx) => {
      const ceilingStrip = MeshBuilder.CreateBox(
        `ceilingStrip_${idx}`,
        { width: 0.18, height: 0.04, depth: 8.5 },
        this.scene,
      );
      ceilingStrip.position = new Vector3(x, 4.33, 2.2);
      ceilingStrip.material = this.accentPrimaryMat;
    });

    // Console Plinth (under presentation board at x: -0.85, y: 1.92, z: -1.82)
    const plinth = MeshBuilder.CreateBox(
      "plinth",
      { width: 3.5, height: 0.88, depth: 0.45 },
      this.scene,
    );
    plinth.position = new Vector3(-0.85, 0.44, -1.55);
    plinth.material = this.plinthMat;

    // Plinth Upper Luminous Reveal Trim
    const plinthTrim = MeshBuilder.CreateBox(
      "plinthTrim",
      { width: 3.52, height: 0.03, depth: 0.47 },
      this.scene,
    );
    plinthTrim.position = new Vector3(-0.85, 0.89, -1.55);
    plinthTrim.material = this.accentPrimaryMat;

    // Side Table / Instructor Podium
    const table = MeshBuilder.CreateBox(
      "sideTable",
      { width: 0.85, height: 0.74, depth: 0.48 },
      this.scene,
    );
    table.position = new Vector3(1.55, 0.37, 0.85);
    table.material = this.tableMat;

    // Table Accent Strip
    const tableAccent = MeshBuilder.CreateBox(
      "tableAccent",
      { width: 0.87, height: 0.02, depth: 0.50 },
      this.scene,
    );
    tableAccent.position = new Vector3(1.55, 0.75, 0.85);
    tableAccent.material = this.accentSecondaryMat;
  }

  private createLighting(): void {
    // 1. Ambient Skylight
    this.hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
    this.hemiLight.intensity = 0.85;

    // 2. Soft Fill Light
    this.fillLight = new HemisphericLight("fill", new Vector3(-0.4, 0.8, 0.6), this.scene);
    this.fillLight.intensity = 0.35;

    // 3. Directional Key Light pointing at instructor from front-left
    this.keyLight = new DirectionalLight(
      "instructorKeyLight",
      new Vector3(-0.6, -0.8, -0.8),
      this.scene,
    );
    this.keyLight.position = new Vector3(2.5, 3.5, 2.5);
    this.keyLight.intensity = 1.05;

    // 4. Directional Rim Light from behind/right for silhouette depth and separation
    this.rimLight = new DirectionalLight(
      "instructorRimLight",
      new Vector3(0.5, 0.3, 1.0),
      this.scene,
    );
    this.rimLight.position = new Vector3(0.5, 2.2, -1.0);
    this.rimLight.intensity = 0.55;

    // 5. Environmental Accent Point Light radiating on the back wall feature
    this.accentPointLight = new PointLight(
      "envAccentPointLight",
      new Vector3(0.5, 3.2, -1.8),
      this.scene,
    );
    this.accentPointLight.range = 14;
    this.accentPointLight.intensity = 1.8;
    this.accentPointLight.specular = new Color3(0, 0, 0);
  }

  private createClerestoryWindow(): void {
    // High architectural clerestory window band across the top of the back wall
    const clerestory = MeshBuilder.CreatePlane(
      "clerestoryWindow",
      { width: 9.8, height: 1.15 },
      this.scene,
    );
    clerestory.position = new Vector3(0, 3.45, -2.08);
    clerestory.material = this.clerestoryMat;

    // Clerestory Bottom Mullion / Sill
    const sill = MeshBuilder.CreateBox(
      "clerestorySill",
      { width: 9.9, height: 0.05, depth: 0.08 },
      this.scene,
    );
    sill.position = new Vector3(0, 2.85, -2.06);
    sill.material = this.trimMat;

    // Vertical Mullions dividing the panoramic clerestory
    [-3.2, 0, 3.2].forEach((x, i) => {
      const mullion = MeshBuilder.CreateBox(
        `clerestoryMullion_${i}`,
        { width: 0.06, height: 1.15, depth: 0.06 },
        this.scene,
      );
      mullion.position = new Vector3(x, 3.45, -2.06);
      mullion.material = this.trimMat;
    });
  }

  private createModuleSpecificArchitecture(): void {
    // =========================================================================
    // MODULE 1: Intelligent Learning Atrium
    // Slender vertical fluted pylons, warm gold floor runways, rising light channels
    // =========================================================================
    const node1 = new TransformNode("module1_atrium", this.scene);
    this.moduleFeatureNodes.set("module-1", node1);

    // Left and right vertical travertine pilasters with warm gold channels
    [-4.2, -2.8, 1.8, 4.2].forEach((x, i) => {
      const pylon = MeshBuilder.CreateBox(
        `m1_pylon_${i}`,
        { width: 0.32, height: 2.8, depth: 0.10 },
        this.scene,
      );
      pylon.position = new Vector3(x, 1.4, -2.08);
      pylon.material = this.wallMat;
      pylon.parent = node1;

      // Inner vertical golden light strip
      const lightChannel = MeshBuilder.CreateBox(
        `m1_goldStrip_${i}`,
        { width: 0.04, height: 2.7, depth: 0.12 },
        this.scene,
      );
      lightChannel.position = new Vector3(x, 1.4, -2.07);
      lightChannel.material = this.accentPrimaryMat;
      lightChannel.parent = node1;
    });

    // Symmetrical floor runway tracks guiding toward the stage
    [-2.2, -0.85, 0.85, 2.2].forEach((x, i) => {
      const track = MeshBuilder.CreateBox(
        `m1_floorTrack_${i}`,
        { width: 0.04, height: 0.01, depth: 7.5 },
        this.scene,
      );
      track.position = new Vector3(x, 0.005, 1.5);
      track.material = this.accentPrimaryMat;
      track.parent = node1;
    });

    // =========================================================================
    // MODULE 2: Comparison & Analysis Studio
    // Symmetrical dual-panel language, paired light paths in cyan and gold
    // =========================================================================
    const node2 = new TransformNode("module2_comparison", this.scene);
    this.moduleFeatureNodes.set("module-2", node2);

    // Balanced paired architectural side panels behind the instructor and board
    // Left panel (Cyan accent)
    const panelL = MeshBuilder.CreateBox(
      "m2_panelL",
      { width: 1.2, height: 2.5, depth: 0.06 },
      this.scene,
    );
    panelL.position = new Vector3(-3.2, 1.4, -2.08);
    panelL.material = this.trimMat;
    panelL.parent = node2;

    const stripL = MeshBuilder.CreateBox(
      "m2_stripL",
      { width: 0.06, height: 2.4, depth: 0.08 },
      this.scene,
    );
    stripL.position = new Vector3(-2.65, 1.4, -2.07);
    stripL.material = this.accentPrimaryMat; // Cyan
    stripL.parent = node2;

    // Right panel (Gold accent)
    const panelR = MeshBuilder.CreateBox(
      "m2_panelR",
      { width: 1.2, height: 2.5, depth: 0.06 },
      this.scene,
    );
    panelR.position = new Vector3(3.2, 1.4, -2.08);
    panelR.material = this.trimMat;
    panelR.parent = node2;

    const stripR = MeshBuilder.CreateBox(
      "m2_stripR",
      { width: 0.06, height: 2.4, depth: 0.08 },
      this.scene,
    );
    stripR.position = new Vector3(2.65, 1.4, -2.07);
    stripR.material = this.accentSecondaryMat; // Gold
    stripR.parent = node2;

    // Paired comparison floor tracks running parallel down the center
    const trackCyan = MeshBuilder.CreateBox(
      "m2_trackCyan",
      { width: 0.05, height: 0.01, depth: 7.5 },
      this.scene,
    );
    trackCyan.position = new Vector3(-0.4, 0.005, 1.5);
    trackCyan.material = this.accentPrimaryMat;
    trackCyan.parent = node2;

    const trackGold = MeshBuilder.CreateBox(
      "m2_trackGold",
      { width: 0.05, height: 0.01, depth: 7.5 },
      this.scene,
    );
    trackGold.position = new Vector3(0.4, 0.005, 1.5);
    trackGold.material = this.accentSecondaryMat;
    trackGold.parent = node2;

    // =========================================================================
    // MODULE 3: AI Systems Lab
    // Branching network light conduits, structured geometric node grid
    // =========================================================================
    const node3 = new TransformNode("module3_systems", this.scene);
    this.moduleFeatureNodes.set("module-3", node3);

    // Network conduits on the back wall
    const conduitCoords = [
      { x: 2.2, y: 1.2, w: 2.4, h: 0.03 },
      { x: 3.4, y: 2.1, w: 0.03, h: 1.8 },
      { x: 2.6, y: 2.4, w: 1.6, h: 0.03 },
      { x: -3.5, y: 1.5, w: 1.8, h: 0.03 },
      { x: -4.4, y: 2.2, w: 0.03, h: 1.4 },
    ];
    conduitCoords.forEach((c, idx) => {
      const conduit = MeshBuilder.CreateBox(
        `m3_conduit_${idx}`,
        { width: c.w, height: c.h, depth: 0.04 },
        this.scene,
      );
      conduit.position = new Vector3(c.x, c.y, -2.08);
      conduit.material = this.accentPrimaryMat; // Emerald
      conduit.parent = node3;
    });

    // Luminous System Nodes (Hexagonal/Cylindrical network nodes)
    const nodePoints = [
      { x: 1.0, y: 1.2 },
      { x: 2.2, y: 1.2 },
      { x: 3.4, y: 1.2 },
      { x: 3.4, y: 2.4 },
      { x: 1.8, y: 2.4 },
      { x: -2.6, y: 1.5 },
      { x: -4.4, y: 1.5 },
      { x: -4.4, y: 2.8 },
    ];
    nodePoints.forEach((pt, idx) => {
      const nodeMesh = MeshBuilder.CreateCylinder(
        `m3_node_${idx}`,
        { height: 0.04, diameter: 0.14, tessellation: 12 },
        this.scene,
      );
      nodeMesh.position = new Vector3(pt.x, pt.y, -2.07);
      nodeMesh.rotation.x = Math.PI / 2;
      nodeMesh.material = idx % 2 === 0 ? this.accentPrimaryMat : this.accentSecondaryMat;
      nodeMesh.parent = node3;
    });

    // Circuit pathway inlays on floor
    [-1.8, 1.8].forEach((x, idx) => {
      const floorConduit = MeshBuilder.CreateBox(
        `m3_floorConduit_${idx}`,
        { width: 0.04, height: 0.01, depth: 7.0 },
        this.scene,
      );
      floorConduit.position = new Vector3(x, 0.005, 1.5);
      floorConduit.material = this.accentPrimaryMat;
      floorConduit.parent = node3;
    });

    // =========================================================================
    // MODULE 4: Executive Presentation Studio
    // Rich walnut acoustic slat baffles, bronze trim, executive stage polish
    // =========================================================================
    const node4 = new TransformNode("module4_presentation", this.scene);
    this.moduleFeatureNodes.set("module-4", node4);

    // Vertical acoustic wood baffles flanking the presentation board and stage
    const baffleXs = [-4.6, -4.2, -3.8, 2.4, 2.8, 3.2, 3.6, 4.0];
    baffleXs.forEach((x, idx) => {
      const baffle = MeshBuilder.CreateBox(
        `m4_baffle_${idx}`,
        { width: 0.16, height: 2.6, depth: 0.08 },
        this.scene,
      );
      baffle.position = new Vector3(x, 1.35, -2.08);
      baffle.material = this.trimMat; // Rich walnut
      baffle.parent = node4;

      // Warm bronze accent edge on the outer face
      const edge = MeshBuilder.CreateBox(
        `m4_baffleEdge_${idx}`,
        { width: 0.02, height: 2.6, depth: 0.09 },
        this.scene,
      );
      edge.position = new Vector3(x, 1.35, -2.07);
      edge.material = this.accentPrimaryMat; // Champagne bronze
      edge.parent = node4;
    });

    // Bronze perimeter floor inlay framing the executive presentation stage
    const stageFrameL = MeshBuilder.CreateBox(
      "m4_stageFrameL",
      { width: 0.06, height: 0.01, depth: 7.2 },
      this.scene,
    );
    stageFrameL.position = new Vector3(-2.8, 0.005, 1.5);
    stageFrameL.material = this.accentPrimaryMat;
    stageFrameL.parent = node4;

    const stageFrameR = MeshBuilder.CreateBox(
      "m4_stageFrameR",
      { width: 0.06, height: 0.01, depth: 7.2 },
      this.scene,
    );
    stageFrameR.position = new Vector3(2.8, 0.005, 1.5);
    stageFrameR.material = this.accentPrimaryMat;
    stageFrameR.parent = node4;

    // =========================================================================
    // MODULE 5: Trust & Governance Chamber
    // Monolithic arched keystone shield buttresses, cobalt & gold security inlays
    // =========================================================================
    const node5 = new TransformNode("module5_governance", this.scene);
    this.moduleFeatureNodes.set("module-5", node5);

    // Protective architectural buttresses on back wall
    [-4.0, 3.4].forEach((x, idx) => {
      const buttress = MeshBuilder.CreateBox(
        `m5_buttress_${idx}`,
        { width: 0.45, height: 2.7, depth: 0.18 },
        this.scene,
      );
      buttress.position = new Vector3(x, 1.38, -2.04);
      buttress.material = this.wallMat;
      buttress.parent = node5;

      // Vertical cobalt trust rib
      const rib = MeshBuilder.CreateBox(
        `m5_rib_${idx}`,
        { width: 0.08, height: 2.65, depth: 0.20 },
        this.scene,
      );
      rib.position = new Vector3(x, 1.38, -2.03);
      rib.material = this.accentPrimaryMat; // Cobalt
      rib.parent = node5;
    });

    // Geometric shield / keystone motif behind the instructor stage
    const shieldArch = MeshBuilder.CreateTorus(
      "m5_shieldArch",
      { diameter: 2.4, thickness: 0.08, tessellation: 48 },
      this.scene,
    );
    shieldArch.position = new Vector3(1.8, 2.1, -2.08);
    shieldArch.rotation.x = Math.PI / 2;
    shieldArch.material = this.accentSecondaryMat; // Gold
    shieldArch.parent = node5;

    // Concentric security perimeter bands on the floor
    [-1.4, 1.4].forEach((x, idx) => {
      const band = MeshBuilder.CreateBox(
        `m5_floorBand_${idx}`,
        { width: 0.05, height: 0.01, depth: 7.2 },
        this.scene,
      );
      band.position = new Vector3(x, 0.005, 1.5);
      band.material = this.accentPrimaryMat;
      band.parent = node5;
    });

    // =========================================================================
    // MODULE 6: AI Innovation Workspace
    // Scandinavian blonde oak louvers, dynamic diagonal momentum fins
    // =========================================================================
    const node6 = new TransformNode("module6_innovation", this.scene);
    this.moduleFeatureNodes.set("module-6", node6);

    // Dynamic angled architectural louvers (evoking modern workplace momentum)
    [-4.5, -4.0, -3.5, 2.5, 3.0, 3.5, 4.0].forEach((x, idx) => {
      const louver = MeshBuilder.CreateBox(
        `m6_louver_${idx}`,
        { width: 0.12, height: 2.6, depth: 0.14 },
        this.scene,
      );
      louver.position = new Vector3(x, 1.38, -2.06);
      louver.rotation.y = 0.35; // Dynamic angled perspective
      louver.material = this.trimMat; // Blonde oak
      louver.parent = node6;

      // Luminous warm edge
      const edge = MeshBuilder.CreateBox(
        `m6_edge_${idx}`,
        { width: 0.02, height: 2.6, depth: 0.15 },
        this.scene,
      );
      edge.position = new Vector3(x + 0.04, 1.38, -2.05);
      edge.rotation.y = 0.35;
      edge.material = this.accentPrimaryMat; // Coral/Gold
      edge.parent = node6;
    });

    // Dynamic forward-pointing chevron momentum tracks on the floor
    [-1.2, 1.2].forEach((x, idx) => {
      const track = MeshBuilder.CreateBox(
        `m6_track_${idx}`,
        { width: 0.06, height: 0.01, depth: 7.2 },
        this.scene,
      );
      track.position = new Vector3(x, 0.005, 1.5);
      track.material = this.accentPrimaryMat;
      track.parent = node6;
    });
  }

  private createParticleSystem(): void {
    // Generate soft circular gradient texture for ambient dust motes
    const tex = new DynamicTexture("envMoteTex", 64, this.scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    grad.addColorStop(0.3, "rgba(255, 235, 180, 0.7)");
    grad.addColorStop(0.7, "rgba(230, 200, 140, 0.2)");
    grad.addColorStop(1, "rgba(230, 200, 140, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();

    const ps = new ParticleSystem("envAmbientMotes", 60, this.scene);
    ps.particleTexture = tex;
    ps.emitter = new Vector3(0, 0.4, 0);
    ps.minEmitBox = new Vector3(-4.5, 0.1, -1.8);
    ps.maxEmitBox = new Vector3(4.5, 3.8, 3.5);

    ps.minSize = 0.05;
    ps.maxSize = 0.14;

    ps.minLifeTime = 4.0;
    ps.maxLifeTime = 8.0;

    ps.emitRate = 20;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;

    ps.gravity = new Vector3(0, 0.01, 0);
    ps.direction1 = new Vector3(-0.08, 0.10, -0.05);
    ps.direction2 = new Vector3(0.08, 0.20, 0.05);

    ps.minEmitPower = 0.03;
    ps.maxEmitPower = 0.08;
    ps.updateSpeed = 0.008;

    ps.start();
    this.particles = ps;
  }

  public setModule(rawModuleId?: string): void {
    const themeId = normalizeModuleId(rawModuleId);
    if (themeId === this.currentThemeId) {
      return;
    }
    this.currentThemeId = themeId;
    const cfg = MODULE_ENVIRONMENTS[themeId];

    // 1. Atmosphere & Fog
    this.scene.clearColor = cfg.clearColor;
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = cfg.fogColor;
    this.scene.fogDensity = cfg.fogDensity;

    // 2. Lighting
    this.hemiLight.diffuse = cfg.hemiDiffuse;
    this.hemiLight.groundColor = cfg.hemiGround;
    this.hemiLight.intensity = cfg.hemiIntensity;

    this.keyLight.diffuse = cfg.keyDiffuse;
    this.keyLight.intensity = cfg.keyIntensity;

    this.rimLight.diffuse = cfg.rimDiffuse;
    this.rimLight.intensity = cfg.rimIntensity;

    this.accentPointLight.diffuse = cfg.accentColor;
    this.accentPointLight.intensity = cfg.accentIntensity;
    this.accentPointLight.specular = new Color3(0, 0, 0);

    // 3. Materials
    this.floorMat.diffuseColor = cfg.floorColor;
    this.floorMat.specularColor = cfg.floorSpecular;
    this.floorMat.roughness = cfg.floorRoughness;

    this.wallMat.diffuseColor = cfg.wallColor;
    this.wallMat.specularColor = cfg.wallSpecular;

    this.trimMat.diffuseColor = cfg.trimColor;
    this.plinthMat.diffuseColor = cfg.plinthColor;
    this.tableMat.diffuseColor = cfg.tableColor;

    this.accentPrimaryMat.diffuseColor = cfg.accentPrimary;
    this.accentPrimaryMat.emissiveColor = cfg.accentPrimaryEmissive;

    this.accentSecondaryMat.diffuseColor = cfg.accentSecondary;
    this.accentSecondaryMat.emissiveColor = cfg.accentSecondaryEmissive;

    // 4. Update Clerestory Panoramic Sky Texture
    const ctx = this.clerestoryTex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, cfg.skyTopColor);
    grad.addColorStop(0.5, cfg.skyMidColor);
    grad.addColorStop(1, cfg.skyHorizonColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);
    this.clerestoryTex.update();

    // 5. Update Particles
    if (this.particles) {
      this.particles.color1 = cfg.particleColor1;
      this.particles.color2 = cfg.particleColor2;
      this.particles.emitRate = cfg.particleRate;
      this.particles.updateSpeed = cfg.particleSpeed;
    }

    // 6. Toggle Module-Specific Feature Nodes
    for (const [id, node] of this.moduleFeatureNodes.entries()) {
      node.setEnabled(id === themeId);
    }
  }

  public update(dt: number): void {
    this.time += dt;

    // Gentle breathing on environmental accent light (calm, premium life)
    if (this.currentThemeId && this.accentPointLight) {
      const baseIntensity = MODULE_ENVIRONMENTS[this.currentThemeId].accentIntensity;
      this.accentPointLight.intensity = baseIntensity + Math.sin(this.time * 0.75) * 0.18;
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
