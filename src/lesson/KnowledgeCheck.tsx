type Props = {
  question: string;
  options: { id: string; label: string }[];
  correctId: string;
  confirmText: string;
  selectedOptionId: string | null;
  submitted: boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onContinue: () => void;
};

export function KnowledgeCheck({
  question,
  options,
  correctId,
  confirmText,
  selectedOptionId,
  submitted,
  onSelect,
  onSubmit,
  onContinue,
}: Props) {
  return (
    <div className="check-panel" role="dialog" aria-labelledby="check-title">
      <p className="eyebrow">Knowledge check</p>
      <h2 id="check-title">{question}</h2>
      <ul className="check-options">
        {options.map((option) => {
          const selected = option.id === selectedOptionId;
          const isCorrect = submitted && option.id === correctId;
          const isWrong = submitted && selected && option.id !== correctId;
          return (
            <li key={option.id}>
              <button
                type="button"
                className={[
                  "check-option",
                  selected ? "is-selected" : "",
                  isCorrect ? "is-correct" : "",
                  isWrong ? "is-wrong" : "",
                ].join(" ")}
                onClick={() => onSelect(option.id)}
                disabled={submitted}
              >
                <span className="check-letter">{option.id.toUpperCase()}</span>
                <span>{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {!submitted ? (
        <button
          type="button"
          className="btn-primary"
          disabled={!selectedOptionId}
          onClick={onSubmit}
        >
          Submit answer
        </button>
      ) : (
        <div className="check-after">
          <p className="check-confirm">{confirmText}</p>
          <button type="button" className="btn-primary" onClick={onContinue}>
            Continue lesson
          </button>
        </div>
      )}
    </div>
  );
}
