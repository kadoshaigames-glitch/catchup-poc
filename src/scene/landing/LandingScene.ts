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
} from "@babylonjs/core";

export class LandingScene {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: UniversalCamera;
  private glowLayer: GlowLayer | null = null;
  private particles: ParticleSystem | null = null;

  // Animated elements
  private oculusOuterRing: Mesh | null = null;
  private oculusInnerRing: Mesh | null = null;
  private horizonAura: PointLight | null = null;
  private sunKey: DirectionalLight | null = null;
  private lightShafts: Mesh[] = [];
  private lightShaftMat: StandardMaterial | null = null;

  private running = false;
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { adaptToDeviceRatio: true }, true);
    this.scene = new Scene(this.engine);

    // 1. Atmosphere: Rich, luminous executive twilight with vibrant golden horizon
    this.scene.clearColor = new Color4(0.09, 0.13, 0.18, 1.0);
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = new Color3(0.12, 0.16, 0.22);
    this.scene.fogDensity = 0.010;

    // 2. Camera: Wide cinematic vantage down the central grand learning gallery
    this.camera = new UniversalCamera(
      "landingCam",
      new Vector3(0, 1.95, -11.0),
      this.scene,
    );
    this.camera.setTarget(new Vector3(0, 1.85, 9.0));
    this.camera.minZ = 0.1;
    this.camera.inputs.clear();

    // 3. Post-Processing Glow: Soft, luxurious bloom on architectural inlays & sunbeams
    this.glowLayer = new GlowLayer("landingGlow", this.scene, {
      blurKernelSize: 24,
    });
    this.glowLayer.intensity = 0.38;

    this.setupSkyDome();
    this.setupLighting();
    this.buildArchitecture();
    this.buildVolumetricSunbeams();
    this.buildAtmosphericParticles();

    window.addEventListener("resize", this.onResize);
  }

  private setupSkyDome(): void {
    // Grand panoramic sky dome with rich twilight-to-golden-dawn gradient
    const skyDome = MeshBuilder.CreateSphere(
      "skyDome",
      { diameter: 180, segments: 24, sideOrientation: Mesh.BACKSIDE },
      this.scene,
    );
    skyDome.position = new Vector3(0, 4, 20);

    const skyTex = new DynamicTexture("skyGradTex", { width: 128, height: 256 }, this.scene, false);
    const ctx = skyTex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#081220");    // Deep corporate midnight navy at apex
    grad.addColorStop(0.35, "#142844"); // Luminous sapphire twilight
    grad.addColorStop(0.65, "#254262"); // Atmospheric horizon transition
    grad.addColorStop(0.85, "#8a582c"); // Warm amber dawn glow
    grad.addColorStop(0.94, "#cf8e42"); // Radiant golden sunrise rim
    grad.addColorStop(1.0, "#1c1410");  // Ground horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);
    skyTex.update();

    const skyMat = new StandardMaterial("skyDomeMat", this.scene);
    skyMat.diffuseTexture = skyTex;
    skyMat.emissiveColor = new Color3(0.42, 0.48, 0.58);
    skyMat.disableLighting = true;
    skyMat.backFaceCulling = false;
    skyDome.material = skyMat;
  }

  private setupLighting(): void {
    // 1. Crisp Ambient Skylight Fill
    const hemi = new HemisphericLight("ambientHemi", new Vector3(0, 1, 0), this.scene);
    hemi.intensity = 0.85;
    hemi.diffuse = new Color3(0.60, 0.72, 0.88); // Crisp sky blue fill
    hemi.groundColor = new Color3(0.24, 0.20, 0.18); // Warm floor bounce

    // 2. Primary Key Sunlight: Golden architectural beam pouring across the hall
    const sun = new DirectionalLight(
      "sunKey",
      new Vector3(-0.55, -0.68, 0.48),
      this.scene,
    );
    sun.position = new Vector3(8, 15, -6);
    sun.intensity = 1.65;
    sun.diffuse = new Color3(1.0, 0.94, 0.82); // Warm golden sunlight
    sun.specular = new Color3(0.95, 0.90, 0.75); // Glossy highlights on marble floor
    this.sunKey = sun;

    // 3. Sky Rim Fill: Cool corporate azure rim from opposite side
    const skyRim = new DirectionalLight(
      "skyRim",
      new Vector3(0.65, -0.32, -0.3),
      this.scene,
    );
    skyRim.position = new Vector3(-10, 8, 4);
    skyRim.intensity = 0.75;
    skyRim.diffuse = new Color3(0.42, 0.62, 0.85);

    // 4. Horizon Dawn Aura: Radiant warm point light radiating through the central learning portal
    const aura = new PointLight("horizonAura", new Vector3(0, 4.2, 24), this.scene);
    aura.intensity = 2.4;
    aura.range = 42;
    aura.diffuse = new Color3(1.0, 0.85, 0.62);
    this.horizonAura = aura;
  }

  private buildArchitecture(): void {
    // -------------------------------------------------------------
    // Premium Materials: Polished Smoked Marble, Brushed Brass, Warm Walnut
    // -------------------------------------------------------------

    // Polished executive smoked marble floor (glossy reflections catching the sunlight & inlays)
    const floorMat = new StandardMaterial("floorMat", this.scene);
    floorMat.diffuseColor = new Color3(0.18, 0.22, 0.28);
    floorMat.specularColor = new Color3(0.65, 0.65, 0.72);
    floorMat.specularPower = 36;
    floorMat.roughness = 0.12;

    // Brushed champagne gold / brass architectural inlays (pure metallic reflection, no blown-out emissive)
    const goldInlayMat = new StandardMaterial("goldInlayMat", this.scene);
    goldInlayMat.diffuseColor = new Color3(0.85, 0.72, 0.44);
    goldInlayMat.specularColor = new Color3(0.95, 0.88, 0.65);
    goldInlayMat.specularPower = 32;

    // Warm architectural walnut fluted wood trim
    const woodMat = new StandardMaterial("woodMat", this.scene);
    woodMat.diffuseColor = new Color3(0.28, 0.18, 0.12);
    woodMat.specularColor = new Color3(0.15, 0.12, 0.09);
    woodMat.specularPower = 16;

    // Sleek architectural travertine columns (uniform executive stone)
    const columnStoneMat = new StandardMaterial("columnStoneMat", this.scene);
    columnStoneMat.diffuseColor = new Color3(0.48, 0.52, 0.58);
    columnStoneMat.specularColor = new Color3(0.32, 0.32, 0.36);
    columnStoneMat.specularPower = 24;

    // Bronze column base
    const plinthMat = new StandardMaterial("plinthMat", this.scene);
    plinthMat.diffuseColor = new Color3(0.20, 0.22, 0.26);
    plinthMat.specularColor = new Color3(0.35, 0.32, 0.28);

    // Luminous Gold Accent (Warm ambient glow for architectural recesses)
    const luminousGoldMat = new StandardMaterial("luminousGoldMat", this.scene);
    luminousGoldMat.diffuseColor = new Color3(0.96, 0.85, 0.58);
    luminousGoldMat.emissiveColor = new Color3(0.72, 0.58, 0.32);
    luminousGoldMat.specularColor = new Color3(0.5, 0.4, 0.2);

    // Luminous Azure Accent
    const luminousAzureMat = new StandardMaterial("luminousAzureMat", this.scene);
    luminousAzureMat.diffuseColor = new Color3(0.45, 0.72, 1.0);
    luminousAzureMat.emissiveColor = new Color3(0.35, 0.60, 0.92);

    // Translucent architectural frosted glass balustrade
    const glassMat = new StandardMaterial("glassMat", this.scene);
    glassMat.diffuseColor = new Color3(0.32, 0.45, 0.62);
    glassMat.specularColor = new Color3(0.75, 0.85, 0.95);
    glassMat.alpha = 0.36;

    // -------------------------------------------------------------
    // Ground & Floor Layout
    // -------------------------------------------------------------
    const ground = MeshBuilder.CreateGround(
      "landingGround",
      { width: 46, height: 85 },
      this.scene,
    );
    ground.position = new Vector3(0, 0, 12);
    ground.material = floorMat;

    // Symmetrical polished champagne gold tracks guiding toward the horizon
    const trackOffsets = [-3.0, -1.0, 1.0, 3.0];
    trackOffsets.forEach((x, i) => {
      const stripe = MeshBuilder.CreateBox(
        `floorStripe_${i}`,
        { width: 0.05, height: 0.012, depth: 75 },
        this.scene,
      );
      stripe.position = new Vector3(x, 0.006, 12);
      stripe.material = goldInlayMat;
    });

    // Lateral warm walnut margins framing the central marble promenade
    [-5.2, 5.2].forEach((x, i) => {
      const margin = MeshBuilder.CreateBox(
        `woodMargin_${i}`,
        { width: 0.65, height: 0.015, depth: 75 },
        this.scene,
      );
      margin.position = new Vector3(x, 0.007, 12);
      margin.material = woodMat;
    });

    // -------------------------------------------------------------
    // Side Atrium Colonnades & Mezzanine Galleries
    // -------------------------------------------------------------
    const pillarZ = [-7, -1, 5, 11, 17, 23, 29];
    pillarZ.forEach((z, idx) => {
      const height = 5.8 + idx * 0.25;
      const xOffset = 4.8 + idx * 0.28;

      // Base bronze plinth (Left & Right)
      [-xOffset, xOffset].forEach((px, side) => {
        const plinth = MeshBuilder.CreateBox(
          `plinth_${idx}_${side}`,
          { width: 0.52, height: 0.8, depth: 0.6 },
          this.scene,
        );
        plinth.position = new Vector3(px, 0.4, z);
        plinth.material = plinthMat;

        // Slender travertine column
        const column = MeshBuilder.CreateBox(
          `column_${idx}_${side}`,
          { width: 0.40, height: height - 0.8, depth: 0.48 },
          this.scene,
        );
        column.position = new Vector3(px, 0.8 + (height - 0.8) / 2, z);
        column.material = columnStoneMat;

        // Warm vertical brass accent reveal on inner face
        const innerSign = side === 0 ? 1 : -1;
        const verticalTrim = MeshBuilder.CreateBox(
          `trim_${idx}_${side}`,
          { width: 0.03, height: height * 0.85, depth: 0.50 },
          this.scene,
        );
        verticalTrim.position = new Vector3(px + innerSign * 0.20, height * 0.45, z);
        verticalTrim.material = goldInlayMat;
      });

      // Upper Mezzanine Balcony Beam & Glass Balustrade
      if (idx < pillarZ.length - 1) {
        const nextZ = pillarZ[idx + 1];
        const span = nextZ - z;
        const beamY = 3.6 + idx * 0.15;

        // Left Balcony
        const bLeft = MeshBuilder.CreateBox(
          `bLeft_${idx}`,
          { width: 0.35, height: 0.32, depth: span },
          this.scene,
        );
        bLeft.position = new Vector3(-xOffset - 0.18, beamY, z + span / 2);
        bLeft.material = columnStoneMat;

        // Left Under-Beam Warm Light Strip
        const glowL = MeshBuilder.CreateBox(
          `glowL_${idx}`,
          { width: 0.06, height: 0.02, depth: span },
          this.scene,
        );
        glowL.position = new Vector3(-xOffset - 0.04, beamY - 0.16, z + span / 2);
        glowL.material = idx % 2 === 0 ? luminousGoldMat : luminousAzureMat;

        // Left Glass Balustrade
        const glassL = MeshBuilder.CreateBox(
          `glassL_${idx}`,
          { width: 0.03, height: 0.85, depth: span * 0.95 },
          this.scene,
        );
        glassL.position = new Vector3(-xOffset + 0.15, beamY + 0.55, z + span / 2);
        glassL.material = glassMat;

        // Left Wooden Handrail
        const railL = MeshBuilder.CreateBox(
          `railL_${idx}`,
          { width: 0.07, height: 0.035, depth: span * 0.95 },
          this.scene,
        );
        railL.position = new Vector3(-xOffset + 0.15, beamY + 0.98, z + span / 2);
        railL.material = woodMat;

        // Right Balcony
        const bRight = MeshBuilder.CreateBox(
          `bRight_${idx}`,
          { width: 0.35, height: 0.32, depth: span },
          this.scene,
        );
        bRight.position = new Vector3(xOffset + 0.18, beamY, z + span / 2);
        bRight.material = columnStoneMat;

        // Right Under-Beam Warm Light Strip
        const glowR = MeshBuilder.CreateBox(
          `glowR_${idx}`,
          { width: 0.06, height: 0.02, depth: span },
          this.scene,
        );
        glowR.position = new Vector3(xOffset + 0.04, beamY - 0.16, z + span / 2);
        glowR.material = idx % 2 === 0 ? luminousGoldMat : luminousAzureMat;

        // Right Glass Balustrade
        const glassR = MeshBuilder.CreateBox(
          `glassR_${idx}`,
          { width: 0.03, height: 0.85, depth: span * 0.95 },
          this.scene,
        );
        glassR.position = new Vector3(xOffset - 0.15, beamY + 0.55, z + span / 2);
        glassR.material = glassMat;

        // Right Wooden Handrail
        const railR = MeshBuilder.CreateBox(
          `railR_${idx}`,
          { width: 0.07, height: 0.035, depth: span * 0.95 },
          this.scene,
        );
        railR.position = new Vector3(xOffset - 0.15, beamY + 0.98, z + span / 2);
        railR.material = woodMat;
      }
    });

    // -------------------------------------------------------------
    // Overhead Vaulted Glass & Brass Skylight Arches
    // -------------------------------------------------------------
    const archDistances = [0, 8, 16, 24];
    archDistances.forEach((z, i) => {
      const arch = MeshBuilder.CreateTorus(
        `skylightArch_${i}`,
        { diameter: 14.5 + i * 0.6, thickness: 0.12, tessellation: 64 },
        this.scene,
      );
      arch.position = new Vector3(0, 4.6, z);
      arch.rotation.x = Math.PI / 2;
      arch.material = goldInlayMat;

      // Inner subtle glass panel ring
      const archGlass = MeshBuilder.CreateTorus(
        `archGlass_${i}`,
        { diameter: 14.2 + i * 0.6, thickness: 0.05, tessellation: 48 },
        this.scene,
      );
      archGlass.position = new Vector3(0, 4.6, z);
      archGlass.rotation.x = Math.PI / 2;
      archGlass.material = glassMat;
    });

    // -------------------------------------------------------------
    // Horizon Focal Nexus (Subtly Magical Kinetic Corporate Portal)
    // -------------------------------------------------------------
    // Far Curved Background Rotunda Colonnade
    const rotundaRadius = 14;
    for (let a = -40; a <= 40; a += 10) {
      const rad = (a * Math.PI) / 180;
      const rx = Math.sin(rad) * rotundaRadius;
      const rz = 28 + Math.cos(rad) * 6;
      const rotCol = MeshBuilder.CreateCylinder(
        `rotCol_${a}`,
        { height: 8.5, diameter: 0.32, tessellation: 20 },
        this.scene,
      );
      rotCol.position = new Vector3(rx, 4.25, rz);
      rotCol.material = columnStoneMat;
    }

    // Outer Champagne Gold Kinetic Ring
    const ringOuter = MeshBuilder.CreateTorus(
      "nexusOuter",
      { diameter: 6.8, thickness: 0.10, tessellation: 72 },
      this.scene,
    );
    ringOuter.position = new Vector3(0, 4.2, 24.5);
    ringOuter.material = goldInlayMat;
    this.oculusOuterRing = ringOuter;

    // Inner Radiant Luminous Azure Ring
    const ringInner = MeshBuilder.CreateTorus(
      "nexusInner",
      { diameter: 5.2, thickness: 0.06, tessellation: 64 },
      this.scene,
    );
    ringInner.position = new Vector3(0, 4.2, 24.7);
    ringInner.material = luminousAzureMat;
    this.oculusInnerRing = ringInner;

    // Distant Radiant Sunrise Glow Disc
    const sunDisc = MeshBuilder.CreateDisc(
      "sunDisc",
      { radius: 2.5, tessellation: 48 },
      this.scene,
    );
    sunDisc.position = new Vector3(0, 4.2, 25.4);
    const sunDiscMat = new StandardMaterial("sunDiscMat", this.scene);
    sunDiscMat.diffuseColor = new Color3(1.0, 0.92, 0.80);
    sunDiscMat.emissiveColor = new Color3(0.85, 0.72, 0.48);
    sunDiscMat.disableLighting = true;
    sunDisc.material = sunDiscMat;
  }

  private buildVolumetricSunbeams(): void {
    // Soft, luminous god-rays entering from overhead skylight
    const shaftMat = new StandardMaterial("sunbeamMat", this.scene);
    shaftMat.diffuseColor = new Color3(1.0, 0.94, 0.82);
    shaftMat.emissiveColor = new Color3(0.45, 0.38, 0.22);
    shaftMat.alpha = 0.085;
    shaftMat.backFaceCulling = false;
    this.lightShaftMat = shaftMat;

    const beamConfigs = [
      { x: -3.2, y: 6.0, z: 1, rotZ: 0.35, rotX: 0.16, height: 16, diam: 2.3 },
      { x: 2.6, y: 6.8, z: 9, rotZ: -0.30, rotX: 0.20, height: 18, diam: 2.7 },
      { x: -0.6, y: 7.5, z: 16, rotZ: 0.20, rotX: 0.24, height: 20, diam: 3.1 },
    ];

    beamConfigs.forEach((cfg, idx) => {
      const beam = MeshBuilder.CreateCylinder(
        `sunbeam_${idx}`,
        {
          height: cfg.height,
          diameterTop: cfg.diam * 0.25,
          diameterBottom: cfg.diam,
          tessellation: 24,
        },
        this.scene,
      );
      beam.position = new Vector3(cfg.x, cfg.y, cfg.z);
      beam.rotation.z = cfg.rotZ;
      beam.rotation.x = cfg.rotX;
      beam.material = shaftMat;
      this.lightShafts.push(beam);
    });
  }

  private buildAtmosphericParticles(): void {
    // Sparkling golden ambient motes in daylight
    const tex = new DynamicTexture("moteTex", 64, this.scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 245, 220, 1.0)");
    grad.addColorStop(0.25, "rgba(235, 205, 145, 0.75)");
    grad.addColorStop(0.65, "rgba(200, 165, 110, 0.2)");
    grad.addColorStop(1, "rgba(200, 165, 110, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();

    const ps = new ParticleSystem("ambientMotes", 140, this.scene);
    ps.particleTexture = tex;
    ps.emitter = new Vector3(0, 0.4, 6);
    ps.minEmitBox = new Vector3(-9, -0.2, -6);
    ps.maxEmitBox = new Vector3(9, 6.0, 22);

    // Warm luminous sunlight colors
    ps.color1 = new Color4(1.0, 0.95, 0.82, 0.75);
    ps.color2 = new Color4(0.90, 0.80, 0.58, 0.45);
    ps.colorDead = new Color4(0.4, 0.3, 0.15, 0.0);

    ps.minSize = 0.07;
    ps.maxSize = 0.20;

    ps.minLifeTime = 5.0;
    ps.maxLifeTime = 10.0;

    ps.emitRate = 20;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;

    ps.gravity = new Vector3(0, 0.015, 0);
    ps.direction1 = new Vector3(-0.12, 0.14, -0.06);
    ps.direction2 = new Vector3(0.12, 0.28, 0.06);

    ps.minEmitPower = 0.05;
    ps.maxEmitPower = 0.15;
    ps.updateSpeed = 0.008;

    ps.start();
    this.particles = ps;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;

    this.engine.runRenderLoop(() => {
      const dt = this.engine.getDeltaTime() / 1000;
      this.time += dt;

      // 1. Stately cinematic camera drift (smooth, subtle arc)
      const swayX = Math.sin(this.time * 0.12) * 0.38;
      const swayY = 1.95 + Math.cos(this.time * 0.16) * 0.08;
      this.camera.position.x = swayX;
      this.camera.position.y = swayY;
      this.camera.setTarget(new Vector3(swayX * 0.32, 1.85, 11.0));

      // 2. Slow hypnotic rotation of the horizon Nexus rings
      if (this.oculusOuterRing) {
        this.oculusOuterRing.rotation.z = this.time * 0.032;
      }
      if (this.oculusInnerRing) {
        this.oculusInnerRing.rotation.z = -this.time * 0.020;
      }

      // 3. Subtle breathing of volumetric sunbeams
      if (this.lightShaftMat) {
        this.lightShaftMat.alpha = 0.080 + Math.sin(this.time * 0.6) * 0.02;
      }

      // 4. Subtle living horizon aura pulse
      if (this.horizonAura) {
        this.horizonAura.intensity = 2.3 + Math.sin(this.time * 0.8) * 0.25;
      }

      // 5. Natural sunlight intensity variation
      if (this.sunKey) {
        this.sunKey.intensity = 1.62 + Math.sin(this.time * 0.35) * 0.10;
      }

      this.scene.render();
    });
  }

  public dispose(): void {
    this.running = false;
    window.removeEventListener("resize", this.onResize);
    this.particles?.dispose();
    this.glowLayer?.dispose();
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }

  private onResize = (): void => {
    this.engine.resize();
  };
}
