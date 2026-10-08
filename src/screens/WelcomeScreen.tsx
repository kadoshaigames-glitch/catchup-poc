type Props = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: Props) {
  return (
    <main className="welcome-screen">
      <div className="welcome-hero-card">
        {/* Subtle holographic ambient glow */}
        <div className="card-ambient-glow" aria-hidden="true" />

        {/* Corporate Header */}
        <div className="welcome-top-meta">
          <div className="kadosh-brand-badge" aria-label="Endorsed by KadoshAI">
            <img
                src={`${import.meta.env.BASE_URL}assets/branding/kadoshai-logo.png`}
              alt="KadoshAI"
              className="kadosh-logo-img"
            />
          </div>
          <div className="access-status-pill">
            <span className="live-pulse-dot" aria-hidden="true" />
            <span className="status-label">AI LEARNING SUITE</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="welcome-content-stack">
          <p className="welcome-eyebrow">Level 1: AI Foundations & Literacy</p>
          <h1 className="welcome-title">Catchup</h1>
          <p className="welcome-lead">
            Missed a corporate training session? We’ve got you covered <span className="welcome-highlight-first">with AI Intelligent, Interactive</span> <span className="welcome-highlight-bright">3D modular recaps</span>.
          </p>
          <p className="welcome-subtext">
            Featuring 3D AI instructor Awang, comprehensive conceptual deep dives, and <span className="welcome-highlight-bright">targeted knowledge checks</span>.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="welcome-start-btn"
          onClick={onStart}
          autoFocus
        >
          <span>Begin Training Recap</span>
          <span className="btn-arrow" aria-hidden="true">→</span>
        </button>

        {/* Footer Meta */}
        <div className="welcome-footer-row">
          <span className="welcome-curriculum-tag">6 Modules Ready</span>
          <span className="welcome-dot-sep">·</span>
          <span className="welcome-curriculum-tag">Interactive 3D Classroom</span>
          <span className="welcome-dot-sep">·</span>
          <span className="welcome-curriculum-tag">Self-Paced</span>
        </div>
      </div>
    </main>
  );
}
