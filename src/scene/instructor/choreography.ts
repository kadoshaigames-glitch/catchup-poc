import { Vector3 } from "@babylonjs/core";
import type { CameraShotId } from "../../types/lesson";
import type { InstructorHandle } from "./types";

export interface ChoreographyState {
  beatId?: string;
  moduleId?: string;
  camera: CameraShotId;
  playbackSec: number;
  beatStartSec: number;
  isPlaying: boolean;
  questionOpen?: boolean;
}

// Stage landmark positions
const PODIUM_POS = new Vector3(1.55, 0, 0.35);
const PODIUM_YAW = -0.25;

const BOARD_POS = new Vector3(0.45, 0, 0.25);
const BOARD_YAW = 0.2;

const MID_STAGE_POS = new Vector3(0.9, 0, 0.3);
const MID_STAGE_YAW = -0.1;

export class LessonChoreographer {
  private readonly instructor: InstructorHandle;
  private lastBeatId = "";
  private lastPlaybackSec = 0;
  private lastSubAction = "";

  constructor(instructor: InstructorHandle) {
    this.instructor = instructor;
  }

  public update(_dt: number, state: ChoreographyState): void {
    if (!this.instructor.isLoaded) {
      return;
    }

    const {
      beatId = "",
      moduleId = "",
      camera,
      playbackSec,
      beatStartSec,
      questionOpen = false,
    } = state;

    // Detect non-linear time jump (seeking or chapter scrubbing)
    const timeDelta = playbackSec - this.lastPlaybackSec;
    const isJump = Math.abs(timeDelta) > 1.5 || (this.lastBeatId !== "" && beatId !== this.lastBeatId && timeDelta < 0);
    this.lastPlaybackSec = playbackSec;

    const beatLocalSec = Math.max(0, playbackSec - beatStartSec);
    const beatChanged = beatId !== this.lastBeatId;

    if (beatChanged) {
      this.lastBeatId = beatId;
      this.lastSubAction = "";
    }

    // Interactive Question: Awang attentively listens to the learner
    if (questionOpen) {
      if (isJump) {
        this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
      }
      if (this.lastSubAction !== "question-listen") {
        this.lastSubAction = "question-listen";
        this.instructor.stopWalking?.();
        this.instructor.listening?.(true);
      }
      return;
    }

    // If module is Module 1 (or l1-m1), run the proof-of-concept sequence
    if (moduleId === "module-1" || moduleId === "l1-m1") {
      this.handleModuleOne(beatId, beatLocalSec, isJump, camera);
      return;
    }

    // Default reusable choreography for any other module
    this.handleGenericModule(camera, beatChanged);
  }

  private handleModuleOne(
    beatId: string,
    localSec: number,
    isJump: boolean,
    camera: CameraShotId,
  ): void {
    switch (beatId) {
      // 1. Welcome & Overview (0s - 45s, camera: wide)
      case "m1-intro": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
          this.instructor.idle?.();
          this.lastSubAction = "intro-idle";
        }
        if (localSec < 3) {
          if (this.lastSubAction !== "intro-idle") {
            this.lastSubAction = "intro-idle";
            this.instructor.idle?.();
          }
        } else if (localSec < 35) {
          if (this.lastSubAction !== "intro-gesture") {
            this.lastSubAction = "intro-gesture";
            this.instructor.simpleGesture?.(true);
          }
        } else {
          if (this.lastSubAction !== "intro-idle-end") {
            this.lastSubAction = "intro-idle-end";
            this.instructor.idle?.();
          }
        }
        break;
      }

      // 2. Core Definitions (45s - 135s, camera: board)
      // Board explanation: walkTo board -> walkToStop -> turn -> point/present
      case "m1-definitions": {
        if (isJump) {
          this.instructor.teleport?.(BOARD_POS, BOARD_YAW);
          this.instructor.point?.(true);
          this.lastSubAction = "def-pointing";
          return;
        }

        if (this.lastSubAction === "") {
          this.lastSubAction = "def-walking";
          this.instructor.walkTo?.(BOARD_POS, 1.1, () => {
            this.instructor.turn?.(BOARD_YAW);
            this.instructor.point?.(true);
            this.lastSubAction = "def-pointing";
          }, BOARD_YAW);
        } else if (localSec >= 45 && this.lastSubAction === "def-pointing") {
          // Mid-explanation: alternate to conversational gesture
          this.lastSubAction = "def-gesture";
          this.instructor.simpleGesture?.(true);
        }
        break;
      }

      // 3. How Concepts Relate / Layers (135s - 185s, camera: board)
      case "m1-layers": {
        if (isJump) {
          this.instructor.teleport?.(BOARD_POS, BOARD_YAW);
          this.instructor.point?.(true);
          this.lastSubAction = "layers-point";
          return;
        }
        if (this.lastSubAction === "") {
          this.lastSubAction = "layers-point";
          this.instructor.point?.(true);
        } else if (localSec >= 25 && this.lastSubAction === "layers-point") {
          this.lastSubAction = "layers-gesture";
          this.instructor.simpleGesture?.(true);
        }
        break;
      }

      // 4. History Milestones (185s - 250s, camera: board)
      // After board explanation: return toward instructor position
      case "m1-history": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
          this.instructor.present?.(true);
          this.lastSubAction = "history-present";
          return;
        }

        if (this.lastSubAction === "") {
          this.lastSubAction = "history-walking";
          this.instructor.walkTo?.(PODIUM_POS, 1.1, () => {
            this.instructor.turn?.(PODIUM_YAW);
            this.instructor.present?.(true);
            this.lastSubAction = "history-present";
          }, PODIUM_YAW);
        }
        break;
      }

      // 5. Token Prediction Engine (250s - 330s, camera: board)
      // Explanation section: alternate between simpleGesture and listening
      case "m1-prediction": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
        }
        if (localSec < 25) {
          if (this.lastSubAction !== "pred-gesture-1") {
            this.lastSubAction = "pred-gesture-1";
            this.instructor.simpleGesture?.(true);
          }
        } else if (localSec < 50) {
          if (this.lastSubAction !== "pred-listen") {
            this.lastSubAction = "pred-listen";
            this.instructor.listening?.(true);
          }
        } else {
          if (this.lastSubAction !== "pred-gesture-2") {
            this.lastSubAction = "pred-gesture-2";
            this.instructor.simpleGesture?.(true);
          }
        }
        break;
      }

      // 6. Platform Selection (330s - 405s, camera: instructor)
      case "m1-platforms": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
        }
        if (localSec < 35) {
          if (this.lastSubAction !== "plat-present") {
            this.lastSubAction = "plat-present";
            this.instructor.present?.(true);
          }
        } else {
          if (this.lastSubAction !== "plat-gesture") {
            this.lastSubAction = "plat-gesture";
            this.instructor.simpleGesture?.(true);
          }
        }
        break;
      }

      // 7. CRE Framework & Temperature (405s - 490s, camera: board)
      // Later section movement variation: steps towards mid-stage to explain dial
      case "m1-cre": {
        if (isJump) {
          this.instructor.teleport?.(MID_STAGE_POS, MID_STAGE_YAW);
          this.instructor.point?.(true);
          this.lastSubAction = "cre-point";
          return;
        }
        if (this.lastSubAction === "") {
          this.lastSubAction = "cre-walking";
          this.instructor.walkTo?.(MID_STAGE_POS, 1.1, () => {
            this.instructor.turn?.(MID_STAGE_YAW);
            this.instructor.point?.(true);
            this.lastSubAction = "cre-point";
          }, MID_STAGE_YAW);
        } else if (localSec >= 40 && this.lastSubAction === "cre-point") {
          this.lastSubAction = "cre-gesture";
          this.instructor.simpleGesture?.(true);
        }
        break;
      }

      // 8. Prompt Walkthrough (490s - 550s, camera: board)
      // Return to podium position and present weak vs structured prompt
      case "m1-walkthrough": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
          this.instructor.present?.(true);
          this.lastSubAction = "walkthrough-present";
          return;
        }
        if (this.lastSubAction === "") {
          this.lastSubAction = "walkthrough-walking";
          this.instructor.walkTo?.(PODIUM_POS, 1.1, () => {
            this.instructor.turn?.(PODIUM_YAW);
            this.instructor.present?.(true);
            this.lastSubAction = "walkthrough-present";
          }, PODIUM_YAW);
        }
        break;
      }

      // 9. Knowledge Check (550s - 570s, camera: instructor)
      case "m1-check": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
        }
        if (this.lastSubAction !== "check-listening") {
          this.lastSubAction = "check-listening";
          this.instructor.listening?.(true);
        }
        break;
      }

      // 10. Key Takeaways (570s - 600s, camera: wide)
      case "m1-takeaway": {
        if (isJump) {
          this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
        }
        if (localSec < 20) {
          if (this.lastSubAction !== "takeaway-present") {
            this.lastSubAction = "takeaway-present";
            this.instructor.present?.(true);
          }
        } else {
          if (this.lastSubAction !== "takeaway-idle") {
            this.lastSubAction = "takeaway-idle";
            this.instructor.idle?.();
          }
        }
        break;
      }

      default: {
        this.handleGenericModule(camera, isJump);
        break;
      }
    }
  }

  private handleGenericModule(
    camera: CameraShotId,
    beatChanged: boolean,
  ): void {
    if (!beatChanged && this.lastSubAction !== "") {
      return;
    }

    if (camera === "board") {
      this.lastSubAction = "gen-point";
      this.instructor.point?.(true);
    } else if (camera === "instructor") {
      this.lastSubAction = "gen-present";
      this.instructor.present?.(true);
    } else {
      this.lastSubAction = "gen-idle";
      this.instructor.idle?.();
    }
  }

  public reset(): void {
    this.lastBeatId = "";
    this.lastPlaybackSec = 0;
    this.lastSubAction = "";
    this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
    this.instructor.idle?.();
  }
}
