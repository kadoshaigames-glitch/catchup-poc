import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Shaders/pbr.vertex";
import "@babylonjs/core/Shaders/pbr.fragment";
import {
  AnimationGroup,
  Color3,
  SceneLoader,
  Space,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import type { Bone, Observer, Scene } from "@babylonjs/core";
import type {
  AwangAnimationName,
  AwangController,
  AwangPose,
  CreateAwangInstructor,
} from "./types";

// Active instructor avatar: Awang V2 (43.9k tris, 2K PBR maps)
// Fixed candidate with uniform rigid torso badge weights
const GLB_DIR = `${import.meta.env.BASE_URL}assets/awang/`;
const GLB_FILE = "awang-v2-rigged-fixed.glb";

// Default instructor spot in the classroom
const DEFAULT_INSTRUCTOR_POS = new Vector3(1.55, 0, 0.35);
// Slightly angled towards the audience / instructor camera
const DEFAULT_INSTRUCTOR_YAW = -0.25;

// Feet offset: V2 mesh bounds min.y is ~ -0.8936 (V1 was ~ -0.9515)
const GLTF_FEET_ELEVATION_Y = GLB_FILE.includes("v2") ? 0.8936 : 0.9515;

const UPPER_BODY_BONES = new Set([
  "spine",
  "chest",
  "neck",
  "head",
  "upper_arm.L",
  "forearm.L",
  "hand.L",
  "upper_arm.R",
  "forearm.R",
  "hand.R",
]);

const NAME_CANONICAL_MAP: Record<string, AwangAnimationName> = {
  idle: "Idle",
  walk: "Walk",
  "walk-to-stop": "Walk-to-stop",
  walktostop: "Walk-to-stop",
  turn: "Turn",
  present: "Present",
  point: "Point",
  simplegesture: "SimpleGesture",
  "simple-gesture": "SimpleGesture",
  listening: "Listening",
  listen: "Listening",
};

export const createAwangInstructor: CreateAwangInstructor = (
  scene: Scene,
): AwangController => {
  const root = new TransformNode("awangInstructorRoot", scene);
  root.position.copyFrom(DEFAULT_INSTRUCTOR_POS);
  root.rotation.set(0, DEFAULT_INSTRUCTOR_YAW, 0);

  const animGroupsMap = new Map<string, AnimationGroup>();
  const upperAnimGroupsMap = new Map<string, AnimationGroup>();
  let isLoaded = false;
  let disposed = false;

  // Skeletons and bone references for Level 1 Micro Motion
  let headBone: Bone | null = null;
  let neckBone: Bone | null = null;
  let chestBone: Bone | null = null;
  let spineBone: Bone | null = null;
  let upperArmL: Bone | null = null;
  let upperArmR: Bone | null = null;
  let forearmL: Bone | null = null;
  let forearmR: Bone | null = null;

  // Base Animation & Crossfading state
  let activeAg: AnimationGroup | null = null;
  let activeAgName: string | null = null;
  let fadingFromAg: AnimationGroup | null = null;
  let crossFadeDuration = 0.3;
  let crossFadeElapsed = 0;

  // Layered Upper-Body Overlay State (Level 2 & 3 gestures over base Listening)
  let isUpperOverlayActive = false;
  let activeUpperAg: AnimationGroup | null = null;
  let upperPhase: "in" | "hold" | "out" | "idle" = "idle";
  let upperBlendInSec = 0.2;
  let upperHoldSec = 1.8;
  let upperBlendOutSec = 0.28;
  let upperPhaseElapsed = 0;
  let upperTargetWeight = 0.75;
  let currentUpperWeight = 0;
  let upperOnComplete: (() => void) | null = null;

  // Level 1 Micro Motion procedural variables
  let microMotionTime = 0;
  let currentHeadYaw = 0;
  let targetHeadYaw = 0;
  let currentHeadPitch = 0;
  let targetHeadPitch = 0;

  // Neutral resting arm posture variation (avoids identical rest pose)
  let armRestStanceTimer = 3.0;
  let armRestStanceIndex = 0;
  let currentArmRestOffsetR = 0;
  let currentArmRestOffsetL = 0;
  let targetArmRestOffsetR = 0;
  let targetArmRestOffsetL = 0;

  // Waypoint locomotion state
  let waypoints: Vector3[] = [];
  let walkSpeed = 1.1;
  let isWalking = false;
  let arrivalCb: (() => void) | null = null;
  let arrivalYaw: number | null = null;

  // Turn state
  let isTurning = false;
  let turnTargetYaw: number | null = null;

  // Queue initial action before asset finishes loading
  let queuedAction: (() => void) | null = () => {
    controller.idle();
  };

  let activeEndTimer = 0;
  let activeEndCallback: (() => void) | null = null;
  let lastElapsedSec = 0;
  let renderObserver: Observer<Scene> | null = null;

  function resolveCanonicalName(name: string): string {
    const key = name.trim().toLowerCase();
    return NAME_CANONICAL_MAP[key] ?? name;
  }

  function getAnimGroup(name: string): AnimationGroup | null {
    const canonical = resolveCanonicalName(name);
    return animGroupsMap.get(canonical) ?? animGroupsMap.get(name) ?? null;
  }

  /**
   * Plays a full-body animation group with smooth weight crossfade.
   */
  function playAnimation(
    name: AwangPose | AwangAnimationName | string,
    loop = true,
    crossFadeSec = 0.3,
    onAnimationEnd?: () => void,
  ): AnimationGroup | null {
    if (!isLoaded) {
      queuedAction = () => {
        playAnimation(name, loop, crossFadeSec, onAnimationEnd);
      };
      return null;
    }

    const targetAg = getAnimGroup(name);
    if (!targetAg) {
      console.warn(`[AwangController] Animation group not found: "${name}"`);
      return null;
    }

    // Cancel any active upper-body overlay when switching base animations
    if (isUpperOverlayActive && activeUpperAg) {
      activeUpperAg.stop();
      activeUpperAg.reset();
      activeUpperAg.setWeightForAllAnimatables(1.0);
      activeUpperAg = null;
      upperPhase = "idle";
      isUpperOverlayActive = false;
    }

    if (activeAg === targetAg && targetAg.isPlaying) {
      if (onAnimationEnd) {
        activeEndCallback = onAnimationEnd;
      }
      return targetAg;
    }

    activeEndCallback = null;
    activeEndTimer = 0;

    if (onAnimationEnd) {
      const durationSec = Math.max(
        0.1,
        (targetAg.to - targetAg.from) / 30 / (targetAg.speedRatio || 1),
      );
      activeEndTimer = durationSec;
      activeEndCallback = () => {
        activeEndCallback = null;
        activeEndTimer = 0;
        onAnimationEnd();
      };
      targetAg.onAnimationGroupEndObservable.addOnce(() => {
        if (activeEndCallback) {
          const cb = activeEndCallback;
          activeEndCallback = null;
          activeEndTimer = 0;
          cb();
        }
      });
    }

    // Smooth weight crossfading without matrix resetting
    if (activeAg && activeAg.isPlaying && crossFadeSec > 0.05) {
      if (fadingFromAg && fadingFromAg !== activeAg && fadingFromAg !== targetAg) {
        fadingFromAg.stop();
        fadingFromAg.reset();
        fadingFromAg.setWeightForAllAnimatables(1.0);
      }
      fadingFromAg = activeAg;
      crossFadeDuration = crossFadeSec;
      crossFadeElapsed = 0;

      targetAg.setWeightForAllAnimatables(0.001);
      targetAg.play(loop);

      activeAg = targetAg;
      activeAgName = targetAg.name;
    } else {
      if (fadingFromAg) {
        fadingFromAg.stop();
        fadingFromAg.reset();
        fadingFromAg.setWeightForAllAnimatables(1.0);
        fadingFromAg = null;
      }
      for (const ag of animGroupsMap.values()) {
        if (ag !== targetAg && ag.isPlaying) {
          ag.stop();
          ag.reset();
          ag.setWeightForAllAnimatables(1.0);
        }
      }
      targetAg.setWeightForAllAnimatables(1.0);
      targetAg.play(loop);
      activeAg = targetAg;
      activeAgName = targetAg.name;
    }

    return targetAg;
  }

  /**
   * Plays an upper-body gesture layered cleanly over continuous base Listening.
   * Lower body (hips, legs, feet) remains 100% driven by Listening, eliminating foot sliding.
   * Base Listening is never stopped or reset, eliminating dead stillness.
   */
  function playUpperBodyGesture(
    name: "SimpleGesture" | "Present" | "Point",
    options?: {
      weight?: number;
      speedRatio?: number;
      durationSec?: number;
      blendInSec?: number;
      blendOutSec?: number;
      onComplete?: () => void;
    },
  ): void {
    if (!isLoaded) return;

    // Ensure base Listening is actively playing as continuous foundation
    const baseAg = getAnimGroup("Listening");
    if (baseAg) {
      if (activeAg !== baseAg || !baseAg.isPlaying) {
        if (activeAg && activeAg !== baseAg) {
          activeAg.stop();
          activeAg.reset();
        }
        baseAg.setWeightForAllAnimatables(1.0);
        baseAg.play(true);
        activeAg = baseAg;
        activeAgName = baseAg.name;
      }
    }

    const upperAg = upperAnimGroupsMap.get(name.toLowerCase());
    if (!upperAg) {
      // Fallback to standard crossfaded animation if upper group not constructed
      playAnimation(name, false, 0.25, options?.onComplete);
      return;
    }

    if (activeUpperAg && activeUpperAg.isPlaying && activeUpperAg !== upperAg) {
      activeUpperAg.stop();
      activeUpperAg.reset();
      activeUpperAg.setWeightForAllAnimatables(1.0);
    }

    activeUpperAg = upperAg;
    upperTargetWeight = options?.weight ?? (name === "SimpleGesture" ? 0.75 : 0.95);
    upperBlendInSec = options?.blendInSec ?? 0.20;
    upperBlendOutSec = options?.blendOutSec ?? 0.28;
    upperAg.speedRatio = options?.speedRatio ?? (name === "SimpleGesture" ? 1.15 : 1.0);

    const targetDuration = options?.durationSec ?? (name === "SimpleGesture" ? 2.2 : 3.2);
    upperHoldSec = Math.max(0.4, targetDuration - upperBlendInSec - upperBlendOutSec);

    upperPhase = "in";
    upperPhaseElapsed = 0;
    currentUpperWeight = 0.001;
    upperAg.setWeightForAllAnimatables(0.001);
    upperAg.play(false);
    isUpperOverlayActive = true;
    upperOnComplete = options?.onComplete ?? null;
  }

  const controller: AwangController = {
    root,

    get isLoaded() {
      return isLoaded;
    },

    get activeAnimationName() {
      return isUpperOverlayActive && activeUpperAg
        ? activeUpperAg.name.replace("Upper_", "")
        : activeAgName;
    },

    get animationGroups() {
      return animGroupsMap;
    },

    idle: () => {
      isWalking = false;
      waypoints = [];
      // If upper overlay was active, blend it out smoothly
      if (isUpperOverlayActive && upperPhase !== "out" && upperPhase !== "idle") {
        upperPhase = "out";
        upperPhaseElapsed = 0;
      }
      // Keep Listening active as the dignified base stance
      const baseAg = getAnimGroup("Listening");
      if (baseAg && (!baseAg.isPlaying || activeAg !== baseAg)) {
        playAnimation("Listening", true, 0.3);
      }
    },

    walk: () => {
      isUpperOverlayActive = false;
      if (activeUpperAg) {
        activeUpperAg.stop();
        activeUpperAg.reset();
        activeUpperAg = null;
      }
      playAnimation("Walk", true, 0.25);
    },

    walkToStop: (onComplete?: () => void) => {
      isWalking = false;
      waypoints = [];
      isUpperOverlayActive = false;
      playAnimation("Walk-to-stop", false, 0.2, () => {
        controller.idle();
        onComplete?.();
      });
    },

    turn: (targetAngleRad?: number, onComplete?: () => void) => {
      if (targetAngleRad !== undefined) {
        isTurning = true;
        turnTargetYaw = targetAngleRad;
      }
      isUpperOverlayActive = false;
      playAnimation("Turn", false, 0.25, () => {
        isTurning = false;
        turnTargetYaw = null;
        controller.idle();
        onComplete?.();
      });
    },

    // Level 3 Emphasis Gesture: Present (open palm towards learner / board)
    present: (loop = false, onComplete?: () => void) => {
      if (loop) {
        playAnimation("Present", true, 0.3, onComplete);
      } else {
        controller.setLookTarget("learner");
        playUpperBodyGesture("Present", {
          weight: 0.95,
          speedRatio: 1.0,
          durationSec: 3.2,
          blendInSec: 0.25,
          blendOutSec: 0.32,
          onComplete,
        });
      }
    },

    // Level 3 Emphasis Gesture: Point (referencing board)
    point: (loop = false, onComplete?: () => void) => {
      if (loop) {
        playAnimation("Point", true, 0.3, onComplete);
      } else {
        controller.setLookTarget("board");
        playUpperBodyGesture("Point", {
          weight: 0.95,
          speedRatio: 1.0,
          durationSec: 3.2,
          blendInSec: 0.25,
          blendOutSec: 0.32,
          onComplete: () => {
            controller.setLookTarget("learner");
            onComplete?.();
          },
        });
      }
    },

    // Level 3 / Standard Teaching Gesture
    simpleGesture: (loop = false, onComplete?: () => void) => {
      if (loop) {
        playAnimation("SimpleGesture", true, 0.3, onComplete);
      } else {
        playUpperBodyGesture("SimpleGesture", {
          weight: 0.88,
          speedRatio: 1.1,
          durationSec: 2.6,
          blendInSec: 0.20,
          blendOutSec: 0.28,
          onComplete,
        });
      }
    },

    // Level 2 Conversational Gesture: Abbreviated, natural teaching movement
    conversationalGesture: (
      variant: "quick" | "nod" | "palm" = "quick",
      onComplete?: () => void,
    ) => {
      const weight = variant === "quick" ? 0.72 : variant === "palm" ? 0.80 : 0.65;
      const speed = variant === "quick" ? 1.2 : 1.12;
      const duration = variant === "quick" ? 2.0 : 2.4;

      playUpperBodyGesture("SimpleGesture", {
        weight,
        speedRatio: speed,
        durationSec: duration,
        blendInSec: 0.18,
        blendOutSec: 0.25,
        onComplete,
      });
    },

    listening: (loop = true) => {
      if (isUpperOverlayActive && activeUpperAg) {
        activeUpperAg.stop();
        activeUpperAg.reset();
        activeUpperAg = null;
        upperPhase = "idle";
        isUpperOverlayActive = false;
      }
      playAnimation("Listening", loop, 0.25);
    },

    setLookTarget: (target: "board" | "learner" | "neutral") => {
      if (target === "board") {
        targetHeadYaw = -0.11; // ~-6.3 deg looking toward board
        targetHeadPitch = 0.01;
      } else if (target === "learner") {
        targetHeadYaw = 0.02; // ~+1.1 deg direct engagement
        targetHeadPitch = 0.0;
      } else {
        targetHeadYaw = -0.03;
        targetHeadPitch = -0.01;
      }
    },

    playAnimation: (
      name: AwangPose | AwangAnimationName | string,
      loop = true,
      crossFadeSec = 0.3,
      onAnimationEnd?: () => void,
    ) => {
      return playAnimation(name, loop, crossFadeSec, onAnimationEnd);
    },

    walkTo: (
      target: Vector3,
      speed = 1.1,
      onArrival?: () => void,
      targetYaw?: number,
    ) => {
      isUpperOverlayActive = false;
      if (activeUpperAg) {
        activeUpperAg.stop();
        activeUpperAg.reset();
        activeUpperAg = null;
      }
      waypoints = [new Vector3(target.x, root.position.y, target.z)];
      walkSpeed = speed;
      arrivalCb = onArrival ?? null;
      arrivalYaw = targetYaw ?? null;
      isWalking = true;
      controller.walk();
    },

    stopWalking: () => {
      isWalking = false;
      waypoints = [];
      arrivalCb = null;
      arrivalYaw = null;
      controller.walkToStop();
    },

    teleport: (position: Vector3, yaw?: number) => {
      isWalking = false;
      waypoints = [];
      arrivalCb = null;
      arrivalYaw = null;
      isTurning = false;
      turnTargetYaw = null;
      isUpperOverlayActive = false;
      if (activeUpperAg) {
        activeUpperAg.stop();
        activeUpperAg.reset();
        activeUpperAg = null;
      }
      root.position.copyFrom(position);
      if (yaw !== undefined) {
        root.rotation.y = yaw;
      }
    },

    update: (elapsedSec: number) => {
      const dt = Math.max(0.001, Math.min(0.1, elapsedSec - lastElapsedSec));
      lastElapsedSec = elapsedSec;
      microMotionTime += dt;

      // 1. Crossfade weight interpolation for base animations
      if (fadingFromAg) {
        crossFadeElapsed += dt;
        const progress = Math.min(1.0, crossFadeElapsed / crossFadeDuration);
        fadingFromAg.setWeightForAllAnimatables(Math.max(0.001, 1.0 - progress));
        if (activeAg) {
          activeAg.setWeightForAllAnimatables(Math.min(1.0, progress));
        }
        if (progress >= 1.0) {
          fadingFromAg.stop();
          fadingFromAg.reset();
          fadingFromAg.setWeightForAllAnimatables(1.0);
          fadingFromAg = null;
          if (activeAg) {
            activeAg.setWeightForAllAnimatables(1.0);
          }
        }
      }

      // 2. Upper-Body Overlay Blending Engine (Level 2 & 3 gestures over base Listening)
      if (isUpperOverlayActive && activeUpperAg) {
        const baseAg = getAnimGroup("Listening");

        if (upperPhase === "in") {
          upperPhaseElapsed += dt;
          const blendProgress = Math.min(1.0, upperPhaseElapsed / upperBlendInSec);
          currentUpperWeight = blendProgress * upperTargetWeight;
          activeUpperAg.setWeightForAllAnimatables(currentUpperWeight);
          if (baseAg) {
            // Keep base breathing alive (never drops below 0.35)
            baseAg.setWeightForAllAnimatables(Math.max(0.35, 1.0 - currentUpperWeight * 0.45));
          }
          if (blendProgress >= 1.0) {
            upperPhase = "hold";
            upperPhaseElapsed = 0;
          }
        } else if (upperPhase === "hold") {
          upperPhaseElapsed += dt;
          activeUpperAg.setWeightForAllAnimatables(upperTargetWeight);
          if (upperPhaseElapsed >= upperHoldSec) {
            upperPhase = "out";
            upperPhaseElapsed = 0;
          }
        } else if (upperPhase === "out") {
          upperPhaseElapsed += dt;
          const blendOutProgress = Math.min(1.0, upperPhaseElapsed / upperBlendOutSec);
          currentUpperWeight = upperTargetWeight * (1.0 - blendOutProgress);
          activeUpperAg.setWeightForAllAnimatables(Math.max(0.001, currentUpperWeight));
          if (baseAg) {
            baseAg.setWeightForAllAnimatables(Math.min(1.0, 1.0 - currentUpperWeight * 0.45));
          }
          if (blendOutProgress >= 1.0) {
            activeUpperAg.stop();
            activeUpperAg.reset();
            activeUpperAg.setWeightForAllAnimatables(1.0);
            activeUpperAg = null;
            upperPhase = "idle";
            isUpperOverlayActive = false;
            if (baseAg) {
              baseAg.setWeightForAllAnimatables(1.0);
            }
            const cb = upperOnComplete;
            upperOnComplete = null;
            cb?.();
          }
        }
      }

      // 3. Level 1 Micro Motion smoothing (Head orientation & arm rest variation)
      const headSmooth = Math.min(1.0, dt * 3.2);
      currentHeadYaw += (targetHeadYaw - currentHeadYaw) * headSmooth;
      currentHeadPitch += (targetHeadPitch - currentHeadPitch) * headSmooth;

      // Neutral resting arm posture transitions (subtle asymmetry)
      if (!isUpperOverlayActive) {
        armRestStanceTimer -= dt;
        if (armRestStanceTimer <= 0) {
          armRestStanceTimer = 3.5 + Math.random() * 2.0;
          armRestStanceIndex = (armRestStanceIndex + 1) % 3;
          if (armRestStanceIndex === 0) {
            targetArmRestOffsetR = 0;
            targetArmRestOffsetL = 0;
          } else if (armRestStanceIndex === 1) {
            targetArmRestOffsetR = 0.05; // slight relaxed elbow bend on right
            targetArmRestOffsetL = -0.02;
          } else {
            targetArmRestOffsetR = -0.02;
            targetArmRestOffsetL = 0.04;
          }
        }
        const armSmooth = Math.min(1.0, dt * 2.0);
        currentArmRestOffsetR += (targetArmRestOffsetR - currentArmRestOffsetR) * armSmooth;
        currentArmRestOffsetL += (targetArmRestOffsetL - currentArmRestOffsetL) * armSmooth;
      }

      // 4. Non-looping animation end countdown fallback
      if (activeEndTimer > 0) {
        activeEndTimer -= dt;
        if (activeEndTimer <= 0) {
          activeEndTimer = 0;
          const cb = activeEndCallback;
          activeEndCallback = null;
          cb?.();
        }
      }

      // 5. Locomotion waypoint navigation
      if (isWalking && waypoints.length > 0) {
        const currentTarget = waypoints[0];
        const dx = currentTarget.x - root.position.x;
        const dz = currentTarget.z - root.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0.05) {
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - root.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          root.rotation.y += diff * Math.min(1.0, dt * 7.0);

          const step = Math.min(dist, walkSpeed * dt);
          root.position.x += (dx / dist) * step;
          root.position.z += (dz / dist) * step;
        } else {
          root.position.x = currentTarget.x;
          root.position.z = currentTarget.z;
          waypoints.shift();

          if (waypoints.length === 0) {
            isWalking = false;
            const cb = arrivalCb;
            const yaw = arrivalYaw;
            arrivalCb = null;
            arrivalYaw = null;
            if (yaw !== null) {
              root.rotation.y = yaw;
            }
            controller.walkToStop();
            cb?.();
          }
        }
      }

      // 6. Smooth yaw interpolation during Turn
      if (isTurning && turnTargetYaw !== null) {
        let diff = turnTargetYaw - root.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        root.rotation.y += diff * Math.min(1.0, dt * 4.0);
      }
    },

    dispose: () => {
      disposed = true;
      if (renderObserver) {
        scene.onBeforeRenderObservable.remove(renderObserver);
        renderObserver = null;
      }
      for (const ag of animGroupsMap.values()) {
        ag.stop();
        ag.dispose();
      }
      for (const uag of upperAnimGroupsMap.values()) {
        uag.stop();
        uag.dispose();
      }
      animGroupsMap.clear();
      upperAnimGroupsMap.clear();
      root.dispose();
    },
  };

  // Asynchronously load the validated Awang GLB
  SceneLoader.ImportMeshAsync("", GLB_DIR, GLB_FILE, scene)
    .then((result) => {
      if (disposed) {
        result.animationGroups.forEach((ag) => ag.dispose());
        result.meshes.forEach((m) => m.dispose());
        return;
      }

      const gltfRoot = result.meshes[0];
      if (gltfRoot) {
        gltfRoot.parent = root;
        gltfRoot.position.set(0, GLTF_FEET_ELEVATION_Y, 0);
      }

      // Configure instructor material: embedded 2K PBR textures
      const awangMesh =
        result.meshes.find((m) => m.name === "awangTextured") || result.meshes[1];
      if (awangMesh) {
        if (GLB_FILE.includes("v2")) {
          if (awangMesh.material) {
            awangMesh.material.backFaceCulling = false;
          }
        } else {
          const stdMat = new StandardMaterial("awangInstructorMat", scene);
          const tex = new Texture(`${import.meta.env.BASE_URL}assets/awang/awang-diffuse.png`, scene, false, false);
          stdMat.diffuseTexture = tex;
          stdMat.specularColor = new Color3(0.08, 0.08, 0.08);
          stdMat.ambientColor = new Color3(0.4, 0.4, 0.4);
          stdMat.backFaceCulling = false;
          awangMesh.material = stdMat;
        }
      }

      // Cache bone references for Level 1 Micro Motion
      if (result.skeletons && result.skeletons.length > 0) {
        const skel = result.skeletons[0];
        headBone = skel.bones.find((b) => b.name === "head") ?? null;
        neckBone = skel.bones.find((b) => b.name === "neck") ?? null;
        chestBone = skel.bones.find((b) => b.name === "chest") ?? null;
        spineBone = skel.bones.find((b) => b.name === "spine") ?? null;
        upperArmL = skel.bones.find((b) => b.name === "upper_arm.L") ?? null;
        upperArmR = skel.bones.find((b) => b.name === "upper_arm.R") ?? null;
        forearmL = skel.bones.find((b) => b.name === "forearm.L") ?? null;
        forearmR = skel.bones.find((b) => b.name === "forearm.R") ?? null;
      }

      // Index source animation groups
      for (const ag of result.animationGroups) {
        animGroupsMap.set(ag.name, ag);
        animGroupsMap.set(ag.name.toLowerCase(), ag);
        ag.speedRatio = 1.0;
        ag.stop();
      }

      // Construct Upper-Body Masked Animation Groups for SimpleGesture, Present, Point
      const gestureSources = ["SimpleGesture", "Present", "Point"];
      for (const name of gestureSources) {
        const srcAg = animGroupsMap.get(name);
        if (srcAg) {
          const upperAg = new AnimationGroup(`Upper_${srcAg.name}`, scene);
          for (const ta of srcAg.targetedAnimations) {
            const targetName = ta.target?.name || "";
            if (UPPER_BODY_BONES.has(targetName)) {
              upperAg.addTargetedAnimation(ta.animation, ta.target);
            }
          }
          upperAg.speedRatio = 1.0;
          upperAg.stop();
          upperAnimGroupsMap.set(name.toLowerCase(), upperAg);
        }
      }

      // Register Level 1 Micro Motion Procedural Render Observer
      // Applies subtle breathing, torso sway, and restrained head attention every frame
      renderObserver = scene.onBeforeRenderObservable.add(() => {
        if (!isLoaded || disposed) return;

        if (headBone && chestBone && spineBone) {
          // Subtle chest breathing (cycle ~3.8s, ~0.85 deg pitch)
          const breathPitch = Math.sin(microMotionTime * 1.65) * 0.014;
          chestBone.rotate(Vector3.Right(), breathPitch, Space.LOCAL);
          spineBone.rotate(Vector3.Right(), breathPitch * 0.5, Space.LOCAL);

          // Subtle torso sway / weight transfer (cycle ~5.2s, ~0.7 deg roll)
          const swayRoll = Math.sin(microMotionTime * 1.20) * 0.012;
          spineBone.rotate(Vector3.Forward(), swayRoll, Space.LOCAL);

          // Subtle conversational nods on head and neck (cycle ~2.6s, ~1.3 deg)
          const nodPitch = Math.sin(microMotionTime * 2.4) * 0.022;
          headBone.rotate(Vector3.Right(), currentHeadPitch + nodPitch, Space.LOCAL);
          headBone.rotate(Vector3.Up(), currentHeadYaw, Space.LOCAL);

          if (neckBone) {
            neckBone.rotate(Vector3.Right(), (currentHeadPitch + nodPitch) * 0.35, Space.LOCAL);
            neckBone.rotate(Vector3.Up(), currentHeadYaw * 0.35, Space.LOCAL);
          }

          // Neutral resting arm posture variation (avoids identical rest pose)
          if (!isUpperOverlayActive && upperArmR && upperArmL) {
            upperArmR.rotate(Vector3.Forward(), currentArmRestOffsetR, Space.LOCAL);
            upperArmL.rotate(Vector3.Forward(), currentArmRestOffsetL, Space.LOCAL);
            if (forearmR && forearmL) {
              forearmR.rotate(Vector3.Forward(), currentArmRestOffsetR * 0.7, Space.LOCAL);
              forearmL.rotate(Vector3.Forward(), currentArmRestOffsetL * 0.7, Space.LOCAL);
            }
          }
        }
      });

      isLoaded = true;

      // Start with Listening base stance
      controller.idle();

      // Execute queued action
      if (queuedAction) {
        const action = queuedAction;
        queuedAction = null;
        action();
      }
    })
    .catch((err) => {
      console.error("[AwangController] Failed to load awang-v2-rigged-fixed.glb:", err);
    });

  return controller;
};
