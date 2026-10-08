import { useState } from "react";

type Props = {
  error: string | null;
  onSubmit: (code: string) => void;
  onBack?: () => void;
};

export function AccessCodeScreen({ error, onSubmit, onBack }: Props) {
  const [codeValue, setCodeValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(codeValue.trim());
  };

  return (
    <main className="access-screen">
      <div className="access-card">
        {/* Subtle holographic ambient edge glow */}
        <div className="card-ambient-glow" aria-hidden="true" />

        {onBack ? (
          <button
            type="button"
            className="access-back-btn"
            onClick={onBack}
            aria-label="Return to welcome screen"
          >
            <span className="back-arrow">←</span> Return
          </button>
        ) : null}

        {/* Brand & System Status Bar */}
        <div className="access-brand-header">
          <div className="kadosh-brand-badge access-badge" aria-label="KadoshAI">
            <img
              src={`${import.meta.env.BASE_URL}assets/branding/kadoshai-logo.png`}
              alt="KadoshAI"
              className="kadosh-logo-img"
            />
          </div>
          <div className="access-status-pill">
            <span className="live-pulse-dot" aria-hidden="true" />
            <span className="status-label">AI RECAP</span>
          </div>
        </div>

        {/* Header & Typography */}
        <div className="access-headings">
          <p className="access-eyebrow">Enterprise Learning Portal</p>
          <h1 className="access-title">Access Catchup</h1>
          <p className="access-subtitle">
            Enter your corporate training access code to unlock your personalized AI lesson recap.
          </p>
        </div>

        {/* Login / Access Form */}
        <form className="access-form" onSubmit={handleSubmit}>
          <div className="access-input-container">
            <label htmlFor="code" className="access-input-label">
              Company Access Code
            </label>
            <div className="access-input-wrapper">
              <span className="input-icon" aria-hidden="true">🔑</span>
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="off"
                autoFocus
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                className="access-input"
                placeholder="Enter access code"
                aria-label="Company access code"
                spellCheck={false}
              />
            </div>
          </div>

          {error ? (
            <div className="access-error-box" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <p className="form-error access-error">{error}</p>
            </div>
          ) : null}

          <button type="submit" className="btn-primary access-continue-btn">
            <span>Continue to Modules</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </main>
  );
}
