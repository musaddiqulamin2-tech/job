import Link from "next/link";
import { notFound } from "next/navigation";
import { getSampleResult } from "../../../lib/categoryData";

const TYPE_ICON = "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2";
const EXAM_ICON = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
const STATUS_ICON = "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const DATE_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3";
const CATEGORY_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16";
const SITE_ICON = "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getSampleResult(slug);
  if (!post) {
    return { title: "Result Details | JobCareer" };
  }
  return {
    title: `${post.title} | JobCareer`,
    description: `Check ${post.title}. ${post.resultType} declared by ${post.org} on ${post.date}.`,
  };
}

export default async function ResultDetailPage({ params }) {
  const { slug } = await params;
  const post = getSampleResult(slug);
  if (!post) {
    notFound();
  }

  const details = [
    { label: "Result Type", value: post.resultType, icon: TYPE_ICON },
    { label: "Exam Name", value: post.exam, icon: EXAM_ICON },
    { label: "Status", value: post.status, icon: STATUS_ICON },
    { label: "Result Date", value: post.date, icon: DATE_ICON },
    { label: "Category", value: post.category, icon: CATEGORY_ICON },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/results" className="jh-detail-back">
          ← Back to Results
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${post.tagColor || "indigo"}`}>
            {post.resultType}
          </div>

          <h1 className="jh-detail-title">{post.title}</h1>
          <p className="jh-detail-company">{post.org}</p>

          <div className="jh-detail-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={DATE_ICON} /></svg>
              {post.date}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={STATUS_ICON} /></svg>
              {post.status}
            </span>
          </div>

          <div className="jh-detail-row">
            <div className="jh-detail-salary">
              <span className="jh-detail-salary-label">Exam</span>
              <strong>{post.exam}</strong>
            </div>
            <a
              href={post.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="jh-btn jh-btn-primary jh-detail-apply"
            >
              Check Result on Official Site
            </a>
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
          <h2>Result Details</h2>
          <p>
            {post.org} has declared the {post.exam} {post.resultType.toLowerCase()}. Candidates who appeared in the
            concerned examination can check their {post.status.toLowerCase()} using their registration or roll number on
            the official website or through JobCareer. Keep your application reference number handy while checking the result.
          </p>

          <h2>How to Check Result</h2>
          <ul className="jh-detail-list">
            <li>Visit the official website of {post.org}.</li>
            <li>Open the results or candidate zone section and select {post.exam} Result 2026.</li>
            <li>Enter your registration / roll number and date of birth (or password).</li>
            <li>Click on &quot;Submit&quot; and download your result / scorecard.</li>
            <li>Print a copy of the result and keep it safe for future steps of the selection process.</li>
          </ul>

          <h2>Cut-off & Merit List</h2>
          <p>
            Along with the result, {post.org} usually releases the category-wise cut-off marks and the final merit list.
            Shortlisted candidates should bookmark the official website and watch for the next stages such as counselling,
            document verification, PET/PST, or interview, as communicated with the scorecard.
          </p>

          <div className="jh-detail-cta">
            <h3>Check your result now</h3>
            <p>Visit the official website to view the complete result and merit list.</p>
            <a href={post.officialSite} target="_blank" rel="noopener noreferrer" className="jh-btn jh-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 8, verticalAlign: "middle" }}><path d={SITE_ICON} /></svg>
              Visit Official Website
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}