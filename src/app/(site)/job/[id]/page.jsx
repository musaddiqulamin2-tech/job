import Link from "next/link";
import connectDB from "../../../lib/mongodb";
import Job from "../../../lib/models/Job";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  let job = null;
  try {
    await connectDB();
    job = await Job.findById(id);
  } catch (e) {
    job = null;
  }
  return {
    title: job ? `${job.title} at ${job.company} | JobCareer` : "Job Details | JobCareer",
  };
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;

  let job;
  try {
    await connectDB();
    job = await Job.findById(id);
  } catch (e) {
    job = null;
  }

  if (!job) {
    notFound();
  }

  const details = [
    { label: "Job Type", value: job.type, icon: "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" },
    { label: "Experience", value: job.experience || "Not specified", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Category", value: job.category, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" },
    { label: "Location", value: job.location, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        {/* Back link */}
        <Link href="/#jobs" className="jh-detail-back">
          ← Back to Jobs
        </Link>

        {/* Header card */}
        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${job.tagColor || "teal"}`}>
            {job.category}
          </div>

          <h1 className="jh-detail-title">{job.title}</h1>
          <p className="jh-detail-company">{job.company}</p>

          <div className="jh-detail-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              {job.type}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {job.posted || "Recently"}
            </span>
          </div>

          <div className="jh-detail-row">
            <div className="jh-detail-salary">
              <span className="jh-detail-salary-label">Salary</span>
              <strong>{job.salary || "Competitive"}</strong>
            </div>
            <Link
              href={`/apply?job=${encodeURIComponent(job.title)}`}
              className="jh-btn jh-btn-primary jh-detail-apply"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Overview grid */}
        <div className="jh-detail-overview">
          {details.map((d) => (
            <div className="jh-detail-info-card" key={d.label}>
              <span className="jh-detail-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d.icon}/></svg>
              </span>
              <span className="jh-detail-info-label">{d.label}</span>
              <span className="jh-detail-info-value">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="jh-detail-body">
          <h2>Job Description</h2>
          <p>{job.description}</p>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <>
              <h2>Responsibilities</h2>
              <ul className="jh-detail-list">
                {job.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <>
              <h2>Requirements</h2>
              <ul className="jh-detail-list">
                {job.requirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <div className="jh-detail-cta">
            <h3>Interested in this role?</h3>
            <p>Don&apos;t miss out — apply today and take the next step in your career.</p>
            <Link
              href={`/apply?job=${encodeURIComponent(job.title)}`}
              className="jh-btn jh-btn-primary"
            >
              Apply for this Job
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
