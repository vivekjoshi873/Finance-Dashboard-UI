import "./EmptyState.css";

export default function EmptyState({ message, description, action }) {
  return (
    <div className="empty-state">
      <svg className="empty-state-icon" width="80" height="80" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="var(--bg-tertiary)" />
        <rect x="38" y="40" width="44" height="6" rx="3" fill="var(--border)" />
        <rect x="38" y="52" width="32" height="6" rx="3" fill="var(--border)" />
        <rect x="38" y="64" width="38" height="6" rx="3" fill="var(--border)" />
        <circle cx="60" cy="85" r="4" fill="var(--text-muted)" />
      </svg>
      <p className="empty-state-message">{message}</p>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && action}
    </div>
  );
}
