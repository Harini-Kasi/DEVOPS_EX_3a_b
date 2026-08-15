export default function OptionRow({ option, index, onTextChange, onScoreChange, onDelete }) {
  const optionLetter = (i) => String.fromCharCode(65 + i); // A, B, C, D, E...

  return (
    <div className="option-row">
      <span className="opt-label">{optionLetter(index)}</span>
      <input
        type="text"
        className="opt-text"
        placeholder={`Option ${optionLetter(index)} text`}
        value={option.text}
        onChange={(e) => onTextChange(index, e.target.value)}
      />
      <input
        type="number"
        className="opt-score"
        placeholder="Score"
        value={option.score}
        onChange={(e) => onScoreChange(index, e.target.value)}
      />
      <button type="button" className="delete-option-btn" title="Delete option" onClick={() => onDelete(index)}>
        &times;
      </button>
    </div>
  );
}
