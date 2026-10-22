"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "./AdminUI";
import { clean, generateJobWhatsAppMessage, whatsAppShareUrl } from "../../../lib/whatsappPost";
import { generateJobPoster } from "../../../lib/jobPoster";

const COPY_OK = "WhatsApp post copied successfully. Paste it into your channel.";
const SHARE_OK = "Opening WhatsApp with the generated message…";
const REGENERATED = "Message regenerated from the saved job details.";
const POSTER_OK = "Poster downloaded. Attach it to your WhatsApp Channel post.";
const COPY_IMAGE_OK = "Poster copied. Paste the image into your WhatsApp Channel post.";

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

// WhatsApp renders *bold* text. The preview mirrors that so the admin sees the
// post roughly the way it will appear in the channel.
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
 * WhatsApp job-post generator for one post. The post has two parts: the poster
 * image (the saved job image, or a branded poster generated from the same saved
 * fields) and the message text. Both are previewed, editable where possible and
 * handed to WhatsApp manually — nothing is published to the Channel here.
 */
export default function WhatsAppShare({
  post,
  label = "Generate WhatsApp Post",
  className = "admin-btn admin-btn-sm",
  warnWhenDraft = false,
  // Legacy prop kept so any older caller keeps working.
  blockWhenDraft = false,
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [posterMode, setPosterMode] = useState("generated");
  const [posterUrl, setPosterUrl] = useState("");
  const [posterBusy, setPosterBusy] = useState(false);
  const [posterError, setPosterError] = useState("");
  const [posterTick, setPosterTick] = useState(0);
  const [toast, setToast] = useState(null);
  const closeRef = useRef(null);

  const generated = post ? generateJobWhatsAppMessage(post) : "";
  const unavailable = !post || !generated;
  const featuredImage = clean(post?.featuredImage);
  const draftWarning = (warnWhenDraft || blockWhenDraft) && post && post.status !== "published";

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
    generateJobPoster(post)
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
  }, [open, posterMode, posterTick, post]);

  if (unavailable) return null;

  function notify(type, text) {
    setToast({ type, message: text });
    window.setTimeout(() => setToast(null), 4000);
  }

  function openEditor() {
    setMessage(generated);
    setShowPreview(true);
    setPosterMode(featuredImage ? "featured" : "generated");
    setPosterUrl(featuredImage || "");
    setPosterError("");
    setOpen(true);
  }

  function regenerate() {
    setMessage(generateJobWhatsAppMessage(post));
    notify("success", REGENERATED);
  }

  function selectFeatured() {
    setPosterMode("featured");
    setPosterError("");
    setPosterUrl(featuredImage);
  }

  function generatePoster() {
    setPosterMode("generated");
    setPosterTick((value) => value + 1);
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
    const name = `${post.slug || "job-poster"}-poster.${extension}`;
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
      copied
        ? COPY_OK
        : "Could not copy automatically. Select the message text and copy it manually."
    );
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
          aria-labelledby="wa-share-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="wa-share-modal">
            <div className="wa-share-head">
              <div className="wa-share-heading">
                <h2 id="wa-share-title">WhatsApp Job Post</h2>
                <p>
                  Choose or generate the poster, edit the message, preview the post, then copy it or
                  share it to WhatsApp. Nothing is published automatically.
                </p>
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

            {draftWarning && (
              <p className="wa-share-warning">
                This post is not published yet. The job-details link will work only after you publish
                it.
              </p>
            )}

            <div className="wa-poster">
              <div className="wa-poster-bar">
                <span className="wa-poster-title">Generate / Select Job Poster</span>
                <div className="wa-poster-actions">
                  {featuredImage && (
                    <button
                      type="button"
                      className={`admin-btn admin-btn-sm${posterMode === "featured" ? " is-active" : ""}`}
                      aria-pressed={posterMode === "featured"}
                      onClick={selectFeatured}
                    >
                      Use Job Image
                    </button>
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
                  <img src={posterUrl} alt={`${post.title || "Job"} poster`} />
                ) : (
                  <div className="wa-poster-placeholder">
                    {posterError || "No poster image is available for this job."}
                  </div>
                )}
              </div>

              <p className="wa-share-note">
                WhatsApp cannot attach this image automatically. Download or copy the poster, attach it
                to your Channel post, then paste the message below.
              </p>
            </div>

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
              <button type="button" className="admin-btn admin-btn-primary" onClick={copy}>
                📋 Copy Post
              </button>
              <a
                className="admin-btn"
                href={whatsAppShareUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => notify("success", SHARE_OK)}
              >
                🟢 Share on WhatsApp
              </a>
            </div>

            <p className="wa-share-note">
              This only prepares the post. Opening WhatsApp does not publish to your Channel
              automatically — attach the poster, paste the message and publish it manually.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
