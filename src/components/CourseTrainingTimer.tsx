import { useMemo } from "react";
import { computeProgrammeSummary, useLearnerProgress } from "../services/learnerProgressStore";
import type { CourseModule } from "../types/lesson";

const PROGRESS_STORAGE_KEY = "catchup_module_progress_v2";
const COMPLETED_STORAGE_KEY = "catchup_completed_modules_v2";

/**
 * Retrieves persisted session progress (seconds watched per module)
 */
export function getStoredModuleProgress(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persists elapsed playback seconds for an active module
 */
export function saveModuleProgress(moduleId: string, seconds: number): void {
  try {
    const current = getStoredModuleProgress();
    const prev = current[moduleId] ?? 0;
    // Only advance or keep highest progress within module
    if (seconds > prev) {
      current[moduleId] = Math.round(seconds);
      sessionStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // ignore storage restrictions
  }
}

/**
 * Retrieves persisted completed module IDs
 */
export function getStoredCompletedModules(): string[] {
  try {
    const raw = sessionStorage.getItem(COMPLETED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists completed module state
 */
export function saveCompletedModule(moduleId: string): void {
  try {
    const current = getStoredCompletedModules();
    if (!current.includes(moduleId)) {
      current.push(moduleId);
      sessionStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // ignore
  }
}

/**
 * Resets session training progress
 */
export function resetTrainingSessionTimer(): void {
  try {
    sessionStorage.removeItem(PROGRESS_STORAGE_KEY);
    sessionStorage.removeItem(COMPLETED_STORAGE_KEY);
  } catch {
    // ignore
  }
}

type Props = {
  modules: CourseModule[];
  completedModuleIds?: string[];
  moduleProgress?: Record<string, number>;
  className?: string;
};

/**
 * Course-Level Total Training Remaining Time Widget
 * 
 * Accurately represents the remaining training time needed to complete all modules.
 * Connects directly to the central learnerProgressStore as single source of truth.
 */
export function CourseTrainingTimer({
  modules,
  className = "",
}: Props) {
  const { progressState } = useLearnerProgress();
  const summary = useMemo(() => computeProgrammeSummary(modules, progressState), [modules, progressState]);

  const { remainingSeconds: remainingSec, totalTrainingSeconds: totalTrainingSec, completedCount } = summary;

  // Format as HH:MM:SS (strictly whole-second integer, never raw float)
  const formattedTime = useMemo(() => {
    const totalSec = Math.max(0, Math.round(Number(remainingSec) || 0));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remainingSec]);

  const activeModuleCount = useMemo(() => {
    return modules.filter((m) => m.available).length;
  }, [modules]);

  const isAllComplete = remainingSec === 0 && totalTrainingSec > 0;
  const isUntouched = remainingSec === totalTrainingSec;

  const statusLabel = isAllComplete
    ? "ALL COMPLETE"
    : isUntouched
      ? "TOTAL REMAINING"
      : "REMAINING";

  return (
    <div
      className={`course-timer-widget ${className} ${isAllComplete ? "is-complete" : ""}`}
      role="status"
      aria-label={`Total training time remaining: ${formattedTime}`}
    >
      <div className="timer-icon-wrap" aria-hidden="true">
        <svg className="timer-svg-ring" viewBox="0 0 36 36">
          <circle
            className="timer-ring-bg"
            cx="18"
            cy="18"
            r="15"
            fill="none"
            strokeWidth="2.5"
          />
          <circle
            className="timer-ring-progress"
            cx="18"
            cy="18"
            r="15"
            fill="none"
            strokeWidth="2.5"
            strokeDasharray="94.2"
            strokeDashoffset={
              totalTrainingSec > 0
                ? 94.2 * (remainingSec / totalTrainingSec)
                : 0
            }
          />
        </svg>
        <span className={`timer-pulse-dot ${isAllComplete ? "dot-success" : ""}`} />
      </div>

      <div className="timer-text-content">
        <div className="timer-eyebrow-row">
          <span className="timer-eyebrow">TOTAL TRAINING TIME</span>
          <span className="timer-module-pill">
            {completedCount > 0 ? `${completedCount}/${activeModuleCount} Done` : `${activeModuleCount} Modules`}
          </span>
        </div>
        <div className="timer-display-row">
          <span className="timer-digits">{formattedTime}</span>
          <span className={`timer-status-badge ${isAllComplete ? "badge-success" : ""}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
