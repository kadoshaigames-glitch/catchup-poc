type Props = {
  error: string | null;
  onSubmit: (code: string) => void;
  onDemoAccess?: () => void;
  onBack?: () => void;
};

export function AccessCodeScreen({ error, onSubmit, onDemoAccess, onBack }: Props) {
  return (
    <main className="access-screen">
      <div className="access-card">
        {onBack ? (
          <button
            type="button"
            className="access-back-btn"
            onClick={onBack}
            aria-label="Return to welcome screen"
          >
            ← Back
          </button>
        ) : null}

        <div className="access-brand-header">
          <div className="kadosh-brand-badge access-badge" aria-label="KadoshAI">
            <img
              src="/assets/branding/kadoshai-logo.png"
              alt="KadoshAI"
              className="kadosh-logo-img"
            />
          </div>
          <span className="demo-pill-badge">Catchup Demo</span>
        </div>

        <h1 className="access-title">Welcome to Catchup</h1>
        <p className="access-subtitle">Enter your company access code or continue with Demo Access.</p>

        <form
          className="access-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            onSubmit(String(data.get("code") ?? "").trim());
          }}
        >
          <div className="access-input-wrapper">
            <input
              id="code"
              name="code"
              type="text"
              autoComplete="off"
              autoFocus
              className="access-input"
              placeholder="Enter access code"
              aria-label="Company access code"
            />
          </div>
          {error ? <p className="form-error access-error">{error}</p> : null}
          <button type="submit" className="btn-primary access-continue-btn">
            Continue
          </button>
        </form>

        {onDemoAccess ? (
          <>
            <div className="access-demo-divider">
              <span>OR</span>
            </div>
            <button
              type="button"
              className="btn-demo-access"
              onClick={onDemoAccess}
            >
              Demo Access →
            </button>
          </>
        ) : null}

        <p className="access-hint">For code entry, use: <strong>TTDA-L1</strong></p>
      </div>
    </main>
  );
}
