"use client";

import { useState } from "react";

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2m0 18.07a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23m4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.73-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.75 8.44-4.92 8.44-9.94" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.26 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </svg>
  );
}

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`${title} | JobCareer`);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${shareText}%20${encodeURIComponent(pageUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(pageUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = pageUrl;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        setCopied(false);
      }
      document.body.removeChild(textarea);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ad-share">
      <button
        type="button"
        className="ad-share-btn ad-share-wa"
        onClick={handleWhatsApp}
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon /> WhatsApp
      </button>
      <button
        type="button"
        className="ad-share-btn ad-share-fb"
        onClick={handleFacebook}
        aria-label="Share on Facebook"
      >
        <FacebookIcon /> Facebook
      </button>
      <button
        type="button"
        className="ad-share-btn ad-share-x"
        onClick={handleTwitter}
        aria-label="Share on X (Twitter)"
      >
        <XIcon /> X
      </button>
      <button
        type="button"
        className="ad-share-btn ad-share-copy"
        onClick={handleCopy}
        aria-label="Copy page link"
      >
        <LinkIcon /> {copied ? "Link copied!" : "Copy Link"}
      </button>
    </div>
  );
}