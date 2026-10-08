import {
  Color3,
  Color4,
  DirectionalLight,
  DynamicTexture,
  Engine,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  PointLight,
  Scene,
  StandardMaterial,
  UniversalCamera,
  Vector3,
  VertexBuffer,
} from "@babylonjs/core";

/**
 * 2026 AI Neural Nexus Landing Scene
 * An immersive, continuously animated 3D environment for enterprise AI learning.
 * Features:
 * - Large animated abstract 3D polyhedra & gyroscopic energy rings
 * - Undulating 3D neural latent wave surface with real-time vertex updates
 * - Synaptic network with traveling photon pulses
 * - Floating holographic telemetry HUD panels
 * - High-speed streaming data particle field
 * - Orbiting satellite polyhedra at varied depths
 * - Dynamic volumetric lighting sweeps & reactive mouse parallax
 */
export class LandingScene {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: UniversalCamera;
  private glowLayer: GlowLayer | null = null;
  private particles: ParticleSystem | null = null;

  // Living AI Core Elements
  private coreRoot: Mesh | null = null;
  private coreIco: Mesh | null = null;
  private coreIcoWire: Mesh | null = null;
  private coreSphere: Mesh | null = null;
  private coreSphereMat: StandardMaterial | null = null;
  private ring1: Mesh | null = null;
  private ring2: Mesh | null = null;
  private ring3: Mesh | null = null;

  // Orbiting Satellite Polyhedra
  private satellites: { mesh: Mesh; orbitRadius: number; orbitSpeed: number; orbitY: number; tilt: number; rotSpeed: Vector3 }[] = [];

  // Dynamic 3D Wave Surface
  private waveMesh: Mesh | null = null;
  private wavePositions: Float32Array | null = null;
  private waveOriginalY: Float32Array | null = null;

  // Neural Synaptic Network & Data Pulses
  private nodeMeshes: Mesh[] = [];
  private photonPulses: { mesh: Mesh; fromNode: number; toNode: number; progress: number; speed: number }[] = [];
  private nodeConnections: { from: number; to: number }[] = [];

  // Holographic Telemetry HUD Panels
  private leftHudMesh: Mesh | null = null;
  private rightHudMesh: Mesh | null = null;
  private leftHudTex: DynamicTexture | null = null;
  private rightHudTex: DynamicTexture | null = null;

  // Dynamic Lighting Sweeps
  private cyanSweepLight: PointLight | null = null;
  private amberSweepLight: PointLight | null = null;
  private keyDirectional: DirectionalLight | null = null;

  // Camera & Mouse Parallax
  private baseCamPos = new Vector3(0, 1.4, -13.5);
  private targetCamOffsetX = 0;
  private targetCamOffsetY = 0;
  private currentCamOffsetX = 0;
  private currentCamOffsetY = 0;

  private running = false;
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { adaptToDeviceRatio: true, preserveDrawingBuffer: false }, true);
    this.scene = new Scene(this.engine);

    // Deep cosmic cybernetic atmosphere
    this.scene.clearColor = new Color4(0.04, 0.06, 0.10, 1.0);
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = new Color3(0.05, 0.08, 0.14);
    this.scene.fogDensity = 0.012;

    // Cinematic Universal Camera
    this.camera = new UniversalCamera("landingCam", this.baseCamPos.clone(), this.scene);
    this.camera.setTarget(new Vector3(0, 0.6, 6.0));
    this.camera.minZ = 0.1;
    this.camera.inputs.clear();

    // High-energy Bloom / Glow Layer for futuristic neon illumination
    this.glowLayer = new GlowLayer("landingGlow", this.scene, {
      blurKernelSize: 32,
    });
    this.glowLayer.intensity = 0.85;

    this.setupSkyDome();
    this.setupLighting();
    this.buildUndulatingWaveSurface();
    this.buildAiCore();
    this.buildOrbitingSatellites();
    this.buildSynapticNetwork();
    this.buildHolographicHudPanels();
    this.buildDataParticleStream();

    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  private setupSkyDome(): void {
    const skyDome = MeshBuilder.CreateSphere(
      "skyDome",
      { diameter: 220, segments: 24, sideOrientation: Mesh.BACKSIDE },
      this.scene,
    );
    skyDome.position = new Vector3(0, 0, 10);

    const skyTex = new DynamicTexture("skyGradTex", { width: 256, height: 512 }, this.scene, false);
    const ctx = skyTex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, "#03060c");   // Deep cosmic void
    grad.addColorStop(0.3, "#07101e");   // Deep sapphire night
    grad.addColorStop(0.6, "#0b1b33");   // Vibrant cybernetic blue
    grad.addColorStop(0.85, "#18324e");  // Atmospheric horizon rim
    grad.addColorStop(0.95, "#2b2a4a");  // Iridescent twilight transition
    grad.addColorStop(1.0, "#080c14");   // Deep ground horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    // Subtle ambient grid stars on the backdrop
    ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
    for (let i = 0; i < 90; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * 256;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * 450;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }
    skyTex.update();

    const skyMat = new StandardMaterial("skyDomeMat", this.scene);
    skyMat.diffuseTexture = skyTex;
    skyMat.emissiveColor = new Color3(0.55, 0.65, 0.85);
    skyMat.disableLighting = true;
    skyMat.backFaceCulling = false;
    skyDome.material = skyMat;
  }

  private setupLighting(): void {
    // 1. Ambient Fill: Deep cybernetic indigo
    const hemi = new HemisphericLight("ambientHemi", new Vector3(0, 1, 0), this.scene);
    hemi.intensity = 0.55;
    hemi.diffuse = new Color3(0.3, 0.55, 0.85);
    hemi.groundColor = new Color3(0.08, 0.12, 0.20);

    // 2. Main Key Directional: Sharp technological blue rim light
    this.keyDirectional = new DirectionalLight("keyRim", new Vector3(-0.6, -0.4, 0.7), this.scene);
    this.keyDirectional.position = new Vector3(12, 16, -10);
    this.keyDirectional.intensity = 1.35;
    this.keyDirectional.diffuse = new Color3(0.35, 0.75, 1.0);
    this.keyDirectional.specular = new Color3(0.8, 0.95, 1.0);

    // 3. Dynamic Sweeping Point Light 1: Electric Cyan
    this.cyanSweepLight = new PointLight("cyanSweep", new Vector3(-5, 2, 4), this.scene);
    this.cyanSweepLight.intensity = 2.4;
    this.cyanSweepLight.range = 35;
    this.cyanSweepLight.diffuse = new Color3(0.0, 0.9, 1.0);
    this.cyanSweepLight.specular = new Color3(0.4, 1.0, 1.0);

    // 4. Dynamic Sweeping Point Light 2: Radiant Champagne Gold (corporate balance)
    this.amberSweepLight = new PointLight("amberSweep", new Vector3(5, -1, 3), this.scene);
    this.amberSweepLight.intensity = 2.0;
    this.amberSweepLight.range = 32;
    this.amberSweepLight.diffuse = new Color3(1.0, 0.78, 0.42);
    this.amberSweepLight.specular = new Color3(1.0, 0.9, 0.6);
  }

  /**
   * Continuous 3D Undulating Wave Surface
   * Represents the dynamic neural latent space topography.
   * Real-time vertex waves rippling continuously.
   */
  private buildUndulatingWaveSurface(): void {
    const subdivisions = 38;
    const waveGrid = MeshBuilder.CreateGround(
      "waveGround",
      { width: 48, height: 48, subdivisions, updatable: true },
      this.scene,
    );
    waveGrid.position = new Vector3(0, -3.6, 9.0);

    const positions = waveGrid.getVerticesData(VertexBuffer.PositionKind);
    if (positions) {
      this.wavePositions = new Float32Array(positions);
      this.waveOriginalY = new Float32Array(positions.length / 3);
      for (let i = 0; i < this.waveOriginalY.length; i++) {
        this.waveOriginalY[i] = positions[i * 3 + 1];
      }
    }

    const waveMat = new StandardMaterial("waveMat", this.scene);
    waveMat.wireframe = true;
    waveMat.emissiveColor = new Color3(0.08, 0.45, 0.85);
    waveMat.diffuseColor = new Color3(0.05, 0.25, 0.55);
    waveMat.alpha = 0.48;
    waveGrid.material = waveMat;

    this.waveMesh = waveGrid;
  }

  /**
   * The Living AI Core: Large Animated Abstract 3D Polyhedra
   * Multi-shelled geometric structure with gyroscopic energy rings.
   */
  private buildAiCore(): void {
    this.coreRoot = new Mesh("coreRoot", this.scene);
    this.coreRoot.position = new Vector3(0, 1.8, 7.5);

    // Outer Faceted Polyhedron (Icosahedron type 3)
    this.coreIco = MeshBuilder.CreatePolyhedron("coreIco", { type: 3, size: 2.85 }, this.scene);
    this.coreIco.parent = this.coreRoot;

    const icoMat = new StandardMaterial("coreIcoMat", this.scene);
    icoMat.diffuseColor = new Color3(0.06, 0.14, 0.26);
    icoMat.emissiveColor = new Color3(0.08, 0.24, 0.45);
    icoMat.specularColor = new Color3(0.4, 0.8, 1.0);
    icoMat.specularPower = 32;
    icoMat.alpha = 0.42;
    this.coreIco.material = icoMat;

    // Glowing Wireframe Cage for crisp technological edges
    this.coreIcoWire = MeshBuilder.CreatePolyhedron("coreIcoWire", { type: 3, size: 2.88 }, this.scene);
    this.coreIcoWire.parent = this.coreRoot;

    const wireMat = new StandardMaterial("coreIcoWireMat", this.scene);
    wireMat.wireframe = true;
    wireMat.emissiveColor = new Color3(0.0, 0.88, 1.0);
    wireMat.diffuseColor = new Color3(0.0, 0.88, 1.0);
    wireMat.alpha = 0.85;
    this.coreIcoWire.material = wireMat;

    // Inner Pulsing Energy Nucleus Sphere
    this.coreSphere = MeshBuilder.CreateSphere("coreSphere", { diameter: 2.1, segments: 24 }, this.scene);
    this.coreSphere.parent = this.coreRoot;

    this.coreSphereMat = new StandardMaterial("coreSphereMat", this.scene);
    this.coreSphereMat.emissiveColor = new Color3(0.85, 0.65, 0.25); // Warm core nucleus
    this.coreSphereMat.diffuseColor = new Color3(1.0, 0.8, 0.3);
    this.coreSphereMat.alpha = 0.72;
    this.coreSphere.material = this.coreSphereMat;

    // Gyroscopic Equatorial & Polar Energy Rings
    this.ring1 = MeshBuilder.CreateTorus("gimbalRing1", { diameter: 4.8, thickness: 0.045, tessellation: 64 }, this.scene);
    this.ring1.parent = this.coreRoot;
    this.ring1.rotation.x = Math.PI / 4;

    const ringMat1 = new StandardMaterial("ringMat1", this.scene);
    ringMat1.emissiveColor = new Color3(0.0, 0.95, 1.0);
    ringMat1.diffuseColor = new Color3(0.0, 0.95, 1.0);
    this.ring1.material = ringMat1;

    this.ring2 = MeshBuilder.CreateTorus("gimbalRing2", { diameter: 5.7, thickness: 0.040, tessellation: 64 }, this.scene);
    this.ring2.parent = this.coreRoot;
    this.ring2.rotation.y = Math.PI / 3;

    const ringMat2 = new StandardMaterial("ringMat2", this.scene);
    ringMat2.emissiveColor = new Color3(0.95, 0.75, 0.28);
    ringMat2.diffuseColor = new Color3(0.95, 0.75, 0.28);
    this.ring2.material = ringMat2;

    this.ring3 = MeshBuilder.CreateTorus("gimbalRing3", { diameter: 6.6, thickness: 0.035, tessellation: 64 }, this.scene);
    this.ring3.parent = this.coreRoot;
    this.ring3.rotation.z = Math.PI / 6;

    const ringMat3 = new StandardMaterial("ringMat3", this.scene);
    ringMat3.emissiveColor = new Color3(0.3, 0.65, 1.0);
    ringMat3.diffuseColor = new Color3(0.3, 0.65, 1.0);
    this.ring3.material = ringMat3;
  }

  /**
   * Satellite Polyhedra orbiting at multiple depths
   */
  private buildOrbitingSatellites(): void {
    const satelliteConfigs = [
      { type: 1, size: 0.95, radius: 6.8, speed: 0.35, y: 1.2, tilt: 0.3, color: new Color3(0.0, 0.85, 1.0) },
      { type: 2, size: 0.85, radius: 8.4, speed: -0.28, y: -0.8, tilt: -0.4, color: new Color3(1.0, 0.75, 0.3) },
      { type: 0, size: 0.75, radius: 5.6, speed: 0.42, y: 2.6, tilt: 0.6, color: new Color3(0.4, 0.7, 1.0) },
      { type: 3, size: 1.1, radius: 9.6, speed: -0.22, y: 0.4, tilt: -0.2, color: new Color3(0.1, 0.9, 0.9) },
    ];

    satelliteConfigs.forEach((cfg, idx) => {
      const sat = MeshBuilder.CreatePolyhedron(`sat_${idx}`, { type: cfg.type, size: cfg.size }, this.scene);
      const satMat = new StandardMaterial(`satMat_${idx}`, this.scene);
      satMat.wireframe = true;
      satMat.emissiveColor = cfg.color;
      satMat.diffuseColor = cfg.color;
      sat.material = satMat;

      this.satellites.push({
        mesh: sat,
        orbitRadius: cfg.radius,
        orbitSpeed: cfg.speed,
        orbitY: cfg.y,
        tilt: cfg.tilt,
        rotSpeed: new Vector3(
          0.8 + idx * 0.2,
          1.1 + idx * 0.3,
          0.5 + idx * 0.15,
        ),
      });
    });
  }

  /**
   * Synaptic Neural Constellation with Traveling Photon Pulses
   */
  private buildSynapticNetwork(): void {
    const nodeCoords: Vector3[] = [
      new Vector3(-6.5, 3.2, 5.0),
      new Vector3(-4.8, 1.2, 4.0),
      new Vector3(-7.2, -0.6, 6.0),
      new Vector3(-3.5, 3.8, 7.0),
      new Vector3(6.2, 3.0, 5.2),
      new Vector3(4.5, 1.0, 4.2),
      new Vector3(7.0, -0.8, 6.2),
      new Vector3(3.8, 3.6, 7.2),
      new Vector3(-1.8, 4.6, 8.0),
      new Vector3(1.8, 4.6, 8.0),
      new Vector3(-5.5, -2.2, 5.5),
      new Vector3(5.5, -2.2, 5.5),
    ];

    const nodeMat = new StandardMaterial("synapseNodeMat", this.scene);
    nodeMat.emissiveColor = new Color3(0.0, 0.95, 1.0);
    nodeMat.diffuseColor = new Color3(0.0, 0.95, 1.0);

    nodeCoords.forEach((coord, i) => {
      const node = MeshBuilder.CreateSphere(`synNode_${i}`, { diameter: 0.18, segments: 12 }, this.scene);
      node.position = coord;
      node.material = nodeMat;
      this.nodeMeshes.push(node);
    });

    // Define interconnected network connections
    this.nodeConnections = [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 },
      { from: 1, to: 3 }, { from: 3, to: 8 }, { from: 2, to: 10 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 4, to: 7 },
      { from: 5, to: 7 }, { from: 7, to: 9 }, { from: 6, to: 11 },
      { from: 8, to: 9 },
    ];

    // Render connection line network
    const lines = this.nodeConnections.map((conn) => [
      nodeCoords[conn.from],
      nodeCoords[conn.to],
    ]);
    const lineSystem = MeshBuilder.CreateLineSystem("synLines", { lines }, this.scene);
    lineSystem.color = new Color3(0.12, 0.35, 0.65);
    lineSystem.alpha = 0.65;

    // Create high-luminosity traveling photon pulses
    const pulseMat = new StandardMaterial("pulseMat", this.scene);
    pulseMat.emissiveColor = new Color3(1.0, 0.95, 0.6);
    pulseMat.diffuseColor = new Color3(1.0, 0.95, 0.6);

    for (let p = 0; p < 7; p++) {
      const pulseMesh = MeshBuilder.CreateSphere(`pulse_${p}`, { diameter: 0.22, segments: 8 }, this.scene);
      pulseMesh.material = pulseMat;
      const connIdx = p % this.nodeConnections.length;
      this.photonPulses.push({
        mesh: pulseMesh,
        fromNode: this.nodeConnections[connIdx].from,
        toNode: this.nodeConnections[connIdx].to,
        progress: p * 0.14,
        speed: 0.45 + (p % 3) * 0.15,
      });
    }
  }

  /**
   * Floating Holographic Telemetry HUD Panels
   */
  private buildHolographicHudPanels(): void {
    // Left Telemetry Panel
    this.leftHudMesh = MeshBuilder.CreatePlane("leftHud", { width: 3.4, height: 2.2 }, this.scene);
    this.leftHudMesh.position = new Vector3(-6.2, 1.2, 3.2);
    this.leftHudMesh.rotation.y = 0.32;
    this.leftHudMesh.rotation.x = -0.08;

    this.leftHudTex = new DynamicTexture("leftHudTex", { width: 512, height: 320 }, this.scene, false);
    const leftMat = new StandardMaterial("leftHudMat", this.scene);
    leftMat.diffuseTexture = this.leftHudTex;
    leftMat.emissiveColor = new Color3(0.4, 0.8, 1.0);
    leftMat.opacityTexture = this.leftHudTex;
    leftMat.backFaceCulling = false;
    this.leftHudMesh.material = leftMat;

    // Right Telemetry Panel
    this.rightHudMesh = MeshBuilder.CreatePlane("rightHud", { width: 3.2, height: 2.2 }, this.scene);
    this.rightHudMesh.position = new Vector3(6.2, 1.0, 3.2);
    this.rightHudMesh.rotation.y = -0.32;
    this.rightHudMesh.rotation.x = -0.08;

    this.rightHudTex = new DynamicTexture("rightHudTex", { width: 512, height: 320 }, this.scene, false);
    const rightMat = new StandardMaterial("rightHudMat", this.scene);
    rightMat.diffuseTexture = this.rightHudTex;
    rightMat.emissiveColor = new Color3(0.9, 0.75, 0.4);
    rightMat.opacityTexture = this.rightHudTex;
    rightMat.backFaceCulling = false;
    this.rightHudMesh.material = rightMat;

    this.updateHudTextures(0);
  }

  private updateHudTextures(t: number): void {
    if (this.leftHudTex) {
      const ctx = this.leftHudTex.getContext() as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, 512, 320);

      // Cybernetic glass border
      ctx.strokeStyle = "rgba(0, 229, 255, 0.65)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, 496, 304);

      // Header telemetry
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, monospace";
      ctx.fillText("[ NEURAL INFERENCE ENGINE // 2026 ]", 24, 40);

      ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
      ctx.font = "14px monospace";
      ctx.fillText("CORE STATUS: ACTIVE · LATENT SPACE STABLE", 24, 70);
      ctx.fillText(`SYNAPSE BANDWIDTH: ${(42.8 + Math.sin(t * 2) * 1.4).toFixed(1)} GB/s`, 24, 94);
      ctx.fillText(`TOKEN LATENCY: ${(3.8 + Math.cos(t * 1.5) * 0.4).toFixed(2)} ms`, 24, 118);

      // Animated live sine waveform
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.85)";
      ctx.lineWidth = 2.5;
      for (let x = 24; x < 488; x += 4) {
        const y = 200 + Math.sin(x * 0.045 + t * 4) * 28 + Math.cos(x * 0.08 - t * 2) * 12;
        if (x === 24) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Lower status markers
      ctx.fillStyle = "#38bdf8";
      ctx.font = "12px monospace";
      ctx.fillText("ENTERPRISE PLATFORM PROTOCOL: OK", 24, 280);
      ctx.fillText("PARALLEL THREADS: 128 / 128", 290, 280);

      this.leftHudTex.update();
    }

    if (this.rightHudTex) {
      const ctx = this.rightHudTex.getContext() as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, 512, 320);

      // Amber/Gold cybernetic glass border
      ctx.strokeStyle = "rgba(245, 158, 11, 0.65)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, 496, 304);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, monospace";
      ctx.fillText("[ LATENT TOPOLOGY MATRIX ]", 24, 40);

      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      ctx.font = "14px monospace";
      ctx.fillText("CURRICULUM: TTDA-L1 FOUNDATIONS", 24, 70);
      ctx.fillText("MODULE RECAPS: 6 VERIFIED", 24, 94);
      ctx.fillText(`SESSION CYCLES: ${Math.floor(t * 60 + 1042)}`, 24, 118);

      // Radar / Reticle Target Graphic
      const cx = 380;
      const cy = 200;
      const r = 58;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.moveTo(cx - r - 8, cy); ctx.lineTo(cx + r + 8, cy);
      ctx.moveTo(cx, cy - r - 8); ctx.lineTo(cx, cy + r + 8);
      ctx.stroke();

      // Sweeping radar arm
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const angle = t * 3;
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Telemetry coordinate readout
      ctx.fillStyle = "#fef08a";
      ctx.font = "13px monospace";
      ctx.fillText(`VECTOR X: ${(Math.sin(t) * 1.82).toFixed(3)}`, 24, 175);
      ctx.fillText(`VECTOR Y: ${(Math.cos(t * 0.8) * 2.15).toFixed(3)}`, 24, 205);
      ctx.fillText(`VECTOR Z: ${(Math.sin(t * 1.2) * 4.90).toFixed(3)}`, 24, 235);
      ctx.fillText("SYSTEM LOCK: ENGAGED", 24, 280);

      this.rightHudTex.update();
    }
  }

  /**
   * High-speed Streaming Data Particle System
   */
  private buildDataParticleStream(): void {
    // Generate circular soft glow particle texture procedurally
    const pTex = new DynamicTexture("particleGlowTex", { width: 64, height: 64 }, this.scene, false);
    const ctx = pTex.getContext() as CanvasRenderingContext2D;
    const radGrad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    radGrad.addColorStop(0.3, "rgba(0, 229, 255, 0.85)");
    radGrad.addColorStop(0.7, "rgba(14, 165, 233, 0.35)");
    radGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 64, 64);
    pTex.update();

    const ps = new ParticleSystem("aiDataStream", 450, this.scene);
    ps.particleTexture = pTex;
    ps.emitter = new Vector3(0, -2.5, 14.0);
    ps.minEmitBox = new Vector3(-14, -3, -8);
    ps.maxEmitBox = new Vector3(14, 6, 8);

    ps.color1 = new Color4(0.0, 0.9, 1.0, 0.95);
    ps.color2 = new Color4(1.0, 0.82, 0.38, 0.85);
    ps.colorDead = new Color4(0.05, 0.12, 0.25, 0.0);

    ps.minSize = 0.08;
    ps.maxSize = 0.28;

    ps.minLifeTime = 2.5;
    ps.maxLifeTime = 5.5;

    ps.emitRate = 95;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;

    ps.gravity = new Vector3(0, 0.08, 0);
    ps.direction1 = new Vector3(-0.6, 0.4, -2.2);
    ps.direction2 = new Vector3(0.6, 0.8, -1.2);

    ps.minEmitPower = 0.8;
    ps.maxEmitPower = 2.2;
    ps.updateSpeed = 0.018;

    ps.start();
    this.particles = ps;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;

    let hudTimer = 0;

    this.engine.runRenderLoop(() => {
      const dt = this.engine.getDeltaTime() / 1000;
      this.time += dt;
      hudTimer += dt;

      // 1. Visibly continuous cinematic camera orbit + smooth mouse parallax
      this.currentCamOffsetX += (this.targetCamOffsetX - this.currentCamOffsetX) * 0.06;
      this.currentCamOffsetY += (this.targetCamOffsetY - this.currentCamOffsetY) * 0.06;

      const orbitCamX = Math.sin(this.time * 0.35) * 1.25 + this.currentCamOffsetX;
      const orbitCamY = 1.4 + Math.cos(this.time * 0.28) * 0.45 + this.currentCamOffsetY;
      const orbitCamZ = this.baseCamPos.z + Math.sin(this.time * 0.2) * 0.6;

      this.camera.position.set(orbitCamX, orbitCamY, orbitCamZ);
      this.camera.setTarget(new Vector3(orbitCamX * 0.25, 0.8 + orbitCamY * 0.15, 6.0));

      // 2. Continuous dynamic rotation of the AI Core
      if (this.coreRoot) {
        this.coreRoot.rotation.y = this.time * 0.45;
        this.coreRoot.rotation.x = Math.sin(this.time * 0.3) * 0.22;
        this.coreRoot.rotation.z = Math.cos(this.time * 0.25) * 0.15;
      }
      if (this.coreIcoWire) {
        this.coreIcoWire.rotation.y = -this.time * 0.65;
        this.coreIcoWire.rotation.x = this.time * 0.35;
      }
      if (this.coreSphere) {
        const pulseScale = 1.0 + Math.sin(this.time * 2.8) * 0.12;
        this.coreSphere.scaling.set(pulseScale, pulseScale, pulseScale);
      }
      if (this.ring1) {
        this.ring1.rotation.z = this.time * 0.95;
        this.ring1.rotation.x = Math.PI / 4 + Math.sin(this.time * 0.6) * 0.3;
      }
      if (this.ring2) {
        this.ring2.rotation.x = -this.time * 0.82;
        this.ring2.rotation.y = Math.PI / 3 + Math.cos(this.time * 0.5) * 0.3;
      }
      if (this.ring3) {
        this.ring3.rotation.y = this.time * 1.15;
        this.ring3.rotation.z = Math.PI / 6 + Math.sin(this.time * 0.7) * 0.3;
      }

      // 3. Orbiting satellite polyhedra update
      this.satellites.forEach((sat, i) => {
        const angle = this.time * sat.orbitSpeed + i * 1.57;
        const sx = Math.cos(angle) * sat.orbitRadius;
        const sz = 7.5 + Math.sin(angle) * (sat.orbitRadius * 0.75);
        const sy = sat.orbitY + Math.sin(this.time * 0.8 + i) * 0.7;

        sat.mesh.position.set(sx, sy, sz);
        sat.mesh.rotation.x += sat.rotSpeed.x * dt;
        sat.mesh.rotation.y += sat.rotSpeed.y * dt;
        sat.mesh.rotation.z += sat.rotSpeed.z * dt;
      });

      // 4. Undulating 3D Wave Surface vertex animation
      if (this.waveMesh && this.wavePositions && this.waveOriginalY) {
        const len = this.waveOriginalY.length;
        for (let i = 0; i < len; i++) {
          const vx = this.wavePositions[i * 3];
          const vz = this.wavePositions[i * 3 + 2];
          const waveHeight =
            Math.sin(vx * 0.38 + this.time * 2.1) * Math.cos(vz * 0.38 + this.time * 1.8) * 0.95 +
            Math.sin((vx + vz) * 0.25 - this.time * 1.4) * 0.45;
          this.wavePositions[i * 3 + 1] = this.waveOriginalY[i] + waveHeight;
        }
        this.waveMesh.updateVerticesData(VertexBuffer.PositionKind, this.wavePositions);
      }

      // 5. Traveling photon pulses along neural connections
      const nodeCoords = this.nodeMeshes.map((m) => m.position);
      this.photonPulses.forEach((pulse) => {
        pulse.progress += pulse.speed * dt;
        if (pulse.progress >= 1.0) {
          pulse.progress = 0.0;
          // Pick a random connected target
          const nextConns = this.nodeConnections.filter((c) => c.from === pulse.toNode || c.to === pulse.toNode);
          if (nextConns.length > 0) {
            const next = nextConns[Math.floor(Math.random() * nextConns.length)];
            pulse.fromNode = pulse.toNode;
            pulse.toNode = next.from === pulse.fromNode ? next.to : next.from;
          }
        }
        const p1 = nodeCoords[pulse.fromNode];
        const p2 = nodeCoords[pulse.toNode];
        if (p1 && p2) {
          pulse.mesh.position.x = p1.x + (p2.x - p1.x) * pulse.progress;
          pulse.mesh.position.y = p1.y + (p2.y - p1.y) * pulse.progress;
          pulse.mesh.position.z = p1.z + (p2.z - p1.z) * pulse.progress;
        }
      });

      // 6. Floating Holographic HUD Panels bobbing and tilting
      if (this.leftHudMesh) {
        this.leftHudMesh.position.y = 1.2 + Math.sin(this.time * 0.9) * 0.18;
        this.leftHudMesh.rotation.z = Math.sin(this.time * 0.7) * 0.04;
      }
      if (this.rightHudMesh) {
        this.rightHudMesh.position.y = 1.0 + Math.cos(this.time * 0.85) * 0.18;
        this.rightHudMesh.rotation.z = -Math.cos(this.time * 0.65) * 0.04;
      }

      // Refresh dynamic HUD canvases every 0.05s (20 FPS) to optimize CPU/GPU
      if (hudTimer > 0.05) {
        this.updateHudTextures(this.time);
        hudTimer = 0;
      }

      // 7. Dynamic sweeping light paths
      if (this.cyanSweepLight) {
        this.cyanSweepLight.position.x = Math.sin(this.time * 0.9) * 8.5;
        this.cyanSweepLight.position.y = 1.5 + Math.cos(this.time * 0.7) * 2.8;
        this.cyanSweepLight.position.z = 4.0 + Math.sin(this.time * 0.5) * 3.5;
      }
      if (this.amberSweepLight) {
        this.amberSweepLight.position.x = Math.cos(this.time * 0.85) * 8.0;
        this.amberSweepLight.position.y = 0.5 + Math.sin(this.time * 0.65) * 2.5;
        this.amberSweepLight.position.z = 4.5 + Math.cos(this.time * 0.45) * 3.0;
      }

      this.scene.render();
    });
  }

  public dispose(): void {
    this.running = false;
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouseMove);
    this.particles?.dispose();
    this.glowLayer?.dispose();
    this.leftHudTex?.dispose();
    this.rightHudTex?.dispose();
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }

  private onResize = (): void => {
    this.engine.resize();
  };

  private onMouseMove = (event: MouseEvent): void => {
    const normX = (event.clientX / window.innerWidth) * 2 - 1;
    const normY = -(event.clientY / window.innerHeight) * 2 + 1;
    this.targetCamOffsetX = normX * 1.35;
    this.targetCamOffsetY = normY * 0.85;
  };
}
