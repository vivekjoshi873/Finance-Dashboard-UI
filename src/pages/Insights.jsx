import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, COLORS } from '../utils/constants';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Insights = () => {
  const { transactions } = useStore();

  const incomeTotal = useMemo(() => transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const expenseTotal = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), [transactions]);

  const categoryData = useMemo(() => {
    const counts = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + t.amount;
    });
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const topCategory = categoryData[0] || { name: 'None', value: 0 };
  const savingsRate = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(1) : 0;
  
  // MoM comparison for March vs April (simplistic hardcode for mock data based on user instructions)
  const marchExpenses = transactions.filter(t => t.date.startsWith('2026-03') && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const aprilExpenses = transactions.filter(t => t.date.startsWith('2026-04') && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const expenseChange = marchExpenses > 0 ? ((aprilExpenses - marchExpenses) / marchExpenses * 100).toFixed(1) : 0;

  return (
    <div className="animate-in">
      <div className="page-header">
        <span className="page-eyebrow">Analysis</span>
        <h1 className="page-title">Spending <em>Insights</em></h1>
        <p className="page-subtitle">Deep dive into your habits and month-over-month performance.</p>
      </div>

      <div className="insights-hero">
        <div className="insight-block">
          <div className="insight-label">Top Category</div>
          <div className="insight-num">{topCategory.name}</div>
          <div className="insight-sub">{formatCurrency(topCategory.value)} this period</div>
        </div>
        <div className="insight-block">
          <div className="insight-label">Savings Rate</div>
          <div className="insight-num">{savingsRate}%</div>
          <div className="insight-sub">of total income saved</div>
        </div>
        <div className="insight-block">
          <div className="insight-label">Expense Change (MoM)</div>
          <div className="insight-num" style={{ color: expenseChange > 0 ? 'var(--red)' : 'var(--green)' }}>
            {expenseChange > 0 ? '+' : ''}{expenseChange}%
          </div>
          <div className="insight-sub">Mar vs Apr Comparison</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3 className="card-title">Monthly Comparison</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Mar', income: transactions.filter(t => t.date.startsWith('2026-03') && t.type === 'income').reduce((acc, t) => acc + t.amount, 0), expense: marchExpenses },
                { name: 'Apr', income: transactions.filter(t => t.date.startsWith('2026-04') && t.type === 'income').reduce((acc, t) => acc + t.amount, 0), expense: aprilExpenses }
              ]}>
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }} itemStyle={{ color: 'var(--text)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="var(--green)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Category Share</h3>
          <div className="progress-row">
            {categoryData.slice(0, 5).map(cat => {
              const pct = expenseTotal > 0 ? (cat.value / expenseTotal) * 100 : 0;
              return (
                <div key={cat.name} className="progress-item">
                  <div className="progress-head">
                    <span className="progress-name">{cat.name}</span>
                    <span className="progress-pct">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${pct}%`, background: COLORS[cat.name] || 'var(--dim)' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
