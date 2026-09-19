import Link from "next/link";
import { notFound } from "next/navigation";
import { getSampleScheme } from "../../../lib/categoryData";

const TYPE_ICON = "M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2";
const ORG_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H3m16 0h2M7 21h10M9 7h1m1 0h1m-2 4h1m1 0h1m-2 4h1m1 0h1m-4-8H7";
const STATUS_ICON = "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const DATE_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3";
const CATEGORY_ICON = "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16";
const SITE_ICON = "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getSampleScheme(slug);
  if (!post) {
    return { title: "Scheme Details | JobCareer" };
  }
  return {
    title: `${post.title} | JobCareer`,
    description: `Know the ${post.schemeType} ${post.title} by ${post.org}, benefits, eligibility, documents and how to apply.`,
  };
}

export default async function SchemeDetailPage({ params }) {
  const { slug } = await params;
  const post = getSampleScheme(slug);
  if (!post) {
    notFound();
  }

  const details = [
    { label: "Scheme Type", value: post.schemeType, icon: TYPE_ICON },
    { label: "Organization", value: post.org, icon: ORG_ICON },
    { label: "Status", value: post.status, icon: STATUS_ICON },
    { label: "Published", value: post.date, icon: DATE_ICON },
    { label: "Category", value: post.category, icon: CATEGORY_ICON },
  ];

  return (
    <main className="jh-detail-page">
      <div className="jh-container">
        <Link href="/category/scheme" className="jh-detail-back">
          ← Back to Schemes
        </Link>

        <div className="jh-detail-hero">
          <div className="jh-detail-hero-orb jh-detail-orb-1" />
          <div className="jh-detail-hero-orb jh-detail-orb-2" />

          <div className={`jh-job-tag jh-tag-${post.tagColor || "emerald"}`}>
            {post.schemeType}
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
              <span className="jh-detail-salary-label">Scheme</span>
              <strong>{post.schemeType}</strong>
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
          <h2>About the Scheme</h2>
          <p>
            {post.org} operates the {post.title}. This {post.schemeType.toLowerCase()} supports eligible citizens with
            benefits aligned to the official guidelines. Interested applicants are advised to read the complete
            notification and check their eligibility before submitting the application form.
          </p>

          <h2>Benefits</h2>
          <ul className="jh-detail-list">
            <li>Direct financial assistance or scholarship amount as per the scheme guidelines of {post.org}.</li>
            <li>Simple online application process through the official portal.</li>
            <li>Transparent selection and disbursement through verified beneficiary lists.</li>
            <li>Available support and helpdesk assistance for applicants.</li>
          </ul>

          <h2>Eligibility</h2>
          <ul className="jh-detail-list">
            <li>Applicant must be a resident of India / Assam as required by the scheme.</li>
            <li>Category-specific conditions (age, income, course, and family income limit) apply as per the notification.</li>
            <li>Valid bank account linked with the applicant / guardian for benefit transfer.</li>
            <li>Applicant must not be availing a similar benefit under another government scheme.</li>
          </ul>

          <h2>Required Documents</h2>
          <ul className="jh-detail-list">
            <li>Aadhaar card and residential proof</li>
            <li>Bank account details (passbook) with IFSC code</li>
            <li>Income certificate and category certificate (if applicable)</li>
            <li>Educational certificate / mark sheet as required by the scheme</li>
            <li>Recent passport-size photograph and mobile number</li>
          </ul>

          <h2>How to Apply</h2>
          <ul className="jh-detail-list">
            <li>Visit the official website of {post.org} and open the scheme portal.</li>
            <li>Register or log in with your mobile number / Aadhaar.</li>
            <li>Fill in the online application form and upload the required documents.</li>
            <li>Submit the form and take a note of the application / reference number.</li>
            <li>Track the application status from the beneficiary or status section.</li>
          </ul>

          <h2>Important Links</h2>
          <ul className="jh-detail-list">
            <li>
              <span>Official Website: </span>
              <a href={post.officialSite} target="_blank" rel="noopener noreferrer">
                {post.org} — {post.schemeType}
              </a>
            </li>
            <li>Latest circular and notification on the JobCareer Schemes page</li>
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