"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Admissions", href: "/admission" },
  { label: "Admit Cards", href: "/category/admit-card" },
  { label: "Jobs", href: "/category/job" },
  { label: "Results", href: "/category/results" },
  { label: "Schemes", href: "/category/scheme" },
  { label: "Scholarships", href: "/category/scholarship" },
  { label: "Submit Job", href: "/submit-job" },
];

const QUICK_SEARCH_TAGS = [
  "Bank Jobs",
  "Government Jobs",
  "IT Jobs",
  "Teaching Jobs",
  "Defence Jobs",
  "Police Recruitment",
  "Railway Jobs",
  "UPSC / SSC",
];

function SearchIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isActive = (href) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(href + "/")) return true;
    const leaf = href.split("/").filter(Boolean).pop();
    if (leaf && leaf !== "category" && pathname.startsWith(`/${leaf}/`)) return true;
    if (href.startsWith("/category/") && pathname.startsWith("/category/")) {
      const h = href.slice("/category/".length);
      const p = pathname.slice("/category/".length);
      if (h === p) return true;
      if (p.endsWith("s") && p.slice(0, -1) === h) return true;
      if (h.endsWith("s") && h.slice(0, -1) === p) return true;
    }
    return false;
  };
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [now, setNow] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const tick = () => {
      const d = new Date().toLocaleString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setNow(d);
    };
    tick();
    const id = setInterval(tick, 1000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  // Handle ESC key to close search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus input when search modal opens & lock scroll
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setSearchResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Live search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.jobs || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  return (
    <>
      <header className={`jh-nav ${scrolled ? "jh-nav-scrolled" : ""}`}>
        <div className="jh-container jh-nav-inner">
          <a href="/" className="jh-logo">
            <span className="jh-logo-badge">JC</span>
            <span className="jh-logo-right">
              <span className="jh-logo-text jh-logo-white">
                Job<span>Career</span>
              </span>
              <span className="jh-nav-secure">100% Secure</span>
            </span>
          </a>

          <nav className="jh-nav-links">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={isActive(item.href) ? "jh-nav-link active" : "jh-nav-link"}
              >
                {item.label}
              </a>
            ))}
            {/* Search Button after Submit Job */}
            <button
              type="button"
              className="jh-nav-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Jobs"
            >
              <SearchIcon className="jh-nav-search-icon" />
              <span>Search</span>
            </button>
            {/* Admin Login */}
            <a href="/admin/login" className="jh-nav-admin-btn">
              Admin Login
            </a>
          </nav>

          <div className="jh-nav-mobile-actions">
            <button
              type="button"
              className="jh-nav-search-mobile-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Jobs"
            >
              <SearchIcon />
            </button>
            <button
              className={`jh-hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="jh-nav-mobile-menu">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={isActive(item.href) ? "active" : ""}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="jh-nav-mobile-search-item"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <SearchIcon />
              <span>Search Jobs</span>
            </button>
            <a href="/register" onClick={() => setMenuOpen(false)}>
              Register
            </a>
            <a href="/admin" onClick={() => setMenuOpen(false)}>
              Admin Login
            </a>
          </div>
        )}

        <div className="jh-nav-scroller">
          <p className="jh-scroller-text">
            {now} • Find your dream job today! • 100% Secure & Safe!
          </p>
        </div>
      </header>

      {/* WhatsApp Channel strip — below navbar */}
      <div className="jh-wa-strip">
        <a
          className="jh-wa-strip-link"
          href="https://chat.whatsapp.com/CjdwvyIXjXV2Lg2CG1iUM0"
          target="_blank"
          rel="noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          <span className="jh-wa-strip-title">WhatsApp Channel</span>
          <strong className="jh-wa-strip-cta">Join Now</strong>
          <span className="jh-wa-strip-arrow">→</span>
        </a>
      </div>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div
          className="ja-search-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Search jobs modal"
        >
          <div className="ja-search-panel">
            <div className="ja-search-header">
              <div className="ja-search-input-wrap">
                <SearchIcon className="ja-search-input-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="ja-search-input"
                  placeholder="Search by job title, department, qualification, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="ja-search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="ja-search-close-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="ja-search-body">
              {searchLoading ? (
                <div className="ja-search-loading">
                  <span className="jh-spinner" /> Searching opportunities...
                </div>
              ) : searchQuery.trim() !== "" ? (
                <div className="ja-search-results">
                  <div className="ja-search-results-header">
                    <span>
                      {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                    </span>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="ja-search-results-list">
                      {searchResults.map((job) => (
                        <Link
                          key={job._id}
                          href={`/job/${job.slug || job._id}`}
                          className="ja-search-result-card"
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="ja-search-result-main">
                            <h4 className="ja-search-result-title">{job.title}</h4>
                            <div className="ja-search-result-meta">
                              {job.company && (
                                <span className="ja-search-badge ja-search-badge-company">
                                  🏢 {job.company}
                                </span>
                              )}
                              {job.category && (
                                <span className="ja-search-badge ja-search-badge-cat">
                                  🏷️ {job.category}
                                </span>
                              )}
                              {job.location && (
                                <span className="ja-search-badge ja-search-badge-loc">
                                  📍 {job.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="ja-search-result-arrow">→</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="ja-search-none">
                      <p>No jobs found matching "{searchQuery}"</p>
                      <span>Try searching by department name, qualification, or state.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ja-search-quick">
                  <h3>Popular Categories & Searches</h3>
                  <div className="ja-search-tags">
                    {QUICK_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="ja-search-tag"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}