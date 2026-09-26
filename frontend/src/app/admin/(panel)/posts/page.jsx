"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { POST_CATEGORY_META } from "../../../lib/postMeta";
import { Spinner, EmptyState, ErrorState, Pagination, Toast } from "../components/AdminUI";
import { apiJson } from "../components/api";

const STATUS_BADGE = {
  draft: { label: "Draft", cls: "admin-badge-gray" },
  scheduled: { label: "Scheduled", cls: "admin-badge-blue" },
  published: { label: "Published", cls: "admin-badge-green" },
  unpublished: { label: "Unpublished", cls: "admin-badge-orange" },
  expired: { label: "Expired", cls: "admin-badge-red" },
};

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
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
      const params = new URLSearchParams({
        page: String(nextPage),
        sort: "createdAt",
        order: "desc",
      });
      if (opts.q || q) params.set("q", opts.q || q);
      if (opts.status ?? status) params.set("status", opts.status ?? status);
      if (opts.category ?? category) params.set("category", opts.category ?? category);
      const { res, data } = await apiJson(`/api/admin/posts?${params.toString()}`);
      if (!res.ok) throw new Error(data?.message || "Failed to load posts.");
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
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

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function bulk(action) {
    if (!selected.length) return;
    if (action === "delete" && !window.confirm(`Delete ${selected.length} post(s)? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const { res, data } = await apiJson("/api/admin/posts", {
        method: "PATCH",
        body: { ids: selected, action },
      });
      if (!res.ok) throw new Error(data?.message || "Bulk action failed.");
      showToast("success", data.message || `${selected.length} post(s) updated.`);
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
          <h1>All Posts</h1>
          <p>{total} posts in the content library.</p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">+ New Post</Link>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input admin-search"
          type="search"
          placeholder="Search title, slug or organization..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1)}
        />
        <select className="admin-input" value={category} onChange={(e) => { setCategory(e.target.value); load(1, { category: e.target.value }); }}>
          <option value="">All Categories</option>
          {Object.keys(POST_CATEGORY_META).map((c) => (
            <option key={c} value={c}>{POST_CATEGORY_META[c].plural}</option>
          ))}
        </select>
        <select className="admin-input" value={status} onChange={(e) => { setStatus(e.target.value); load(1, { status: e.target.value }); }}>
          <option value="">All Status</option>
          {["draft", "scheduled", "published", "unpublished"].map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
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
            <Spinner label="Loading posts..." />
          ) : posts.length === 0 ? (
            <EmptyState
              title="No posts found"
              sub="Create your first post to build your content library."
              action={<Link href="/admin/posts/new" className="admin-btn admin-btn-primary">+ New Post</Link>}
            />
          ) : (
            <div className="admin-card">
              <div className="t-table-wrap">
                <table className="t-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" checked={selected.length === posts.length && posts.length > 0} onChange={(e) => setSelected(e.target.checked ? posts.map((p) => p._id) : [])} aria-label="Select all" /></th>
                      <th>Post</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Published</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => {
                      const meta = POST_CATEGORY_META[p.category] || {};
                      return (
                        <tr key={p._id} className={selected.includes(p._id) ? "selected" : ""}>
                          <td><input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggle(p._id)} aria-label="Select post" /></td>
                          <td>
                            <Link href={`/admin/posts/${p._id}`} className="t-post-cell">
                              {p.featuredImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.featuredImage} alt="" />
                              )}
                              <span>
                                <strong>{p.title || "(no title)"}</strong>
                                <small>/{p.slug}</small>
                              </span>
                            </Link>
                          </td>
                          <td><span className="t-cat-pill" style={{ background: (meta.color || "#ccc") + "1c", color: meta.color || "#555" }}>{meta.plural || p.category}</span></td>
                          <td><span className={`admin-badge ${STATUS_BADGE[p.status]?.cls || ""}`}>{STATUS_BADGE[p.status]?.label || p.status}</span></td>
                          <td>{p.featured ? "★" : "—"}</td>
                          <td>{p.status === "scheduled" ? fmt(p.scheduledAt) : fmt(p.publishedAt)}</td>
                          <td>{fmt(p.updatedAt)}</td>
                          <td>
                            <div className="t-row-actions">
                              <Link href={`/admin/posts/${p._id}`} className="admin-btn admin-btn-sm">Edit</Link>
                              <a href={`/post/${p.slug}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn-sm">View</a>
                              <button
                                type="button"
                                className="admin-btn admin-btn-sm admin-btn-danger"
                                onClick={async () => {
                                  if (!window.confirm("Delete this post?")) return;
                                  const { res, data } = await apiJson(`/api/admin/posts/${p._id}`, { method: "DELETE" });
                                  showToast(res.ok ? "success" : "error", res.ok ? "Post deleted." : (data?.message || "Delete failed."));
                                  if (res.ok) load(page);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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