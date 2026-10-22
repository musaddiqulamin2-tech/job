"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SCHEME_CATEGORY_OPTIONS,
  SCHEME_STATUS_META,
  schemeCategoryLabel,
} from "../../../lib/schemeMeta";
import { Spinner, EmptyState, ErrorState, Pagination, Toast } from "../components/AdminUI";
import { apiJson } from "../components/api";

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function load(nextPage = page, opts = {}) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(nextPage), sort: "createdAt", order: "desc" });
      if (opts.q || q) params.set("q", opts.q || q);
      if (opts.status ?? status) params.set("status", opts.status ?? status);
      if (opts.category ?? category) params.set("category", opts.category ?? category);
      const { res, data } = await apiJson(`/api/admin/schemes?${params.toString()}`);
      if (!res.ok) throw new Error(data?.message || "Failed to load schemes.");
      setSchemes(data.schemes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(nextPage);
      setSelected([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, { q: "", status: "", category: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function bulk(action) {
    if (!selected.length) return;
    if (action === "delete" && !window.confirm(`Delete ${selected.length} scheme(s)? This cannot be undone.`)) return;
    if (action === "unpublish" && !window.confirm(`Unpublish ${selected.length} scheme(s)? They will disappear from the public website.`)) return;
    setBusy(true);
    try {
      const { res, data } = await apiJson("/api/admin/schemes", {
        method: "PATCH",
        body: { ids: selected, action },
      });
      if (!res.ok) throw new Error(data?.message || "Bulk action failed.");
      showToast("success", `${selected.length} scheme(s) updated.`);
      load(page);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Schemes</h1>
          <p>
            {loading
              ? "Loading schemes..."
              : error
                ? "Could not load schemes. Check your session and retry."
                : `${total} schemes in the library.`}
          </p>
        </div>
        <Link href="/admin/schemes/new" className="admin-btn admin-btn-primary">+ New Scheme</Link>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input admin-search"
          type="search"
          placeholder="Search scheme, slug or department..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1)}
        />
        <select
          className="admin-input"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            load(1, { category: e.target.value });
          }}
        >
          <option value="">All Categories</option>
          {SCHEME_CATEGORY_OPTIONS.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <select
          className="admin-input"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            load(1, { status: e.target.value });
          }}
        >
          <option value="">All Status</option>
          {["draft", "scheduled", "published", "unpublished"].map((s) => (
            <option key={s} value={s}>{SCHEME_STATUS_META[s]?.label || s}</option>
          ))}
        </select>
        <button type="button" className="admin-btn" onClick={() => load(1)}>Search</button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => load(page)} />
      ) : (
        <>
          {selected.length > 0 && (
            <div className="admin-bulk-bar">
              <strong>{selected.length} selected</strong>
              <button type="button" className="admin-btn" disabled={busy} onClick={() => bulk("publish")}>Publish</button>
              <button type="button" className="admin-btn" disabled={busy} onClick={() => bulk("unpublish")}>Unpublish</button>
              <button type="button" className="admin-btn" disabled={busy} onClick={() => bulk("feature")}>Feature</button>
              <button type="button" className="admin-btn" disabled={busy} onClick={() => bulk("unfeature")}>Unfeature</button>
              <button type="button" className="admin-btn admin-btn-danger" disabled={busy} onClick={() => bulk("delete")}>Delete</button>
            </div>
          )}

          {loading ? (
            <Spinner label="Loading schemes..." />
          ) : schemes.length === 0 ? (
            <EmptyState
              title="No schemes found"
              sub="Publish your first government scheme to start building the library."
              action={<Link href="/admin/schemes/new" className="admin-btn admin-btn-primary">+ New Scheme</Link>}
            />
          ) : (
            <div className="admin-card">
              <div className="t-table-wrap">
                <table className="t-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selected.length === schemes.length && schemes.length > 0}
                          onChange={(e) => setSelected(e.target.checked ? schemes.map((s) => s._id) : [])}
                          aria-label="Select all"
                        />
                      </th>
                      <th>Scheme</th>
                      <th>Department</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Published</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((s) => (
                      <tr key={s._id} className={selected.includes(s._id) ? "selected" : ""}>
                        <td><input type="checkbox" checked={selected.includes(s._id)} onChange={() => toggle(s._id)} aria-label="Select scheme" /></td>
                        <td>
                          <Link href={`/admin/schemes/${s._id}`} className="t-post-cell">
                            {s.featuredImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.featuredImage} alt="" />
                            )}
                            <span>
                              <strong>{s.title || "(no title)"}</strong>
                              <small>/{s.slug}</small>
                            </span>
                          </Link>
                        </td>
                        <td>{s.department || "—"}</td>
                        <td><span className="t-cat-pill">{schemeCategoryLabel(s.category)}</span></td>
                        <td>
                          <span className={`admin-badge ${SCHEME_STATUS_META[s.status]?.cls || ""}`}>
                            {SCHEME_STATUS_META[s.status]?.label || s.status}
                          </span>
                        </td>
                        <td>{s.featured ? "★" : "—"}</td>
                        <td>{s.status === "scheduled" ? fmt(s.scheduledAt) : fmt(s.publishedAt)}</td>
                        <td>{fmt(s.updatedAt)}</td>
                        <td>
                          <div className="t-row-actions">
                            <Link href={`/admin/schemes/${s._id}`} className="admin-btn admin-btn-sm">Edit</Link>
                            {s.status === "published" && (
                              <a href={`/scheme/${s.slug}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn-sm">View</a>
                            )}
                            <button
                              type="button"
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={async () => {
                                if (!window.confirm("Delete this scheme?")) return;
                                const { res, data } = await apiJson(`/api/admin/schemes/${s._id}`, { method: "DELETE" });
                                showToast(res.ok ? "success" : "error", res.ok ? "Scheme deleted." : (data?.message || "Delete failed."));
                                if (res.ok) load(page);
                              }}
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
              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={(p) => load(p)} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
