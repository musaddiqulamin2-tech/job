"use client";

export const APP_STATUSES = ["Pending", "Reviewing", "Shortlisted", "Rejected", "Selected"];
export const JOB_STATUSES = ["Active", "Inactive", "Expired"];

export const APP_STATUS_BADGE = {
  Pending: "admin-badge-blue",
  Reviewing: "admin-badge-slate",
  Shortlisted: "admin-badge-purple",
  Rejected: "admin-badge-red",
  Selected: "admin-badge-green",
};

export const JOB_STATUS_BADGE = {
  Active: "admin-badge-green",
  Inactive: "admin-badge-red",
  Expired: "admin-badge-slate",
};

export function StatusBadge({ status }) {
  const cls =
    APP_STATUS_BADGE[status] || JOB_STATUS_BADGE[status] || "admin-badge-slate";
  return <span className={`admin-badge ${cls}`}>{status || "—"}</span>;
}

export function Spinner({ label }) {
  return (
    <div className="admin-loading-block">
      <span className="admin-spinner" />
      {label && <p className="admin-loading-label">{label}</p>}
    </div>
  );
}

export function EmptyState({ title, sub, action }) {
  return (
    <div className="no-jobs">
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="admin-error-state">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="admin-pagination">
      <button
        className="admin-pagination-btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>
      <span className="admin-pagination-info">
        Page {page} of {totalPages}
      </span>
      <button
        className="admin-pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const cls =
    toast.type === "error"
      ? "admin-toast admin-toast-error"
      : toast.type === "info"
        ? "admin-toast admin-toast-info"
        : "admin-toast admin-toast-success";

  return (
    <div className={`admin-toast-wrap ${toast.type === "error" ? "error" : ""}`}>
      <div className={cls}>
        <span>{toast.message}</span>
        <button className="admin-toast-close" onClick={() => onClose()} aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}