"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  { name: "Technology", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📢" },
  { name: "Finance", icon: "📊" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Education", icon: "📚" },
  { name: "Sales", icon: "💼" },
  { name: "Remote Jobs", icon: "🌍" },
];

const marqueeItems = [
  "Technology", "Design", "Marketing", "Finance", "Healthcare",
  "Education", "Sales", "Remote Jobs", "Engineering", "Data Science",
  "Product", "Operations", "HR", "Legal", "Content",
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer @ TechCorp",
    text: "JobCareer made my job search effortless. Within a week of applying, I received three interview calls and landed my dream role!",
    initials: "RS",
    color: "teal",
  },
  {
    name: "Priya Patel",
    role: "Product Manager @ Innovate",
    text: "The quick apply feature is a game changer. I updated my profile once and applied to multiple jobs in minutes.",
    initials: "PP",
    color: "indigo",
  },
  {
    name: "Amit Verma",
    role: "Data Analyst @ DataCorp",
    text: "Verified listings meant I never had to worry about scams. Transparent, fast, and really effective platform.",
    initials: "AV",
    color: "amber",
  },
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  function handleSearch() {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();
    const result = jobs.filter((job) => {
      const matchSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.category.toLowerCase().includes(searchText);
      const matchLocation =
        !locationText || job.location.toLowerCase().includes(locationText);
      return matchSearch && matchLocation;
    });
    setFilteredJobs(result);
    setTimeout(() => {
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function resetSearch() {
    setSearch("");
    setLocation("");
    setFilteredJobs(jobs);
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="jh-hero">
        <div className="jh-hero-orb jh-orb-1" />
        <div className="jh-hero-orb jh-orb-2" />
        <div className="jh-hero-orb jh-orb-3" />

        <div className="jh-hero-inner">
          <span className="jh-hero-badge">
            <span className="jh-badge-dot" /> {jobs.length || 2400}+ Open Positions
          </span>

          <h1 className="jh-hero-title">
            Find Your <span className="jh-gradient-text">Dream Job</span> Today
          </h1>

          <p className="jh-hero-sub">
            Connect with thousands of companies and discover opportunities
            that match your skills and ambition.
          </p>

          <div className="jh-search-box">
            <div className="jh-search-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="jh-search-divider" />
            <div className="jh-search-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="jh-search-btn" onClick={handleSearch}>
              Search Jobs
            </button>
          </div>

          <div className="jh-hero-tags">
            <span>Popular:</span>
            <button onClick={() => { setSearch("Developer"); handleSearch(); }}>Developer</button>
            <button onClick={() => { setSearch("Designer"); handleSearch(); }}>Designer</button>
            <button onClick={() => { setSearch("Remote"); handleSearch(); }}>Remote</button>
          </div>
        </div>
      </section>

      {/* Scrolling Marquee */}
      <div className="jh-marquee-section">
        <div className="jh-marquee-track">
          <div className="jh-marquee-content">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="jh-marquee-item">
                <span className="jh-marquee-dot" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="jh-stats-section">
        <div className="jh-container">
          <div className="jh-stats-grid">
            <div className="jh-stat">
              <p className="jh-stat-value">{jobs.length || 2400}+</p>
              <p className="jh-stat-label">Active Jobs</p>
            </div>
            <div className="jh-stat">
              <p className="jh-stat-value">850+</p>
              <p className="jh-stat-label">Companies</p>
            </div>
            <div className="jh-stat">
              <p className="jh-stat-value">15K+</p>
              <p className="jh-stat-label">Job Seekers</p>
            </div>
            <div className="jh-stat">
              <p className="jh-stat-value">95%</p>
              <p className="jh-stat-label">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="jh-jobs-section">
        <div className="jh-container">
          <div className="jh-section-header">
            <h2>
              Latest <span className="jh-gradient-text">Opportunities</span>
            </h2>
            <p>Browse through our curated list of top jobs</p>
          </div>

          {loading ? (
            <div className="jh-loading">
              <div className="jh-spinner" />
              <p>Loading latest jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="jh-jobs-grid">
              {filteredJobs.map((job) => (
                <Link href={`/job/${job._id}`} className="jh-job-card" key={job._id}>
                  <div className="jh-job-top">
                    <div className={`jh-job-tag jh-tag-${job.tagColor || "teal"}`}>
                      {job.category}
                    </div>
                    <span className="jh-job-posted">{job.posted}</span>
                  </div>

                  <h3 className="jh-job-title">{job.title}</h3>
                  <p className="jh-job-company">{job.company}</p>

                  <div className="jh-job-meta">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {job.location}
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                      {job.type}
                    </span>
                  </div>

                  <div className="jh-job-bottom">
                    <span className="jh-job-salary">{job.salary}</span>
                    <span className="jh-job-apply">
                      Apply Now →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="jh-empty">
              <h3>No jobs found</h3>
              <p>Try a different search or location.</p>
              <button onClick={resetSearch}>
                Show All Jobs
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="about" className="jh-categories-section">
        <div className="jh-container">
          <div className="jh-section-header">
            <h2>
              Browse by <span className="jh-gradient-text">Category</span>
            </h2>
            <p>Explore jobs in your field of expertise</p>
          </div>

          <div className="jh-categories-grid">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="jh-category-card"
                onClick={() => { setSearch(cat.name === "Remote Jobs" ? "Remote" : cat.name); handleSearch(); }}
              >
                <span className="jh-cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>View jobs →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="jh-testimonials-section">
        <div className="jh-container">
          <div className="jh-section-header">
            <h2>
              What Our <span className="jh-gradient-text">Users Say</span>
            </h2>
            <p>Success stories from people who found their dream job</p>
          </div>

          <div className="jh-testimonials-grid">
            {testimonials.map((t) => (
              <div className="jh-testimonial-card" key={t.name}>
                <div className={`jh-tm-avatar jh-av-${t.color}`}>{t.initials}</div>
                <p className="jh-tm-text">“{t.text}”</p>
                <div className="jh-tm-footer">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="jh-why-section">
        <div className="jh-container">
          <div className="jh-section-header">
            <h2>
              Why Choose <span className="jh-gradient-text">JobCareer</span>?
            </h2>
            <p>We make your job search simple, fast, and effective</p>
          </div>

          <div className="jh-features-grid">
            <div className="jh-feature-card">
              <div className="jh-feature-icon jh-fi-teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3>Smart Job Search</h3>
              <p>AI-powered matching to find jobs that fit your skills and preferences perfectly.</p>
            </div>

            <div className="jh-feature-card">
              <div className="jh-feature-icon jh-fi-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Top Companies</h3>
              <p>Access opportunities from leading companies across India and globally.</p>
            </div>

            <div className="jh-feature-card">
              <div className="jh-feature-icon jh-fi-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h3>Quick Apply</h3>
              <p>One-click applications with your saved profile and resume.</p>
            </div>

            <div className="jh-feature-card">
              <div className="jh-feature-icon jh-fi-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Verified Listings</h3>
              <p>Every job is verified by our team to ensure authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="jh-cta-section">
        <div className="jh-cta-orb jh-orb-cta-1" />
        <div className="jh-cta-orb jh-orb-cta-2" />
        <div className="jh-container jh-cta-inner">
          <h2>Ready to Start Your Career Journey?</h2>
          <p>
            Join thousands of job seekers who found their dream job through
            JobCareer. Your next opportunity is just a click away.
          </p>
          <div className="jh-cta-btns">
            <Link href="#jobs" className="jh-btn jh-btn-primary">Browse Jobs</Link>
            <Link href="#about" className="jh-btn jh-btn-outline">Learn More</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
