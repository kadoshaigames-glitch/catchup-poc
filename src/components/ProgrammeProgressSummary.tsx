import { useState } from "react";
import {
  computeProgrammeSummary,
  resetAllLearnerProgress,
  useLearnerProgress,
} from "../services/learnerProgressStore";
import type { CourseModule } from "../types/lesson";

type Props = {
  modules: CourseModule[];
};

export function ProgrammeProgressSummary({ modules }: Props) {
  const { progressState } = useLearnerProgress();
  const summary = computeProgrammeSummary(modules, progressState);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleConfirmReset = () => {
    resetAllLearnerProgress();
    setConfirmResetOpen(false);
  };

  return (
    <section className="programme-summary-card" aria-labelledby="programme-summary-heading">
      {/* Background ambient lighting */}
      <div className="programme-summary-ambient-glow" aria-hidden="true" />
      <div className="programme-summary-top-edge" aria-hidden="true" />

      <header className="programme-summary-header">
        <div className="programme-summary-title-group">
          <div className="programme-summary-eyebrow">
            <span className="summary-badge-dot" aria-hidden="true" />
            <span>EXECUTIVE OVERVIEW</span>
          </div>
          <h2 id="programme-summary-heading" className="programme-summary-title">
            YOUR LEARNING PROGRESS
          </h2>
        </div>

        <div className="programme-summary-actions">
          <button
            type="button"
            className="text-btn summary-reset-btn"
            onClick={() => setConfirmResetOpen(true)}
            title="Reset progress back to initial state"
            aria-label="Reset progress"
          >
            <span aria-hidden="true">↺</span>
            <span>Reset progress</span>
          </button>
        </div>
      </header>

      {/* 4 Metric Columns Grid */}
      <div className="programme-metrics-grid">
        {/* Metric 1: Completed Modules */}
        <div className="programme-metric-col metric-col-completion">
          <div className="metric-header">
            <span className="metric-icon" aria-hidden="true">🎓</span>
            <span className="metric-label">Curriculum Completion</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-val-main">
              {summary.completedCount} <span className="metric-val-sub">of {summary.totalModules}</span>
            </span>
            <span className="metric-pill">
              {summary.completedCount === summary.totalModules
                ? "All Complete"
                : `${summary.overallPercentComplete}%`}
            </span>
          </div>
          <div className="metric-progress-track">
            <div
              className="metric-progress-fill"
              style={{
                width: `${(summary.completedCount / summary.totalModules) * 100}%`,
              }}
              role="progressbar"
              aria-valuenow={summary.completedCount}
              aria-valuemin={0}
              aria-valuemax={summary.totalModules}
            />
          </div>
        </div>

        {/* Metric 2: Knowledge Average */}
        <div className="programme-metric-col metric-col-knowledge">
          <div className="metric-header">
            <span className="metric-icon" aria-hidden="true">🎯</span>
            <span className="metric-label">Knowledge Average</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-val-main">
              {summary.knowledgeAveragePct !== null ? (
                `${summary.knowledgeAveragePct}%`
              ) : (
                <span className="metric-val-empty">—</span>
              )}
            </span>
            {summary.knowledgeAveragePct !== null && (
              <span className="metric-pill success">Quiz Verified</span>
            )}
          </div>
          <p className="metric-footnote">
            {summary.knowledgeAveragePct !== null
              ? "Across completed module assessments"
              : "Complete an assessment to verify score"}
          </p>
        </div>

        {/* Metric 3: Confidence Average */}
        <div className="programme-metric-col metric-col-confidence">
          <div className="metric-header">
            <span className="metric-icon" aria-hidden="true">📊</span>
            <span className="metric-label">Confidence Average</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-val-main">
              {summary.confidenceAverageScore !== null ? (
                <>
                  {summary.confidenceAverageScore}
                  <span className="metric-val-sub"> / 5</span>
                </>
              ) : (
                <span className="metric-val-empty">— / 5</span>
              )}
            </span>
            {summary.confidenceAverageScore !== null && (
              <span className="metric-pill info">Self-Report</span>
            )}
          </div>
          <p className="metric-footnote">
            {summary.confidenceAverageScore !== null
              ? "Workplace application readiness"
              : "Complete an assessment to record readiness"}
          </p>
        </div>

        {/* Metric 4: Remaining Training Time */}
        <div className="programme-metric-col metric-col-time">
          <div className="metric-header">
            <span className="metric-icon" aria-hidden="true">⏱️</span>
            <span className="metric-label">Remaining Training Time</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-val-main">
              {summary.remainingMinutes > 0 ? (
                <>
                  {summary.remainingMinutes}
                  <span className="metric-val-sub"> min</span>
                </>
              ) : (
                <span className="metric-val-complete">0 min (Complete!)</span>
              )}
            </span>
            <span className="metric-pill time-pill">
              {summary.remainingMinutes === 0
                ? "Accomplished"
                : "Dynamic Est."}
            </span>
          </div>
          <p className="metric-footnote">
            Calculated from active lesson progress
          </p>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Progress */}
      {confirmResetOpen && (
        <div className="confirm-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
          <div className="confirm-modal-card">
            <div className="confirm-modal-icon" aria-hidden="true">⚠️</div>
            <h3 id="reset-modal-title" className="confirm-modal-title">
              Reset all Catchup learning progress?
            </h3>
            <p className="confirm-modal-desc">
              This will reset your completed modules, assessment scores, and saved lesson checkpoints for this demo.
            </p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setConfirmResetOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary confirm-danger-btn"
                onClick={handleConfirmReset}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
