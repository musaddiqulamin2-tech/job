"use client";
import { useEffect, useState } from "react";

const navItems = [
  { label: "disclaimer", href: "/disclaimer" },
  { label: "contact", href: "/contact" },
  { label: "terms", href: "/terms" },
  { label: "privacy", href: "/privacy" },
  { label: "pricing", href: "/pricing" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState("");

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

  return (
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
            <a key={item.label} href={item.href}>
              {item.label.replace("-", " ").toUpperCase()}
            </a>
          ))}
          <a href="/offer-job" className="jh-nav-post">
            Job Post
          </a>
        </nav>

        <div className="jh-nav-mobile-actions">
          <a href="/offer-job" className="jh-nav-post">
            Job Post
          </a>
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
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label.replace("-", " ").toUpperCase()}
            </a>
          ))}
          <a href="/offer-job" onClick={() => setMenuOpen(false)} className="jh-nav-post-mobile">
            + Offer Job
          </a>
          <a href="/register" onClick={() => setMenuOpen(false)}>
            Register
          </a>
          <a href="/admin" onClick={() => setMenuOpen(false)}>
            Admin Panel
          </a>
        </div>
      )}

      <div className="jh-nav-scroller">
        <p className="jh-scroller-text">
          {now} • Find your dream job today! • 100% Secure & Safe!
        </p>
      </div>
    </header>
  );
}