import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmissionPost } from "../../../lib/categoryData";

const TYPE_ICON = "M3 6h18m-9 0v12m-6.5 0h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 18.5 6h-13A1.5 1.5 0 0 0 4 7.5v9A1.5 1.5 0 0 0 5.5 18z";
const ORG_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H3m16 0h2M7 21h10M9 7h1m1 0h1m-2 4h1m1 0h1m-2 4h1m1 0h1m-4-8H7";
const STATUS_ICON = "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const DATE_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3";
const CATEGORY_ICON = "M4 6h16M4 10h16M4 14h16M4 18h16";
const SITE_ICON = "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9";
const CALENDAR_ICON = "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getAdmissionPost(slug);
  if (!post) {
    return { title: "Admission Details | JobCareer" };
  }
  return {
    title: `${post.title} | JobCareer`,
    description: `Know the ${post.category} ${post.title} by ${post.org}, important dates, eligibility, application process and official website.`,
    alternates: {
      canonical: `https://jobcareer.in/admission/${post.slug}`,
    },
  };
}

export function generateStaticParams() {
  return [];
}

export default async function AdmissionDetailPage({ params }) {
  const { slug } = await params;
  const post = getAdmissionPost(slug);
  if (!post) {
    notFound();
  }

  const details = [
    { label: "Admission Type", value: post.category, icon: TYPE_ICON },
    { label: "Organization", value: post.org, icon: ORG_ICON },
    { label: "Status", value: post.status, icon: STATUS_ICON },
    { label: "Published", value: post.date, icon: DATE_ICON },
    { label: "Category", value: "Admission", icon: CATEGORY_ICON },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/admission" className="jh-detail-back">
          ← Back to Admission
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${post.tagColor || "emerald"}`}>
            {post.category}
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
              <span className="jh-detail-salary-label">Admission</span>
              <strong>{post.category}</strong>
            </div>
            <a
              href={post.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="jh-btn jh-btn-primary jh-detail-apply"
            >
              Apply / View Official Website
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
          <h2>About the Admission</h2>
          <p>
            {post.org} has published the {post.title}. Candidates who meet the eligibility criteria published in the
            official notification can apply for admission through the official portal of {post.org}. Applicants are
            advised to read the complete notification, check the important dates, and keep the required documents ready
            before submitting the application form.
          </p>

          <h2>Important Dates</h2>
          <ul className="jh-detail-list">
            <li>Application Start: As per the official notification of {post.org}.</li>
            <li>Last Date to Apply: Mentioned in the official notification.</li>
            <li>Publication of Ranking / Merit List: After the last date of application.</li>
            <li>Document Verification and Counselling: As per the schedule of {post.org}.</li>
          </ul>

          <h2>Eligibility</h2>
          <ul className="jh-detail-list">
            <li>Candidates must be a citizen of India / Assam with valid educational certificates.</li>
            <li>Qualifying examination and minimum percentage as mentioned in the notification.</li>
            <li>Age limits follow the category and course specific rules of {post.org}.</li>
            <li>Candidates already holding a seat in the same programme should confirm the reservation rules.</li>
          </ul>

          <h2>Steps to Apply</h2>
          <ul className="jh-detail-list">
            <li>Visit the official website of {post.org} and open the admission portal.</li>
            <li>Register with a valid mobile number and email address.</li>
            <li>Fill in the online application form and upload the required documents.</li>
            <li>Pay the application fee (if applicable) and submit the form.</li>
            <li>Take a printout of the application form / confirmation page for future reference.</li>
          </ul>

          <h2>Required Documents</h2>
          <ul className="jh-detail-list">
            <li>Aadhaar card and residential proof</li>
            <li>Educational mark sheets and certificates (HSLC / HSSLC / UG as applicable)</li>
            <li>Category certificate and income certificate (if applicable)</li>
            <li>Passport-size photographs and scanned signature</li>
            <li>Valid email address and mobile number for registration</li>
          </ul>

          <h2>Important Links</h2>
          <ul className="jh-detail-list">
            <li>
              <span>Official Website: </span>
              <a href={post.officialSite} target="_blank" rel="noopener noreferrer">
                {post.org} — {post.category}
              </a>
            </li>
            <li>Latest admission circular and updates on the JobCareer Admission page</li>
          </ul>

          <div className="jh-detail-cta">
            <h3>Check the official details</h3>
            <p>Visit the official website of {post.org} for the complete notification and application form.</p>
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