import type { CourseLesson } from "../types/lesson";

type Props = {
  lesson: CourseLesson;
  onSelectModule: (moduleId: string) => void;
  onBack: () => void;
};

export function LessonSelectScreen({ lesson, onSelectModule, onBack }: Props) {
  return (
    <main className="screen">
      <div className="screen-container">
        <header className="screen-header">
          <button type="button" className="text-btn" onClick={onBack}>
            ← Change access code
          </button>
          <p className="eyebrow">{lesson.title} · {lesson.subtitle}</p>
          <h1>Select an Individual Module Recap</h1>
          <p className="lede">
            Each module is an independent ~10-minute catch-up learning experience with its own
            content, script, 3D scenes, and knowledge check. Module 1 is active as a technical
            demonstration; Modules 2–6 have source content mapping in progress.
          </p>
        </header>

        <div className="lesson-list">
          {lesson.modules.map((mod) => {
            return (
              <div
                key={mod.id}
                className={mod.available ? "lesson-card is-available" : "lesson-card is-locked"}
              >
                <div className="lesson-info">
                  <div className="lesson-tags">
                    <span className="tag-section">{mod.title}</span>
                    <span className={mod.available ? "tag-status is-ready" : "tag-status is-locked"}>
                      {mod.statusLabel}
                    </span>
                  </div>
                  <h3>{mod.subtitle}</h3>
                  <p className="lesson-desc">{mod.description}</p>
                </div>
                <div className="lesson-action">
                  {mod.available ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onSelectModule(mod.id)}
                    >
                      Start Module 1 Recap
                    </button>
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
