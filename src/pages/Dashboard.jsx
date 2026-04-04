import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import useStore from "../store/useStore";
import SummaryCard from "../components/SummaryCard";
import "./Dashboard.css";

const PIE_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16",
];

function fmt(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Previous month comparison (rough)
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const thisMonthIncome = transactions
      .filter((t) => t.type === "income" && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);
    const prevMonthIncome = transactions
      .filter((t) => t.type === "income" && t.date.startsWith(prevMonth))
      .reduce((s, t) => s + t.amount, 0);
    const thisMonthExpense = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);
    const prevMonthExpense = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(prevMonth))
      .reduce((s, t) => s + t.amount, 0);

    const incomeTrend = prevMonthIncome > 0
      ? (((thisMonthIncome - prevMonthIncome) / prevMonthIncome) * 100).toFixed(1) + "%"
      : "—";
    const expenseTrend = prevMonthExpense > 0
      ? (((thisMonthExpense - prevMonthExpense) / prevMonthExpense) * 100).toFixed(1) + "%"
      : "—";

    return {
      balance, income, expenses, savingsRate,
      incomeTrend, incomeTrendUp: thisMonthIncome >= prevMonthIncome,
      expenseTrend, expenseTrendUp: thisMonthExpense > prevMonthExpense,
    };
  }, [transactions]);

  // Balance trend by month
  const balanceTrend = useMemo(() => {
    const map = {};
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!map[m]) map[m] = 0;
      map[m] += t.type === "income" ? t.amount : -t.amount;
    });
    let cumulative = 0;
    return Object.entries(map).map(([month, net]) => {
      cumulative += net;
      return {
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        balance: Math.round(cumulative * 100) / 100,
      };
    });
  }, [transactions]);

  // Spending by category
  const spendingByCategory = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Recent 5 transactions
  const recent = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [transactions]);

  return (
    <div className="page-enter">
      <h2 className="page-title">Dashboard</h2>

      <div className="summary-grid">
        <SummaryCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/></svg>}
          label="Total Balance"
          value={fmt(stats.balance)}
        />
        <SummaryCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>}
          label="Total Income"
          value={fmt(stats.income)}
          trend={stats.incomeTrend}
          trendUp={stats.incomeTrendUp}
        />
        <SummaryCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>}
          label="Total Expenses"
          value={fmt(stats.expenses)}
          trend={stats.expenseTrend}
          trendUp={!stats.expenseTrendUp}
        />
        <SummaryCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg>}
          label="Savings Rate"
          value={stats.savingsRate.toFixed(1) + "%"}
        />
      </div>

      <div className="dashboard-charts">
        {/* Balance Trend */}
        <div className="card chart-card">
          <h3 className="chart-title">Balance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#balanceGrad)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="card chart-card">
          <h3 className="chart-title">Spending Breakdown</h3>
          {spendingByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {spendingByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => fmt(val)}
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text-primary)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No expense data yet</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card recent-card">
        <h3 className="chart-title">Recent Transactions</h3>
        {recent.length > 0 ? (
          <div className="recent-list">
            {recent.map((tx, i) => (
              <div
                key={tx.id}
                className="recent-row"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="recent-info">
                  <span className="recent-desc">{tx.description}</span>
                  <span className="recent-date">{new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <div className="recent-right">
                  <span className={`cat-badge cat-${tx.category}`}>{tx.category}</span>
                  <span className={`recent-amount ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="chart-empty">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
