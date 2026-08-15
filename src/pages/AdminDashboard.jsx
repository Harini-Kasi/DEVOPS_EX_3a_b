import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import QuestionBuilderTab from "../components/admin/QuestionBuilderTab";
import SubmissionsTab from "../components/admin/SubmissionsTab";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { tab: "builder", tag: "01", label: "Question Builder" },
  { tab: "submissions", tag: "02", label: "Submissions" },
];

export default function AdminDashboard() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("builder");
  const [submissionsRefreshKey, setSubmissionsRefreshKey] = useState(0);

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === "submissions") {
      setSubmissionsRefreshKey((k) => k + 1);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <section id="adminDashboard" className="dashboard">
      <Sidebar
        title="Admin Console"
        navItems={NAV_ITEMS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        avatarText="A"
        userLabel={session?.username || "Administrator"}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <div className={activeTab === "builder" ? "" : "hidden"}>
          <QuestionBuilderTab />
        </div>
        <div className={activeTab === "submissions" ? "" : "hidden"}>
          <SubmissionsTab refreshKey={submissionsRefreshKey} />
        </div>
      </main>
    </section>
  );
}
