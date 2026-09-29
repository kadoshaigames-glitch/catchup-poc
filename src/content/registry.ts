import type { LessonRecap } from "../types/lesson";
import { moduleOneRecap } from "./moduleOneRecap";
import { moduleTwoRecap } from "./moduleTwoRecap";
import { moduleThreeRecap } from "./moduleThreeRecap";
import { moduleFourRecap } from "./moduleFourRecap";
import { moduleFiveRecap } from "./moduleFiveRecap";
import { moduleSixRecap } from "./moduleSixRecap";
import { sampleLesson } from "./sampleLesson";

/**
 * Registry mapping lesson and module IDs to their independent LessonRecap definitions.
 *
 * Current State:
 * - Module 1 (Full): Connected to ~10-minute recap (moduleOneRecap).
 * - Module 1 (POC Demo): Preserved ~78s technical baseline (sampleLesson).
 * - Modules 2–6: Fully implemented and playable independent ~10-minute recaps.
 */
const lessonRegistry: Record<string, LessonRecap> = {
  // Module 1: Full Production (~10 min) + Preserved Demo (~78s)
  [moduleOneRecap.id]: moduleOneRecap,
  "module-1": moduleOneRecap,
  "l1-m1": moduleOneRecap,
  "m1-recap": moduleOneRecap,

  [sampleLesson.id]: sampleLesson,
  "module-1-demo": sampleLesson,
  "m1-demo": sampleLesson,
  "m1-l1": sampleLesson,

  // Module 2: Smart Comparison (~10 min)
  [moduleTwoRecap.id]: moduleTwoRecap,
  "module-2": moduleTwoRecap,
  "l1-m2": moduleTwoRecap,
  "m2-recap": moduleTwoRecap,

  // Module 3: Build AI Agents (~10 min)
  [moduleThreeRecap.id]: moduleThreeRecap,
  "module-3": moduleThreeRecap,
  "l1-m3": moduleThreeRecap,
  "m3-recap": moduleThreeRecap,

  // Module 4: Dynamic Presentation and Report (~10 min)
  [moduleFourRecap.id]: moduleFourRecap,
  "module-4": moduleFourRecap,
  "l1-m4": moduleFourRecap,
  "m4-recap": moduleFourRecap,

  // Module 5: AI Ethics, Privacy and Security (~10 min)
  [moduleFiveRecap.id]: moduleFiveRecap,
  "module-5": moduleFiveRecap,
  "l1-m5": moduleFiveRecap,
  "m5-recap": moduleFiveRecap,

  // Module 6: Putting AI into Practice (~10 min)
  [moduleSixRecap.id]: moduleSixRecap,
  "module-6": moduleSixRecap,
  "l1-m6": moduleSixRecap,
  "m6-recap": moduleSixRecap,
};

/**
 * Register an independent module recap in the registry.
 */
export function registerLessonRecap(lesson: LessonRecap): void {
  lessonRegistry[lesson.id] = lesson;
}

/**
 * Resolve a module recap by its ID.
 */
export function getLessonRecap(lessonId: string): LessonRecap | undefined {
  return lessonRegistry[lessonId];
}

/**
 * Check if a module recap is available for playback.
 */
export function hasLessonRecap(lessonId: string): boolean {
  return Boolean(lessonRegistry[lessonId]);
}
