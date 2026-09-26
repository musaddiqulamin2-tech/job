import Link from "next/link";
import Pagination from "../../../Components/Pagination";
import { formatDate } from "../../../lib/categoryData";

export const ADMIT_CARD_PAGE_DESCRIPTION =
  "Download the latest admit cards for government and competitive exams. Get direct links, release dates, and step-by-step instructions to access your hall tickets easily.";

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
      <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
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

function DownloadArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 11V1" />
      <path d="M3.5 5.5 8 10l4.5-4.5" />
      <path d="M2 14h12" />
    </svg>
  );
}

function AdmitCard({ post, index }) {
  const t = AC_THEMES[index % AC_THEMES.length];
  const href = `/admit-card/${post.slug}`;
  const displayDate = post.date || formatDate(post.createdAt);

  return (
    <div className="ac-card" key={post._id}>
      <Link
        href={href}
        className="ac-card-thumb"
        tabIndex={-1}
        aria-hidden="true"
        style={{ background: t.bg }}
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

        <div className="sc-meta">
          <BuildingIcon />
          <span>{post.org}</span>
        </div>

        <div className="sc-meta">
          <CalendarIcon />
          <span>{displayDate}</span>
        </div>

        <span className="sc-status">{post.status || "Admit Card Released"}</span>

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
          {displayDate}
        </span>
      </div>
    </div>
  );
}

function AdmitCardHeader() {
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
          Admit Card
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
        <p style={{ margin: 0, fontSize: "14px", color: "#52525b", lineHeight: 1.75 }}>{ADMIT_CARD_PAGE_DESCRIPTION}</p>
      </div>
    </div>
  );
}

export default function AdmitCardCategory({ posts, current, total }) {
  return (
    <div className="ja-cat-page site grid-container container hfeed" id="page">
      <div className="site-content" id="content">
        <div className="content-area" id="primary">
          <main className="site-main" id="main">
            <div className="gb-element-bf2aea27" style={{ rowGap: "1rem", paddingBottom: "1.5rem" }}>
              <AdmitCardHeader />

              {posts.length > 0 ? (
                <>
                  <div className="ac-grid">
                    {posts.map((post, idx) => (
                      <AdmitCard key={post._id} post={post} index={idx} />
                    ))}
                  </div>
                  <Pagination currentPage={current} totalPages={total} basePath="/category/admit-card" />
                </>
              ) : (
                <div className="ja-empty">
                  <p>Unable to load admit cards right now. Please try again.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}