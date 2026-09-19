import Link from "next/link";
import connectDB from "../../../lib/mongodb";
import Job from "../../../lib/models/Job";
import { notFound } from "next/navigation";
import { getSampleJob } from "../../../lib/categoryData";

const JOB_TYPE_ICON = "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2";
const CALENDAR_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3";
const CATEGORY_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16";
const LOCATION_ICON = "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z";
const PIN_ICON = "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z";
const BRIEFCASE_ICON = "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2";

function SampleJobDetail({ job }) {
  const details = [
    { label: "Job Type", value: job.jobType, icon: JOB_TYPE_ICON },
    { label: "Last Date", value: job.lastDate, icon: CALENDAR_ICON },
    { label: "Category", value: job.category, icon: CATEGORY_ICON },
    { label: "Location", value: job.location, icon: LOCATION_ICON },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/job" className="jh-detail-back">
          ← Back to Jobs
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${job.tagColor || "teal"}`}>
            {job.jobType}
          </div>

          <h1 className="jh-detail-title">{job.title}</h1>
          <p className="jh-detail-company">{job.org || job.company}</p>

          <div className="jh-detail-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={PIN_ICON} /><circle cx="12" cy="10" r="3" /></svg>
              {job.location}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d={BRIEFCASE_ICON} /></svg>
              {job.jobType}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={CALENDAR_ICON} /></svg>
              Last Date: {job.lastDate}
            </span>
          </div>

          <div className="jh-detail-row">
            <div className="jh-detail-salary">
              <span className="jh-detail-salary-label">Last Date</span>
              <strong>{job.lastDate}</strong>
            </div>
            <Link
              href={`/apply?job=${encodeURIComponent(job.title)}`}
              className="jh-btn jh-btn-primary jh-detail-apply"
            >
              Apply Now
            </Link>
          </div>
        </div>

        <div className="jh-detail-overview">
          {details.map((d) => (
            <div className="jh-detail-info-card" key={d.label}>
              <span className="jh-detail-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d.icon} /></svg>
              </span>
              <span className="jh-detail-info-label">{d.label}</span>
              <span className="jh-detail-info-value">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="jh-detail-body">
          <h2>Job Description</h2>
          <p>
            {job.org || job.company} has released a recruitment notification for {job.jobType.toLowerCase()}.
            Interested and eligible candidates can apply online before the last date. Candidates are advised to
            read the full official notification carefully and confirm their eligibility before applying.
          </p>

          <h2>How to Apply</h2>
          <ul className="jh-detail-list">
            <li>Visit the official website of {job.org || job.company} and read the full recruitment notification.</li>
            <li>Check your eligibility for the position before filling the application form.</li>
            <li>Fill in the online application form and upload the required documents and photographs.</li>
            <li>Pay the application fee (if applicable) and submit your application before {job.lastDate}.</li>
            <li>Download and print a copy of the completed application for future reference.</li>
          </ul>

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

export async function generateMetadata({ params }) {
  const { id } = await params;

  const sample = getSampleJob(id);
  if (sample) {
    return {
      title: `${sample.title} | ${sample.org || sample.company} | JobCareer`,
      description: `Latest ${sample.jobType}. ${sample.title} at ${sample.org || sample.company}. Apply online before ${sample.lastDate} on JobCareer.`,
    };
  }

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

  const sample = getSampleJob(id);
  if (sample) {
    return <SampleJobDetail job={sample} />;
  }

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
    { label: "Job Type", value: job.type, icon: JOB_TYPE_ICON },
    { label: "Experience", value: job.experience || "Not specified", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Category", value: job.category, icon: CATEGORY_ICON },
    { label: "Location", value: job.location, icon: LOCATION_ICON },
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {job.location}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              {job.type}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d.icon} /></svg>
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