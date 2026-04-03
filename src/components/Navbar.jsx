import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const { role, setRole, theme, setTheme } = useStore();
  const location = useLocation();

  return (
    <>
      <div className="topbar">
        <div className="wordmark">
          <span className="wordmark-name">Fintrack</span>
          <span className="wordmark-tag">PRO</span>
        </div>
        <div className="topbar-right">
          <button 
            className="role-pill" 
            style={{ padding: '0 10px' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div className="role-badge">
            Current role: <strong>{role}</strong>
          </div>
          <select 
            className="role-pill" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Sidebar is technically separate in the shell grid, but we can render it here for simplicity 
          assuming the parent wraps Navbar and Outlet in a .shell wrapper, or we can just render it here 
          using a React Fragment. */}
      <div className="sidebar">
        <div className="sidebar-section-label">Main Menu</div>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive && location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">💳</span>
          Transactions
        </NavLink>
        <NavLink 
          to="/insights" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">💡</span>
          Insights
        </NavLink>
      </div>
    </>
  );
};
