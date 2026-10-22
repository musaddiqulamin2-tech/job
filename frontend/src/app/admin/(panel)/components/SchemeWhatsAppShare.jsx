"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "./AdminUI";
import { apiJson, readFileAsDataUrl } from "./api";
import {
  SCHEME_SHARE_STATUS_META,
  generateSchemeWhatsAppMessage,
  schemePublicUrl,
  schemeWhatsAppShareUrl,
} from "../../../lib/schemeShare";
import { generateSchemePoster } from "../../../lib/schemePoster";

const COPY_OK = "WhatsApp post copied. Paste it into your Channel.";
const SHARE_OK = "Opening WhatsApp with the generated message…";
const REGENERATED = "Message regenerated from the saved scheme record.";
const POSTER_OK = "Poster downloaded. Attach it to your Channel post.";
const COPY_IMAGE_OK = "Poster copied. Paste the image into your Channel post.";
const STATUS_SAVED = "Sharing status updated.";

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy copy path below.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(area);
    return copied;
  } catch {
    return false;
  }
}

function renderWhatsAppText(text) {
  return String(text)
    .split(/(\*[^*\n]+\*)/g)
    .map((part, index) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
        <strong key={index}>{part.slice(1, -1)}</strong>
      ) : (
        <span key={index}>{part}</span>
      )
    );
}

function posterExtension(blob, fallbackUrl) {
  if (blob?.type === "image/png") return "png";
  if (blob?.type === "image/webp") return "webp";
  if (blob?.type === "image/gif") return "gif";
  const match = String(fallbackUrl || "").match(/\.(png|jpe?g|webp|gif)(?:\?|$)/i);
  return match ? match[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function canvasToPngBlob(blob) {
  if (!blob || blob.type === "image/png") return blob;
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("decode"));
      element.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(image, 0, 0);
    return await new Promise((resolve) => canvas.toBlob((result) => resolve(result), "image/png"));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * WhatsApp Channel generator for one government scheme. The saved record is the
 * only source of truth: the poster and the message are generated from it, and
 * the only link in the message is the scheme's page on jobcareercanvas.in.
 *
 * Nothing is published here. The admin copies the message, downloads the poster
 * and publishes to the Channel manually. The share status is stored on the
 * scheme record so it always reflects what actually happened.
 */
export default function SchemeWhatsAppShare({
  scheme,
  label = "WhatsApp Post",
  className = "admin-btn admin-btn-sm",
  warnWhenDraft = true,
  onStatusChange,
  onImageChange,
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [posterMode, setPosterMode] = useState("generated");
  const [posterUrl, setPosterUrl] = useState("");
  const [posterBusy, setPosterBusy] = useState(false);
  const [posterError, setPosterError] = useState("");
  const [posterTick, setPosterTick] = useState(0);
  const [image, setImage] = useState(scheme?.featuredImage || "");
  const [status, setStatus] = useState(scheme?.whatsappStatus || "");
  const [statusBusy, setStatusBusy] = useState(false);
  const [overrideDraft, setOverrideDraft] = useState(false);
  const [toast, setToast] = useState(null);
  const closeRef = useRef(null);
  const uploadRef = useRef(null);

  const generated = scheme ? generateSchemeWhatsAppMessage(scheme) : "";
  const unavailable = !scheme || !generated;
  const isPublished = scheme?.status === "published";
  const draftBlocked = !isPublished && !overrideDraft;
  const publicUrl = schemePublicUrl(scheme);
  const statusMeta = SCHEME_SHARE_STATUS_META[status] || SCHEME_SHARE_STATUS_META[""];

  useEffect(() => {
    setImage(scheme?.featuredImage || "");
    setStatus(scheme?.whatsappStatus || "");
  }, [scheme]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || posterMode !== "generated") return undefined;
    let alive = true;
    setPosterBusy(true);
    setPosterError("");
    generateSchemePoster(scheme)
      .then((url) => {
        if (!alive) return;
        if (url) {
          setPosterUrl(url);
        } else {
          setPosterUrl("");
          setPosterError("The poster could not be generated in this browser.");
        }
      })
      .catch(() => {
        if (!alive) return;
        setPosterUrl("");
        setPosterError("The poster could not be generated in this browser.");
      })
      .finally(() => {
        if (alive) setPosterBusy(false);
      });
    return () => {
      alive = false;
    };
  }, [open, posterMode, posterTick, scheme]);

  if (unavailable) return null;

  function notify(type, text) {
    setToast({ type, message: text });
    window.setTimeout(() => setToast(null), 4000);
  }

  async function persist(body, nextStatus) {
    if (!scheme?._id) return;
    setStatusBusy(true);
    try {
      const { res, data } = await apiJson(`/api/admin/schemes/${scheme._id}`, {
        method: "PATCH",
        body,
      });
      if (!res.ok) throw new Error(data?.message || "Status update failed.");
      if (nextStatus !== undefined) {
        setStatus(nextStatus);
        if (typeof onStatusChange === "function") onStatusChange(nextStatus);
      }
      return true;
    } catch (e) {
      notify("error", e.message);
      return false;
    } finally {
      setStatusBusy(false);
    }
  }

  async function openEditor() {
    setMessage(generated);
    setShowPreview(true);
    setPosterMode(image ? "featured" : "generated");
    setPosterUrl(image || "");
    setPosterError("");
    setOverrideDraft(false);
    setOpen(true);
    const nextStatus = isPublished ? "ready" : "draft";
    setStatus(scheme?.whatsappStatus || nextStatus);
    if (scheme?._id && !scheme.whatsappStatus) {
      await persist({ whatsappStatus: nextStatus }, nextStatus);
    }
  }

  function regenerate() {
    setMessage(generateSchemeWhatsAppMessage(scheme));
    notify("success", REGENERATED);
  }

  function selectFeatured() {
    setPosterMode("featured");
    setPosterError("");
    setPosterUrl(image);
  }

  function generatePoster() {
    setPosterMode("generated");
    setPosterTick((value) => value + 1);
  }

  async function uploadPoster(file) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      notify("error", "Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notify("error", "Image must be under 8 MB.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { res, data } = await apiJson("/api/admin/media", {
        method: "POST",
        body: { dataUrl, filename: file.name, resourceType: "image" },
      });
      if (!res.ok) throw new Error(data?.message || "Upload failed.");
      const url = data.item.secureUrl || data.item.url;
      if (!url) throw new Error("Upload did not return an image URL.");
      setImage(url);
      setPosterMode("uploaded");
      setPosterUrl(url);
      if (typeof onImageChange === "function") onImageChange(url);
      await persist({ featuredImage: url });
      notify("success", "Poster uploaded and saved to this scheme.");
    } catch (e) {
      notify("error", e.message);
    }
  }

  async function posterBlob() {
    if (!posterUrl) return null;
    try {
      const response = await fetch(posterUrl);
      if (!response.ok) return null;
      return await response.blob();
    } catch {
      return null;
    }
  }

  async function downloadPoster() {
    const blob = await posterBlob();
    if (!blob) {
      if (posterUrl) {
        window.open(posterUrl, "_blank", "noopener,noreferrer");
        notify("error", "Direct download was blocked. The poster opened in a new tab — save it from there.");
      } else {
        notify("error", "Generate or select a poster first.");
      }
      return;
    }
    const extension = posterExtension(blob, posterUrl);
    const name = `${scheme.slug || "scheme"}-poster.${extension}`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    notify("success", POSTER_OK);
  }

  async function copyPoster() {
    if (!posterUrl) {
      notify("error", "Generate or select a poster first.");
      return;
    }
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      notify("error", "This browser cannot copy images. Use Download Poster instead.");
      return;
    }
    try {
      const blob = await posterBlob();
      const png = await canvasToPngBlob(blob);
      if (!png) throw new Error("no image");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
      notify("success", COPY_IMAGE_OK);
    } catch {
      notify("error", "Could not copy the poster. Use Download Poster instead.");
    }
  }

  async function copy() {
    const text = message.trim();
    if (!text) {
      notify("error", "The message is empty. Generate the post first.");
      return;
    }
    const copied = await copyToClipboard(message);
    notify(
      copied ? "success" : "error",
      copied ? COPY_OK : "Could not copy automatically. Select the message text and copy it manually."
    );
  }

  async function share() {
    await persist({ whatsappStatus: "share-opened" }, "share-opened");
    notify("success", SHARE_OK);
  }

  async function markPublished() {
    if (!window.confirm("Have you already published this post to your WhatsApp Channel?")) return;
    const ok = await persist({ whatsappStatus: "published" }, "published");
    if (ok) notify("success", STATUS_SAVED);
  }

  return (
    <>
      <button type="button" className={className} onClick={openEditor}>
        🟢 {label}
      </button>

      <Toast toast={toast} onClose={() => setToast(null)} />

      {open && (
        <div
          className="wa-share-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-scheme-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="wa-share-modal">
            <div className="wa-share-head">
              <div className="wa-share-heading">
                <h2 id="wa-scheme-title">WhatsApp Scheme Post</h2>
                <p>
                  Choose or generate the poster, edit the message, preview the post, then copy it or
                  share it to WhatsApp. Nothing is published automatically.
                </p>
                <div className="wa-share-status">
                  <span className={`admin-badge ${statusMeta.cls}`}>{statusMeta.label}</span>
                  <span className="wa-share-target">{isPublished ? "Published scheme" : "Not published yet"}</span>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="admin-btn admin-btn-sm"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            {warnWhenDraft && !isPublished && (
              <div className="wa-share-warning">
                <strong>This scheme is not published.</strong> The details link will not open for the
                public until you publish it.
                <label className="wa-share-override">
                  <input
                    type="checkbox"
                    checked={overrideDraft}
                    onChange={(event) => setOverrideDraft(event.target.checked)}
                  />
                  <span>Generate and share anyway (advanced)</span>
                </label>
              </div>
            )}

            <div className="wa-scheme-summary">
              <strong>{scheme.title}</strong>
              <span className="wa-share-target">{publicUrl || "No slug set on this scheme."}</span>
            </div>

            <div className="wa-poster">
              <div className="wa-poster-bar">
                <span className="wa-poster-title">Generate / Select Scheme Poster</span>
                <div className="wa-poster-actions">
                  {image && (
                    <button
                      type="button"
                      className={`admin-btn admin-btn-sm${posterMode === "featured" ? " is-active" : ""}`}
                      aria-pressed={posterMode === "featured"}
                      onClick={selectFeatured}
                    >
                      Use Scheme Image
                    </button>
                  )}
                  {posterMode === "uploaded" && (
                    <span className="admin-btn admin-btn-sm is-active">Uploaded Poster</span>
                  )}
                  <button
                    type="button"
                    className={`admin-btn admin-btn-sm${posterMode === "generated" ? " is-active" : ""}`}
                    aria-pressed={posterMode === "generated"}
                    onClick={generatePoster}
                    disabled={posterBusy}
                  >
                    {posterMode === "generated" ? "Regenerate Poster" : "Generate Poster"}
                  </button>
                  <button type="button" className="admin-btn admin-btn-sm" onClick={() => uploadRef.current?.click()}>
                    Upload Poster
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm"
                    onClick={downloadPoster}
                    disabled={!posterUrl || posterBusy}
                  >
                    ⬇ Download Poster
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm"
                    onClick={copyPoster}
                    disabled={!posterUrl || posterBusy}
                  >
                    Copy Poster
                  </button>
                </div>
              </div>

              <div className="wa-poster-frame">
                {posterBusy ? (
                  <div className="wa-poster-placeholder">Generating poster…</div>
                ) : posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={posterUrl} alt={`${scheme.title || "Scheme"} poster`} />
                ) : (
                  <div className="wa-poster-placeholder">
                    {posterError || "No poster image is available for this scheme."}
                  </div>
                )}
              </div>

              <p className="wa-share-note">
                WhatsApp cannot attach this image automatically. Download or copy the poster, attach it
                to your Channel post, then paste the message below.
              </p>
            </div>

            <input
              ref={uploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="t-hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                uploadPoster(file);
                e.target.value = "";
              }}
            />

            <div className="wa-share-toolbar">
              <button type="button" className="admin-btn admin-btn-sm" onClick={regenerate}>
                Generate WhatsApp Post
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-sm"
                onClick={() => setShowPreview((value) => !value)}
              >
                {showPreview ? "Hide Preview" : "Preview Post"}
              </button>
              <span className="wa-share-count">{message.length} characters</span>
            </div>

            {showPreview && (
              <div className="wa-share-bubble" aria-label="WhatsApp preview">
                <div className="wa-share-bubble-text">{renderWhatsAppText(message)}</div>
              </div>
            )}

            <textarea
              className="wa-share-editor"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              spellCheck={false}
              aria-label="Editable WhatsApp message"
            />

            <div className="wa-share-actions">
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={copy}
                disabled={draftBlocked}
              >
                📋 Copy Post
              </button>
              <a
                className="admin-btn"
                href={schemeWhatsAppShareUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={draftBlocked}
                onClick={(event) => {
                  if (draftBlocked) {
                    event.preventDefault();
                    return;
                  }
                  share();
                }}
              >
                🟢 Share on WhatsApp
              </a>
              <button
                type="button"
                className="admin-btn"
                onClick={markPublished}
                disabled={statusBusy || status === "published"}
              >
                ✅ Mark as Published
              </button>
            </div>

            <p className="wa-share-note">
              This only prepares the post. Opening WhatsApp does not publish to your Channel —
              download the poster, paste the message, publish manually, then mark it as published here.
              The public link always stays on jobcareercanvas.in.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
