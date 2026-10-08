import type { AnimationGroup, Scene, TransformNode, Vector3 } from "@babylonjs/core";

export type AwangAnimationName =
  | "Idle"
  | "Walk"
  | "Walk-to-stop"
  | "Turn"
  | "Present"
  | "Point"
  | "SimpleGesture"
  | "Listening";

export type AwangPose =
  | "idle"
  | "walk"
  | "walk-to-stop"
  | "turn"
  | "present"
  | "point"
  | "simpleGesture"
  | "listening";

export type InstructorAnimState =
  | "IDLE"
  | "LISTENING"
  | "PRESENTING"
  | "POINTING"
  | "GESTURING"
  | "TURNING"
  | "WALKING";

export interface InstructorHandle {
  root: TransformNode;
  update: (elapsedSec: number) => void;
  dispose: () => void;

  // Optional methods provided by full character controllers (e.g. AwangController)
  readonly isLoaded?: boolean;
  readonly activeAnimationName?: string | null;
  readonly animState?: InstructorAnimState;
  idle?: () => void;
  walk?: () => void;
  walkToStop?: (onComplete?: () => void) => void;
  turn?: (targetAngleRad?: number, onComplete?: () => void) => void;
  present?: (loop?: boolean, onComplete?: () => void) => void;
  point?: (loop?: boolean, onComplete?: () => void) => void;
  simpleGesture?: (loop?: boolean, onComplete?: () => void) => void;
  listening?: (loop?: boolean) => void;
  walkTo?: (
    target: Vector3,
    speed?: number,
    onArrival?: () => void,
    targetYaw?: number,
  ) => void;
  stopWalking?: () => void;
  teleport?: (position: Vector3, yaw?: number) => void;
  setLookTarget?: (target: "board" | "learner" | "neutral") => void;
  conversationalGesture?: (variant?: "quick" | "nod" | "palm", onComplete?: () => void) => void;
  playAnimation?: (
    name: AwangPose | AwangAnimationName | string,
    loop?: boolean,
    crossFadeSec?: number,
    onAnimationEnd?: () => void,
  ) => AnimationGroup | null;
}

export interface AwangController extends InstructorHandle {
  readonly isLoaded: boolean;
  readonly activeAnimationName: string | null;
  readonly animationGroups: ReadonlyMap<string, AnimationGroup>;

  idle: () => void;
  walk: () => void;
  walkToStop: (onComplete?: () => void) => void;
  turn: (targetAngleRad?: number, onComplete?: () => void) => void;
  present: (loop?: boolean, onComplete?: () => void) => void;
  point: (loop?: boolean, onComplete?: () => void) => void;
  simpleGesture: (loop?: boolean, onComplete?: () => void) => void;
  listening: (loop?: boolean) => void;
  setLookTarget: (target: "board" | "learner" | "neutral") => void;
  conversationalGesture: (variant?: "quick" | "nod" | "palm", onComplete?: () => void) => void;

  playAnimation: (
    name: AwangPose | AwangAnimationName | string,
    loop?: boolean,
    crossFadeSec?: number,
    onAnimationEnd?: () => void,
  ) => AnimationGroup | null;

  walkTo: (
    target: Vector3,
    speed?: number,
    onArrival?: () => void,
    targetYaw?: number,
  ) => void;
  stopWalking: () => void;
  teleport: (position: Vector3, yaw?: number) => void;
}

export type CreateInstructor = (scene: Scene) => InstructorHandle;
export type CreateAwangInstructor = (scene: Scene) => AwangController;
