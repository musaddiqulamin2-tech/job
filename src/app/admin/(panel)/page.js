"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminBarChart from "./components/AdminBarChart";
import { Spinner, ErrorState, EmptyState, StatusBadge } from "./components/AdminUI";

const colors = ["#2563eb", "#16a34a", "#f59e0b", "#db2777", "#7c3aed"];

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const now = new Date();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load dashboard.");
      }
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  const { stats, perDay, perJob, recentApplications, openJobs } = data;

  return (
    <div className="admin-page">
      <div className="admin-welcome">
        <div className="admin-welcome-text">
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here&apos;s your overview for{" "}
            {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/admin/jobs/new" className="admin-welcome-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post New Job
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card grad-blue">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="admin-stat-badge">↑ {stats.weeklyApplications} this week</span>
          </div>
          <p className="admin-stat-value">{stats.totalApplications}</p>
          <p className="admin-stat-label">Total Applications</p>
        </div>

        <div className="admin-stat-card grad-green">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>
            <span className="admin-stat-badge">Active</span>
          </div>
          <p className="admin-stat-value">{stats.activeJobs}</p>
          <p className="admin-stat-label">Open Positions</p>
        </div>

        <div className="admin-stat-card grad-orange">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            <span className="admin-stat-badge">Total</span>
          </div>
          <p className="admin-stat-value">{stats.totalJobs}</p>
          <p className="admin-stat-label">Total Jobs</p>
        </div>

        <div className="admin-stat-card grad-purple">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            </span>
            <span className="admin-stat-badge">{stats.jobCategories} Types</span>
          </div>
          <p className="admin-stat-value">{stats.jobCategories}</p>
          <p className="admin-stat-label">Job Categories</p>
        </div>
      </div>

      <div className="admin-dash-row">
        <div className="admin-card admin-chart-card">
          <div className="admin-card-header">
            <div>
              <h2>Applications Overview</h2>
              <p className="admin-card-sub">Applications received — last 7 days</p>
            </div>
            <span className="admin-chip">
              <span className="chip-dot" />
              Live
            </span>
          </div>

          {stats.totalApplications === 0 ? (
            <EmptyState title="No data yet" sub="The chart will populate once candidates apply." />
          ) : (
            <AdminBarChart data={perDay} />
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>By Position</h2>
              <p className="admin-card-sub">Top 5 most applied roles</p>
            </div>
          </div>

          {perJob.length === 0 ? (
            <EmptyState title="No applications yet" />
          ) : (
            <div className="admin-progress-list">
              {perJob.map((job, i) => (
                <div className="admin-progress-item" key={i}>
                  <div className="admin-progress-top">
                    <span className="admin-progress-title">
                      <i style={{ background: colors[i % colors.length] }} />
                      {titleCase(job.title)}
                    </span>
                    <span className="admin-progress-value">
                      {job.count} <small>({job.percent}%)</small>
                    </span>
                  </div>
                  <div className="admin-progress-track">
                    <div
                      className="admin-progress-bar"
                      style={{
                        width: `${job.percent}%`,
                        background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Recent Applications</h2>
              <p className="admin-card-sub">Latest candidates to apply</p>
            </div>
            <Link href="/admin/applications" className="admin-link">
              View All →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" />
          ) : (
            <div className="admin-app-list">
              {recentApplications.map((app, idx) => (
                <Link
                  href={`/admin/applications/${app._id}`}
                  className="admin-app-row"
                  key={app._id}
                >
                  <div
                    className="admin-app-avatar"
                    style={{
                      background: colors[idx % colors.length] + "1a",
                      color: colors[idx % colors.length],
                    }}
                  >
                    {app.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.photoUrl} alt={app.fullName} />
                    ) : (
                      titleCase(app.fullName)?.charAt(0) || "?"
                    )}
                  </div>
                  <div className="admin-app-main">
                    <strong>{titleCase(app.fullName)}</strong>
                    <span>{app.jobTitle}</span>
                  </div>
                  <div className="admin-app-right">
                    <StatusBadge status={app.status} />
                    <span className="admin-app-date">{formatDate(app.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Available Jobs</h2>
              <p className="admin-card-sub">Currently hiring roles</p>
            </div>
            <Link href="/admin/jobs" className="admin-link">
              Manage →
            </Link>
          </div>

          <div className="admin-position-list">
            {openJobs.length > 0 ? (
              openJobs.map((job, i) => (
                <Link
                  href={`/admin/jobs/${job._id}`}
                  className="admin-position-row"
                  key={job._id}
                >
                  <div
                    className="admin-position-icon"
                    style={{
                      background: colors[i % colors.length] + "1a",
                      color: colors[i % colors.length],
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <div className="admin-position-main">
                    <strong>{job.title}</strong>
                    <span>{job.company}</span>
                  </div>
                  <div className="admin-app-right">
                    <span className="admin-app-date">
                      {job.location} • {formatDateTime(job.createdAt)}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No jobs posted yet"
                action={
                  <Link href="/admin/jobs/new" className="admin-link">
                    Post your first job →
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}