import "./SummaryCard.css";

export default function SummaryCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="summary-card card">
      <div className="summary-card-header">
        <span className="summary-card-icon">{icon}</span>
        <span className="summary-card-label">{label}</span>
      </div>
      <p className="summary-card-value">{value}</p>
      {trend !== undefined && (
        <span className={`summary-card-trend ${trendUp ? "trend-up" : "trend-down"}`}>
          {trendUp ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          )}
          {trend}
        </span>
      )}
    </div>
  );
}
