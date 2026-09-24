"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Spinner,
  ErrorState,
  StatusBadge,
  Toast,
  APP_STATUSES,
} from "../../components/AdminUI";

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

export default function AdminApplicationDetail({ params }) {
  const { id } = use(params);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [statusNote, setStatusNote] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load application.");
      }
      setApp(json.application);
      setStatus(json.application.status || "Pending");
      setStatusNote(json.application.statusNote || "");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function saveStatus(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusNote }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update status.");
      }
      setApp((prev) => ({ ...prev, ...json.application }));
      showToast("success", json.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <Spinner label="Loading application..." />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="admin-page">
        <ErrorState message={error || "Application not found."} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <Link href="/admin/applications" className="admin-back-link">
            ← All applications
          </Link>
          <h1>{titleCase(app.fullName)}</h1>
          <p>{app.jobTitle} • applied {formatDateTime(app.createdAt)}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="admin-detail-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Candidate Details</h2>
              <p className="admin-card-sub">Contact and application information</p>
            </div>
          </div>

          <div className="admin-detail-profile">
            <div className="admin-detail-avatar">
              {app.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.photoUrl} alt={app.fullName} />
              ) : (
                titleCase(app.fullName)?.charAt(0) || "?"
              )}
            </div>
            <div className="admin-detail-contact">
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${app.email}`}>{app.email}</a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${app.phone}`}>{app.phone}</a>
              </p>
              <p>
                <strong>Applied for:</strong> {app.jobTitle}
              </p>
              <p>
                <strong>Applied on:</strong> {formatDateTime(app.createdAt)}
              </p>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Cover Message</label>
            <div className="admin-quote-block">
              &ldquo;{app.coverMessage || "No cover message provided."}&rdquo;
            </div>
          </div>

          <div className="admin-detail-actions">
            {app.resumeUrl ? (
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-primary"
              >
                View Resume
              </a>
            ) : (
              <span className="admin-text-muted">No resume uploaded</span>
            )}
            {app.photoUrl && (
              <a
                href={app.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-outline"
              >
                View Photo
              </a>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Application Status</h2>
              <p className="admin-card-sub">Update the candidate review status</p>
            </div>
          </div>

          <form onSubmit={saveStatus}>
            <div className="admin-form-group">
              <label htmlFor="statusSelect">Status</label>
              <select
                id="statusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {APP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="statusNote">Internal Note (optional)</label>
              <textarea
                id="statusNote"
                rows="4"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note about this candidate..."
              />
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Status"}
              </button>
            </div>
          </form>

          {app.reviewedAt && (
            <p className="admin-text-muted admin-detail-meta">
              Last reviewed on {formatDateTime(app.reviewedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}