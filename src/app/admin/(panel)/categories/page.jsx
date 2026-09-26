"use client";

import { useEffect, useState } from "react";
import { Spinner, EmptyState, ErrorState, Toast } from "../components/AdminUI";
import { apiJson, slugify } from "../components/api";

const ICONS = ["gov", "private", "admit-card", "result", "admission", "answer-key", "syllabus", ""];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", parent: "", order: 0, enabled: true, icon: "" });

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { res, data } = await apiJson("/api/admin/categories");
      if (!res.ok) throw new Error(data?.message || "Failed to load categories.");
      setCategories(data.categories);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(cat) {
    setEditing(cat?._id || "new");
    setForm({
      name: cat?.name || "",
      slug: cat?.slug || "",
      description: cat?.description || "",
      parent: cat?.parent || "",
      order: cat?.order ?? 0,
      enabled: cat ? cat.enabled !== false : true,
      icon: cat?.icon || "",
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", parent: "", order: 0, enabled: true, icon: "" });
  }

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("error", "Name is required.");
      return;
    }
    setBusy(true);
    try {
      const body = { ...form, name: form.name.trim(), slug: form.slug.trim() || slugify(form.name) };
      const { res, data } = await apiJson(
        editing === "new" ? "/api/admin/categories" : "/api/admin/categories",
        { method: editing === "new" ? "POST" : "PATCH", body: { ...body, id: editing === "new" ? undefined : editing } }
      );
      if (!res.ok) throw new Error(data?.message || "Failed to save category.");
      showToast("success", data.message || "Category saved.");
      cancelEdit();
      load();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize posts into content sections. Default categories feed the main public pages.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => startEdit(null)}>
          {editing === "new" ? "Editing..." : "+ Add Category"}
        </button>
      </div>

      {editing && (
        <div className="admin-card t-edit-cat">
          <h2>{editing === "new" ? "New Category" : "Edit Category"}</h2>
          <form onSubmit={save}>
            <div className="admin-form-row t-row2">
              <div className="admin-form-group">
                <label htmlFor="c-name">Name *</label>
                <input id="c-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label htmlFor="c-slug">Slug</label>
                <input id="c-slug" type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label htmlFor="c-desc">Description</label>
              <textarea id="c-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="admin-form-row t-row2">
              <div className="admin-form-group">
                <label htmlFor="c-parent">Parent</label>
                <input id="c-parent" type="text" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} placeholder="Optional" />
              </div>
              <div className="admin-form-group">
                <label htmlFor="c-order">Order</label>
                <input id="c-order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label htmlFor="c-icon">Icon</label>
              <select id="c-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic || "none"}</option>
                ))}
              </select>
            </div>
            <div className="t-check-row">
              <label className="admin-switch">
                <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                <span className="admin-switch-slider" />
              </label>
              <div><strong>Enabled</strong><p>Enabled categories appear on the public site.</p></div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>{busy ? "Saving..." : "Save Category"}</button>
              <button type="button" className="admin-btn" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading categories..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" sub="Add categories to structure your content." />
      ) : (
        <div className="admin-card">
          <div className="t-table-wrap">
            <table className="t-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.description && <small className="t-muted">{c.description}</small>}
                    </td>
                    <td><code>{c.slug}</code></td>
                    <td>{c.parent || "—"}</td>
                    <td>{c.order}</td>
                    <td>{c.enabled ? <span className="admin-badge admin-badge-green">Enabled</span> : <span className="admin-badge admin-badge-gray">Disabled</span>}</td>
                    <td>
                      <div className="t-row-actions">
                        <button type="button" className="admin-btn admin-btn-sm" onClick={() => startEdit(c)}>Edit</button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={async () => {
                            if (!window.confirm(`Delete "${c.name}"?`)) return;
                            const { res, data } = await apiJson(`/api/admin/categories?id=${c._id}&slug=${c.slug}`, { method: "DELETE" });
                            showToast(res.ok ? "success" : "error", res.ok ? "Category deleted." : (data?.message || "Delete failed."));
                            if (res.ok) load();
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
        </div>
      )}
    </div>
  );
}