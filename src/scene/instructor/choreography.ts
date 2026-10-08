import { Vector3 } from "@babylonjs/core";
import type { CameraShotId } from "../../types/lesson";
import type { InstructorAnimState, InstructorHandle } from "./types";

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

type GestureType = "conv_quick" | "conv_palm" | "conv_nod" | "present" | "point" | "simpleGesture";

export class LessonChoreographer {
  private readonly instructor: InstructorHandle;
  private animState: InstructorAnimState = "LISTENING";
  private lastBeatId = "";
  private lastPlaybackSec = 0;
  private lastSubAction = "";

  // 3-Level Motion Architecture
  // Level 1: Micro Motion (breathing, subtle torso sway, gentle head nods) is continuously driven by instructor
  // Level 2: Conversational Gestures (frequent, small, every 2–4 seconds)
  // Level 3: Emphasis Gestures (less frequent, every 9–14 seconds or on key beats)
  private conversationalCadenceSec = 2.2; // Next conversational trigger
  private emphasisCooldownSec = 9.0;      // Cooldown for large emphasis gestures
  private gestureActiveTimer = 0;         // Timer for active upper-body gesture
  private gestureHistory: GestureType[] = [];

  // Stage locomotion tracking
  private currentStageArea: "podium" | "board" | "mid_stage" = "podium";
  private isNavigating = false;

  constructor(instructor: InstructorHandle) {
    this.instructor = instructor;
  }

  public get currentAnimState(): InstructorAnimState {
    return this.animState;
  }

  public update(dt: number, state: ChoreographyState): void {
    if (!this.instructor.isLoaded) {
      return;
    }

    const {
      beatId = "",
      moduleId = "",
      camera,
      playbackSec,
      beatStartSec,
      isPlaying,
      questionOpen = false,
    } = state;

    // Detect non-linear time jump (seeking or chapter scrubbing)
    const timeDelta = playbackSec - this.lastPlaybackSec;
    const isJump =
      Math.abs(timeDelta) > 1.5 ||
      (this.lastBeatId !== "" && beatId !== this.lastBeatId && timeDelta < 0);
    this.lastPlaybackSec = playbackSec;

    const beatLocalSec = Math.max(0, playbackSec - beatStartSec);
    const beatChanged = beatId !== this.lastBeatId;

    if (beatChanged) {
      this.lastBeatId = beatId;
      this.lastSubAction = "";
      this.conversationalCadenceSec = 1.4 + Math.random() * 0.8;
      // Allow emphasis gesture at start of new beat
      this.emphasisCooldownSec = 0.5;
    }

    // 1. Interactive Question Check: Awang attentively listens to the learner
    if (questionOpen) {
      if (isJump) {
        this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
        this.currentStageArea = "podium";
      }
      if (this.animState !== "LISTENING" || this.lastSubAction !== "question-listen") {
        this.lastSubAction = "question-listen";
        this.isNavigating = false;
        this.instructor.stopWalking?.();
        this.animState = "LISTENING";
        this.instructor.listening?.(true);
        this.instructor.setLookTarget?.("learner");
      }
      return;
    }

    // 2. Pause Handling: Transition cleanly to neutral Listening; freeze cadence timers
    // Base micro-motion continues breathing naturally
    if (!isPlaying) {
      if (
        this.animState !== "LISTENING" &&
        this.animState !== "WALKING" &&
        this.animState !== "TURNING"
      ) {
        this.animState = "LISTENING";
        this.gestureActiveTimer = 0;
        this.instructor.idle?.();
        this.instructor.setLookTarget?.("learner");
      }
      return;
    }

    // 3. Stage Navigation / Movement Routing (Module 1 specific landmarks + generic handling)
    if (moduleId === "module-1" || moduleId === "l1-m1") {
      this.routeModuleOneMovement(beatId, isJump, beatLocalSec);
    } else {
      this.routeGenericModuleMovement(camera, beatChanged, isJump);
    }

    // If currently walking or turning, do not trigger upper-body gestures
    if (this.isNavigating || this.animState === "WALKING" || this.animState === "TURNING") {
      return;
    }

    // Update look direction based on camera context
    if (camera === "board") {
      this.instructor.setLookTarget?.("board");
    } else if (this.gestureActiveTimer <= 0) {
      this.instructor.setLookTarget?.("learner");
    }

    // 4. Teaching Body Language Engine (Three Levels of Movement)
    this.updateNaturalTeachingRhythm(dt, camera, beatId);
  }

  /**
   * Evaluates landmark walking for Module 1.
   */
  private routeModuleOneMovement(
    beatId: string,
    isJump: boolean,
    _localSec: number,
  ): void {
    switch (beatId) {
      // 1. Welcome (podium)
      case "m1-intro": {
        if (isJump || this.currentStageArea !== "podium") {
          this.moveToStagePosition(PODIUM_POS, PODIUM_YAW, "podium", isJump);
        }
        break;
      }

      // 2. Core Definitions (walks to board)
      case "m1-definitions":
      case "m1-layers": {
        if (isJump || (this.currentStageArea !== "board" && !this.isNavigating)) {
          this.moveToStagePosition(BOARD_POS, BOARD_YAW, "board", isJump);
        }
        break;
      }

      // 4. History Milestones (returns to podium)
      case "m1-history":
      case "m1-prediction":
      case "m1-platforms": {
        if (isJump || (this.currentStageArea !== "podium" && !this.isNavigating)) {
          this.moveToStagePosition(PODIUM_POS, PODIUM_YAW, "podium", isJump);
        }
        break;
      }

      // 7. CRE Framework & Temperature (steps to mid-stage)
      case "m1-cre": {
        if (isJump || (this.currentStageArea !== "mid_stage" && !this.isNavigating)) {
          this.moveToStagePosition(MID_STAGE_POS, MID_STAGE_YAW, "mid_stage", isJump);
        }
        break;
      }

      // 8. Prompt Walkthrough & 10. Takeaways (returns to podium)
      case "m1-walkthrough":
      case "m1-check":
      case "m1-takeaway": {
        if (isJump || (this.currentStageArea !== "podium" && !this.isNavigating)) {
          this.moveToStagePosition(PODIUM_POS, PODIUM_YAW, "podium", isJump);
        }
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Shared stage navigation for Modules 2 through 6.
   */
  private routeGenericModuleMovement(
    camera: CameraShotId,
    _beatChanged: boolean,
    isJump: boolean,
  ): void {
    if (camera === "board") {
      if (this.currentStageArea !== "board" && !this.isNavigating) {
        this.moveToStagePosition(BOARD_POS, BOARD_YAW, "board", isJump);
      }
    } else if (camera === "instructor" || camera === "wide") {
      if (this.currentStageArea !== "podium" && !this.isNavigating) {
        this.moveToStagePosition(PODIUM_POS, PODIUM_YAW, "podium", isJump);
      }
    }
  }

  /**
   * Helper to perform smooth walk or instant jump to a landmark.
   */
  private moveToStagePosition(
    targetPos: Vector3,
    targetYaw: number,
    area: "podium" | "board" | "mid_stage",
    instant: boolean,
  ): void {
    if (instant) {
      this.isNavigating = false;
      this.currentStageArea = area;
      this.instructor.teleport?.(targetPos, targetYaw);
      this.animState = "LISTENING";
      this.instructor.listening?.(true);
      return;
    }

    this.isNavigating = true;
    this.animState = "WALKING";
    this.instructor.walkTo?.(
      targetPos,
      1.1,
      () => {
        this.animState = "TURNING";
        this.instructor.turn?.(targetYaw, () => {
          this.currentStageArea = area;
          this.isNavigating = false;
          this.animState = "LISTENING";
          this.instructor.idle?.();
          this.conversationalCadenceSec = 1.6;
        });
      },
      targetYaw,
    );
  }

  /**
   * Natural Teaching Rhythm:
   * Level 1 (micro-motion) runs continuously.
   * Level 2 (conversational gestures) triggers every 2–4 seconds.
   * Level 3 (emphasis gestures) triggers every 9–14 seconds or on key beats.
   * Eliminates dead stillness while preventing repetitive robotic cycles.
   */
  private updateNaturalTeachingRhythm(
    dt: number,
    camera: CameraShotId,
    beatId: string,
  ): void {
    // 1. Active gesture timer countdown
    if (this.gestureActiveTimer > 0) {
      this.gestureActiveTimer -= dt;
      if (this.gestureActiveTimer <= 0) {
        this.gestureActiveTimer = 0;
        this.animState = "LISTENING";
      }
    }

    this.emphasisCooldownSec -= dt;
    this.conversationalCadenceSec -= dt;

    // Trigger next visible motion event when cadence expires
    if (this.conversationalCadenceSec <= 0 && this.gestureActiveTimer <= 0) {
      this.triggerNextNaturalMotion(camera, beatId);
    }
  }

  /**
   * Determines whether to fire a Level 2 conversational gesture or Level 3 emphasis gesture.
   */
  private triggerNextNaturalMotion(
    camera: CameraShotId,
    beatId: string,
  ): void {
    const isBoardFocus =
      camera === "board" || this.currentStageArea === "board";
    const isConceptBeat =
      beatId.includes("intro") ||
      beatId.includes("welcome") ||
      beatId.includes("summary") ||
      beatId.includes("takeaway") ||
      beatId.includes("framework");

    // Level 3 Emphasis Gestures: triggered every 9–14 seconds or at concept transitions
    const canDoEmphasis = this.emphasisCooldownSec <= 0 || (isConceptBeat && this.lastGestureType !== "present");

    if (canDoEmphasis) {
      let chosenEmphasis: "present" | "point" | "simpleGesture";

      if (isBoardFocus && this.lastGestureType !== "point") {
        chosenEmphasis = "point";
      } else if (isConceptBeat && this.lastGestureType !== "present") {
        chosenEmphasis = "present";
      } else {
        // Controlled variation avoiding repetitive A-B-A-C loops
        const recentEmphasis = this.gestureHistory.filter(
          (g) => g === "present" || g === "point" || g === "simpleGesture",
        );
        const lastEmph = recentEmphasis[recentEmphasis.length - 1];

        if (lastEmph === "present") {
          chosenEmphasis = isBoardFocus ? "point" : "simpleGesture";
        } else if (lastEmph === "point") {
          chosenEmphasis = "present";
        } else {
          chosenEmphasis = isBoardFocus ? "point" : "present";
        }
      }

      this.recordGesture(chosenEmphasis);
      this.emphasisCooldownSec = 9.5 + Math.random() * 4.0; // 9.5s - 13.5s cooldown
      this.conversationalCadenceSec = 3.6 + Math.random() * 1.4; // Next small movement in 3.6 - 5.0s

      if (chosenEmphasis === "present") {
        this.animState = "PRESENTING";
        this.gestureActiveTimer = 3.2;
        this.instructor.present?.(false, () => {
          if (this.animState === "PRESENTING") this.animState = "LISTENING";
        });
      } else if (chosenEmphasis === "point") {
        this.animState = "POINTING";
        this.gestureActiveTimer = 3.2;
        this.instructor.point?.(false, () => {
          if (this.animState === "POINTING") this.animState = "LISTENING";
        });
      } else {
        this.animState = "GESTURING";
        this.gestureActiveTimer = 2.6;
        this.instructor.simpleGesture?.(false, () => {
          if (this.animState === "GESTURING") this.animState = "LISTENING";
        });
      }
      return;
    }

    // Level 2 Conversational Gestures: Small, quick movements (every 2.2 - 3.8s)
    const recentConv = this.gestureHistory.filter((g) => g.startsWith("conv_"));
    const lastConv = recentConv[recentConv.length - 1];

    let chosenVariant: "quick" | "palm" | "nod";
    if (lastConv === "conv_quick") {
      chosenVariant = isBoardFocus ? "nod" : "palm";
    } else if (lastConv === "conv_palm") {
      chosenVariant = "quick";
    } else {
      chosenVariant = "quick";
    }

    const gestureId: GestureType = `conv_${chosenVariant}` as GestureType;
    this.recordGesture(gestureId);
    this.animState = "GESTURING";
    this.gestureActiveTimer = chosenVariant === "quick" ? 2.0 : 2.4;
    this.conversationalCadenceSec = 2.5 + Math.random() * 1.3; // Next conversational trigger in 2.5 - 3.8s

    if (isBoardFocus && Math.random() > 0.4) {
      this.instructor.setLookTarget?.("board");
    }

    this.instructor.conversationalGesture?.(chosenVariant, () => {
      if (this.animState === "GESTURING") {
        this.animState = "LISTENING";
      }
    });
  }

  private recordGesture(gesture: GestureType): void {
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > 5) {
      this.gestureHistory.shift();
    }
  }

  private get lastGestureType(): GestureType | null {
    return this.gestureHistory.length > 0
      ? this.gestureHistory[this.gestureHistory.length - 1]
      : null;
  }

  public reset(): void {
    this.lastBeatId = "";
    this.lastPlaybackSec = 0;
    this.lastSubAction = "";
    this.animState = "LISTENING";
    this.gestureActiveTimer = 0;
    this.conversationalCadenceSec = 2.0;
    this.emphasisCooldownSec = 9.0;
    this.gestureHistory = [];
    this.currentStageArea = "podium";
    this.isNavigating = false;
    this.instructor.teleport?.(PODIUM_POS, PODIUM_YAW);
    this.instructor.setLookTarget?.("learner");
    this.instructor.idle?.();
  }
}
