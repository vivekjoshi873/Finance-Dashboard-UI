import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import useStore from "../store/useStore";
import "./Insights.css";

function fmt(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(n);
}

function SavingsRing({ percentage }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const capped = Math.max(0, Math.min(percentage, 100));
  const offset = circ - (capped / 100) * circ;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="savings-ring">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="60" y="60" textAnchor="middle" dominantBaseline="central"
        fill="var(--text-primary)" fontSize="18" fontWeight="700"
        fontFamily="var(--font)"
      >
        {capped.toFixed(1)}%
      </text>
    </svg>
  );
}

export default function Insights() {
  const transactions = useStore((s) => s.transactions);

  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const incomes = useMemo(
    () => transactions.filter((t) => t.type === "income"),
    [transactions]
  );

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

  // Top spending category
  const topCategory = useMemo(() => {
    const map = {};
    expenses.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return null;
    return { name: entries[0][0], amount: entries[0][1], pct: (entries[0][1] / totalExpense) * 100 };
  }, [expenses, totalExpense]);

  // Monthly comparison
  const monthly = useMemo(() => {
    const now = new Date();
    const thisM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1);
    const prevM = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

    const thisIncome = transactions.filter((t) => t.type === "income" && t.date.startsWith(thisM)).reduce((s, t) => s + t.amount, 0);
    const thisExpense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(thisM)).reduce((s, t) => s + t.amount, 0);
    const prevIncome = transactions.filter((t) => t.type === "income" && t.date.startsWith(prevM)).reduce((s, t) => s + t.amount, 0);
    const prevExpense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(prevM)).reduce((s, t) => s + t.amount, 0);

    return {
      thisIncome, thisExpense, thisNet: thisIncome - thisExpense,
      prevIncome, prevExpense, prevNet: prevIncome - prevExpense,
    };
  }, [transactions]);

  // Savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Spending streak — consecutive days with at least one expense
  const spendingStreak = useMemo(() => {
    if (expenses.length === 0) return 0;
    const dates = [...new Set(expenses.map((t) => t.date))].sort().reverse();
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }, [expenses]);

  // Average transaction
  const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
  const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

  // Spending by day of week
  const spendingByDay = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = days.map((d) => ({ day: d, amount: 0 }));
    expenses.forEach((t) => {
      const dow = new Date(t.date).getDay();
      map[dow].amount += t.amount;
    });
    return map;
  }, [expenses]);

  // Category breakdown table
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((t) => {
      if (!map[t.category]) map[t.category] = { total: 0, count: 0 };
      map[t.category].total += t.amount;
      map[t.category].count += 1;
    });
    return Object.entries(map)
      .map(([cat, data]) => ({
        category: cat,
        total: data.total,
        count: data.count,
        pct: totalExpense > 0 ? (data.total / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, totalExpense]);

  const noData = expenses.length === 0;

  return (
    <div className="page-enter">
      <h2 className="page-title">Insights</h2>

      <div className="insights-grid">
        {/* Top spending category */}
        <div className="card insight-card">
          <h3 className="insight-title">Top Spending Category</h3>
          {topCategory ? (
            <div className="insight-body">
              <span className={`cat-badge cat-${topCategory.name}`} style={{ fontSize: "0.8rem", padding: "4px 12px" }}>
                {topCategory.name}
              </span>
              <p className="insight-value">{fmt(topCategory.amount)}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${topCategory.pct}%` }}
                />
              </div>
              <span className="insight-sub">{topCategory.pct.toFixed(1)}% of total expenses</span>
            </div>
          ) : (
            <p className="insight-empty">Not enough data yet</p>
          )}
        </div>

        {/* Monthly Comparison */}
        <div className="card insight-card">
          <h3 className="insight-title">Monthly Comparison</h3>
          {monthly.thisIncome > 0 || monthly.prevIncome > 0 ? (
            <div className="insight-body">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>This Month</th>
                    <th>Last Month</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comp-label">Income</td>
                    <td>{fmt(monthly.thisIncome)}</td>
                    <td>{fmt(monthly.prevIncome)}</td>
                    <td>{monthly.thisIncome >= monthly.prevIncome
                      ? <span className="trend-up">↑</span>
                      : <span className="trend-down">↓</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="comp-label">Expenses</td>
                    <td>{fmt(monthly.thisExpense)}</td>
                    <td>{fmt(monthly.prevExpense)}</td>
                    <td>{monthly.thisExpense <= monthly.prevExpense
                      ? <span className="trend-up">↑</span>
                      : <span className="trend-down">↓</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="comp-label">Net</td>
                    <td className={monthly.thisNet >= 0 ? "amount-income" : "amount-expense"}>{fmt(monthly.thisNet)}</td>
                    <td className={monthly.prevNet >= 0 ? "amount-income" : "amount-expense"}>{fmt(monthly.prevNet)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="insight-empty">Not enough data yet</p>
          )}
        </div>

        {/* Savings Rate */}
        <div className="card insight-card">
          <h3 className="insight-title">Savings Rate</h3>
          {totalIncome > 0 ? (
            <div className="insight-body insight-center">
              <SavingsRing percentage={savingsRate} />
              <span className="insight-sub">
                {savingsRate >= 20 ? "Great job saving!" : "Try to save more"}
              </span>
            </div>
          ) : (
            <p className="insight-empty">Not enough data yet</p>
          )}
        </div>

        {/* Spending Streak */}
        <div className="card insight-card">
          <h3 className="insight-title">Spending Streak</h3>
          {!noData ? (
            <div className="insight-body insight-center">
              <p className="insight-big">{spendingStreak}</p>
              <span className="insight-sub">consecutive days with expenses</span>
            </div>
          ) : (
            <p className="insight-empty">Not enough data yet</p>
          )}
        </div>

        {/* Average Transaction */}
        <div className="card insight-card">
          <h3 className="insight-title">Average Transaction</h3>
          <div className="insight-body">
            <div className="avg-row">
              <span className="avg-label">Avg Income</span>
              <span className="amount-income">{fmt(avgIncome)}</span>
            </div>
            <div className="avg-row">
              <span className="avg-label">Avg Expense</span>
              <span className="amount-expense">{fmt(avgExpense)}</span>
            </div>
          </div>
        </div>

        {/* Spending by Day of Week */}
        <div className="card insight-card insight-wide">
          <h3 className="insight-title">Spending by Day of Week</h3>
          {!noData ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spendingByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip
                  formatter={(val) => fmt(val)}
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text-primary)",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="insight-empty">Not enough data yet</p>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card insight-table-card">
        <h3 className="insight-title" style={{ padding: "20px 20px 0" }}>Category Breakdown</h3>
        {categoryBreakdown.length > 0 ? (
          <table className="category-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent</th>
                <th>Transactions</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((row) => (
                <tr key={row.category}>
                  <td><span className={`cat-badge cat-${row.category}`}>{row.category}</span></td>
                  <td className="amount-expense">{fmt(row.total)}</td>
                  <td>{row.count}</td>
                  <td>
                    <div className="pct-bar-wrap">
                      <div className="pct-bar" style={{ width: `${row.pct}%` }} />
                      <span>{row.pct.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: 24 }}>
            <p className="insight-empty">Not enough data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
