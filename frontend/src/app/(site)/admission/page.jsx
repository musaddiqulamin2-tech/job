import Link from "next/link";
import { getAdmissionPosts, getSampleJobs, getSampleResults } from "../../lib/categoryData";
import AdmissionSidebar from "../../Components/admission/AdmissionSidebar";
import AdmissionCategoryFilter from "../../Components/admission/AdmissionCategoryFilter";

export const metadata = {
  title: "Latest Admission Posts | JobCareer",
  description:
    "Check the latest admission updates for India — college, university, nursing, ANM, GNM, D.El.Ed and ITI admissions with application dates, eligibility and exam details.",
  alternates: { canonical: "https://jobcareer.in/admission/" },
  openGraph: {
    title: "Latest Admission Posts | JobCareer",
    description:
      "Latest admission updates for college, university, nursing and professional courses across India.",
    url: "https://jobcareer.in/admission/",
    type: "website",
    siteName: "JobCareer",
  },
};

export const dynamic = "force-dynamic";

export default async function AdmissionLandingPage() {
  const posts = getAdmissionPosts();
  const jobs = getSampleJobs();
  const results = getSampleResults();

  return (
    <main className="jh-detail-page ad-detail-page">
      <div className="jh-container">
        <nav className="ad-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="ad-breadcrumb-sep">/</span>
          <span className="ad-breadcrumb-current" aria-current="page">
            Admission
          </span>
        </nav>

        <section className="ad-land-hero">
          <span className="ad-badge ad-badge-indigo">Admission</span>
          <h1 className="ad-title">Latest Admission Updates 2026</h1>
          <p className="ad-land-intro">
            Find the latest college, university, nursing, ANM, GNM, D.El.Ed and
            ITI admission notifications. Filter admissions by category to see
            application dates, eligibility, exam pattern and how to apply for
            the course you are looking for.
          </p>
        </section>

        <div className="ad-detail-grid">
          <div className="ad-article">
            <AdmissionCategoryFilter posts={posts} />
          </div>

          <AdmissionSidebar
            admissions={posts}
            jobs={jobs}
            results={results}
          />
        </div>
      </div>
    </main>
  );
}