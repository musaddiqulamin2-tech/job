import Link from "next/link";
import { notFound } from "next/navigation";
import { getSampleScholarship } from "../../../lib/categoryData";

const TYPE_ICON = "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2";
const ORG_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H3m16 0h2M7 21h10M9 7h1m1 0h1m-2 4h1m1 0h1m-2 4h1m1 0h1m-4-8H7";
const ELIG_ICON = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
const MODE_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3";
const STATUS_ICON = "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const CATEGORY_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16";
const SITE_ICON = "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getSampleScholarship(slug);
  if (!post) {
    return { title: "Scholarship Details | JobCareer" };
  }
  return {
    title: `${post.title} | JobCareer`,
    description: `Apply online for ${post.title} (${post.schemeType}) by ${post.org}. Check eligibility, last date, benefits and how to apply on JobCareer.`,
  };
}

export default async function ScholarshipDetailPage({ params }) {
  const { slug } = await params;
  const post = getSampleScholarship(slug);
  if (!post) {
    notFound();
  }

  const details = [
    { label: "Scholarship Type", value: post.schemeType, icon: TYPE_ICON },
    { label: "Organization", value: post.org, icon: ORG_ICON },
    { label: "Eligibility", value: post.eligibility || "As per norms", icon: ELIG_ICON },
    { label: "Apply Mode", value: post.applyMode || "—", icon: MODE_ICON },
    { label: "Status", value: post.status, icon: STATUS_ICON },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/scholarship" className="jh-detail-back">
          ← Back to Scholarships
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${post.tagColor || "indigo"}`}>
            {post.schemeType}
          </div>

          <h1 className="jh-detail-title">{post.title}</h1>
          <p className="jh-detail-company">{post.org}</p>

          <div className="jh-detail-meta">
            {post.lastDate && (
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={MODE_ICON} /></svg>
                Last Date: {post.lastDate}
              </span>
            )}
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={STATUS_ICON} /></svg>
              {post.status}
            </span>
          </div>

          <div className="jh-detail-row">
            <div className="jh-detail-salary">
              <span className="jh-detail-salary-label">{post.lastDate ? "Last Date" : "Status"}</span>
              <strong>{post.lastDate || post.status}</strong>
            </div>
            <a
              href={post.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="jh-btn jh-btn-primary jh-detail-apply"
            >
              Apply Online
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
          <h2>About the Scholarship</h2>
          <p>
            {post.org} offers the {post.title} for eligible students. This {post.schemeType.toLowerCase()} provides
            financial support to help students continue their academic journey. Applicants are advised to read the full
            official notification and confirm their eligibility before applying.
          </p>

          <h2>Eligibility Criteria</h2>
          <ul className="jh-detail-list">
            <li>{post.eligibility || "As per the official notification of the scheme."}</li>
            <li>Applicant must be enrolled in the required course / class as specified.</li>
            <li>Family income and category conditions apply as per the official notification.</li>
            <li>A valid and active bank account is required for the benefit transfer.</li>
          </ul>

          <h2>Scholarship Amount & Benefits</h2>
          <ul className="jh-detail-list">
            <li>Financial assistance amount as per the official scheme guidelines.</li>
            <li>Direct benefit transfer to the applicant&apos;s bank account after approval.</li>
            <li>Renewable benefit subject to continuing eligibility and progress.</li>
          </ul>

          <h2>Required Documents</h2>
          <ul className="jh-detail-list">
            <li>Aadhaar card and residential proof</li>
            <li>Bank account details (passbook) with IFSC code</li>
            <li>Income certificate and category certificate (if applicable)</li>
            <li>Latest mark sheet / admission proof of the current academic year</li>
            <li>Recent passport-size photograph and valid mobile number</li>
          </ul>

          <h2>Important Dates</h2>
          <div className="jh-table-wrap">
            <table className="jh-kv-table">
              <tbody>
                <tr>
                  <th>Scholarship Name</th>
                  <td>{post.title}</td>
                </tr>
                <tr>
                  <th>Organization</th>
                  <td>{post.org}</td>
                </tr>
                <tr>
                  <th>Scholarship Type</th>
                  <td>{post.schemeType}</td>
                </tr>
                <tr>
                  <th>Application Start Date</th>
                  <td>{post.startDate || "As per notification"}</td>
                </tr>
                <tr>
                  <th>Application Last Date</th>
                  <td>{post.lastDate || "As per notification"}</td>
                </tr>
                <tr>
                  <th>Apply Mode</th>
                  <td>{post.applyMode || "As per notification"}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{post.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How to Apply</h2>
          <ul className="jh-detail-list">
            <li>Visit the official website of {post.org} and open the scholarship / student zone section.</li>
            <li>Register or log in with your mobile number / Aadhaar.</li>
            <li>Fill in the online application form and upload the required documents.</li>
            <li>Submit the form and note down the application / acknowledgement number.</li>
            <li>Track your application status from the scholarship portal from time to time.</li>
          </ul>

          <h2>Important Links</h2>
          <ul className="jh-detail-list">
            <li>
              <span>Official Website: </span>
              <a href={post.officialSite} target="_blank" rel="noopener noreferrer">
                {post.org} — {post.schemeType}
              </a>
            </li>
            <li>Latest scholarship notifications on the JobCareer Scholarship page</li>
          </ul>

          <div className="jh-detail-cta">
            <h3>Don&apos;t miss the deadline</h3>
            <p>
              Apply before {post.lastDate || "the last date"}. Visit the official website of {post.org} to submit your application.
            </p>
            <a href={post.officialSite} target="_blank" rel="noopener noreferrer" className="jh-btn jh-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 8, verticalAlign: "middle" }}><path d={SITE_ICON} /></svg>
              Apply Online
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}