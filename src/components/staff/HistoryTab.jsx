import { useMemo } from "react";
import SubmissionCard from "../SubmissionCard";
import { useAuth } from "../../context/AuthContext";
import { getSubmissions } from "../../utils/storage";

export default function HistoryTab({ refreshKey }) {
  const { session } = useAuth();

  const mine = useMemo(() => {
    return getSubmissions()
      .filter(
        (s) =>
          s.staffName === session.name &&
          s.department === session.department &&
          s.designation === session.designation
      )
      .slice()
      .reverse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.name, session.department, session.designation, refreshKey]);

  return (
    <div id="historyTab" className="tab-panel">
      <header className="panel-header">
        <h2>My Submissions</h2>
        <p>A record of every appraisal you have submitted.</p>
      </header>
      <div id="staffSubmissionsList" className="submissions-list">
        {mine.length === 0 ? (
          <div className="no-data-msg card">You haven't submitted any appraisals yet.</div>
        ) : (
          mine.map((sub) => <SubmissionCard key={sub.id} submission={sub} />)
        )}
      </div>
    </div>
  );
}
