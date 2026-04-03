import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { useStore } from './store/useStore';

const App = () => {
  const { role, theme } = useStore();
  const [loading, setLoading] = React.useState(true);

  // Theme Sync
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Mock API integration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // simulate API delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'var(--bg)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--line)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--gold)', letterSpacing: '0.1em', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fetching Data...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="shell">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>

        {role === 'Viewer' && (
          <div className="viewer-bar">
            <div className="viewer-bar-dot"></div>
            Read-Only Mode Active
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
