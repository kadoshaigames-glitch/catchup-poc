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

export interface InstructorHandle {
  root: TransformNode;
  update: (elapsedSec: number) => void;
  dispose: () => void;

  // Optional methods provided by full character controllers (e.g. AwangController)
  readonly isLoaded?: boolean;
  readonly activeAnimationName?: string | null;
  idle?: () => void;
  walk?: () => void;
  walkToStop?: (onComplete?: () => void) => void;
  turn?: (targetAngleRad?: number) => void;
  present?: (loop?: boolean) => void;
  point?: (loop?: boolean) => void;
  simpleGesture?: (loop?: boolean) => void;
  listening?: (loop?: boolean) => void;
  walkTo?: (
    target: Vector3,
    speed?: number,
    onArrival?: () => void,
    targetYaw?: number,
  ) => void;
  stopWalking?: () => void;
  teleport?: (position: Vector3, yaw?: number) => void;
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
  turn: (targetAngleRad?: number) => void;
  present: (loop?: boolean) => void;
  point: (loop?: boolean) => void;
  simpleGesture: (loop?: boolean) => void;
  listening: (loop?: boolean) => void;

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
