import { useEffect, useState } from "react";
import { getLessonRecap } from "../content/registry";
import type { CourseModule } from "../types/lesson";

export const LEARNER_PROGRESS_STORAGE_KEY = "catchup_learner_progress_v1";
export const PROGRESS_EVENT_NAME = "catchup-learner-progress-change";

export type ModuleStatus = "ready" | "in_progress" | "completed";

export interface ModuleProgressRecord {
  moduleId: string;
  status: ModuleStatus;
  lastLessonTimeSec: number;
  lastBeatId: string;
  quizScore?: number;
  quizTotal?: number;
  confidenceAverage?: number;
  updatedAt: number;
  completedAt?: number;
  startedAt?: number;
  lessonCompleted?: boolean;
  assessmentCompleted?: boolean;
  resultsViewed?: boolean;
}

export interface LearnerProgressState {
  version: number;
  modules: Record<string, ModuleProgressRecord>;
  lastActiveModuleId?: string;
  updatedAt: number;
}

const DEFAULT_STATE: LearnerProgressState = {
  version: 1,
  modules: {},
  updatedAt: Date.now(),
};

/**
 * Loads authoritative learner progress from localStorage with safe error handling and migration.
 */
export function loadLearnerProgress(): LearnerProgressState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE };
  }

  try {
    const raw = localStorage.getItem(LEARNER_PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.version === 1 && parsed.modules) {
        return parsed as LearnerProgressState;
      }
    }
  } catch (err) {
    console.warn("[LearnerProgressStore] Failed to parse stored progress, falling back to clean state:", err);
  }

  // Attempt migration from legacy sessionStorage if available
  try {
    const legacyCompletedRaw = sessionStorage.getItem("catchup_completed_modules_v2");
    const legacyProgressRaw = sessionStorage.getItem("catchup_module_progress_v2");
    const legacyCompleted: string[] = legacyCompletedRaw ? JSON.parse(legacyCompletedRaw) : [];
    const legacyProgress: Record<string, number> = legacyProgressRaw ? JSON.parse(legacyProgressRaw) : {};

    if (legacyCompleted.length > 0 || Object.keys(legacyProgress).length > 0) {
      const migratedModules: Record<string, ModuleProgressRecord> = {};
      const now = Date.now();

      for (const modId of legacyCompleted) {
        migratedModules[modId] = {
          moduleId: modId,
          status: "completed",
          lastLessonTimeSec: 600,
          lastBeatId: "m-assessment",
          quizScore: 5,
          quizTotal: 5,
          confidenceAverage: 4.5,
          updatedAt: now,
          completedAt: now,
          lessonCompleted: true,
          assessmentCompleted: true,
          resultsViewed: true,
        };
      }

      for (const [modId, sec] of Object.entries(legacyProgress)) {
        if (!migratedModules[modId] && sec > 0) {
          migratedModules[modId] = {
            moduleId: modId,
            status: "in_progress",
            lastLessonTimeSec: sec,
            lastBeatId: "",
            updatedAt: now,
            startedAt: now,
          };
        }
      }

      const migratedState: LearnerProgressState = {
        version: 1,
        modules: migratedModules,
        updatedAt: now,
      };

      saveLearnerProgress(migratedState);
      return migratedState;
    }
  } catch {
    // Ignore migration failure
  }

  return { ...DEFAULT_STATE, modules: {} };
}

/**
 * Saves learner progress to localStorage and broadcasts the change event.
 */
export function saveLearnerProgress(state: LearnerProgressState): void {
  if (typeof window === "undefined") return;

  try {
    state.updatedAt = Date.now();
    localStorage.setItem(LEARNER_PROGRESS_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: state }));
  } catch (err) {
    console.warn("[LearnerProgressStore] Failed to write progress to localStorage:", err);
  }
}

/**
 * Returns the progress record for a specific module, or default "ready" state.
 */
export function getModuleProgressRecord(
  moduleId: string,
  state?: LearnerProgressState
): ModuleProgressRecord {
  const current = state ?? loadLearnerProgress();
  return (
    current.modules[moduleId] ?? {
      moduleId,
      status: "ready",
      lastLessonTimeSec: 0,
      lastBeatId: "",
      updatedAt: Date.now(),
    }
  );
}

/**
 * Sets module status to IN PROGRESS when learner begins actual lesson playback.
 * Does NOT downgrade a completed module.
 */
export function recordLessonStart(moduleId: string, firstBeatId: string = ""): void {
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId];

  if (existing?.status === "completed") {
    // Reviewing a completed module keeps status completed
    return;
  }

  state.modules[moduleId] = {
    ...(existing ?? {
      moduleId,
      lastLessonTimeSec: 0,
      lastBeatId: firstBeatId,
    }),
    status: "in_progress",
    startedAt: existing?.startedAt ?? Date.now(),
    lastBeatId: existing?.lastBeatId || firstBeatId,
    updatedAt: Date.now(),
  };

  state.lastActiveModuleId = moduleId;
  saveLearnerProgress(state);
}

/**
 * Saves periodically throttled lesson position during playback.
 */
export function updateLessonPosition(
  moduleId: string,
  timeSec: number,
  beatId: string
): void {
  if (timeSec < 0) return;
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId];

  const currentStatus: ModuleStatus =
    existing?.status === "completed"
      ? "completed"
      : timeSec >= 1
      ? "in_progress"
      : existing?.status ?? "ready";

  state.modules[moduleId] = {
    moduleId,
    status: currentStatus,
    lastLessonTimeSec: Math.max(0, Math.round(timeSec)),
    lastBeatId: beatId || existing?.lastBeatId || "",
    quizScore: existing?.quizScore,
    quizTotal: existing?.quizTotal,
    confidenceAverage: existing?.confidenceAverage,
    startedAt: existing?.startedAt ?? (timeSec >= 1 ? Date.now() : undefined),
    completedAt: existing?.completedAt,
    lessonCompleted: existing?.lessonCompleted,
    assessmentCompleted: existing?.assessmentCompleted,
    resultsViewed: existing?.resultsViewed,
    updatedAt: Date.now(),
  };

  state.lastActiveModuleId = moduleId;
  saveLearnerProgress(state);
}

/**
 * Persists knowledge check quiz score when quiz step finishes.
 */
export function recordQuizScore(
  moduleId: string,
  quizScore: number,
  quizTotal: number
): void {
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId] ?? {
    moduleId,
    status: "in_progress",
    lastLessonTimeSec: 0,
    lastBeatId: "",
    updatedAt: Date.now(),
  };

  state.modules[moduleId] = {
    ...existing,
    quizScore,
    quizTotal,
    assessmentCompleted: true,
    updatedAt: Date.now(),
  };

  saveLearnerProgress(state);
}

/**
 * Persists confidence rating average when self-report step finishes.
 */
export function recordConfidenceScore(
  moduleId: string,
  confidenceAverage: number
): void {
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId] ?? {
    moduleId,
    status: "in_progress",
    lastLessonTimeSec: 0,
    lastBeatId: "",
    updatedAt: Date.now(),
  };

  state.modules[moduleId] = {
    ...existing,
    confidenceAverage: Math.round(confidenceAverage * 10) / 10,
    updatedAt: Date.now(),
  };

  saveLearnerProgress(state);
}

/**
 * Marks module COMPLETED after full flow (lesson + quiz + confidence + results) completes.
 */
export function completeModule(
  moduleId: string,
  assessmentData?: {
    quizScore?: number;
    quizTotal?: number;
    confidenceAverage?: number;
  }
): void {
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId] ?? {
    moduleId,
    status: "in_progress",
    lastLessonTimeSec: 0,
    lastBeatId: "",
    updatedAt: Date.now(),
  };

  state.modules[moduleId] = {
    ...existing,
    status: "completed",
    completedAt: Date.now(),
    lessonCompleted: true,
    assessmentCompleted: true,
    resultsViewed: true,
    quizScore: assessmentData?.quizScore ?? existing.quizScore ?? 5,
    quizTotal: assessmentData?.quizTotal ?? existing.quizTotal ?? 5,
    confidenceAverage:
      assessmentData?.confidenceAverage ?? existing.confidenceAverage ?? 4.5,
    updatedAt: Date.now(),
  };

  saveLearnerProgress(state);
}

/**
 * Resets saved lesson position back to 0 without erasing completion or assessment score.
 */
export function resetModulePosition(moduleId: string): void {
  const state = loadLearnerProgress();
  const existing = state.modules[moduleId];
  if (!existing) return;

  state.modules[moduleId] = {
    ...existing,
    lastLessonTimeSec: 0,
    lastBeatId: "",
    updatedAt: Date.now(),
  };

  saveLearnerProgress(state);
}

/**
 * Demo Utility: Resets only Catchup learner progress in localStorage.
 */
export function resetAllLearnerProgress(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(LEARNER_PROGRESS_STORAGE_KEY);
    sessionStorage.removeItem("catchup_completed_modules_v2");
    sessionStorage.removeItem("catchup_module_progress_v2");
    window.dispatchEvent(
      new CustomEvent(PROGRESS_EVENT_NAME, { detail: { ...DEFAULT_STATE, modules: {} } })
    );
  } catch (err) {
    console.warn("[LearnerProgressStore] Failed to reset learner progress:", err);
  }
}

/**
 * Centralized calculation of Programme-Level summary metrics.
 */
export interface ProgrammeSummaryMetrics {
  completedCount: number;
  totalModules: number;
  knowledgeAveragePct: number | null;
  confidenceAverageScore: number | null;
  remainingMinutes: number;
  remainingSeconds: number;
  totalTrainingSeconds: number;
  overallPercentComplete: number;
}

export function computeProgrammeSummary(
  modules: CourseModule[],
  progressState: LearnerProgressState
): ProgrammeSummaryMetrics {
  const activeModules = modules.filter((m) => m.available);
  const totalModules = activeModules.length;

  let completedCount = 0;
  let totalCurriculumSec = 0;
  let remainingSec = 0;

  // Knowledge average accumulator (only completed assessments with real scores)
  let totalQuizScore = 0;
  let totalQuizMax = 0;
  let scoredModulesCount = 0;

  // Confidence average accumulator
  let totalConfidence = 0;
  let confidenceCount = 0;

  for (const mod of activeModules) {
    const recap = getLessonRecap(mod.id);
    const modDuration =
      recap?.durationSec ?? (mod.recapMinutes ? mod.recapMinutes * 60 : 600);
    totalCurriculumSec += modDuration;

    const record = progressState.modules[mod.id];
    const isCompleted = record?.status === "completed";
    const isInProgress = record?.status === "in_progress";

    if (isCompleted) {
      completedCount += 1;
      // Completed modules contribute 0 to remaining time
    } else if (isInProgress) {
      const watched = record.lastLessonTimeSec ?? 0;
      // Reserve final 30s for assessment
      const clampedWatched = Math.min(Math.max(0, modDuration - 30), Math.max(0, watched));
      remainingSec += Math.max(0, modDuration - clampedWatched);
    } else {
      // Ready modules contribute full duration
      remainingSec += modDuration;
    }

    if (
      record?.quizScore !== undefined &&
      record?.quizTotal !== undefined &&
      record.quizTotal > 0
    ) {
      totalQuizScore += record.quizScore;
      totalQuizMax += record.quizTotal;
      scoredModulesCount += 1;
    }

    if (
      record?.confidenceAverage !== undefined &&
      record.confidenceAverage > 0
    ) {
      totalConfidence += record.confidenceAverage;
      confidenceCount += 1;
    }
  }

  const knowledgeAveragePct =
    totalQuizMax > 0
      ? Math.round((totalQuizScore / totalQuizMax) * 100)
      : null;

  const confidenceAverageScore =
    confidenceCount > 0
      ? Math.round((totalConfidence / confidenceCount) * 10) / 10
      : null;

  const normalizedRemainingSec = Math.max(0, Math.round(remainingSec));
  const remainingMinutes = Math.ceil(normalizedRemainingSec / 60);

  const consumedSec = totalCurriculumSec - normalizedRemainingSec;
  const overallPercentComplete =
    totalCurriculumSec > 0
      ? Math.min(100, Math.round((consumedSec / totalCurriculumSec) * 100))
      : 0;

  return {
    completedCount,
    totalModules,
    knowledgeAveragePct,
    confidenceAverageScore,
    remainingMinutes,
    remainingSeconds: normalizedRemainingSec,
    totalTrainingSeconds: totalCurriculumSec,
    overallPercentComplete,
  };
}

/**
 * Reactive React hook that subscribes to central progress state updates.
 */
export function useLearnerProgress(): {
  progressState: LearnerProgressState;
  getRecord: (moduleId: string) => ModuleProgressRecord;
} {
  const [progressState, setProgressState] = useState<LearnerProgressState>(loadLearnerProgress);

  useEffect(() => {
    const handleUpdate = () => {
      setProgressState(loadLearnerProgress());
    };

    window.addEventListener(PROGRESS_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    progressState,
    getRecord: (moduleId: string) => getModuleProgressRecord(moduleId, progressState),
  };
}
