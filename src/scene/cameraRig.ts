import { Vector3 } from "@babylonjs/core";
import type { UniversalCamera } from "@babylonjs/core";
import type { CameraShotId } from "../types/lesson";

const shots: Record<CameraShotId, { position: Vector3; target: Vector3 }> = {
  wide: {
    position: new Vector3(0, 2.15, 6.4),
    target: new Vector3(0.15, 1.35, 0),
  },
  instructor: {
    position: new Vector3(0.35, 1.7, 3.35),
    target: new Vector3(1.35, 1.45, 0.2),
  },
  board: {
    position: new Vector3(-0.85, 1.66, 2.35),
    target: new Vector3(-0.85, 1.52, -1.82),
  },
};

export class CameraRig {
  private camera: UniversalCamera;
  private goalPosition: Vector3;
  private goalTarget: Vector3;

  constructor(camera: UniversalCamera) {
    this.camera = camera;
    this.goalPosition = shots.wide.position.clone();
    this.goalTarget = shots.wide.target.clone();
    camera.position.copyFrom(this.goalPosition);
    camera.setTarget(this.goalTarget);
  }

  goTo(shot: CameraShotId): void {
    this.goalPosition = shots[shot].position.clone();
    this.goalTarget = shots[shot].target.clone();
  }

  update(): void {
    Vector3.LerpToRef(
      this.camera.position,
      this.goalPosition,
      0.045,
      this.camera.position,
    );
    const currentTarget = this.camera.getTarget();
    Vector3.LerpToRef(currentTarget, this.goalTarget, 0.045, currentTarget);
    this.camera.setTarget(currentTarget);
  }
}
