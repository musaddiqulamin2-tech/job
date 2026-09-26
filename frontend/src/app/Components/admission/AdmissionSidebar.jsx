"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function WidgetBlock({ title, children }) {
  return (
    <div className="ad-widget">
      <h2 className="ad-widget-title">{title}</h2>
      {children}
    </div>
  );
}

function ItemLink({ href, title, sub }) {
  return (
    <li>
      <Link href={href}>
        <span className="ad-widget-item-title">{title}</span>
        {sub ? <span className="ad-widget-item-org">{sub}</span> : null}
      </Link>
    </li>
  );
}

const CATEGORIES = [
  { label: "Recruitment", href: "/category/job" },
  { label: "Admission", href: "/admission" },
  { label: "Admit Card", href: "/category/admit-card" },
  { label: "Results", href: "/category/results" },
  { label: "Scholarship", href: "/category/scholarship" },
];

const TOOLS = ["Age Calculator", "Image Resize", "PDF Tools", "Resume Maker"];

export default function AdmissionSidebar({ admissions = [], jobs = [], results = [] }) {
  const [query, setQuery] = useState("");

  const searchItems = useMemo(() => {
    const items = [
      ...admissions.map((p) => ({
        title: p.title,
        sub: p.org || p.category,
        href: p.url || `/admission/${p.slug}`,
      })),
      ...jobs.map((p) => ({
        title: p.title,
        sub: p.company || p.organization || p.category,
        href: `/job/${p.slug}`,
      })),
      ...results.map((p) => ({
        title: p.title,
        sub: p.org || p.company || p.category,
        href: `/result/${p.slug}`,
      })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)
    );
  }, [query, admissions, jobs, results]);

  return (
    <aside className="ad-sidebar">
      <WidgetBlock title="Search">
        <div className="ad-search">
          <input
            type="search"
            className="ad-search-input"
            placeholder="Search admissions, jobs, results..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the website"
          />
          {query.trim() ? (
            <ul className="ad-widget-list ad-search-results">
              {searchItems.length > 0 ? (
                searchItems.map((it, idx) => (
                  <ItemLink key={it.href + idx} {...it} />
                ))
              ) : (
                <li className="ad-search-empty">No matches found.</li>
              )}
            </ul>
          ) : (
            <p className="ad-search-hint">
              Type to search across the latest admissions, jobs and results.
            </p>
          )}
        </div>
      </WidgetBlock>

      <WidgetBlock title="Latest Updates">
        <ul className="ad-widget-list">
          {[
            ...admissions.map((p) => ({
              title: p.title,
              sub: p.org || p.category,
              href: p.url || `/admission/${p.slug}`,
            })),
            ...jobs.map((p) => ({
              title: p.title,
              sub: p.company || p.organization,
              href: `/job/${p.slug}`,
            })),
            ...results.map((p) => ({
              title: p.title,
              sub: p.org || p.company,
              href: `/result/${p.slug}`,
            })),
          ]
            .slice(0, 6)
            .map((it, idx) => <ItemLink key={it.href + idx} {...it} />)}
        </ul>
      </WidgetBlock>

      <WidgetBlock title="Latest Admissions">
        <ul className="ad-widget-list">
          {admissions.slice(0, 6).map((p) => (
            <ItemLink
              key={p._id || p.slug}
              href={p.url || `/admission/${p.slug}`}
              title={p.title}
              sub={p.org || p.category}
            />
          ))}
        </ul>
      </WidgetBlock>

      <WidgetBlock title="Latest Jobs">
        <ul className="ad-widget-list">
          {jobs.slice(0, 6).map((p) => (
            <ItemLink
              key={p._id || p.slug}
              href={`/job/${p.slug}`}
              title={p.title}
              sub={p.company || p.organization}
            />
          ))}
        </ul>
      </WidgetBlock>

      <WidgetBlock title="Categories">
        <div className="ad-cat-list">
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="ad-cat-chip">
              {c.label}
            </Link>
          ))}
        </div>
      </WidgetBlock>

      <WidgetBlock title="Popular Posts">
        <ul className="ad-widget-list">
          {admissions.slice(0, 4).map((p) => (
            <ItemLink
              key={p._id || p.slug}
              href={p.url || `/admission/${p.slug}`}
              title={p.title}
              sub={p.organization || p.org}
            />
          ))}
          {jobs.slice(0, 2).map((p) => (
            <ItemLink
              key={p._id || p.slug}
              href={`/job/${p.slug}`}
              title={p.title}
              sub={p.company}
            />
          ))}
        </ul>
      </WidgetBlock>

      <WidgetBlock title="Useful Tools">
        <div className="ad-tools-list">
          {TOOLS.map((t) => (
            <span key={t} className="ad-tool-chip">
              {t} <span className="ad-tool-soon">Coming Soon</span>
            </span>
          ))}
        </div>
      </WidgetBlock>
    </aside>
  );
}