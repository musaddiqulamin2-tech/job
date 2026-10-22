"use client";

import { useState } from "react";

// The job card thumbnail is rendered on the server, but a broken or removed
// image URL has to fall back to the themed placeholder at runtime. Keeping the
// <img> in a small client component lets us hide it on error without turning
// the whole category page into a client component.
export default function JobThumbImage({ src, alt, org, darkText }) {
  const [failed, setFailed] = useState(false);

  if (!src) return null;

  if (failed) {
    return (
      <span className="ac-card-org" style={{ color: darkText }}>
        {org}
      </span>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="ac-card-img"
        src={src}
        alt={alt || ""}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      <span className="ac-card-scrim" />
      <span className="ac-card-org" style={{ color: "#ffffff" }}>
        {org}
      </span>
    </>
  );
}
