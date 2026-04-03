import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import { formatCurrency, COLORS } from '../utils/constants';

export const Dashboard = () => {
  const { transactions } = useStore();

  const incomeTotal = useMemo(() => transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const expenseTotal = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const balance = incomeTotal - expenseTotal;

  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    return months.map((m, i) => {
      const monthPrefix = `2026-0${i + 1}`;
      const monthTxs = transactions.filter(t => t.date.startsWith(monthPrefix));
      const income = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { name: m, income, expense };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const counts = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + t.amount;
    });
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="animate-in">
      <div className="page-header">
        <span className="page-eyebrow">Overview</span>
        <h1 className="page-title">Financial <em>Dashboard</em></h1>
        <p className="page-subtitle">Welcome back. Here is your current financial summary.</p>
      </div>

      <div className="kpi-strip">
        <div className="kpi-block">
          <div className="kpi-label"><div className="kpi-dot" style={{ background: 'var(--gold)' }}></div>Net Balance</div>
          <div className={`kpi-value ${balance >= 0 ? 'pos' : 'neg'}`}>{formatCurrency(balance)}</div>
        </div>
        <div className="kpi-block">
          <div className="kpi-label"><div className="kpi-dot" style={{ background: 'var(--green)' }}></div>Total Income</div>
          <div className="kpi-value pos">{formatCurrency(incomeTotal)}</div>
          <div className="kpi-delta"><span className="kpi-delta-badge up">↑ 12%</span> vs last month</div>
        </div>
        <div className="kpi-block">
          <div className="kpi-label"><div className="kpi-dot" style={{ background: 'var(--red)' }}></div>Total Expenses</div>
          <div className="kpi-value neg">{formatCurrency(expenseTotal)}</div>
          <div className="kpi-delta"><span className="kpi-delta-badge down">↓ 8%</span> vs last month</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3 className="card-title">Monthly Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }} itemStyle={{ color: 'var(--text)' }} />
                <Area type="monotone" dataKey="income" stroke="var(--green)" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="var(--red)" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Spending Breakdown</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }} itemStyle={{ color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
