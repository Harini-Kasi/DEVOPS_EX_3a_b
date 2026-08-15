import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AppraisalTab from "../components/staff/AppraisalTab";
import HistoryTab from "../components/staff/HistoryTab";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { tab: "appraisal", tag: "01", label: "My Appraisal" },
  { tab: "history", tag: "02", label: "My Submissions" },
];

export default function StaffDashboard() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appraisal");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === "history") {
      setHistoryRefreshKey((k) => k + 1);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSubmitted() {
    setHistoryRefreshKey((k) => k + 1);
  }

  return (
    <section id="staffDashboard" className="dashboard">
      <Sidebar
        title="Staff Portal"
        navItems={NAV_ITEMS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        avatarText={session?.name ? session.name.charAt(0).toUpperCase() : "S"}
        userLabel={session?.name || "Faculty"}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <div className={activeTab === "appraisal" ? "" : "hidden"}>
          <AppraisalTab onSubmitted={handleSubmitted} />
        </div>
        <div className={activeTab === "history" ? "" : "hidden"}>
          <HistoryTab refreshKey={historyRefreshKey} />
        </div>
      </main>
    </section>
  );
}
