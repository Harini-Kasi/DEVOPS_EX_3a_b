import { useMemo, useState } from "react";
import SubmissionCard from "../SubmissionCard";
import { DEPARTMENTS, DESIGNATIONS } from "../../utils/constants";
import { getSubmissions } from "../../utils/storage";

export default function SubmissionsTab({ refreshKey }) {
  const [deptFilter, setDeptFilter] = useState("");
  const [desigFilter, setDesigFilter] = useState("");

  const submissions = useMemo(() => {
    let list = getSubmissions();
    if (deptFilter) list = list.filter((s) => s.department === deptFilter);
    if (desigFilter) list = list.filter((s) => s.designation === desigFilter);
    // Most recent first
    return list.slice().reverse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptFilter, desigFilter, refreshKey]);

  return (
    <div id="submissionsTab" className="tab-panel">
      <header className="panel-header">
        <h2>Staff Submissions</h2>
        <p>Every appraisal submitted by staff, with computed totals.</p>
      </header>

      <div className="filter-bar card">
        <div className="filter-item">
          <label>Department</label>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Designation</label>
          <select value={desigFilter} onChange={(e) => setDesigFilter(e.target.value)}>
            <option value="">All Designations</option>
            {DESIGNATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div id="submissionsList" className="submissions-list">
        {submissions.length === 0 ? (
          <div className="no-data-msg card">No submissions match the selected filters yet.</div>
        ) : (
          submissions.map((sub) => <SubmissionCard key={sub.id} submission={sub} />)
        )}
      </div>
    </div>
  );
}
