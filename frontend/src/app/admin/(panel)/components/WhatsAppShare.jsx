"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "./AdminUI";
import { generateJobWhatsAppMessage, whatsAppShareUrl } from "../../../lib/whatsappPost";

const COPY_OK = "WhatsApp message copied successfully.";
const SHARE_OK = "Opening WhatsApp with the generated message…";
const REGENERATED = "Message regenerated from the saved job details.";

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

/**
 * WhatsApp job-post generator for one post. The generated message is editable,
 * can be previewed, copied and handed to WhatsApp. It only prepares the text —
 * it never posts to the Channel automatically.
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
  const [toast, setToast] = useState(null);
  const closeRef = useRef(null);

  const generated = post ? generateJobWhatsAppMessage(post) : "";
  const unavailable = !post || !generated;
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

  if (unavailable) return null;

  function notify(type, text) {
    setToast({ type, message: text });
    window.setTimeout(() => setToast(null), 3500);
  }

  function openEditor() {
    setMessage(generated);
    setShowPreview(true);
    setOpen(true);
  }

  function regenerate() {
    setMessage(generateJobWhatsAppMessage(post));
    notify("success", REGENERATED);
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
                <p>Edit the message, preview it, then copy it or open WhatsApp to post it to your channel.</p>
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
                📋 Copy Message
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
              This only prepares the message. Opening WhatsApp does not publish to your Channel
              automatically — copy the message and paste it into the Channel to post it.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
