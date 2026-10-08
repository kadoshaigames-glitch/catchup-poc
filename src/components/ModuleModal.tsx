import { useEffect } from "react";
import type { CourseModule } from "../types/lesson";

type Props = {
  module: CourseModule | null;
  isOpen: boolean;
  isCompleted?: boolean;
  isInProgress?: boolean;
  onClose: () => void;
  onStartRecap: (moduleId: string) => void;
  onStartDemo?: (demoId: string) => void;
};

/**
 * Modern 2026 AI Module Information Modal
 * Features:
 * - Frosted glass backdrop blur
 * - Dimensional modal card with glowing edge highlights
 * - Clear corporate hierarchy & structured metadata
 * - Smooth entrance and exit transitions
 * - Direct recap launch and technical demo launch
 */
export function ModuleModal({
  module,
  isOpen,
  isCompleted = false,
  isInProgress = false,
  onClose,
  onStartRecap,
  onStartDemo,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !module) return null;

  return (
    <div
      className="module-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="module-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="modal-glow-line" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-tag-group">
            <span className="modal-module-chip">
              MODULE {String(module.moduleNumber).padStart(2, "0")}
            </span>
            {isCompleted ? (
              <span className="modal-status-badge is-completed">✓ Completed</span>
            ) : module.available ? (
              <span className="modal-status-badge is-ready">{module.statusLabel}</span>
            ) : (
              <span className="modal-status-badge is-locked">{module.statusLabel}</span>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close module details"
          >
            ✕
          </button>
        </div>

        {/* Modal Title & Subtitle */}
        <div className="modal-title-section">
          <h2 id="modal-title" className="modal-title">
            {module.subtitle}
          </h2>
          <p className="modal-subtitle-lead">
            {module.title} · Level 1: AI Foundations & Literacy
          </p>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="modal-meta-grid">
          <div className="modal-meta-item">
            <span className="meta-icon" aria-hidden="true">⏱️</span>
            <div>
              <span className="meta-label">ESTIMATED COMPLETION</span>
              <p className="meta-value">
                ~{module.recapMinutes} Minutes Full Recap
                {module.moduleNumber === 1 ? " (+ 78s Demo)" : ""}
              </p>
            </div>
          </div>
          <div className="modal-meta-item">
            <span className="meta-icon" aria-hidden="true">👤</span>
            <div>
              <span className="meta-label">AI INSTRUCTOR</span>
              <p className="meta-value">Awang (3D Interactive Classroom)</p>
            </div>
          </div>
          <div className="modal-meta-item">
            <span className="meta-icon" aria-hidden="true">📝</span>
            <div>
              <span className="meta-label">ASSESSMENT</span>
              <p className="meta-value">Interactive Knowledge Check Included</p>
            </div>
          </div>
          <div className="modal-meta-item">
            <span className="meta-icon" aria-hidden="true">🎯</span>
            <div>
              <span className="meta-label">FORMAT</span>
              <p className="meta-value">Self-Paced Modular Learning</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="modal-body-section">
          <h3 className="modal-section-heading">Overview & Curriculum Objectives</h3>
          <p className="modal-description">{module.description}</p>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions-footer">
          <div className="modal-primary-actions">
            {module.available ? (
              <>
                <button
                  type="button"
                  className="btn-primary modal-start-btn"
                  onClick={() => {
                    onClose();
                    onStartRecap(module.id);
                  }}
                  autoFocus
                >
                  <span>
                    {isCompleted
                      ? `Review Module ${module.moduleNumber} Recap`
                      : isInProgress
                      ? `Continue Module ${module.moduleNumber} Recap`
                      : `Start Module Recap (~${module.recapMinutes} min)`}
                  </span>
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </button>

                {module.moduleNumber === 1 && onStartDemo && (
                  <button
                    type="button"
                    className="btn-outline modal-demo-btn"
                    onClick={() => {
                      onClose();
                      onStartDemo("module-1-demo");
                    }}
                  >
                    Play 78s Technical Demo
                  </button>
                )}
              </>
            ) : (
              <button type="button" className="btn-secondary" disabled>
                Content mapping in progress
              </button>
            )}
          </div>

          <button
            type="button"
            className="modal-secondary-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
