"use client";

import { useEffect, useState } from "react";
import { Spinner, EmptyState, ErrorState, Pagination, Toast } from "../components/AdminUI";
import { apiJson, readFileAsDataUrl } from "../components/api";

function fmtSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = null;

  function showToast(t, m) {
    setToast({ t, m, type: t });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function load(nextPage = page, opts = {}) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (opts.type ?? type) params.set("type", opts.type ?? type);
      if (opts.q ?? q) params.set("q", opts.q ?? q);
      const { res, data } = await apiJson(`/api/admin/media?${params.toString()}`);
      if (!res.ok) throw new Error(data?.message || "Failed to load media.");
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(nextPage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, { type: "", q: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(file) {
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    if (!isPdf && !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      showToast("error", "Only JPG, PNG, WEBP, GIF or PDF files are allowed.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { res, data } = await apiJson("/api/admin/media", {
        method: "POST",
        body: { dataUrl, filename: file.name, resourceType: isPdf ? "pdf" : "image" },
      });
      if (!res.ok) throw new Error(data?.message || "Upload failed.");
      showToast("success", data.message || "Uploaded to media library.");
      load(1);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setUploading(false);
    }
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("success", "URL copied to clipboard.");
    } catch {
      showToast("error", "Could not copy URL.");
    }
  }

  return (
    <div className="admin-page">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type} ${toast.m ? "" : ""}`}>
          {toast.m}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Media Library</h1>
          <p>{total} files stored in Cloudinary.</p>
        </div>
        <label className="admin-btn admin-btn-primary t-upload-btn">
          {uploading ? "Uploading..." : "+ Upload Files"}
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            disabled={uploading}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              (async () => {
                for (const f of files) await upload(f);
              })();
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input admin-search"
          type="search"
          placeholder="Search files..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1)}
        />
        <select className="admin-input" value={type} onChange={(e) => { setType(e.target.value); load(1, { type: e.target.value }); }}>
          <option value="">All Files</option>
          <option value="image">Images</option>
          <option value="pdf">PDFs</option>
        </select>
        <button type="button" className="admin-btn" onClick={() => load(1)}>Search</button>
      </div>

      {loading ? (
        <Spinner label="Loading media..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState title="No files yet" sub="Upload images and PDFs to use in posts." />
      ) : (
        <>
          <div className="t-media-grid">
            {items.map((m) => (
              <div className="t-media-item" key={m._id}>
                {m.resourceType === "pdf" ? (
                  <div className="t-media-pdf">
                    <span>PDF</span>
                    <small>{m.filename || "document.pdf"}</small>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.secureUrl || m.url} alt={m.filename} loading="lazy" />
                )}
                <div className="t-media-meta">
                  <strong title={m.filename}>{m.filename || m.publicId}</strong>
                  <span>{m.format?.toUpperCase()} {m.width ? `${m.width}×${m.height}` : ""} {fmtSize(m.size)}</span>
                </div>
                <div className="t-media-actions">
                  <button type="button" className="admin-btn admin-btn-sm" onClick={() => copyUrl(m.secureUrl || m.url)}>Copy URL</button>
                  {m.resourceType !== "pdf" && (
                    <button type="button" className="admin-btn admin-btn-sm" onClick={() => copyUrl(m.secureUrl || m.url)}>Insert</button>
                  )}
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={async () => {
                      if (!window.confirm("Delete this file? URLs referencing it will break.")) return;
                      const { res, data } = await apiJson(`/api/admin/media?id=${m._id}`, { method: "DELETE" });
                      showToast(res.ok ? "success" : "error", res.ok ? "File deleted." : (data?.message || "Delete failed."));
                      if (res.ok) load(page);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={(p) => load(p)} />}
        </>
      )}
    </div>
  );
}