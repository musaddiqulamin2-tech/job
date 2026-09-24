"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Spinner,
  EmptyState,
  ErrorState,
  Pagination,
  StatusBadge,
  Toast,
  JOB_STATUSES,
} from "../components/AdminUI";

const pageSize = 10;

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  const load = useCallback(
    async (search = q, statusFilter = status, pageNum = page) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(pageSize),
        });
        if (search) params.set("q", search);
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/admin/jobs?${params.toString()}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load jobs.");
        }
        setJobs(json.jobs);
        setTotal(json.total);
        setTotalPages(json.totalPages);
        setPage(pageNum);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
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

  async function toggleStatus(job) {
    const next = job.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/admin/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update job.");
      }
      showToast("success", json.message);
      load(q, status, page);
    } catch (err) {
      showToast("error", err.message);
    }
  }

  async function deleteJob(job) {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/jobs/${job._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to delete job.");
      }
      showToast("success", json.message);
      const newPage = jobs.length === 1 && page > 1 ? page - 1 : page;
      load(q, status, newPage);
    } catch (err) {
      showToast("error", err.message);
    }
  }

  const counts = {
    total,
    active: jobs.filter((j) => j.status === "Active").length,
    featured: jobs.filter((j) => j.featured).length,
  };

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>Add, edit, and delete job listings.</p>
        </div>
        <Link href="/admin/jobs/new" className="admin-btn admin-btn-primary">
          + Add New Job
        </Link>
      </div>

      <div className="admin-stats-small-grid">
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{counts.total}</span>
          <span className="admin-small-stat-label">Total Jobs</span>
        </div>
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{counts.active}</span>
          <span className="admin-small-stat-label">Active (this page)</span>
        </div>
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{counts.featured}</span>
          <span className="admin-small-stat-label">Featured (this page)</span>
        </div>
      </div>

      <div className="admin-apps-filterbar">
        <form className="admin-search admin-search-lg" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
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
        {JOB_STATUSES.map((s) => (
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
        <div className="admin-card">
          <Spinner label="Loading jobs..." />
        </div>
      ) : error ? (
        <div className="admin-card">
          <ErrorState message={error} onRetry={() => load(q, status, page)} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="admin-card">
          <EmptyState
            title="No Jobs Found"
            sub={
              q || status
                ? "Try clearing your search or filters."
                : "Add your first job listing using the button above."
            }
          />
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>All Jobs ({total})</h2>
            <span className="admin-chip">
              <span className="chip-dot" />
              Live from database
            </span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Last Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="admin-td-title">
                        <strong>{job.title}</strong>
                        {job.featured && (
                          <span className="admin-badge admin-badge-purple">Featured</span>
                        )}
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.salary || "—"}</td>
                    <td>
                      <span className="admin-badge admin-badge-slate">{job.type}</span>
                    </td>
                    <td>{job.category}</td>
                    <td>{job.lastDate || "—"}</td>
                    <td>
                      <button
                        className="admin-status-toggle"
                        title="Click to toggle Active / Inactive"
                        onClick={() => toggleStatus(job)}
                      >
                        <StatusBadge status={job.status} />
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          href={`/admin/jobs/${job._id}`}
                          className="admin-action-btn admin-action-edit"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          className="admin-action-btn admin-action-delete"
                          onClick={() => deleteJob(job)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={(p) => load(q, status, p)} />
        </div>
      )}
    </div>
  );
}