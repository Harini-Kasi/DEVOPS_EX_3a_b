export default function StaffQuestionCard({ question, index, answer, onSelectChange, onEvidenceChange, hasError }) {
  const selectedScore = (() => {
    if (answer.optionIndex === "") return "0";
    const optionScore = question.options[+answer.optionIndex].score;
    const questionScore = (optionScore * question.weightage).toFixed(2).replace(/\.00$/, "");
    return questionScore;
  })();

  return (
    <div className={`staff-question-card${hasError ? " has-error" : ""}`} data-qid={question.id}>
      <div className="sq-head">
        <span className="q-tag">Q{String(index + 1).padStart(2, "0")}</span>
        <span className="weightage-badge">Weightage: {question.weightage}</span>
      </div>
      <p className="sq-text">{question.text}</p>
      <div className="sq-controls">
        <div className="sq-field">
          <label>Select Rating</label>
          <select
            className="opt-select"
            value={answer.optionIndex}
            onChange={(e) => onSelectChange(question.id, e.target.value)}
          >
            <option value="" disabled>
              Choose an option
            </option>
            {question.options.map((opt, i) => (
              <option key={i} value={i}>
                {opt.text} (score {opt.score})
              </option>
            ))}
          </select>
        </div>
        <div className="score-display">
          <span>Question Score</span>
          <span className="score-num">{selectedScore}</span>
        </div>
      </div>
      <div className="sq-field evidence-field">
        <label>Evidence / Remarks</label>
        <textarea
          className="evidence-text"
          placeholder="Provide supporting evidence for your selected rating..."
          value={answer.evidence}
          onChange={(e) => onEvidenceChange(question.id, e.target.value)}
        />
      </div>
      <div className="field-error-msg">Please select a rating and provide evidence for this question.</div>
    </div>
  );
}
