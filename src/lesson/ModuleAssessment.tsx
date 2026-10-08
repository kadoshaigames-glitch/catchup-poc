import { useMemo, useState } from "react";
import {
  getModuleQuizData,
  type ModuleQuizData,
  type QuizQuestion,
} from "../content/quizData";
import {
  recordConfidenceScore,
  recordQuizScore,
} from "../services/learnerProgressStore";

type Props = {
  moduleId: string;
  onComplete: (results?: {
    quizScore: number;
    quizTotal: number;
    confidenceAverage: number;
  }) => void;
  onReviewLesson?: () => void;
};

type AssessmentStep = "quiz" | "self-report" | "results";

const SELF_REPORT_STATEMENTS = [
  {
    id: 1,
    statement: "I understand the main concepts from this module.",
  },
  {
    id: 2,
    statement: "I could apply these ideas to a real workplace task.",
  },
  {
    id: 3,
    statement: "I know when to use the method/tools taught here.",
  },
  {
    id: 4,
    statement: "I know which areas I still need to review.",
  },
];

export function ModuleAssessment({ moduleId, onComplete, onReviewLesson }: Props) {
  const quizData: ModuleQuizData = useMemo(() => getModuleQuizData(moduleId), [moduleId]);

  // Assessment flow step
  const [step, setStep] = useState<AssessmentStep>("quiz");

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<
    Record<string, { selectedId: string; isCorrect: boolean; topicTag: string }>
  >({});

  // Self-report ratings (1-5 for statements 1-4)
  const [ratings, setRatings] = useState<Record<number, number>>({
    1: 4,
    2: 4,
    3: 4,
    4: 4,
  });

  const currentQuestion: QuizQuestion | undefined =
    quizData.questions[currentQuestionIndex];

  // Handle selecting an option
  const handleSelectOption = (id: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(id);
  };

  // Submit answer for current question
  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;
    const isCorrect = selectedOptionId === currentQuestion.correctId;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedId: selectedOptionId,
        isCorrect,
        topicTag: currentQuestion.topicTag,
      },
    }));
    setIsAnswerSubmitted(true);
  };

  // Move to next question or to self-report
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      const score = Object.values(answers).filter((a) => a.isCorrect).length;
      recordQuizScore(moduleId, score, quizData.questions.length);
      setStep("self-report");
    }
  };

  // Self-report rating update
  const handleRatingChange = (statementId: number, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [statementId]: value,
    }));
  };

  // Transition from self-report to results
  const handleFinishSelfReport = () => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = values.length ? Math.round((sum / values.length) * 10) / 10 : 4;
    recordConfidenceScore(moduleId, avg);
    setStep("results");
  };

  // Reset quiz to retake
  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setStep("quiz");
  };

  // Results calculations
  const totalQuestions = quizData.questions.length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  const strengthsTopics = useMemo(() => {
    const set = new Set<string>();
    Object.values(answers).forEach((a) => {
      if (a.isCorrect) set.add(a.topicTag);
    });
    return Array.from(set);
  }, [answers]);

  const reviewTopics = useMemo(() => {
    const set = new Set<string>();
    Object.values(answers).forEach((a) => {
      if (!a.isCorrect) set.add(a.topicTag);
    });
    return Array.from(set);
  }, [answers]);

  // Average confidence score (1-5)
  const averageConfidence = useMemo(() => {
    const values = Object.values(ratings);
    if (!values.length) return 4;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / values.length) * 10) / 10;
  }, [ratings]);

  // Targeted quick recap reminders
  const recapBulletPoints = useMemo(() => {
    const bullets: string[] = [];
    if (reviewTopics.length > 0) {
      for (const topic of reviewTopics) {
        const topicRecaps = quizData.topicRecaps[topic];
        if (topicRecaps) {
          bullets.push(...topicRecaps);
        }
        if (bullets.length >= 4) break;
      }
    }

    // If learner got everything correct or we need more bullets, take from top topics
    if (bullets.length < 2) {
      const allTopics = Object.keys(quizData.topicRecaps);
      for (const topic of allTopics) {
        const items = quizData.topicRecaps[topic];
        if (items) {
          for (const item of items) {
            if (!bullets.includes(item)) {
              bullets.push(item);
            }
            if (bullets.length >= 4) break;
          }
        }
        if (bullets.length >= 4) break;
      }
    }
    return bullets.slice(0, 4);
  }, [reviewTopics, quizData]);

  return (
    <div className="assessment-backdrop" role="dialog" aria-modal="true">
      <div className="assessment-card">
        {/* ================================================================= */}
        {/* STEP 1: FINAL QUIZ                                                */}
        {/* ================================================================= */}
        {step === "quiz" && currentQuestion && (
          <div className="assessment-quiz-view">
            <header className="assessment-header">
              <div className="assessment-header-meta">
                <span className="assessment-badge">FINAL KNOWLEDGE CHECK</span>
                <span className="assessment-progress-tag">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <h2 className="assessment-title">{quizData.title}</h2>
              <div className="assessment-progress-bar">
                <div
                  className="assessment-progress-fill"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </header>

            <div className="assessment-question-body">
              <p className="assessment-question-text">{currentQuestion.question}</p>
              <ul className="assessment-options-list">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = isAnswerSubmitted && option.id === currentQuestion.correctId;
                  const isWrong =
                    isAnswerSubmitted && isSelected && option.id !== currentQuestion.correctId;

                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        className={[
                          "assessment-option-btn",
                          isSelected ? "is-selected" : "",
                          isCorrect ? "is-correct" : "",
                          isWrong ? "is-wrong" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => handleSelectOption(option.id)}
                        disabled={isAnswerSubmitted}
                      >
                        <span className="assessment-option-letter">
                          {option.id.toUpperCase()}
                        </span>
                        <span className="assessment-option-label">{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Instant feedback card after answering */}
              {isAnswerSubmitted && (
                <div
                  className={`assessment-feedback-card ${
                    selectedOptionId === currentQuestion.correctId ? "is-correct" : "is-wrong"
                  }`}
                >
                  <div className="feedback-status">
                    {selectedOptionId === currentQuestion.correctId ? (
                      <span className="feedback-badge success">✓ Correct</span>
                    ) : (
                      <span className="feedback-badge warning">✕ Review Needed</span>
                    )}
                    <span className="feedback-topic">Topic: {currentQuestion.topicTag}</span>
                  </div>
                  <p className="feedback-text">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            <footer className="assessment-footer">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  className="btn-primary assessment-action-btn"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary assessment-action-btn"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex + 1 < totalQuestions
                    ? "Next Question →"
                    : "Proceed to Self-Report →"}
                </button>
              )}
            </footer>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: MINI SELF-REPORT                                          */}
        {/* ================================================================= */}
        {step === "self-report" && (
          <div className="assessment-selfreport-view">
            <header className="assessment-header">
              <span className="assessment-badge">CONFIDENCE CHECK</span>
              <h2 className="assessment-title">HOW CONFIDENT DO YOU FEEL?</h2>
              <p className="assessment-subtitle">
                Rate your agreement on a scale from 1 (Low) to 5 (High). This helps identify areas for targeted recap.
              </p>
            </header>

            <div className="selfreport-list">
              {SELF_REPORT_STATEMENTS.map((item) => {
                const currentRating = ratings[item.id] ?? 4;
                return (
                  <div key={item.id} className="selfreport-item">
                    <p className="selfreport-statement">{item.statement}</p>
                    <div className="selfreport-rating-group">
                      <span className="rating-anchor">Low</span>
                      <div className="rating-buttons">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`rating-btn ${currentRating === val ? "is-active" : ""}`}
                            onClick={() => handleRatingChange(item.id, val)}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <span className="rating-anchor">High</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="assessment-footer">
              <button
                type="button"
                className="btn-primary assessment-action-btn"
                onClick={handleFinishSelfReport}
              >
                View Results & Recap →
              </button>
            </footer>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: RESULTS / IMPROVEMENT REPORT                              */}
        {/* ================================================================= */}
        {step === "results" && (
          <div className="assessment-results-view">
            <header className="assessment-header results-header">
              <span className="assessment-badge success">RECAP ACCOMPLISHED</span>
              <h2 className="assessment-title">MODULE COMPLETE</h2>
              <div className="results-score-row">
                <div className="score-card">
                  <span className="score-label">Quiz Score</span>
                  <span className="score-number">
                    {correctCount} <span className="score-denom">/ {totalQuestions}</span>
                  </span>
                  <span
                    className="score-pct"
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--accent-gold)",
                      fontWeight: 600,
                      marginTop: "2px",
                    }}
                  >
                    {Math.round((correctCount / totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="score-card">
                  <span className="score-label">Confidence</span>
                  <span className="score-number">
                    {averageConfidence} <span className="score-denom">/ 5</span>
                  </span>
                </div>
              </div>
            </header>

            <div className="results-body">
              {/* What you're doing well */}
              <div className="results-section">
                <h3 className="results-section-title success-text">
                  <span className="section-icon">✓</span> WHAT YOU'RE DOING WELL
                </h3>
                {strengthsTopics.length > 0 ? (
                  <div className="topic-tags-wrap">
                    {strengthsTopics.map((topic) => (
                      <span key={topic} className="topic-chip is-strength">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="results-empty-note">
                    Complete additional reviews to build core concept mastery.
                  </p>
                )}
              </div>

              {/* Good areas to review */}
              <div className="results-section">
                <h3 className="results-section-title review-text">
                  <span className="section-icon">⚑</span> GOOD AREAS TO REVIEW
                </h3>
                {reviewTopics.length > 0 ? (
                  <div className="topic-tags-wrap">
                    {reviewTopics.map((topic) => (
                      <span key={topic} className="topic-chip is-review">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="results-success-note">
                    Outstanding! You demonstrated 100% accuracy across all assessed topics.
                  </p>
                )}
              </div>

              {/* Quick Recap */}
              <div className="results-section recap-section">
                <h3 className="results-section-title">
                  <span className="section-icon">💡</span> QUICK RECAP
                </h3>
                <ul className="recap-bullets-list">
                  {recapBulletPoints.map((bullet, idx) => (
                    <li key={idx} className="recap-bullet-item">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <footer className="assessment-footer results-footer">
              <button
                type="button"
                className="btn-primary completion-btn"
                onClick={() =>
                  onComplete({
                    quizScore: correctCount,
                    quizTotal: totalQuestions,
                    confidenceAverage: averageConfidence,
                  })
                }
              >
                Complete Module
              </button>
              <div className="results-secondary-actions">
                {onReviewLesson && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={onReviewLesson}
                  >
                    Review Lesson
                  </button>
                )}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handleRetake}
                >
                  Retake Quiz
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
