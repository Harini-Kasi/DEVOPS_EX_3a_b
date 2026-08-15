import { useRef, useState } from "react";
import QuestionCard from "./QuestionCard";
import { DEPARTMENTS, DESIGNATIONS } from "../../utils/constants";
import { designationLabel, formKey, getQuestions, saveQuestions } from "../../utils/storage";
import { useNotification } from "../../context/NotificationContext";

export default function QuestionBuilderTab() {
  const { showNotification } = useNotification();

  const [builderDept, setBuilderDept] = useState(DEPARTMENTS[0].value);
  const [builderDesig, setBuilderDesig] = useState(DESIGNATIONS[0].value);
  const [builderQuestions, setBuilderQuestions] = useState([]);
  const [builderStatus, setBuilderStatus] = useState("");
  const questionIdCounter = useRef(0);

  function loadBuilderForm() {
    const key = formKey(builderDept, builderDesig);
    const allQuestions = getQuestions();
    const existing = allQuestions[key];

    const loaded = existing ? JSON.parse(JSON.stringify(existing)) : [];
    questionIdCounter.current = loaded.length ? Math.max(...loaded.map((q) => q.id)) + 1 : 1;
    setBuilderQuestions(loaded);

    setBuilderStatus(
      existing
        ? `Loaded ${existing.length} question(s) for ${builderDept} / ${designationLabel(builderDesig)}.`
        : `No form saved yet for ${builderDept} / ${designationLabel(builderDesig)}. Start adding questions.`
    );
  }

  function addQuestionCard() {
    setBuilderQuestions((prev) => [
      ...prev,
      {
        id: questionIdCounter.current++,
        text: "",
        weightage: 1,
        options: [], // no default options — admin adds them with "+ Add Option"
      },
    ]);
  }

  function updateQuestionText(qId, value) {
    setBuilderQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, text: value } : q)));
  }

  function updateQuestionWeightage(qId, value) {
    const parsed = parseFloat(value) || 0;
    setBuilderQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, weightage: parsed } : q)));
  }

  function addOptionToQuestion(qId) {
    setBuilderQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, options: [...q.options, { text: "", score: 0 }] } : q))
    );
  }

  function deleteOptionFromQuestion(qId, optIndex) {
    const q = builderQuestions.find((item) => item.id === qId);
    if (!q) return;
    if (q.options.length <= 2) {
      showNotification("Each question needs at least 2 options.", "error");
      return;
    }
    setBuilderQuestions((prev) =>
      prev.map((item) =>
        item.id === qId ? { ...item, options: item.options.filter((_, i) => i !== optIndex) } : item
      )
    );
  }

  function updateOptionText(qId, optIndex, value) {
    setBuilderQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((opt, i) => (i === optIndex ? { ...opt, text: value } : opt)) }
          : q
      )
    );
  }

  function updateOptionScore(qId, optIndex, value) {
    const parsed = parseFloat(value) || 0;
    setBuilderQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((opt, i) => (i === optIndex ? { ...opt, score: parsed } : opt)) }
          : q
      )
    );
  }

  function deleteQuestion(qId) {
    setBuilderQuestions((prev) => prev.filter((item) => item.id !== qId));
  }

  function saveBuilderForm() {
    if (builderQuestions.length === 0) {
      showNotification("Add at least one question before saving.", "error");
      return;
    }

    // Validation: every question needs text, a positive weightage, and filled options
    for (let i = 0; i < builderQuestions.length; i++) {
      const q = builderQuestions[i];
      if (!q.text.trim()) {
        showNotification(`Question ${i + 1} is missing its question text.`, "error");
        return;
      }
      if (!q.weightage || q.weightage <= 0) {
        showNotification(`Question ${i + 1} needs a weightage greater than 0.`, "error");
        return;
      }
      if (q.options.length < 2) {
        showNotification(`Question ${i + 1} needs at least 2 answer options.`, "error");
        return;
      }
      if (q.options.some((opt) => !opt.text.trim())) {
        showNotification(`Question ${i + 1} needs every option label filled in.`, "error");
        return;
      }
    }

    const allQuestions = getQuestions();
    allQuestions[formKey(builderDept, builderDesig)] = builderQuestions;
    saveQuestions(allQuestions);

    setBuilderStatus(`Saved ${builderQuestions.length} question(s) for ${builderDept} / ${designationLabel(builderDesig)}.`);
    showNotification("Form saved successfully to local storage.", "success");
  }

  return (
    <div id="builderTab" className="tab-panel">
      <header className="panel-header">
        <h2>Question Builder</h2>
        <p>Design evaluation criteria for a specific department and designation.</p>
      </header>

      <div className="filter-bar card">
        <div className="filter-item">
          <label>Department</label>
          <select value={builderDept} onChange={(e) => setBuilderDept(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Designation</label>
          <select value={builderDesig} onChange={(e) => setBuilderDesig(e.target.value)}>
            {DESIGNATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-secondary" onClick={loadBuilderForm}>
          Load Form
        </button>
        <div className="filter-status">{builderStatus}</div>
      </div>

      <div id="questionList" className="question-list">
        {builderQuestions.length === 0 ? (
          <div className="empty-state card">
            <p>No questions yet.</p>
            <p className="empty-sub">Click "+ Add Question" to start building the evaluation form.</p>
          </div>
        ) : (
          builderQuestions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={index}
              onTextChange={updateQuestionText}
              onWeightageChange={updateQuestionWeightage}
              onOptionTextChange={updateOptionText}
              onOptionScoreChange={updateOptionScore}
              onAddOption={addOptionToQuestion}
              onDeleteOption={deleteOptionFromQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          ))
        )}
      </div>

      <div className="builder-actions">
        <button className="btn-outline" onClick={addQuestionCard}>
          + Add Question
        </button>
        <button className="btn-primary" onClick={saveBuilderForm}>
          Save Form
        </button>
      </div>
    </div>
  );
}
