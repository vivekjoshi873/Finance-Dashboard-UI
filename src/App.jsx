import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

// --- MOCK DATA ---
const INITIAL_TXS = [
  { id: 1, date: '2026-01-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 2, date: '2026-01-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 3, date: '2026-01-12', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 120 },
  { id: 4, date: '2026-01-15', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 80 },
  { id: 5, date: '2026-01-20', description: 'Freelance Design', category: 'Freelance', type: 'income', amount: 800 },
  { id: 6, date: '2026-02-02', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 7, date: '2026-02-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 8, date: '2026-02-15', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 110 },
  { id: 9, date: '2026-02-20', description: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 300 },
  { id: 10, date: '2026-02-25', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15 },
  { id: 11, date: '2026-03-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 12, date: '2026-03-05', description: 'Stock Dividend', category: 'Investment', type: 'income', amount: 200 },
  { id: 13, date: '2026-03-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 14, date: '2026-03-15', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 50 },
  { id: 15, date: '2026-03-20', description: 'Uber Rides', category: 'Transport', type: 'expense', amount: 120 },
  { id: 16, date: '2026-03-25', description: 'Apple Store', category: 'Shopping', type: 'expense', amount: 1200 },
  { id: 17, date: '2026-04-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 18, date: '2026-04-02', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 150 },
  { id: 19, date: '2026-04-05', description: 'Gas Station', category: 'Transport', type: 'expense', amount: 60 },
  { id: 20, date: '2026-04-08', description: 'Dinner with friends', category: 'Food', type: 'expense', amount: 90 },
  { id: 21, date: '2026-04-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 22, date: '2026-04-12', description: 'Cloud Services', category: 'Utilities', type: 'expense', amount: 45 },
  { id: 23, date: '2026-01-25', description: 'Concert Tickets', category: 'Entertainment', type: 'expense', amount: 250 },
  { id: 24, date: '2026-02-18', description: 'Doctor Visit', category: 'Health', type: 'expense', amount: 100 },
  { id: 25, date: '2026-03-18', description: 'Furniture Store', category: 'Housing', type: 'expense', amount: 450 },
  { id: 26, date: '2026-04-15', description: 'Coffee Shop', category: 'Food', type: 'expense', amount: 35 },
  { id: 27, date: '2026-04-18', description: 'Pharmacy', category: 'Health', type: 'expense', amount: 40 },
  { id: 28, date: '2026-04-20', description: 'Uber Rides', category: 'Transport', type: 'expense', amount: 80 },
  { id: 29, date: '2026-04-22', description: 'Freelance Design', category: 'Freelance', type: 'income', amount: 1200 },
  { id: 30, date: '2026-04-25', description: 'Investment Return', category: 'Investment', type: 'income', amount: 350 },
];

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Utilities', 'Shopping', 'Investment'];

const COLORS = {
  Housing: '#10b981',
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Entertainment: '#8b5cf6',
  Health: '#ec4899',
  Salary: '#10b981',
  Freelance: '#059669',
  Utilities: '#6366f1',
  Shopping: '#f43f5e',
  Investment: '#eab308',
};

// --- COMPONENTS ---

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const StatCard = ({ title, amount, type, trend }) => (
  <div className="stat-card">
    <span className="stat-title">{title}</span>
    <h3 className={`stat-amount mono ${type}`}>{formatCurrency(amount)}</h3>
    {trend && <span className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
      {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
    </span>}
  </div>
);

const App = () => {
  const [txs, setTxs] = useState(INITIAL_TXS);
  const [role, setRole] = useState('Admin'); // Admin / Viewer
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard / transactions / insights
  const [modal, setModal] = useState(null); // null / { mode: 'add' } / { mode: 'edit', id: 1 }

  // --- DERIVED DATA ---
  const incomeTotal = useMemo(() => txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), [txs]);
  const expenseTotal = useMemo(() => txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), [txs]);
  const balance = incomeTotal - expenseTotal;

  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    return months.map((m, i) => {
      const monthPrefix = `2026-0${i + 1}`;
      const monthTxs = txs.filter(t => t.date.startsWith(monthPrefix));
      const income = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { name: m, income, expense };
    });
  }, [txs]);

  const categoryData = useMemo(() => {
    const counts = {};
    txs.filter(t => t.type === 'expense').forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + t.amount;
    });
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] })).sort((a, b) => b.value - a.value);
  }, [txs]);

  // --- ACTIONS ---
  const handleDelete = (id) => {
    if (role !== 'Admin') return;
    setTxs(txs.filter(t => t.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (role !== 'Admin') return;
    const formData = new FormData(e.target);
    const newTx = {
      id: modal.mode === 'edit' ? modal.id : Date.now(),
      date: formData.get('date'),
      description: formData.get('description'),
      category: formData.get('category'),
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount'))
    };

    if (modal.mode === 'edit') {
      setTxs(txs.map(t => t.id === modal.id ? newTx : t));
    } else {
      setTxs([newTx, ...txs]);
    }
    setModal(null);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="Fintrack Logo" className="logo-img" />
          <h1>Fintrack</h1>
        </div>
        <div className="role-switch">
          <span className="current-role">Role: <strong>{role}</strong></span>
          <button onClick={() => setRole(role === 'Admin' ? 'Viewer' : 'Admin')} className="role-btn">
            Switch to {role === 'Admin' ? 'Viewer' : 'Admin'}
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="nav">
        {['dashboard', 'transactions', 'insights'].map(tab => (
          <button 
            key={tab} 
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid animate-fade-in">
            <div className="stats-row">
              <StatCard title="Net Balance" amount={balance} type={balance >= 0 ? 'income' : 'expense'} />
              <StatCard title="Total Income" amount={incomeTotal} type="income" trend={12} />
              <StatCard title="Total Expenses" amount={expenseTotal} type="expense" trend={8} />
            </div>

            <div className="charts-grid">
              <div className="card chart-card main-trend">
                <h3>Monthly Trend</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrendData}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#5d628d" />
                      <YAxis stroke="#5d628d" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d4a" />
                      <Tooltip contentStyle={{ backgroundColor: '#151726', border: '1px solid #2a2d4a' }} />
                      <Area type="monotone" dataKey="income" stroke="#4ade80" fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card pie-breakdown">
                <h3>Spending Breakdown</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionsView 
            txs={txs} 
            role={role} 
            onDelete={handleDelete} 
            onEdit={(id) => setModal({ mode: 'edit', id })} 
            onAdd={() => setModal({ mode: 'add' })} 
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView txs={txs} categoryData={categoryData} incomeTotal={incomeTotal} expenseTotal={expenseTotal} />
        )}
      </main>

      {/* FOOTER NOTICE */}
      {role === 'Viewer' && (
        <div className="viewer-notice">
          <p>Read-Only Mode: All mutation controls are disabled.</p>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal card">
            <h2>{modal.mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Description</label>
                <input name="description" defaultValue={modal.mode === 'edit' ? txs.find(t => t.id === modal.id)?.description : ''} required placeholder="Grocery Store" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input name="amount" type="number" step="0.01" defaultValue={modal.mode === 'edit' ? txs.find(t => t.id === modal.id)?.amount : ''} required placeholder="50.00" />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" defaultValue={modal.mode === 'edit' ? txs.find(t => t.id === modal.id)?.type : 'expense'}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" defaultValue={modal.mode === 'edit' ? txs.find(t => t.id === modal.id)?.category : 'Food'}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input name="date" type="date" defaultValue={modal.mode === 'edit' ? txs.find(t => t.id === modal.id)?.date : new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* Scoped styles for modularity inside single file */
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-img {
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .logo-container h1 {
          font-size: 2rem;
          background: linear-gradient(to right, #fff, var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .role-switch {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .current-role {
          color: var(--text-secondary);
        }

        .role-btn {
          background: var(--bg-card);
          color: var(--accent);
          border: 1px solid var(--accent);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-btn:hover {
          background: var(--accent);
          color: var(--bg-deep);
        }

        .nav {
          display: flex;
          gap: 1rem;
          padding: 0.5rem;
          background: var(--bg-card);
          border-radius: 12px;
          width: fit-content;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-btn.active {
          background: var(--bg-deep);
          color: var(--text-primary);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--bg-card);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid var(--border);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          background: var(--bg-card-hover);
        }

        .stat-title {
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }

        .stat-amount {
          font-size: 2.5rem;
          margin: 0.5rem 0;
          font-weight: 600;
        }

        .stat-amount.income { color: var(--income); }
        .stat-amount.expense { color: var(--expense); }

        .stat-trend {
          font-size: 0.9rem;
          font-weight: 500;
        }
        .stat-trend.up { color: var(--income); }
        .stat-trend.down { color: var(--expense); }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .charts-grid { grid-template-columns: 1fr; }
        }

        .card {
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid var(--border);
        }

        .chart-card h3 {
          margin-bottom: 2rem;
          color: var(--text-secondary);
          font-size: 1.2rem;
          font-weight: 600;
        }

        .viewer-notice {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--expense);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(248, 113, 113, 0.3);
          z-index: 100;
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 500px;
          animation: fadeIn 0.3s ease-out;
        }

        .form-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; }

        input, select {
          background: var(--bg-deep);
          border: 1px solid var(--border);
          padding: 0.75rem;
          border-radius: 8px;
          color: white;
          outline: none;
        }
        
        input:focus, select:focus {
          border-color: var(--accent);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary {
          background: var(--accent);
          color: var(--bg-deep);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TransactionsView = ({ txs, role, onDelete, onEdit, onAdd }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredTxs = useMemo(() => {
    return txs
      .filter(t => (
        (t.description.toLowerCase().includes(search.toLowerCase()) || 
         t.category.toLowerCase().includes(search.toLowerCase())) &&
        (filterType === 'all' || t.type === filterType) &&
        (filterCat === 'all' || t.category === filterCat)
      ))
      .sort((a, b) => {
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        return 0;
      });
  }, [txs, search, filterType, filterCat, sortBy]);

  return (
    <div className="transactions-view animate-fade-in">
      <div className="action-bar">
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search description..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
        {role === 'Admin' && (
          <button className="btn-primary" onClick={onAdd}>+ Add Transaction</button>
        )}
      </div>

      <div className="tx-table-container">
        {filteredTxs.length > 0 ? (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map(t => (
                <tr key={t.id}>
                  <td className="mono">{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className="category-pill" style={{ '--color': COLORS[t.category] }}>{t.category}</span></td>
                  <td><span className={`type-badge ${t.type}`}>{t.type}</span></td>
                  <td className={`mono amount ${t.type}`}>{formatCurrency(t.amount)}</td>
                  {role === 'Admin' && (
                    <td className="actions-cell">
                      <button onClick={() => onEdit(t.id)} className="edit-btn">Edit</button>
                      <button onClick={() => onDelete(t.id)} className="delete-btn">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No transactions found matching your filters.</p>
          </div>
        )}
      </div>

      <style>{`
        .action-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-filters {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
        }

        .search-input { min-width: 250px; }

        .tx-table-container {
          background: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border);
          overflow-x: auto;
        }

        .tx-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tx-table th, .tx-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .tx-table th {
          color: var(--text-secondary);
          font-family: var(--font-heading);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        .category-pill {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color);
          color: var(--color);
        }

        .type-badge {
          text-transform: capitalize;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .type-badge.income { color: var(--income); }
        .type-badge.expense { color: var(--expense); }

        .amount.income { color: var(--income); }
        .amount.expense { color: var(--expense); }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .edit-btn { color: var(--accent); }
        .delete-btn { color: var(--expense); }

        .empty-state {
          padding: 5rem;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

const InsightsView = ({ txs, categoryData, incomeTotal, expenseTotal }) => {
  const topCategory = categoryData[0] || { name: 'None', value: 0 };
  const savingsRate = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(1) : 0;
  
  // MoM comparison for March vs April
  const marchExpenses = txs.filter(t => t.date.startsWith('2026-03') && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const aprilExpenses = txs.filter(t => t.date.startsWith('2026-04') && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const expenseChange = marchExpenses > 0 ? ((aprilExpenses - marchExpenses) / marchExpenses * 100).toFixed(1) : 0;

  return (
    <div className="insights-view animate-fade-in">
      <div className="insights-grid">
        <div className="card insight-card">
          <h4>Top Spending Category</h4>
          <div className="insight-value mono">{topCategory.name}</div>
          <div className="insight-sub">{formatCurrency(topCategory.value)} this period</div>
        </div>
        <div className="card insight-card">
          <h4>Savings Rate</h4>
          <div className="insight-value mono">{savingsRate}%</div>
          <div className="insight-sub">of total income saved</div>
        </div>
        <div className="card insight-card">
          <h4>Expense Change (MoM)</h4>
          <div className="insight-value mono" style={{ color: expenseChange > 0 ? 'var(--expense)' : 'var(--income)' }}>
            {expenseChange > 0 ? '+' : ''}{expenseChange}%
          </div>
          <div className="insight-sub">Mar vs Apr Comparison</div>
        </div>
      </div>

      <div className="charts-grid-insights">
        <div className="card">
          <h3>Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Mar', income: txs.filter(t => t.date.startsWith('2026-03') && t.type === 'income').reduce((acc, t) => acc + t.amount, 0), expense: marchExpenses },
              { name: 'Apr', income: txs.filter(t => t.date.startsWith('2026-04') && t.type === 'income').reduce((acc, t) => acc + t.amount, 0), expense: aprilExpenses }
            ]}>
              <XAxis dataKey="name" stroke="#5d628d" />
              <YAxis stroke="#5d628d" />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#151726', border: '1px solid #2a2d4a' }} />
              <Legend />
              <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Category Share</h3>
          <div className="progress-list">
            {categoryData.slice(0, 5).map(cat => (
              <div key={cat.name} className="progress-item">
                <div className="progress-info">
                  <span>{cat.name}</span>
                  <span className="mono">{((cat.value / expenseTotal) * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${(cat.value / expenseTotal) * 100}%`, background: COLORS[cat.name] }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .insight-card h4 {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .insight-value {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .insight-sub {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .charts-grid-insights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 800px) {
          .charts-grid-insights { grid-template-columns: 1fr; }
        }

        .progress-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 1rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .progress-bar-bg {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
