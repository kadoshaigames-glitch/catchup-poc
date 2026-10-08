type Props = {
  isOpen: boolean;
  moduleTitle: string;
  stoppedBeatLabel: string;
  stoppedTimeSec: number;
  totalDurationSec: number;
  onContinue: () => void;
  onStartFromBeginning: () => void;
  onExit?: () => void;
};

export function ResumeLearningModal({
  isOpen,
  moduleTitle,
  stoppedBeatLabel,
  stoppedTimeSec,
  totalDurationSec,
  onContinue,
  onStartFromBeginning,
  onExit,
}: Props) {
  if (!isOpen) return null;

  const minutes = Math.floor(stoppedTimeSec / 60);
  const seconds = Math.floor(stoppedTimeSec % 60);
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const totalMin = Math.floor(totalDurationSec / 60);
  const totalSec = Math.floor(totalDurationSec % 60);
  const formattedTotal = `${String(totalMin).padStart(2, "0")}:${String(totalSec).padStart(2, "0")}`;

  const progressPercent = totalDurationSec > 0
    ? Math.min(100, Math.round((stoppedTimeSec / totalDurationSec) * 100))
    : 0;

  return (
    <div className="resume-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="resume-title">
      <div className="resume-modal-card">
        {/* Ambient Glow & Accent Bar */}
        <div className="resume-ambient-glow" aria-hidden="true" />
        <div className="resume-accent-bar" aria-hidden="true" />

        <header className="resume-modal-header">
          <div className="resume-badge">
            <span className="resume-badge-dot" aria-hidden="true" />
            <span>WELCOME BACK</span>
          </div>
          <h2 id="resume-title" className="resume-title">
            Pick up where you left off
          </h2>
          <p className="resume-subtitle">{moduleTitle}</p>
        </header>

        <div className="resume-body">
          <div className="resume-checkpoint-card">
            <div className="resume-checkpoint-icon" aria-hidden="true">
              📍
            </div>
            <div className="resume-checkpoint-info">
              <span className="resume-checkpoint-label">You previously stopped at:</span>
              <h3 className="resume-checkpoint-name">
                &ldquo;{stoppedBeatLabel || "Lesson Content"}&rdquo;
              </h3>
              <div className="resume-checkpoint-meta">
                <span className="resume-checkpoint-time">
                  <strong>{formattedTime}</strong> into this module ({progressPercent}%)
                </span>
                <span className="resume-checkpoint-total">Total: {formattedTotal}</span>
              </div>
            </div>
          </div>

          <div className="resume-progress-track">
            <div
              className="resume-progress-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <footer className="resume-modal-footer">
          <button
            type="button"
            className="btn-primary resume-continue-btn"
            onClick={onContinue}
            autoFocus
          >
            <span>CONTINUE LEARNING</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            className="btn-outline resume-restart-btn"
            onClick={onStartFromBeginning}
          >
            <span aria-hidden="true">↺</span>
            <span>START FROM BEGINNING</span>
          </button>

          {onExit && (
            <button
              type="button"
              className="text-btn resume-exit-btn"
              onClick={onExit}
            >
              ← Back to Module Overview
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
