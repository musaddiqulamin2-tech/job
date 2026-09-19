"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCategoryMeta,
  getAdmitCardPosts,
  formatDate,
} from "../../../lib/categoryData";

const AC_THEMES = [
  { bg: "#eef2ff", text: "#3730a3", accent: "#4f46e5" },
  { bg: "#eff6ff", text: "#1d4ed8", accent: "#2563eb" },
  { bg: "#1e293b", text: "#e2e8f0", accent: "#334155" },
  { bg: "#fef3c7", text: "#b45309", accent: "#d97706" },
  { bg: "#ecfdf5", text: "#047857", accent: "#059669" },
  { bg: "#faf5ff", text: "#7e22ce", accent: "#9333ea" },
  { bg: "#f0f9ff", text: "#0369a1", accent: "#0ea5e9" },
  { bg: "#f1f5f9", text: "#334155", accent: "#64748b" },
];

const JOB_TYPE_THEME = {
  "Government Job": { bg: "#eef2ff", text: "#3730a3", accent: "#4f46e5" },
  "Banking Job": { bg: "#eff6ff", text: "#1d4ed8", accent: "#2563eb" },
  "Railway Job": { bg: "#f0f9ff", text: "#0369a1", accent: "#0ea5e9" },
  "PSU Job": { bg: "#ecfdf5", text: "#047857", accent: "#059669" },
  "Private Job": { bg: "#f5f3ff", text: "#6d28d9", accent: "#7c3aed" },
  "Teaching Job": { bg: "#fef3c7", text: "#b45309", accent: "#d97706" },
};

const JOB_BADGE = {
  "Government Job": "GOVERNMENT",
  "Banking Job": "BANKING",
  "Railway Job": "RAILWAY",
  "PSU Job": "PSU",
  "Private Job": "PRIVATE",
  "Teaching Job": "TEACHING",
};

const RESULT_THEMES = [
  { bg: "#f0f9ff", text: "#0369a1", accent: "#0ea5e9" },
  { bg: "#eef2ff", text: "#3730a3", accent: "#4f46e5" },
  { bg: "#ecfdf5", text: "#047857", accent: "#059669" },
  { bg: "#eff6ff", text: "#1d4ed8", accent: "#2563eb" },
  { bg: "#faf5ff", text: "#7e22ce", accent: "#9333ea" },
  { bg: "#fef3c7", text: "#b45309", accent: "#d97706" },
  { bg: "#f5f3ff", text: "#6d28d9", accent: "#7c3aed" },
  { bg: "#f1f5f9", text: "#334155", accent: "#64748b" },
];

const RESULT_FILTERS = [
  { key: "all", label: "All" },
  { key: "government", label: "Government" },
  { key: "banking", label: "Banking" },
  { key: "entrance", label: "Entrance" },
  { key: "university", label: "University" },
  { key: "assam", label: "Assam" },
];

const SCHEME_THEMES = [
  { bg: "#ecfdf5", text: "#047857", accent: "#059669" },
  { bg: "#eef2ff", text: "#3730a3", accent: "#4f46e5" },
  { bg: "#eff6ff", text: "#1d4ed8", accent: "#2563eb" },
  { bg: "#f0f9ff", text: "#0369a1", accent: "#0ea5e9" },
  { bg: "#fef3c7", text: "#b45309", accent: "#d97706" },
  { bg: "#faf5ff", text: "#7e22ce", accent: "#9333ea" },
  { bg: "#f1f5f9", text: "#334155", accent: "#64748b" },
  { bg: "#f5f3ff", text: "#6d28d9", accent: "#7c3aed" },
];

const SCHEME_FILTERS = [
  { key: "all", label: "All" },
  { key: "student", label: "Student" },
  { key: "education", label: "Education" },
  { key: "scholarship", label: "Scholarship" },
  { key: "farmer", label: "Farmer" },
  { key: "financial", label: "Financial Assistance" },
  { key: "government", label: "Government" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
];

const SCHOLARSHIP_THEMES = [
  { bg: "#eef2ff", text: "#3730a3", accent: "#4f46e5" },
  { bg: "#ecfdf5", text: "#047857", accent: "#059669" },
  { bg: "#eff6ff", text: "#1d4ed8", accent: "#2563eb" },
  { bg: "#f0f9ff", text: "#0369a1", accent: "#0ea5e9" },
  { bg: "#fef3c7", text: "#b45309", accent: "#d97706" },
  { bg: "#faf5ff", text: "#7e22ce", accent: "#9333ea" },
  { bg: "#f1f5f9", text: "#334155", accent: "#64748b" },
  { bg: "#f5f3ff", text: "#6d28d9", accent: "#7c3aed" },
];

const SCHOLARSHIP_FILTERS = [
  { key: "all", label: "All" },
  { key: "school", label: "School" },
  { key: "college", label: "College" },
  { key: "university", label: "University" },
  { key: "central", label: "Central" },
  { key: "assam", label: "Assam" },
];

const ADMIT_PER_PAGE = 12;

function generateJobAssamThumbnailSvg(title, badge, subtitle, themeIndex = 0) {
  const themes = [
    { bg1: "#0f172a", bg2: "#1e1b4b", accent: "#dc2626", badgeBg: "#dc2626", pillColor: "#38bdf8" },
    { bg1: "#082f49", bg2: "#0c4a6e", accent: "#0284c7", badgeBg: "#0284c7", pillColor: "#7dd3fc" },
    { bg1: "#052e16", bg2: "#14532d", accent: "#16a34a", badgeBg: "#16a34a", pillColor: "#86efac" },
    { bg1: "#3b0764", bg2: "#581c87", accent: "#9333ea", badgeBg: "#9333ea", pillColor: "#d8b4fe" },
    { bg1: "#431407", bg2: "#7c2d12", accent: "#ea580c", badgeBg: "#ea580c", pillColor: "#fdba74" },
    { bg1: "#18181b", bg2: "#27272a", accent: "#dc2626", badgeBg: "#dc2626", pillColor: "#fca5a5" },
    { bg1: "#042f2e", bg2: "#134e4a", accent: "#0d9488", badgeBg: "#0d9488", pillColor: "#5eead4" },
    { bg1: "#1e1b4b", bg2: "#312e81", accent: "#4f46e5", badgeBg: "#4f46e5", pillColor: "#a5b4fc" },
  ];
  const t = themes[themeIndex % themes.length];
  const safeBadge = (badge || "ADMISSION 2026").toUpperCase();
  const safeSub = (subtitle || "GOVERNMENT NOTIFICATION").toUpperCase();
  const displayTitle = title.length > 40 ? title.slice(0, 38) + "..." : title;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
    <defs>
      <linearGradient id="jaG${themeIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${t.bg1}"/>
        <stop offset="100%" stop-color="${t.bg2}"/>
      </linearGradient>
      <pattern id="jaGrid${themeIndex}" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="640" height="360" fill="url(#jaG${themeIndex})"/>
    <rect width="640" height="360" fill="url(#jaGrid${themeIndex})"/>
    <rect x="0" y="0" width="640" height="8" fill="${t.accent}"/>

    <!-- Top Pill Badge -->
    <rect x="36" y="32" width="${Math.min(safeBadge.length * 9.5 + 24, 240)}" height="26" rx="5" fill="${t.badgeBg}"/>
    <text x="48" y="50" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11.5" font-weight="800" letter-spacing="0.8">${safeBadge}</text>

    <!-- Subtitle -->
    <text x="36" y="92" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="700" letter-spacing="0.4">${safeSub}</text>

    <!-- Big Headline Title -->
    <text x="36" y="152" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="27" font-weight="900">
      ${displayTitle}
    </text>

    <!-- Info Pill -->
    <rect x="36" y="208" width="310" height="46" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="52" y="238" fill="${t.pillColor}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="15" font-weight="800">APPLY ONLINE &amp; DETAILS</text>

    <!-- Bottom Footer Row -->
    <line x1="36" y1="310" x2="604" y2="310" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <circle cx="50" cy="334" r="8" fill="#2cb641"/>
    <path d="M46 334 L49 337 L55 331" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="66" y="338" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="13" font-weight="700">JobCareer</text>
    <text x="604" y="338" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="12" font-weight="600" text-anchor="end">100% Verified</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"></path>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"></path>
      <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
    </svg>
  );
}

function DownloadArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 11V1" />
      <path d="M3.5 5.5 8 10l4.5-4.5" />
      <path d="M2 14h12" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M6.75.75a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 0-.75-.75zM2.25 4.5a2 2 0 0 0-2 2v4.5a1 1 0 0 0 1 1h1.5v2.5a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-2.5H14a1 1 0 0 0 1-1V6.5a2 2 0 0 0-2-2zM13 5.5v3h-1.5a.5.5 0 0 0-.5.5.5.5 0 0 1-1 0 .5.5 0 0 0-.5-.5H7.5a.5.5 0 0 0-.5.5.5.5 0 0 1-1 0 .5.5 0 0 0-.5-.5H4a.5.5 0 0 0-.5.5.5.5 0 0 1-1 0 .5.5 0 0 0-.5-.5h-1V5.5z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M1.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.33.75.75.75h3.75v-5h4.5v5H14.25a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H6.5V1.75A.75.75 0 0 0 5.75 1zM4 4h1v1H4zm2 0h1v1H6zm-2 2h1v1H4zm2 0h1v1H6zm-2 2h1v1H4zm2 0h1v1H6zm-2 2h1v1H4zm2 0h1v1H6zm4-4h1v1h-1zm-2.75.75H9.5v1h-1.25zM8 10h1v1H8z" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M7.985 3.273 1.4 6.42 8 9.57l6.6-3.15v4.08h1.4V6.42L7.985 3.273M4 10h8c0 1.1-.537 2-2 2H6c-.92 0-2-.88-2-1.999" />
      <path d="M2 8.82v2.06l3.994 1.908q.372.177.791-.08l1.715-.821V13.5h1.5v-1.61l1.719.82q.428.263.786.081L16 10.88V8.82L8.5 12.265z" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M2.75 2.5h10.5a1.25 1.25 0 0 1 1.25 1.25v6.5A1.25 1.25 0 0 1 13.25 11.5H2.75a1.25 1.25 0 0 1-1.25-1.25v-6.5a1.25 1.25 0 0 1 1.25-1.25m0 1.25v6.5h10.5v-6.5zM2 13h12v1.25H2z" />
    </svg>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div>
      <div
        className="section-bar gb-element-906b3e4d"
        style={{
          backgroundColor: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.875rem",
          padding: "7px 10px",
          borderRadius: "0.25rem",
          marginBottom: 0,
          borderBottom: "none",
        }}
      >
        <h1
          className="gb-text section-title"
          style={{ margin: 0, fontSize: "14px", fontWeight: 700, lineHeight: 1, color: "#ffffff" }}
        >
          {title}
        </h1>
        <Link
          className="ja-home-btn"
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            backgroundColor: "#ffffff",
            color: "#52525b",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1,
            padding: "7px 10.5px",
            borderRadius: "0.25rem",
          }}
        >
          <span className="gb-text">Home</span>
          <span className="gb-shape">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"></path>
            </svg>
          </span>
        </Link>
      </div>

      <div
        className="gb-text gb-text-2ec81c6a"
        style={{ marginTop: "14px", border: "1px solid #e4e4e7", borderRadius: "0.25rem", padding: "7px", backgroundColor: "transparent" }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#52525b", lineHeight: 1.75 }}>{description}</p>
      </div>
    </div>
  );
}

export default function CategoryBody({ slug }) {
  const rawSlug = (slug || "").toLowerCase();
  const normalizedSlug =
    rawSlug.endsWith("s") && rawSlug !== "results" ? rawSlug.slice(0, -1) : rawSlug;
  const isAdmitCard = normalizedSlug === "admit-card";
  const isJobs = normalizedSlug === "job";
  const isResults = normalizedSlug === "results";
  const isSchemes = normalizedSlug === "scheme";
  const isScholarship = normalizedSlug === "scholarship";

  const meta = getCategoryMeta(rawSlug);
  const admitPosts = getAdmitCardPosts();

  const [posts, setPosts] = useState(isAdmitCard ? admitPosts : meta.fallbacks);
  const [loading, setLoading] = useState(isAdmitCard ? false : true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setPage(1);
    if (isAdmitCard) {
      setLoading(false);
      setPosts(admitPosts);
      return;
    }
    async function loadCategoryPosts() {
      try {
        const res = await fetch(`/api/jobs?category=${encodeURIComponent(rawSlug)}`);
        const data = await res.json();
        if (data.success && data.jobs && data.jobs.length > 0) {
          setPosts(data.jobs);
        } else {
          setPosts(meta.fallbacks);
        }
        setLoadFailed(false);
      } catch (err) {
        console.error("Error fetching category posts:", err);
        setPosts(meta.fallbacks);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryPosts();
  }, [rawSlug, isAdmitCard]);

  const filteredPosts =
    (isResults || isSchemes || isScholarship) && filter !== "all"
      ? posts.filter((p) => (p.group || "all").toLowerCase() === filter)
      : posts;

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ADMIT_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice((safePage - 1) * ADMIT_PER_PAGE, safePage * ADMIT_PER_PAGE);

  return (
    <div className="ja-cat-page site grid-container container hfeed" id="page">
      <div className="site-content" id="content">
        <div className="content-area" id="primary">
          <main className="site-main" id="main">
            <div className="gb-element-bf2aea27" style={{ rowGap: "1rem", paddingBottom: "1.5rem" }}>
              <SectionHeader title={meta.title} description={meta.description} />

              {isAdmitCard ? (
                <>
                  <div className="ac-grid">
                    {visiblePosts.map((post, idx) => {
                      const t = AC_THEMES[idx % AC_THEMES.length];
                      const href = `/admit-card/${post.slug}`;
                      return (
                        <div className="ac-card" key={post._id}>
                          <Link
                            href={href}
                            className="ac-card-thumb"
                            tabIndex={-1}
                            aria-hidden="true"
                            style={{
                              background: t.bg,
                            }}
                          >
                            <span className="ac-card-badge" style={{ backgroundColor: t.accent }}>
                              {post.badge}
                            </span>
                            <span className="ac-card-org" style={{ color: t.text }}>
                              {post.org}
                            </span>
                            <span className="ac-card-accent" style={{ backgroundColor: t.accent }} />
                          </Link>

                          <div className="ac-card-body">
                            <h2 className="ac-card-title">
                              <Link href={href}>{post.title}</Link>
                            </h2>

                            <Link href={href} className="ac-card-btn">
                              <DownloadArrowIcon />
                              <span>DOWNLOAD ADMIT CARD</span>
                            </Link>
                          </div>

                          <div className="ac-card-foot">
                            <span className="ac-card-meta">
                              <span className="ac-card-meta-icon ac-card-meta-check">
                                <CheckCircleIcon />
                              </span>
                              JobCareer
                            </span>
                            <span className="ac-card-meta">
                              <span className="ac-card-meta-icon">
                                <CalendarIcon />
                              </span>
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="ac-pagination">
                    <button
                      type="button"
                      className="ja-pag-btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Previous
                    </button>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`ja-pag-btn ${page === n ? "active" : ""}`}
                        disabled={n > totalPages}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="ja-pag-btn"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              ) : isJobs ? (
                <>
                  {loading ? (
                    <div className="jb-skeleton" aria-hidden="true">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div className="jb-sk-card" key={i}>
                          <div className="jb-sk jb-sk-head" />
                          <div className="jb-sk jb-sk-line" />
                          <div className="jb-sk jb-sk-line short" />
                          <div className="jb-sk jb-sk-btn" />
                        </div>
                      ))}
                    </div>
                  ) : posts.length > 0 ? (
                    <>
                      <div className="ac-grid">
                        {visiblePosts.map((post, idx) => {
                          const t =
                            JOB_TYPE_THEME[post.jobType] ||
                            AC_THEMES[idx % AC_THEMES.length];
                          const badge = JOB_BADGE[post.jobType] || "GOVERNMENT";
                          const href = `/job/${post.slug || post._id}`;
                          return (
                            <div className="ac-card jb-card" key={post._id || post.slug || idx}>
                              <Link
                                href={href}
                                className="ac-card-thumb"
                                tabIndex={-1}
                                aria-hidden="true"
                                style={{ background: t.bg }}
                              >
                                <span className="ac-card-badge" style={{ backgroundColor: t.accent }}>
                                  {badge}
                                </span>
                                <span className="ac-card-org" style={{ color: t.text }}>
                                  {post.org || post.company || "JobCareer"}
                                </span>
                                <span className="ac-card-accent" style={{ backgroundColor: t.accent }} />
                              </Link>

                              <div className="ac-card-body">
                                <h2 className="ac-card-title">
                                  <Link href={href}>{post.title}</Link>
                                </h2>

                                <ul className="jb-meta">
                                  <li className="jb-meta-item">
                                    <LocationIcon />
                                    <span>{post.location || "All India"}</span>
                                  </li>
                                  <li className="jb-meta-item">
                                    <BriefcaseIcon />
                                    <span>{post.jobType || "Government Job"}</span>
                                  </li>
                                  <li className="jb-meta-item jb-meta-last">
                                    <CalendarIcon />
                                    <span>Last Date: {post.lastDate || formatDate(post.createdAt)}</span>
                                  </li>
                                </ul>

                                <Link href={href} className="ac-card-btn">
                                  <span>VIEW DETAILS</span>
                                  <span className="jb-chev">→</span>
                                </Link>
                              </div>

                              <div className="ac-card-foot">
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon ac-card-meta-check">
                                    <CheckCircleIcon />
                                  </span>
                                  JobCareer
                                </span>
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon">
                                    <CalendarIcon />
                                  </span>
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="ac-pagination">
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={page === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ← Previous
                        </button>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`ja-pag-btn ${page === n ? "active" : ""}`}
                            disabled={n > totalPages}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={page === totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="ja-empty">
                      <p>No jobs found.</p>
                    </div>
                  )}
                </>
              ) : isResults ? (
                <>
                  <div className="rs-filter" role="group" aria-label="Filter results">
                    {RESULT_FILTERS.map((f) => {
                      const count =
                        f.key === "all"
                          ? posts.length
                          : posts.filter((p) => (p.group || "all").toLowerCase() === f.key).length;
                      return (
                        <button
                          key={f.key}
                          type="button"
                          className={`rs-filter-chip ${filter === f.key ? "active" : ""}`}
                          aria-pressed={filter === f.key}
                          onClick={() => {
                            setFilter(f.key);
                            setPage(1);
                          }}
                        >
                          <span>{f.label}</span>
                          <span className="rs-filter-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {loading ? (
                    <div className="jb-skeleton" aria-hidden="true">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div className="jb-sk-card" key={i}>
                          <div className="jb-sk jb-sk-head" />
                          <div className="jb-sk jb-sk-line" />
                          <div className="jb-sk jb-sk-line short" />
                          <div className="jb-sk jb-sk-btn" />
                        </div>
                      ))}
                    </div>
                  ) : visiblePosts.length > 0 ? (
                    <>
                      <div className="ac-grid">
                        {visiblePosts.map((post, idx) => {
                          const t = RESULT_THEMES[idx % RESULT_THEMES.length];
                          const href = `/result/${post.slug}`;
                          return (
                            <div className="ac-card rs-card" key={post._id || post.slug || idx}>
                              <Link
                                href={href}
                                className="ac-card-thumb"
                                tabIndex={-1}
                                aria-hidden="true"
                                style={{ background: t.bg }}
                              >
                                <span className="rs-status-badge" style={{ color: t.text }}>
                                  {post.status}
                                </span>
                                <span className="ac-card-org" style={{ color: t.text }}>
                                  {post.org}
                                </span>
                                <span className="ac-card-accent" style={{ backgroundColor: t.accent }} />
                              </Link>

                              <div className="ac-card-body">
                                <h2 className="ac-card-title">
                                  <Link href={href}>{post.title}</Link>
                                </h2>
                                <div className="rs-type">
                                  <span className="rs-type-label">RESULT</span>
                                  <span className="rs-type-name">{post.resultType}</span>
                                </div>
                                <Link href={href} className="ac-card-btn">
                                  <span>VIEW RESULT</span>
                                  <span className="jb-chev">→</span>
                                </Link>
                              </div>

                              <div className="ac-card-foot">
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon ac-card-meta-check">
                                    <CheckCircleIcon />
                                  </span>
                                  JobCareer
                                </span>
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon">
                                    <CalendarIcon />
                                  </span>
                                  {post.date || formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="ac-pagination">
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ← Previous
                        </button>
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`ja-pag-btn ${safePage === n ? "active" : ""}`}
                            disabled={n > totalPages}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </>
                  ) : loadFailed ? (
                    <div className="ja-empty">
                      <p>Unable to load results. Please try again.</p>
                    </div>
                  ) : (
                    <div className="ja-empty">
                      <p>No results found.</p>
                    </div>
                  )}
                </>
              ) : isSchemes ? (
                <>
                  <div className="rs-filter" role="group" aria-label="Filter schemes">
                    {SCHEME_FILTERS.map((f) => {
                      const count =
                        f.key === "all"
                          ? posts.length
                          : posts.filter((p) => (p.group || "all").toLowerCase() === f.key).length;
                      return (
                        <button
                          key={f.key}
                          type="button"
                          className={`rs-filter-chip ${filter === f.key ? "active" : ""}`}
                          aria-pressed={filter === f.key}
                          onClick={() => {
                            setFilter(f.key);
                            setPage(1);
                          }}
                        >
                          <span>{f.label}</span>
                          <span className="rs-filter-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {loading ? (
                    <div className="jb-skeleton" aria-hidden="true">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div className="jb-sk-card" key={i}>
                          <div className="jb-sk jb-sk-head" />
                          <div className="jb-sk jb-sk-line" />
                          <div className="jb-sk jb-sk-line short" />
                          <div className="jb-sk jb-sk-btn" />
                        </div>
                      ))}
                    </div>
                  ) : visiblePosts.length > 0 ? (
                    <>
                      <div className="ac-grid">
                        {visiblePosts.map((post, idx) => {
                          const t = SCHEME_THEMES[idx % SCHEME_THEMES.length];
                          const href = `/scheme/${post.slug}`;
                          return (
                            <div className="ac-card sc-card" key={post._id || post.slug || idx}>
                              <Link
                                href={href}
                                className="ac-card-thumb"
                                tabIndex={-1}
                                aria-hidden="true"
                                style={{ background: t.bg }}
                              >
                                <span className="sc-cat" style={{ color: t.text }}>
                                  {post.schemeType}
                                </span>
                                <span className="ac-card-org" style={{ color: t.text }}>
                                  {post.org}
                                </span>
                                <span className="ac-card-accent" style={{ backgroundColor: t.accent }} />
                              </Link>

                              <div className="ac-card-body">
                                <h2 className="ac-card-title">
                                  <Link href={href}>{post.title}</Link>
                                </h2>
                                <div className="sc-meta">
                                  <BuildingIcon />
                                  <span>{post.org}</span>
                                </div>
                                <div className="sc-meta">
                                  <CalendarIcon />
                                  <span>{post.date}</span>
                                </div>
                                <span className="sc-status">{post.status}</span>
                                <Link href={href} className="ac-card-btn">
                                  <span>VIEW DETAILS</span>
                                  <span className="jb-chev">→</span>
                                </Link>
                              </div>

                              <div className="ac-card-foot">
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon ac-card-meta-check">
                                    <CheckCircleIcon />
                                  </span>
                                  JobCareer
                                </span>
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon">
                                    <CalendarIcon />
                                  </span>
                                  {post.date}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="ac-pagination">
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ← Previous
                        </button>
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`ja-pag-btn ${safePage === n ? "active" : ""}`}
                            disabled={n > totalPages}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </>
                  ) : loadFailed ? (
                    <div className="ja-empty">
                      <p>Unable to load schemes. Please try again.</p>
                    </div>
                  ) : (
                    <div className="ja-empty">
                      <p>No schemes found.</p>
                    </div>
                  )}
                </>
              ) : isScholarship ? (
                <>
                  <div className="rs-filter" role="group" aria-label="Filter scholarships">
                    {SCHOLARSHIP_FILTERS.map((f) => {
                      const count =
                        f.key === "all"
                          ? posts.length
                          : posts.filter((p) => (p.group || "all").toLowerCase() === f.key).length;
                      return (
                        <button
                          key={f.key}
                          type="button"
                          className={`rs-filter-chip ${filter === f.key ? "active" : ""}`}
                          aria-pressed={filter === f.key}
                          onClick={() => {
                            setFilter(f.key);
                            setPage(1);
                          }}
                        >
                          <span>{f.label}</span>
                          <span className="rs-filter-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {loading ? (
                    <div className="jb-skeleton" aria-hidden="true">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div className="jb-sk-card" key={i}>
                          <div className="jb-sk jb-sk-head" />
                          <div className="jb-sk jb-sk-line" />
                          <div className="jb-sk jb-sk-line short" />
                          <div className="jb-sk jb-sk-btn" />
                        </div>
                      ))}
                    </div>
                  ) : visiblePosts.length > 0 ? (
                    <>
                      <div className="ac-grid">
                        {visiblePosts.map((post, idx) => {
                          const t = SCHOLARSHIP_THEMES[idx % SCHOLARSHIP_THEMES.length];
                          const href = `/scholarship/${post.slug}`;
                          const footDate = post.lastDate || post.startDate || formatDate(post.createdAt);
                          return (
                            <div className="ac-card sc-card" key={post._id || post.slug || idx}>
                              <Link
                                href={href}
                                className="ac-card-thumb"
                                tabIndex={-1}
                                aria-hidden="true"
                                style={{ background: t.bg }}
                              >
                                <span className="sc-cat" style={{ color: t.text }}>
                                  {post.schemeType}
                                </span>
                                <span className="ac-card-org" style={{ color: t.text }}>
                                  {post.org}
                                </span>
                                <span className="ac-card-accent" style={{ backgroundColor: t.accent }} />
                              </Link>

                              <div className="ac-card-body">
                                <h2 className="ac-card-title">
                                  <Link href={href}>{post.title}</Link>
                                </h2>
                                {post.eligibility && (
                                  <div className="sc-meta">
                                    <GraduationCapIcon />
                                    <span>{post.eligibility}</span>
                                  </div>
                                )}
                                {post.applyMode && (
                                  <div className="sc-meta">
                                    <LaptopIcon />
                                    <span>{post.applyMode}</span>
                                  </div>
                                )}
                                {post.lastDate && (
                                  <div className="sc-meta">
                                    <CalendarIcon />
                                    <span>Last Date: {post.lastDate}</span>
                                  </div>
                                )}
                                <span className="sc-status">{post.status}</span>
                                <Link href={href} className="ac-card-btn">
                                  <span>VIEW DETAILS</span>
                                  <span className="jb-chev">→</span>
                                </Link>
                              </div>

                              <div className="ac-card-foot">
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon ac-card-meta-check">
                                    <CheckCircleIcon />
                                  </span>
                                  JobCareer
                                </span>
                                <span className="ac-card-meta">
                                  <span className="ac-card-meta-icon">
                                    <CalendarIcon />
                                  </span>
                                  {footDate}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="ac-pagination">
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ← Previous
                        </button>
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`ja-pag-btn ${safePage === n ? "active" : ""}`}
                            disabled={n > totalPages}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ja-pag-btn"
                          disabled={safePage === totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </>
                  ) : loadFailed ? (
                    <div className="ja-empty">
                      <p>Unable to load scholarships. Please try again.</p>
                    </div>
                  ) : (
                    <div className="ja-empty">
                      <p>No scholarships found.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    {loading ? (
                      <div style={{ textAlign: "center", padding: "2.5rem", color: "#52525b", fontSize: "14px" }}>
                        <span className="jh-spinner" /> Loading {meta.title} updates...
                      </div>
                    ) : posts.length > 0 ? (
                      <div className="post-grid">
                        {posts.map((post, idx) => {
                          const thumbSrc =
                            post.image ||
                            generateJobAssamThumbnailSvg(
                              post.title,
                              post.badge || meta.title,
                              post.company || "JobCareer",
                              idx
                            );

                          return (
                            <Link
                              key={post._id || idx}
                              className="gb-loop-item post-grid-item"
                              href={`/job/${post._id}`}
                            >
                              <img
                                width="640"
                                height="360"
                                alt={post.title}
                                className="post-grid-image"
                                src={thumbSrc}
                                loading="lazy"
                              />

                              <div className="post-grid-detail">
                                <div className="gb-text post-grid-title">{post.title}</div>

                                <div className="post-grid-meta">
                                  <div className="post-grid-meta-item">
                                    <span className="gb-shape" style={{ color: "#2cb641" }}>
                                      <CheckCircleIcon />
                                    </span>
                                    <span className="gb-text">JobCareer</span>
                                  </div>

                                  <div className="post-grid-meta-item">
                                    <span className="gb-shape" style={{ color: "#71717a" }}>
                                      <CalendarIcon />
                                    </span>
                                    <span className="gb-text">{formatDate(post.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "2.5rem", border: "1px dashed #e4e4e7", borderRadius: "0.25rem" }}>
                        <p style={{ fontSize: "14px", color: "#52525b", margin: 0 }}>
                          No updates currently available under {meta.title}.
                        </p>
                      </div>
                    )}
                  </div>

                  {posts.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.4rem",
                        marginTop: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <button className="ja-pag-btn active" style={{ padding: "5px 12px", fontSize: "12.5px" }} disabled>
                        1
                      </button>
                      <button className="ja-pag-btn" style={{ padding: "5px 12px", fontSize: "12.5px" }}>
                        2
                      </button>
                      <button className="ja-pag-btn" style={{ padding: "5px 12px", fontSize: "12.5px" }}>
                        3
                      </button>
                      <button className="ja-pag-btn" style={{ padding: "5px 12px", fontSize: "12.5px" }}>
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}