import { useState } from "react";
import { designationLabel } from "../utils/storage";

export default function SubmissionCard({ submission }) {
  const [expanded, setExpanded] = useState(false);
  const dateStr = new Date(submission.submittedAt).toLocaleString();

  return (
    <div className="submission-card">
      <div className="submission-summary" onClick={() => setExpanded((prev) => !prev)}>
        <div className="submission-meta">
          <span className="submission-name">{submission.staffName}</span>
          <span className="submission-sub">
            {submission.department} · {designationLabel(submission.designation)} · {dateStr}
          </span>
        </div>
        <span className="submission-score">
          {submission.totalScore} / {submission.maxScore}
        </span>
      </div>
      <div className={`submission-details${expanded ? "" : " hidden"}`}>
        {expanded &&
          submission.answers.map((ans, i) => (
            <div className="submission-row" key={i}>
              <div className="sr-q">
                Q{String(i + 1).padStart(2, "0")}. {ans.questionText}
              </div>
              <div className="sr-meta">
                Weightage: {ans.weightage} · Selected: {ans.selectedOption} (score {ans.optionScore}) · Question
                Score: {ans.questionScore}
              </div>
              <div className="sr-evidence">&quot;{ans.evidence}&quot;</div>
            </div>
          ))}
      </div>
    </div>
  );
}
