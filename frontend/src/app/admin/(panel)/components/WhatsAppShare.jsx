"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "./AdminUI";
import {
  WHATSAPP_CHANNEL_URL,
  generateJobWhatsAppMessage,
  whatsAppShareUrl,
} from "../../../lib/whatsappPost";

const COPY_OK = "WhatsApp post copied successfully.";
const SHARE_OK = "WhatsApp post prepared successfully.";

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

/**
 * "Share on WhatsApp Channel" for one post. Opens a preview of the generated
 * recruitment post, then lets the admin copy it or hand it to WhatsApp. It does
 * not post to the Channel and never claims to have done so.
 */
export default function WhatsAppShare({
  post,
  label = "Share on WhatsApp Channel",
  className = "admin-btn admin-btn-sm",
  blockWhenDraft = false,
}) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const closeRef = useRef(null);

  const message = useMemo(() => (post ? generateJobWhatsAppMessage(post) : ""), [post]);
  const status = post?.status;
  const hidden = !post || !message || (blockWhenDraft && status !== "published");

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

  if (hidden) return null;

  function notify(type, text) {
    setToast({ type, message: text });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function copy() {
    const copied = await copyToClipboard(message);
    notify(
      copied ? "success" : "error",
      copied
        ? COPY_OK
        : "Could not copy automatically. Please select the preview text and copy it manually."
    );
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
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
                <h2 id="wa-share-title">WhatsApp Post Preview</h2>
                <p>Review the prepared post, then copy it or open WhatsApp to send it to the channel.</p>
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

            <pre className="wa-share-preview">{message}</pre>

            <div className="wa-share-actions">
              <button type="button" className="admin-btn admin-btn-primary" onClick={copy}>
                📋 Copy WhatsApp Post
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
              <a
                className="admin-btn"
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 Open Channel
              </a>
            </div>

            <p className="wa-share-note">
              This only prepares the post. Nothing is published to the channel automatically — send it
              from the official JobCareer WhatsApp Channel yourself.
            </p>
          </div>
        </div>
      )}
    </>
  );
}