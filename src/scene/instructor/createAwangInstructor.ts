import "@babylonjs/loaders/glTF";
import {
  AnimationGroup,
  Color3,
  SceneLoader,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import type { Scene } from "@babylonjs/core";
import type {
  AwangAnimationName,
  AwangController,
  AwangPose,
  CreateAwangInstructor,
} from "./types";

const GLB_DIR = "/assets/awang/";
const GLB_FILE = "awang-rigged.glb";

// Default instructor spot in the classroom
const DEFAULT_INSTRUCTOR_POS = new Vector3(1.55, 0, 0.35);
// Slightly angled towards the audience / instructor camera
const DEFAULT_INSTRUCTOR_YAW = -0.25;

// Feet offset: awang mesh bounds min.y is ~ -0.9515, so elevate gltf root to align soles with y=0 floor
const GLTF_FEET_ELEVATION_Y = 0.9515;

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
  let isLoaded = false;
  let disposed = false;

  let activeAg: AnimationGroup | null = null;
  let activeAgName: string | null = null;

  // Waypoint locomotion state
  let waypoints: Vector3[] = [];
  let walkSpeed = 1.1;
  let isWalking = false;
  let arrivalCb: (() => void) | null = null;
  let arrivalYaw: number | null = null;

  // Turn state
  let isTurning = false;
  let turnTargetYaw: number | null = null;

  // Queue initial or early action before asset finishes loading
  let queuedAction: (() => void) | null = () => {
    controller.idle();
  };

  let activeEndTimer = 0;
  let activeEndCallback: (() => void) | null = null;
  let lastElapsedSec = 0;

  function resolveCanonicalName(name: string): string {
    const key = name.trim().toLowerCase();
    return NAME_CANONICAL_MAP[key] ?? name;
  }

  function getAnimGroup(name: string): AnimationGroup | null {
    const canonical = resolveCanonicalName(name);
    return animGroupsMap.get(canonical) ?? animGroupsMap.get(name) ?? null;
  }

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

    if (activeAg === targetAg && targetAg.isPlaying) {
      return targetAg;
    }

    // Stop all other animations and reset bones to prevent matrix conflict
    for (const ag of animGroupsMap.values()) {
      if (ag !== targetAg && ag.isPlaying) {
        ag.stop();
        ag.reset();
      }
    }

    activeAg = targetAg;
    activeAgName = targetAg.name;

    // Always clear any previous end callback and timer
    activeEndCallback = null;
    activeEndTimer = 0;

    if (onAnimationEnd) {
      const durationSec = Math.max(
        0.1,
        (targetAg.to - targetAg.from) / 60 / (targetAg.speedRatio || 1),
      );
      activeEndTimer = durationSec;
      activeEndCallback = () => {
        activeEndCallback = null;
        activeEndTimer = 0;
        onAnimationEnd();
      };
    }

    targetAg.play(loop);
    return targetAg;
  }

  const controller: AwangController = {
    root,

    get isLoaded() {
      return isLoaded;
    },

    get activeAnimationName() {
      return activeAgName;
    },

    get animationGroups() {
      return animGroupsMap;
    },

    idle: () => {
      isWalking = false;
      waypoints = [];
      playAnimation("Idle", true, 0.3);
    },

    walk: () => {
      playAnimation("Walk", true, 0.25);
    },

    walkToStop: (onComplete?: () => void) => {
      isWalking = false;
      waypoints = [];
      playAnimation("Walk-to-stop", false, 0.2, () => {
        controller.idle();
        onComplete?.();
      });
    },

    turn: (targetAngleRad?: number) => {
      if (targetAngleRad !== undefined) {
        isTurning = true;
        turnTargetYaw = targetAngleRad;
      }
      playAnimation("Turn", false, 0.25, () => {
        isTurning = false;
        turnTargetYaw = null;
        controller.idle();
      });
    },

    present: (loop = true) => {
      playAnimation(
        "Present",
        loop,
        0.3,
        loop ? undefined : () => controller.idle(),
      );
    },

    point: (loop = true) => {
      playAnimation(
        "Point",
        loop,
        0.3,
        loop ? undefined : () => controller.idle(),
      );
    },

    simpleGesture: (loop = true) => {
      playAnimation(
        "SimpleGesture",
        loop,
        0.3,
        loop ? undefined : () => controller.idle(),
      );
    },

    listening: (loop = true) => {
      playAnimation(
        "Listening",
        loop,
        0.3,
        loop ? undefined : () => controller.idle(),
      );
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
      root.position.copyFrom(position);
      if (yaw !== undefined) {
        root.rotation.y = yaw;
      }
    },

    update: (elapsedSec: number) => {
      const dt = Math.max(0.001, Math.min(0.1, elapsedSec - lastElapsedSec));
      lastElapsedSec = elapsedSec;

      // 1. Non-looping animation end countdown fallback
      if (activeEndTimer > 0) {
        activeEndTimer -= dt;
        if (activeEndTimer <= 0) {
          activeEndTimer = 0;
          const cb = activeEndCallback;
          activeEndCallback = null;
          cb?.();
        }
      }

      // 2. Locomotion waypoint navigation
      if (isWalking && waypoints.length > 0) {
        const currentTarget = waypoints[0];
        const dx = currentTarget.x - root.position.x;
        const dz = currentTarget.z - root.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0.05) {
          // Desired heading angle
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - root.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          root.rotation.y += diff * Math.min(1.0, dt * 7.0);

          // Move along horizontal direction
          const step = Math.min(dist, walkSpeed * dt);
          root.position.x += (dx / dist) * step;
          root.position.z += (dz / dist) * step;
        } else {
          // Reached waypoint
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

      // 3. Smooth yaw interpolation during Turn
      if (isTurning && turnTargetYaw !== null) {
        let diff = turnTargetYaw - root.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        root.rotation.y += diff * Math.min(1.0, dt * 4.0);
      }
    },

    dispose: () => {
      disposed = true;
      for (const ag of animGroupsMap.values()) {
        ag.stop();
        ag.dispose();
      }
      animGroupsMap.clear();
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
        // Elevate feet to sit on floor
        gltfRoot.position.set(0, GLTF_FEET_ELEVATION_Y, 0);
      }

      // Configure instructor material: use StandardMaterial with diffuse texture for rich color and contrast
      const awangMesh =
        result.meshes.find((m) => m.name === "awangTextured") || result.meshes[1];
      if (awangMesh) {
        const stdMat = new StandardMaterial("awangInstructorMat", scene);
        const tex = new Texture("/assets/awang/awang-diffuse.png", scene, false, false);
        stdMat.diffuseTexture = tex;
        stdMat.specularColor = new Color3(0.08, 0.08, 0.08);
        stdMat.ambientColor = new Color3(0.4, 0.4, 0.4);
        stdMat.backFaceCulling = false;
        awangMesh.material = stdMat;
      }

      for (const ag of result.animationGroups) {
        animGroupsMap.set(ag.name, ag);
        animGroupsMap.set(ag.name.toLowerCase(), ag);
        ag.speedRatio = 1.0;
        ag.stop();
      }

      isLoaded = true;

      // Execute queued action (defaults to idle)
      if (queuedAction) {
        const action = queuedAction;
        queuedAction = null;
        action();
      }
    })
    .catch((err) => {
      console.error("[AwangController] Failed to load awang-rigged.glb:", err);
    });

  return controller;
};
