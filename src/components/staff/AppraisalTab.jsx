import { useEffect, useMemo, useState } from "react";
import StaffQuestionCard from "./StaffQuestionCard";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { designationLabel, formKey, getQuestions, getSubmissions, roundClean, saveSubmissions } from "../../utils/storage";

export default function AppraisalTab({ onSubmitted }) {
  const { session } = useAuth();
  const { showNotification } = useNotification();

  const questions = useMemo(() => {
    const allQuestions = getQuestions();
    const key = formKey(session.department, session.designation);
    return allQuestions[key] || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.department, session.designation, onSubmitted]);

  const [answers, setAnswers] = useState({});
  const [errorQids, setErrorQids] = useState(new Set());

  // Reset answers whenever the question set changes (e.g. after a submit / new form)
  useEffect(() => {
    const initial = {};
    questions.forEach((q) => {
      initial[q.id] = { optionIndex: "", evidence: "" };
    });
    setAnswers(initial);
    setErrorQids(new Set());
  }, [questions]);

  function handleSelectChange(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], optionIndex: value } }));
    setErrorQids((prev) => {
      const next = new Set(prev);
      next.delete(qId);
      return next;
    });
  }

  function handleEvidenceChange(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], evidence: value } }));
    setErrorQids((prev) => {
      const next = new Set(prev);
      next.delete(qId);
      return next;
    });
  }

  const { total, max } = useMemo(() => {
    let t = 0;
    let m = 0;
    questions.forEach((q) => {
      const maxOptionScore = Math.max(...q.options.map((o) => o.score));
      m += maxOptionScore * q.weightage;
      const answer = answers[q.id];
      if (answer && answer.optionIndex !== "") {
        const optionScore = q.options[+answer.optionIndex].score;
        t += optionScore * q.weightage;
      }
    });
    return { total: roundClean(t), max: roundClean(m) };
  }, [questions, answers]);

  function submitAppraisal() {
    if (questions.length === 0) {
      showNotification("There is no form available to submit.", "error");
      return;
    }

    let hasError = false;
    const newErrorQids = new Set();
    const submittedAnswers = [];
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      const answer = answers[q.id] || { optionIndex: "", evidence: "" };
      const evidence = answer.evidence.trim();

      const maxOptionScore = Math.max(...q.options.map((o) => o.score));
      maxScore += maxOptionScore * q.weightage;

      if (answer.optionIndex === "" || !evidence) {
        newErrorQids.add(q.id);
        hasError = true;
        return;
      }

      const optIndex = +answer.optionIndex;
      const option = q.options[optIndex];
      const questionScore = option.score * q.weightage;
      totalScore += questionScore;

      submittedAnswers.push({
        questionId: q.id,
        questionText: q.text,
        weightage: q.weightage,
        selectedOption: option.text,
        optionScore: option.score,
        questionScore: roundClean(questionScore),
        evidence,
      });
    });

    if (hasError) {
      setErrorQids(newErrorQids);
      showNotification("Please answer every question and provide evidence before submitting.", "error");
      return;
    }

    const submission = {
      id: Date.now(),
      staffName: session.name,
      department: session.department,
      designation: session.designation,
      answers: submittedAnswers,
      totalScore: roundClean(totalScore),
      maxScore: roundClean(maxScore),
      submittedAt: new Date().toISOString(),
    };

    const submissions = getSubmissions();
    submissions.push(submission);
    saveSubmissions(submissions);

    showNotification("Appraisal submitted successfully!", "success");

    // Reset the form for a clean slate
    const resetAnswers = {};
    questions.forEach((q) => {
      resetAnswers[q.id] = { optionIndex: "", evidence: "" };
    });
    setAnswers(resetAnswers);
    setErrorQids(new Set());

    if (onSubmitted) onSubmitted();
  }

  return (
    <div id="appraisalTab" className="tab-panel">
      <header className="panel-header">
        <h2>My Appraisal</h2>
        <p>Complete every criterion below with an honest rating and supporting evidence.</p>
      </header>

      <div className="profile-card card">
        <div className="profile-item">
          <span className="profile-label">Faculty Name</span>
          <span className="profile-value">{session.name || "—"}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Department</span>
          <span className="profile-value">{session.department || "—"}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Designation</span>
          <span className="profile-value">{session.designation ? designationLabel(session.designation) : "—"}</span>
        </div>
      </div>

      <div id="staffQuestionList" className="question-list">
        {questions.map((q, index) => (
          <StaffQuestionCard
            key={q.id}
            question={q}
            index={index}
            answer={answers[q.id] || { optionIndex: "", evidence: "" }}
            onSelectChange={handleSelectChange}
            onEvidenceChange={handleEvidenceChange}
            hasError={errorQids.has(q.id)}
          />
        ))}
      </div>

      {questions.length === 0 && (
        <div id="staffEmptyState" className="empty-state card">
          <p>No evaluation form has been published yet for your department and designation.</p>
          <p className="empty-sub">Please check back once the admin publishes the criteria.</p>
        </div>
      )}

      {questions.length > 0 && (
        <div id="totalBar" className="total-bar">
          <div className="total-info">
            <span className="total-label">Total Score</span>
            <span id="totalScoreValue" className="total-value">
              {total}
            </span>
            <span className="total-max">
              / <span id="totalMaxValue">{max}</span>
            </span>
          </div>
          <button id="submitAppraisalBtn" className="btn-primary" onClick={submitAppraisal}>
            Submit Appraisal
          </button>
        </div>
      )}
    </div>
  );
}
