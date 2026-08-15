import OptionRow from "./OptionRow";

export default function QuestionCard({
  question,
  index,
  onTextChange,
  onWeightageChange,
  onOptionTextChange,
  onOptionScoreChange,
  onAddOption,
  onDeleteOption,
  onDeleteQuestion,
}) {
  return (
    <div className="question-card" data-id={question.id}>
      <div className="question-card-head">
        <span className="q-tag">Q{String(index + 1).padStart(2, "0")}</span>
        <button type="button" className="delete-question-btn" onClick={() => onDeleteQuestion(question.id)}>
          Delete
        </button>
      </div>
      <div className="qc-row">
        <label>Question Text</label>
        <textarea
          className="q-text"
          rows={2}
          placeholder="Enter the evaluation question..."
          value={question.text}
          onChange={(e) => onTextChange(question.id, e.target.value)}
        />
      </div>
      <div className="qc-row weightage-row">
        <label>Weightage</label>
        <input
          type="number"
          className="q-weightage"
          min="0"
          step="0.5"
          value={question.weightage}
          onChange={(e) => onWeightageChange(question.id, e.target.value)}
        />
      </div>
      <div className="qc-row">
        <label>Answer Options &amp; Scores</label>
        <div className="options-list">
          {question.options.length === 0 ? (
            <p className="no-options-msg">No options yet — click "+ Add Option" below.</p>
          ) : (
            question.options.map((opt, i) => (
              <OptionRow
                key={i}
                option={opt}
                index={i}
                onTextChange={(idx, val) => onOptionTextChange(question.id, idx, val)}
                onScoreChange={(idx, val) => onOptionScoreChange(question.id, idx, val)}
                onDelete={(idx) => onDeleteOption(question.id, idx)}
              />
            ))
          )}
        </div>
        <button type="button" className="add-option-btn" onClick={() => onAddOption(question.id)}>
          + Add Option
        </button>
      </div>
    </div>
  );
}
