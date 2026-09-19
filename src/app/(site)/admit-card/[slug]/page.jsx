import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmitCardPost, formatDate } from "../../../lib/categoryData";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getAdmitCardPost(slug);
  return {
    title: post ? `${post.title} | Admit Card Download | JobCareer` : "Admit Card Details | JobCareer",
    description: post
      ? `Download the ${post.org} admit card 2026. Check hall ticket release dates and step-by-step download instructions on JobCareer.`
      : "Admit card download details for government and competitive exams on JobCareer.",
  };
}

const DOWNLOAD_STEPS = [
  "Visit the official website of the exam conducting authority.",
  'Click on the "Admit Card" or "Hall Ticket" link from the notification section.',
  "Enter your registration number / roll number and date of birth or password.",
  "Verify the details printed on the admit card carefully.",
  "Download the PDF and take multiple printouts for the exam day.",
];

export default async function AdmitCardDetailPage({ params }) {
  const { slug } = await params;
  const post = getAdmitCardPost(slug);

  if (!post) {
    notFound();
  }

  const info = [
    { label: "Conducting Body", value: post.org },
    { label: "Exam / Post", value: post.badge },
    { label: "Category", value: post.category },
    { label: "Released On", value: formatDate(post.createdAt) },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/admit-card" className="jh-detail-back">
          ← Back to Admit Cards
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${post.tagColor || "sky"}`}>
            {post.category}
          </div>

          <h1 className="jh-detail-title">{post.title}</h1>
          <p className="jh-detail-company">{post.org}</p>

          <div className="jh-detail-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              Released: {formatDate(post.createdAt)}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Admit Card Released
            </span>
          </div>

          <div className="jh-detail-row">
            <div className="jh-detail-salary">
              <span className="jh-detail-salary-label">Hall Ticket Status</span>
              <strong>Download Now</strong>
            </div>
            <a href="#download-steps" className="jh-btn jh-btn-primary jh-detail-apply">
              How to Download Admit Card
            </a>
          </div>
        </div>

        <div className="jh-detail-overview">
          {info.map((d) => (
            <div className="jh-detail-info-card" key={d.label}>
              <span className="jh-detail-info-label">{d.label}</span>
              <span className="jh-detail-info-value">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="jh-detail-body" id="download-steps">
          <h2>How to Download Admit Card</h2>
          <p>
            Follow the simple steps below to download the {post.org} admit card for{" "}
            {post.badge || post.category} 2026. Keep your registration details ready before you begin.
          </p>

          <ul className="jh-detail-list">
            {DOWNLOAD_STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <div className="jh-detail-cta">
            <h3>Need help?</h3>
            <p>
              If the admit card link is not active yet, keep checking this page. We update hall
              ticket release dates as soon as the exam authority publishes them.
            </p>
            <Link href="/category/admit-card" className="jh-btn jh-btn-primary">
              View All Admit Cards
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}