import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="jh-pricing-page">
      <h1>Subscription Plans</h1>

      <div className="jh-pricing-grid">
        <div className="jh-pricing-card">
          <h2>Employer Plan</h2>
          <p className="jh-price-free">FREE</p>
          <ul>
            <li>Post Unlimited Jobs</li>
            <li>View Applicants</li>
            <li>Access Employer Dashboard</li>
            <li>Manage Job Listings</li>
          </ul>
          <button className="jh-price-btn-black" disabled>
            Already Free
          </button>
        </div>

        <div className="jh-pricing-card">
          <h2>Employee Plan</h2>
          <p className="jh-price-blue">₹10 / Job Apply</p>
          <ul>
            <li>Apply for Jobs</li>
            <li>Upload Resume</li>
            <li>Job Alerts</li>
            <li>Profile Dashboard</li>
          </ul>
          <Link href="/register" className="jh-price-btn-blue">
            Pay ₹10 &amp; Apply Job
          </Link>
        </div>
      </div>
    </main>
  );
}