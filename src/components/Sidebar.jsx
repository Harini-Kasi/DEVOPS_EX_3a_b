import { Link } from "react-router-dom";

export default function Sidebar({ title, navItems, activeTab, onTabChange, avatarText, userLabel, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-mark small">FPA</div>
        <div className="sidebar-title">{title}</div>
      </div>
      <nav className="side-nav">
        {navItems.map((item) => (
          <button
            key={item.tab}
            type="button"
            className={`nav-btn${activeTab === item.tab ? " active" : ""}`}
            data-tab={item.tab}
            onClick={() => onTabChange(item.tab)}
          >
            <span className="nav-tag">{item.tag}</span> {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="user-avatar">{avatarText}</span>
          <span>{userLabel}</span>
        </div>
        <Link to="/settings" className="logout-btn" style={{ display: "block", textAlign: "center", marginBottom: "0.6rem", textDecoration: "none" }}>
          Settings
        </Link>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
