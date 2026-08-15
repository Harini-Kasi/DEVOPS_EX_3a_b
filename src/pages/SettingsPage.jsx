import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function SettingsPage() {
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const { session } = useAuth();
  const navigate = useNavigate();

  function goBack() {
    if (session?.role === "admin") navigate("/admin");
    else if (session?.role === "staff") navigate("/staff");
    else navigate("/");
  }

  return (
    <section className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand-mark small">FPA</div>
          <div className="sidebar-title">Settings</div>
        </div>
        <nav className="side-nav">
          <button type="button" className="nav-btn active">
            <span className="nav-tag">01</span> Appearance
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={goBack}>
            &larr; Back
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="tab-panel">
          <header className="panel-header">
            <h2>Settings</h2>
            <p>Personalize how the appraisal system looks.</p>
          </header>

          <div className="settings-section card">
            <h3>Theme</h3>
            <p className="settings-desc">Switch between light and dark mode. Your choice is saved on this device.</p>
            <div className="theme-toggle-row">
              <button
                type="button"
                className={`theme-switch${theme === "dark" ? " is-dark" : ""}`}
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                <span className="switch-knob"></span>
              </button>
              <span className="theme-toggle-label">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </div>
          </div>

          <div className="settings-section card">
            <h3>Font Size</h3>
            <p className="settings-desc">Adjust the global text size across the whole application.</p>
            <div className="settings-option-row">
              {FONT_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`settings-choice-btn${fontSize === opt.value ? " active" : ""}`}
                  onClick={() => setFontSize(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
