"use client";

import { useMemo, useState } from "react";
import AdmissionCard from "./AdmissionCard";

const KEYWORDS = {
  ANM: ["anm", "auxiliary nurse"],
  GNM: ["gnm", "general nursing"],
  Nursing: ["nursing"],
  College: ["college admission"],
  University: ["university admission", "univ"],
  ITI: ["iti", "polytechnic", "itc"],
  "D.El.Ed": ["d.el.ed", "deled", "diploma in elementary"],
};

export default function AdmissionCategoryFilter({ posts }) {
  const [active, setActive] = useState("All");

  const categories = ["All", ...Object.keys(KEYWORDS), "Other"];

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    if (active === "Other") {
      return posts.filter(
        (p) =>
          !Object.values(KEYWORDS).some((kws) =>
            kws.some((k) =>
              `${p.title} ${p.slug} ${p.category} ${p.org} ${p.badge || ""}`
                .toLowerCase()
                .includes(k)
            )
          )
      );
    }
    const kws = KEYWORDS[active];
    const hay = (p) =>
      `${p.title} ${p.slug} ${p.category} ${p.org} ${p.badge || ""}`.toLowerCase();
    return posts.filter((p) => kws.some((k) => hay(p).includes(k)));
  }, [active, posts]);

  return (
    <div>
      <div className="ad-filter-chips" role="tablist" aria-label="Filter admissions by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={`ad-filter-chip ${active === cat ? "active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <div className="ad-land-grid">
          {filtered.map((post) => (
            <AdmissionCard key={post._id ?? post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="ad-land-empty">
          <p>No admission posts are available in this category yet.</p>
          <p>
            Keep checking this page — new admissions will be updated as official
            notifications are released.
          </p>
        </div>
      )}
    </div>
  );
}