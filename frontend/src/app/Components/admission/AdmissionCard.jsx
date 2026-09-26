"use client";

import Link from "next/link";

export default function AdmissionCard({ post }) {
  const href = post.url || `/admission/${post.slug}`;
  const badgeColor = post.tagColor || "teal";
  return (
    <article className="ad-land-card">
      <Link href={href} className="ad-land-link">
        <span className={`ad-badge ad-badge-${badgeColor}`}>{post.category}</span>
        <h2 className="ad-land-title">{post.title}</h2>
        <span className="ad-land-org">{post.org}</span>
        {post.date ? <span className="ad-land-date">{post.date}</span> : null}
        <span className="ad-land-btn">Read More →</span>
      </Link>
    </article>
  );
}