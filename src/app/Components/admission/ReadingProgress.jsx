"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="ad-progress" aria-hidden="true">
        <div className="ad-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      {showTop ? (
        <button
          type="button"
          className="ad-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑
        </button>
      ) : null}
    </>
  );
}