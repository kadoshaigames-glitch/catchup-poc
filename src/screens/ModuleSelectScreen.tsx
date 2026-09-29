import { unlockAudioSystem } from "../audio/AudioController";
import type { CourseModule } from "../types/lesson";

type Props = {
  modules: CourseModule[];
  completedModuleIds?: string[];
  onSelectModule: (moduleId: string) => void;
  onBack: () => void;
};

export function ModuleSelectScreen({
  modules,
  completedModuleIds = [],
  onSelectModule,
  onBack,
}: Props) {
  return (
    <main className="screen">
      <div className="screen-container">
        <header className="screen-header">
          <div className="select-header-top">
            <button type="button" className="text-btn" onClick={onBack}>
              ← Exit / Logout
            </button>
            <span className="demo-pill-badge">Catchup Demo</span>
          </div>
          <p className="eyebrow">Lesson 1 · Level 1: AI Foundations & Literacy</p>
          <h1>Select an Individual Module Recap</h1>
          <p className="lede">
            Each module is an independent ~10-minute catch-up learning experience with its own
            content, script, 3D animated scenes, and knowledge check. All six modules of Lesson 1
            are now fully playable.
          </p>
        </header>

        <div className="card-grid">
          {modules.map((module) => {
            const isCompleted = completedModuleIds.includes(module.id);
            return (
              <div key={module.id} className="module-card">
                <div className="card-content">
                  <div className="lesson-tags">
                    <span className="card-badge">{module.title}</span>
                    {isCompleted ? (
                      <span className="tag-status is-completed">✓ Completed</span>
                    ) : module.available ? (
                      <span className="tag-status is-ready">{module.statusLabel}</span>
                    ) : (
                      <span className="tag-status is-locked">{module.statusLabel}</span>
                    )}
                  </div>
                  <h2>{module.subtitle}</h2>
                  <p className="lesson-desc">{module.description}</p>
                </div>
                <div className="lesson-action">
                  {module.available ? (
                    <div className="module-action-stack">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          unlockAudioSystem();
                          onSelectModule(module.id);
                        }}
                      >
                        {isCompleted
                          ? `Review Module ${module.moduleNumber} Recap`
                          : module.moduleNumber === 1
                          ? "Start Full Recap (~10 min)"
                          : `Start Module ${module.moduleNumber} Recap (~10 min)`}
                      </button>
                      {module.moduleNumber === 1 && (
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => {
                            unlockAudioSystem();
                            onSelectModule("module-1-demo");
                          }}
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
      </div>
    </main>
  );
}
