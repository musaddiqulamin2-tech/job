"use client";

import { useRef, useState } from "react";

export default function FAQ({ items, firstOpen = false }) {
  const [openIdx, setOpenIdx] = useState(firstOpen ? 0 : null);
  const bodyRefs = useRef([]);

  if (!items || items.length === 0) return null;

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="ad-faq" role="region" aria-label="Frequently asked questions">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`ad-faq-item ${isOpen ? "open" : ""}`}
          >
            <button
              type="button"
              className="ad-faq-question"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${idx}`}
              id={`faq-btn-${idx}`}
              onClick={() => toggle(idx)}
            >
              {item.question}
            </button>
            <div
              ref={(el) => {
                bodyRefs.current[idx] = el;
              }}
              className="ad-faq-body"
              id={`faq-panel-${idx}`}
              role="region"
              aria-labelledby={`faq-btn-${idx}`}
              style={{
                maxHeight: isOpen
                  ? bodyRefs.current[idx]?.scrollHeight + 8
                  : 0,
              }}
            >
              <p className="ad-faq-answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}