type Props = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: Props) {
  return (
    <main className="welcome-screen">
      <div className="welcome-hero-card">
        <div className="kadosh-brand-badge" aria-label="Endorsed by KadoshAI">
          <img
            src="/assets/branding/kadoshai-logo.png"
            alt="KadoshAI"
            className="kadosh-logo-img"
          />
        </div>
        <div className="welcome-demo-tag-row">
          <span className="demo-pill-badge">Demo</span>
        </div>
        <h1 className="welcome-title">Catchup</h1>
        <p className="welcome-subtitle">Missed a session? We've got you covered.</p>
        <button
          type="button"
          className="welcome-start-btn"
          onClick={onStart}
          autoFocus
        >
          Start
        </button>
      </div>
    </main>
  );
}
