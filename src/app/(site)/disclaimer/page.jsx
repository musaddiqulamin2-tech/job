export default function DisclaimerPage() {
  return (
    <main className="jh-legal-page">
      <div className="jh-legal-card">
        <h1>Disclaimer</h1>
        <p className="jh-legal-meta">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Job Listings and Employers</h2>
        <p>
          All job listings and employer information on JobCareer are provided by the
          respective employers. We do not verify or endorse any employer or promote any
          specific candidate.
        </p>

        <h2>2. No Responsibility for External Links</h2>
        <p>
          Our platform may contain links to external websites. JobCareer is not responsible
          for the content, privacy practices, or availability of those external sites.
        </p>

        <h2>3. User&rsquo;s Own Risk</h2>
        <p>
          Users are advised to exercise their own judgment while applying to jobs engaging
          with employers. JobCareer shall not be liable for any loss or damage resulting
          from the use of our services.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about this Disclaimer, please contact us at{" "}
          <a href="mailto:support@jobcareer.in">support@jobcareer.in</a>.
        </p>
      </div>
    </main>
  );
}