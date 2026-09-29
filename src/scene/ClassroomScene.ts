import {
  Color3,
  DynamicTexture,
  Engine,
  MeshBuilder,
  Scene,
  StandardMaterial,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import type { BoardContent, CameraShotId } from "../types/lesson";
import { CameraRig } from "./cameraRig";
import { buildClassroom, type ClassroomEnvironment } from "./classroom";
import { LessonChoreographer } from "./instructor/choreography";
import { createAwangInstructor } from "./instructor/createAwangInstructor";
import type { CreateInstructor, InstructorHandle } from "./instructor/types";
import { drawBoard } from "./presentationBoard";

export type SceneCommand = {
  camera: CameraShotId;
  board: BoardContent;
  localSec: number;
  beatId?: string;
  moduleId?: string;
  playbackSec?: number;
  beatStartSec?: number;
  isPlaying?: boolean;
  questionOpen?: boolean;
};

export class ClassroomScene {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly rig: CameraRig;
  public readonly environment: ClassroomEnvironment;
  public readonly instructor: InstructorHandle;
  public readonly choreographer: LessonChoreographer;
  private readonly boardTexture: DynamicTexture;
  private lastBoardKey = "";
  private elapsed = 0;
  private running = false;
  private latestCommand: SceneCommand | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    createInstructor: CreateInstructor = createAwangInstructor,
    initialModuleId = "module-1",
  ) {
    this.engine = new Engine(canvas, true, { adaptToDeviceRatio: true }, true);
    this.scene = new Scene(this.engine);
    this.scene.skipPointerMovePicking = true;

    const camera = new UniversalCamera("camera", new Vector3(0, 2.15, 6.4), this.scene);
    camera.minZ = 0.1;
    camera.inputs.clear();
    this.rig = new CameraRig(camera);

    this.environment = buildClassroom(this.scene, initialModuleId);
    this.instructor = createInstructor(this.scene);
    this.choreographer = new LessonChoreographer(this.instructor);

    const board = MeshBuilder.CreatePlane(
      "presentationBoard",
      { width: 3.2, height: 1.8 },
      this.scene,
    );
    board.position = new Vector3(-0.85, 1.92, -1.82);
    this.boardTexture = new DynamicTexture(
      "boardTex",
      { width: 1280, height: 720 },
      this.scene,
      true,
    );
    this.boardTexture.uScale = -1;
    this.boardTexture.vScale = 1;
    this.boardTexture.uOffset = 1;
    this.boardTexture.vOffset = 0;
    const boardMat = new StandardMaterial("boardMat", this.scene);
    boardMat.diffuseTexture = this.boardTexture;
    boardMat.emissiveTexture = this.boardTexture;
    boardMat.emissiveColor = new Color3(1, 1, 1);
    boardMat.disableLighting = true;
    boardMat.backFaceCulling = false;
    boardMat.specularColor.set(0, 0, 0);
    board.material = boardMat;

    window.addEventListener("resize", this.onResize);
  }

  apply(command: SceneCommand): void {
    this.latestCommand = command;
    this.rig.goTo(command.camera);

    if (command.moduleId) {
      this.environment.setModule(command.moduleId);
    }

    this.choreographer.update(0, {
      beatId: command.beatId,
      moduleId: command.moduleId,
      camera: command.camera,
      playbackSec: command.playbackSec ?? command.localSec,
      beatStartSec: command.beatStartSec ?? 0,
      isPlaying: command.isPlaying ?? true,
      questionOpen: command.questionOpen,
    });

    const reveal =
      command.board.kind === "layers"
        ? Math.min(
            command.board.layers.length,
            Math.max(1, Math.floor(command.localSec / 3.2) + 1),
          )
        : 0;
    const key = `${JSON.stringify(command.board)}:${reveal}`;
    if (key === this.lastBoardKey) {
      return;
    }
    this.lastBoardKey = key;
    const ctx = this.boardTexture.getContext() as CanvasRenderingContext2D;
    drawBoard(ctx, command.board, command.localSec);
    this.boardTexture.update();
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.engine.runRenderLoop(() => {
      const dt = this.engine.getDeltaTime() / 1000;
      this.elapsed += dt;
      this.environment.update(dt);
      if (this.latestCommand) {
        this.choreographer.update(dt, {
          beatId: this.latestCommand.beatId,
          moduleId: this.latestCommand.moduleId,
          camera: this.latestCommand.camera,
          playbackSec: this.latestCommand.playbackSec ?? this.latestCommand.localSec,
          beatStartSec: this.latestCommand.beatStartSec ?? 0,
          isPlaying: this.latestCommand.isPlaying ?? true,
          questionOpen: this.latestCommand.questionOpen,
        });
      }
      this.instructor.update(this.elapsed);
      this.rig.update();
      this.scene.render();
    });
  }

  dispose(): void {
    this.running = false;
    window.removeEventListener("resize", this.onResize);
    this.choreographer.reset();
    this.instructor.dispose();
    this.environment.dispose();
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }

  private onResize = (): void => {
    this.engine.resize();
  };
}
