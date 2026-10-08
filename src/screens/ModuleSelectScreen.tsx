import { useState } from "react";
import { unlockAudioSystem } from "../audio/AudioController";
import { CourseTrainingTimer, resetTrainingSessionTimer } from "../components/CourseTrainingTimer";
import { FuturisticBackground } from "../components/FuturisticBackground";
import { ModuleModal } from "../components/ModuleModal";
import { ProgrammeProgressSummary } from "../components/ProgrammeProgressSummary";
import { getLessonRecap } from "../content/registry";
import { useLearnerProgress } from "../services/learnerProgressStore";
import type { CourseModule } from "../types/lesson";

type Props = {
  modules: CourseModule[];
  completedModuleIds?: string[];
  moduleProgress?: Record<string, number>;
  onSelectModule: (moduleId: string) => void;
  onBack: () => void;
};

type ViewMode = "card" | "index";

export function ModuleSelectScreen({
  modules,
  onSelectModule,
  onBack,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("index");
  const [modalModule, setModalModule] = useState<CourseModule | null>(null);
  const { getRecord } = useLearnerProgress();

  const handleStartModule = (moduleId: string) => {
    const recap = getLessonRecap(moduleId);
    unlockAudioSystem(recap?.beats[0]?.audioSrc);
    onSelectModule(moduleId);
  };

  const handleExitLogout = () => {
    resetTrainingSessionTimer();
    onBack();
  };

  return (
    <main className="screen module-screen-root">
      {/* 2026 AI Connected Futuristic Living Background */}
      <FuturisticBackground intensity={0.82} showGeometry={true} />

      <div className="screen-container module-screen-container">
        {/* Top Application Bar */}
        <header className="select-app-bar">
          <div className="app-bar-left">
            <button
              type="button"
              className="text-btn app-bar-exit-btn"
              onClick={handleExitLogout}
              aria-label="Exit or logout to access screen"
            >
              <span className="btn-arrow" aria-hidden="true">←</span>
              <span>Exit / Logout</span>
            </button>

            <div className="app-bar-brand">
              <div className="kadosh-brand-badge header-badge" aria-label="KadoshAI">
                <img
                  src={`${import.meta.env.BASE_URL}assets/branding/kadoshai-logo.png`}
                  alt="KadoshAI"
                  className="kadosh-logo-img"
                />
              </div>
              <span className="demo-pill-badge">Catchup</span>
            </div>
          </div>

          <div className="app-bar-right">
            {/* Dynamic Course-Level Total Training Remaining Time Widget */}
            <CourseTrainingTimer modules={modules} />
          </div>
        </header>

        {/* Section A: Corporate Introduction Section */}
        <section className="corporate-intro-section" aria-labelledby="intro-heading">
          <div className="intro-eyebrow-row">
            <span className="intro-eyebrow-badge">CURRICULUM OVERVIEW</span>
            <span className="intro-programme-line">Lesson 1 · Level 1: AI Foundations & Literacy</span>
          </div>

          <h1 id="intro-heading" className="intro-main-title">
            WELCOME TO YOUR AI TRAINING RECAP
          </h1>

          <p className="intro-lead-text">
            &ldquo;Access missed training lessons, review key concepts and continue learning at your own pace.&rdquo;
          </p>

          <p className="intro-supporting-text">
            Select a module to begin your recap, or use Index View to explore the full training programme.
          </p>
        </section>

        {/* Programme Progress Summary Section */}
        <ProgrammeProgressSummary modules={modules} />

        {/* Section B: Module Section Outer Border / Frame */}
        <section className="module-frame-container" aria-label="Training Modules Area">
          {/* Subtle Ambient Frame Light */}
          <div className="frame-ambient-top-light" aria-hidden="true" />

          {/* Frame Header Bar: Title + View Switcher */}
          <div className="module-frame-header">
            <div className="frame-title-group">
              <span className="frame-section-title">TRAINING MODULES</span>
              <span className="frame-count-badge">
                {modules.filter((m) => m.available).length} of {modules.length} Ready to Play
              </span>
            </div>

            {/* Section D: View Switcher (INDEX VIEW first, CARD VIEW second) */}
            <div className="view-toggle-container" role="tablist" aria-label="View Mode Switcher">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "index"}
                className={`view-toggle-btn ${viewMode === "index" ? "is-active" : ""}`}
                onClick={() => setViewMode("index")}
              >
                <span className="toggle-glyph" aria-hidden="true">☰</span>
                <span>INDEX VIEW</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "card"}
                className={`view-toggle-btn ${viewMode === "card" ? "is-active" : ""}`}
                onClick={() => setViewMode("card")}
              >
                <span className="toggle-glyph" aria-hidden="true">⊞</span>
                <span>CARD VIEW</span>
              </button>
            </div>
          </div>

          {/* Section D: View Modes */}
          {viewMode === "card" ? (
            /* CARD VIEW: Executive AI Training Showcase */
            <div className="card-grid" role="region" aria-label="Executive AI Training Showcase">
              {modules.map((module, index) => {
                const record = getRecord(module.id);
                const isCompleted = record.status === "completed";
                const isInProgress = record.status === "in_progress";
                const recap = getLessonRecap(module.id);
                const modDuration = recap?.durationSec ?? (module.recapMinutes ? module.recapMinutes * 60 : 600);
                const progressPercent = modDuration > 0
                  ? Math.min(99, Math.round(((record.lastLessonTimeSec || 0) / modDuration) * 100))
                  : 0;

                return (
                  <div
                    key={module.id}
                    className={`module-card module-accent-${module.moduleNumber} ${
                      isCompleted ? "is-card-completed" : ""
                    } ${isInProgress ? "is-card-in-progress" : ""}`}
                    style={{ "--card-index": index } as React.CSSProperties}
                  >
                    {/* Atmospheric Ambient Glow & Top Accent Edge */}
                    <div className="card-ambient-glow" aria-hidden="true" />
                    <div className="card-top-light-edge" aria-hidden="true" />

                    {/* Animated moving sheen highlight across hover state */}
                    <div className="card-shimmer-highlight" aria-hidden="true" />

                    <div className="card-content">
                      {/* Top Row: Executive Anchor Badge + Status Pill + View Details */}
                      <div className="card-top-row">
                        <div className="card-num-anchor">
                          <span className="card-num-digits">
                            {String(module.moduleNumber).padStart(2, "0")}
                          </span>
                          <span className="card-num-sub">MODULE</span>
                        </div>

                        <div className="card-top-actions">
                          <div className="card-status-pill-wrap">
                            {isCompleted ? (
                              <span className="tag-status is-completed">✓ Completed</span>
                            ) : isInProgress ? (
                              <span className="tag-status is-in-progress">
                                <span className="status-dot pulsating" aria-hidden="true" />
                                <span>In Progress ({progressPercent}%)</span>
                              </span>
                            ) : (
                              <span className="tag-status is-ready">● Ready</span>
                            )}
                          </div>

                          {/* Quick Info Pill Button */}
                          <button
                            type="button"
                            className="card-details-pill-btn"
                            onClick={() => setModalModule(module)}
                            title={`View curriculum syllabus and objectives for Module ${module.moduleNumber}`}
                            aria-label={`View curriculum syllabus and objectives for Module ${module.moduleNumber}`}
                          >
                            <span className="pill-btn-icon" aria-hidden="true">ⓘ</span>
                            <span className="pill-btn-label">View Details</span>
                          </button>
                        </div>
                      </div>

                      {/* Middle Zone: Curriculum Hierarchy & Description */}
                      <div className="card-heading-group">
                        <span className="card-curriculum-parent">{module.title}</span>
                        <h2 className="module-card-title">{module.subtitle}</h2>
                      </div>

                      <p className="lesson-desc">{module.description}</p>

                      {/* Metadata Chips: Time + 3D Instructor + Knowledge Check */}
                      <div className="card-meta-chips">
                        <span className="meta-chip">
                          <span className="meta-icon" aria-hidden="true">⏱️</span>
                          <span>~{module.recapMinutes} min</span>
                        </span>
                        <span className="meta-chip">
                          <span className="meta-icon" aria-hidden="true">🤖</span>
                          <span>Awang 3D</span>
                        </span>
                        <span className="meta-chip">
                          <span className="meta-icon" aria-hidden="true">🎯</span>
                          <span>Knowledge Check</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="lesson-action">
                      {module.available ? (
                        <div className="module-action-stack">
                          <button
                            type="button"
                            className="btn-primary card-start-btn"
                            onClick={() => handleStartModule(module.id)}
                            title={
                              isCompleted
                                ? `Review Module ${module.moduleNumber} Recap`
                                : isInProgress
                                ? `Continue Module ${module.moduleNumber} Recap`
                                : `Start Module ${module.moduleNumber} Recap`
                            }
                          >
                            <span>
                              {isCompleted
                                ? "Review Recap"
                                : isInProgress
                                ? "Continue Recap"
                                : module.moduleNumber === 1
                                ? "Start Full Recap (~10 min)"
                                : `Start Module ${module.moduleNumber} Recap (~10 min)`}
                            </span>
                            <span className="btn-arrow" aria-hidden="true">→</span>
                          </button>

                          {module.moduleNumber === 1 && (
                            <button
                              type="button"
                              className="btn-outline card-demo-btn"
                              onClick={() => handleStartModule("module-1-demo")}
                              title="Play 78s Technical Demo"
                            >
                              Play 78s Technical Demo
                            </button>
                          )}
                        </div>
                      ) : (
                        <button type="button" className="btn-secondary" disabled>
                          Content mapping in progress
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* INDEX VIEW: Executive Curriculum Navigator */
            <div className="index-navigator-root" role="region" aria-label="Executive Curriculum Navigator">
              {/* Executive Summary Header Bar */}
              <div className="index-summary-bar">
                <div className="index-summary-header">
                  <span className="index-summary-badge">PROGRAMME DIRECTORY</span>
                  <h2 className="index-summary-heading">Executive AI Training Roadmap</h2>
                </div>
                <div className="index-summary-chips">
                  <span className="index-summary-chip">
                    <span className="summary-chip-val">{modules.length}</span>
                    <span className="summary-chip-label">Modules</span>
                  </span>
                  <span className="index-summary-chip">
                    <span className="summary-chip-val">~{modules.reduce((acc, m) => acc + (m.recapMinutes || 10), 0)}</span>
                    <span className="summary-chip-label">Min Total</span>
                  </span>
                  <span className="index-summary-chip">
                    <span className="summary-chip-icon">🤖</span>
                    <span className="summary-chip-label">Awang 3D</span>
                  </span>
                  <span className="index-summary-chip">
                    <span className="summary-chip-icon">⚡</span>
                    <span className="summary-chip-label">Self-Paced</span>
                  </span>
                  <span className="index-summary-chip is-completion-chip">
                    <span className="summary-chip-val">
                      {modules.filter((m) => getRecord(m.id).status === "completed").length} of {modules.length}
                    </span>
                    <span className="summary-chip-label">Completed</span>
                  </span>
                </div>
              </div>

              {/* Connected Curriculum Timeline & Module Rows */}
              <div className="index-timeline-container">
                {/* Glowing Vertical Journey Rail */}
                <div className="index-journey-rail" aria-hidden="true">
                  <div className="rail-line-glow" />
                </div>

                <div className="index-module-stack">
                  {modules.map((module, index) => {
                    const record = getRecord(module.id);
                    const isCompleted = record.status === "completed";
                    const isInProgress = record.status === "in_progress";
                    const recap = getLessonRecap(module.id);
                    const modDuration = recap?.durationSec ?? (module.recapMinutes ? module.recapMinutes * 60 : 600);
                    const progressPercent = modDuration > 0
                      ? Math.min(99, Math.round(((record.lastLessonTimeSec || 0) / modDuration) * 100))
                      : 0;

                    return (
                      <div
                        key={module.id}
                        className={`index-module-card module-accent-${module.moduleNumber} ${
                          isCompleted ? "is-module-completed" : ""
                        } ${isInProgress ? "is-module-in-progress" : ""}`}
                        style={{ "--row-index": index } as React.CSSProperties}
                        onClick={() => setModalModule(module)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setModalModule(module);
                          }
                        }}
                        title={`Click to view curriculum details for Module ${module.moduleNumber}: ${module.subtitle}`}
                      >
                        {/* Shimmer light sweep highlight */}
                        <div className="index-row-shimmer" aria-hidden="true" />

                        {/* Timeline Node Connection */}
                        <div className="index-timeline-node" aria-hidden="true">
                          <div className="node-outer-ring">
                            <div className="node-inner-dot" />
                          </div>
                        </div>

                        {/* Zone 1: Large Numerical Anchor */}
                        <div className="index-anchor-col">
                          <div className="index-number-badge">
                            <span className="index-number-digits">
                              {String(module.moduleNumber).padStart(2, "0")}
                            </span>
                            <span className="index-number-label">MODULE</span>
                          </div>
                        </div>

                        {/* Zone 2: Content & Objectives */}
                        <div className="index-content-col">
                          <div className="index-title-row">
                            <h3 className="index-title-text">{module.subtitle}</h3>
                            <span className="index-curriculum-parent">{module.title}</span>
                          </div>
                          <p className="index-description-text">{module.description}</p>
                          <div className="index-meta-row">
                            <span className="index-meta-pill">
                              <span className="meta-icon" aria-hidden="true">⏱️</span>
                              <span>~{module.recapMinutes} min</span>
                            </span>
                            <span className="index-meta-pill">
                              <span className="meta-icon" aria-hidden="true">🤖</span>
                              <span>Awang 3D</span>
                            </span>
                            <span className="index-meta-pill">
                              <span className="meta-icon" aria-hidden="true">🎯</span>
                              <span>Knowledge Check</span>
                            </span>
                          </div>
                        </div>

                        {/* Zone 3: Status & Action Buttons */}
                        <div className="index-action-col" onClick={(e) => e.stopPropagation()}>
                          <div className="index-status-indicator">
                            {isCompleted ? (
                              <span className="tag-status is-completed">✓ Completed</span>
                            ) : isInProgress ? (
                              <span className="tag-status is-in-progress">
                                <span className="status-dot pulsating" aria-hidden="true" />
                                <span>In Progress ({progressPercent}%)</span>
                              </span>
                            ) : (
                              <span className="tag-status is-ready">● Ready</span>
                            )}
                          </div>

                          <div className="index-buttons-row">
                            <button
                              type="button"
                              className="index-details-btn"
                              onClick={() => setModalModule(module)}
                              title={`View full syllabus and objectives for Module ${module.moduleNumber}`}
                            >
                              <span className="btn-icon" aria-hidden="true">ⓘ</span>
                              <span>View Details</span>
                            </button>

                            {module.available ? (
                              <button
                                type="button"
                                className="btn-primary index-start-btn"
                                onClick={() => handleStartModule(module.id)}
                                title={
                                  isCompleted
                                    ? `Review Module ${module.moduleNumber} Recap`
                                    : isInProgress
                                    ? `Continue Module ${module.moduleNumber} Recap`
                                    : `Start Module ${module.moduleNumber} Recap`
                                }
                              >
                                <span>{isCompleted ? "Review Recap" : isInProgress ? "Continue Recap" : "Start Recap"}</span>
                                <span className="btn-arrow" aria-hidden="true">→</span>
                              </button>
                            ) : (
                              <button type="button" className="btn-secondary index-start-btn" disabled>
                                In Progress
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Section E: Module Modal Popup */}
      <ModuleModal
        module={modalModule}
        isOpen={modalModule !== null}
        isCompleted={modalModule ? getRecord(modalModule.id).status === "completed" : false}
        isInProgress={modalModule ? getRecord(modalModule.id).status === "in_progress" : false}
        onClose={() => setModalModule(null)}
        onStartRecap={handleStartModule}
        onStartDemo={handleStartModule}
      />
    </main>
  );
}
