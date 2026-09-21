"use client";

import { useEffect, useRef, useState } from "react";

export default function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.current.observe(el);
    });
    return () => observer.current?.disconnect();
  }, [items]);

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
  };

  if (!items || items.length === 0) return null;

  return (
    <nav className="ad-toc" aria-label="Table of contents">
      <p className="ad-toc-title">Table of Contents</p>
      <ol className="ad-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`ad-toc-link ${activeId === item.id ? "active" : ""}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}