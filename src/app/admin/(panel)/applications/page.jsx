"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Spinner,
  EmptyState,
  ErrorState,
  Pagination,
  StatusBadge,
  Toast,
  APP_STATUSES,
} from "../components/AdminUI";

const pageSize = 12;
const LIVE_REFRESH_MS = 20000;

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function titleCase(str) {
  return str
    ? String(str)
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "";
}

const avatarGradients = [
  "linear-gradient(135deg, #2563eb, #7c3aed)",
  "linear-gradient(135deg, #16a34a, #0d9488)",
  "linear-gradient(135deg, #f59e0b, #db2777)",
  "linear-gradient(135deg, #0ea5e9, #6366f1)",
];

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const totalRef = useRef(0);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  const load = useCallback(
    async (search = q, statusFilter = status, pageNum = page, silent = false) => {
      if (!(silent && applications.length > 0)) setLoading(true);
      if (silent) setSyncing(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(pageSize),
        });
        if (search) params.set("q", search);
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/admin/applications?${params.toString()}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load applications.");
        }
        if (silent && json.total > totalRef.current && (search || statusFilter)) {
          showToast("success", `${json.total - totalRef.current} new application(s) matching your filters.`);
        } else if (silent && json.total > totalRef.current) {
          showToast("success", `${json.total - totalRef.current} new application(s) just arrived 🎉`);
        }
        totalRef.current = json.total;
        setApplications(json.applications);
        setTotal(json.total);
        setTotalPages(json.totalPages);
        setPage(pageNum);
      } catch (e) {
        if (!silent) setError(e.message);
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
    const tick = setInterval(() => setClock(new Date()), 1000);
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        load(q, status, page, true);
      }
    }, LIVE_REFRESH_MS);
    return () => {
      clearInterval(tick);
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(q, status, 1);
  }

  function handleStatusFilter(next) {
    setStatus(next);
    load(q, next, 1);
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Applications</h1>
          <p>Review candidates who applied to your jobs.</p>
        </div>
        <span className={`admin-live-chip ${syncing ? "syncing" : ""}`} title={`Auto-refreshes every ${LIVE_REFRESH_MS / 1000} seconds`}>
          <span className="chip-dot" />
          Live
          <em>• {formatTime(clock)}</em>
        </span>
      </div>

      <div className="admin-apps-filterbar">
        <form className="admin-search admin-search-lg" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, phone, or job..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </div>

      <div className="admin-filter-chips">
        <button
          className={`admin-fchip ${status === "" ? "active" : ""}`}
          onClick={() => handleStatusFilter("")}
        >
          All
        </button>
        {APP_STATUSES.map((s) => (
          <button
            key={s}
            className={`admin-fchip ${status === s ? "active" : ""}`}
            onClick={() => handleStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading applications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(q, status, page)} />
      ) : applications.length === 0 ? (
        <div className="admin-card">
          <EmptyState
            title="No Applications Found"
            sub={
              q || status
                ? "Try clearing your search or filters."
                : "Applications will appear here when candidates apply."
            }
          />
        </div>
      ) : (
        <>
          <div className="admin-cards-grid">
            {applications.map((app, idx) => {
              const initials = titleCase(app.fullName)
                ?.split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <Link
                  href={`/admin/applications/${app._id}`}
                  className="admin-app-card"
                  key={app._id}
                >
                  <div className="admin-app-card-top">
                    <div
                      className="admin-app-card-avatar"
                      style={{ background: avatarGradients[idx % avatarGradients.length] }}
                    >
                      {app.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={app.photoUrl} alt={app.fullName} />
                      ) : (
                        initials || "?"
                      )}
                    </div>

                    <div className="admin-app-card-info">
                      <strong>{titleCase(app.fullName)}</strong>
                      <span>{app.jobTitle}</span>
                      <span className="admin-app-card-date">
                        {formatDate(app.createdAt)} • {formatTime(app.createdAt)}
                      </span>
                    </div>

                    <StatusBadge status={app.status} />
                  </div>

                  <div className="admin-app-card-body">
                    <div className="admin-app-contact">
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {app.email}
                      </span>
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {app.phone}
                      </span>
                    </div>

                    {app.coverMessage && (
                      <p className="admin-app-card-message">
                        &ldquo;
                        {app.coverMessage.length > 180
                          ? app.coverMessage.slice(0, 180) + "..."
                          : app.coverMessage}
                        &rdquo;
                      </p>
                    )}
                  </div>

                  <div className="admin-app-card-footer">
                    <span className="admin-text-muted">View details →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={(p) => load(q, status, p)} />
        </>
      )}
    </div>
  );
}