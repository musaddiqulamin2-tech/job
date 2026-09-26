import Link from "next/link";
import Pagination from "../../../Components/Pagination";
import { formatDate } from "../../../lib/categoryData";

export const RESULTS_PAGE_DESCRIPTION =
  "Stay updated with the latest examination results, merit lists, scorecards, and recruitment results. Find result dates, official links, and important result information in one place.";

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

function ResultCard({ post, index }) {
  const t = RESULT_THEMES[index % RESULT_THEMES.length];
  const href = `/result/${post.slug || post._id}`;

  return (
    <div className="ac-card rs-card" key={post._id}>
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
          {post.org || post.company || "JobCareer"}
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
}

function ResultsHeader() {
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
          Results
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
        <p style={{ margin: 0, fontSize: "14px", color: "#52525b", lineHeight: 1.75 }}>{RESULTS_PAGE_DESCRIPTION}</p>
      </div>
    </div>
  );
}

export default function ResultsCategory({ posts, current, total }) {
  return (
    <div className="ja-cat-page site grid-container container hfeed" id="page">
      <div className="site-content" id="content">
        <div className="content-area" id="primary">
          <main className="site-main" id="main">
            <div className="gb-element-bf2aea27" style={{ rowGap: "1rem", paddingBottom: "1.5rem" }}>
              <ResultsHeader />

              {posts.length > 0 ? (
                <>
                  <div className="ac-grid">
                    {posts.map((post, idx) => (
                      <ResultCard key={post._id} post={post} index={idx} />
                    ))}
                  </div>
                  <Pagination currentPage={current} totalPages={total} basePath="/category/results" label="Results Pagination" />
                </>
              ) : (
                <div className="ja-empty">
                  <p>Unable to load results right now. Please try again.</p>
                </div>
              )}

              <div className="ai-archive">JobCareer – Results</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}