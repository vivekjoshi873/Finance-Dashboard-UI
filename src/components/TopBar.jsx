import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import "./TopBar.css";

export default function TopBar() {
  const { darkMode, toggleDarkMode, role, setRole } = useStore();
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 500);
    return () => clearTimeout(t);
  }, [role]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <svg className="topbar-logo-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h1 className="topbar-title">Fintrack</h1>
      </div>

      <div className="topbar-right">
        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          <span className={`theme-icon ${darkMode ? "rotated" : ""}`}>
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </span>
        </button>

        {/* Role switcher */}
        <div className="role-switcher">
          <select
            id="role-select"
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <span
            className={`badge ${role === "admin" ? "badge-admin" : "badge-viewer"} ${pulsing ? "badge-pulse" : ""}`}
          >
            {role}
          </span>
        </div>
      </div>
    </header>
  );
}
