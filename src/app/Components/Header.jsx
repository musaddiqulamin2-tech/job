"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`jh-nav ${scrolled ? "jh-nav-scrolled" : ""}`}>
      <div className="jh-container jh-nav-inner">
        <a href="/" className="jh-logo">
          <span className="jh-logo-badge">JC</span>
          <span className="jh-logo-text">
            Job<span>Career</span>
          </span>
        </a>

        <nav className={`jh-nav-links ${menuOpen ? "open" : ""}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#jobs" onClick={() => setMenuOpen(false)}>Jobs</a>
          <a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="/register" className="jh-nav-register" onClick={() => setMenuOpen(false)}>
            Register
          </a>
          <a href="/admin" className="jh-nav-admin" onClick={() => setMenuOpen(false)}>
            Admin Panel
          </a>
        </nav>

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
    </header>
  );
}