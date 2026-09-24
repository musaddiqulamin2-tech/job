"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Spinner,
  EmptyState,
  ErrorState,
  Pagination,
  Toast,
} from "../components/AdminUI";

const pageSize = 10;

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  const load = useCallback(async (search = q, pageNum = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(pageSize),
      });
      if (search) params.set("q", search);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load users.");
      }
      setUsers(json.users);
      setTotal(json.total);
      setTotalPages(json.totalPages);
      setPage(pageNum);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(q, 1);
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete registered user "${user.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users?id=${user._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to delete user.");
      }
      showToast("success", json.message);
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      load(q, newPage);
    } catch (err) {
      showToast("error", err.message);
    }
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>Registered workers on the website.</p>
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
            placeholder="Search by name, mobile, state, or district..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <Spinner label="Loading users..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(q, page)} />
      ) : users.length === 0 ? (
        <div className="admin-card">
          <EmptyState
            title="No Users Found"
            sub={
              q
                ? "Try a different search."
                : "Registered workers will appear here."
            }
          />
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Registered Workers ({total})</h2>
            <span className="admin-chip">
              <span className="chip-dot" />
              Live from database
            </span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Work Type</th>
                  <th>KYC</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="admin-td-title">
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.mobile}</td>
                    <td>{user.state}</td>
                    <td>{user.district}</td>
                    <td>
                      <span className="admin-badge admin-badge-slate">{user.workType}</span>
                    </td>
                    <td>{user.kycType}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="admin-actions">
                        {user.documentUrl && (
                          <a
                            href={user.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-action-btn admin-action-edit"
                            title="View document"
                          >
                            KYC
                          </a>
                        )}
                        <button
                          className="admin-action-btn admin-action-delete"
                          onClick={() => deleteUser(user)}
                          title="Delete user"
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

          <Pagination page={page} totalPages={totalPages} onChange={(p) => load(q, p)} />
        </div>
      )}
    </div>
  );
}