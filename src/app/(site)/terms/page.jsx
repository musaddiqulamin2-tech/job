export default function TermsPage() {
  return (
    <main className="jh-legal-page">
      <div className="jh-legal-card">
        <h1>Refund Policy &amp; Terms and Conditions</h1>
        <p className="jh-legal-meta">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Refund Policy</h2>
        <p>
          At <strong>JobCareer</strong>, we value customer satisfaction and strive to
          maintain transparency in our services. Refunds are processed only under the valid
          conditions mentioned below.
        </p>

        <h3>1. Subscription &amp; Services</h3>
        <p>
          Refunds are applicable only if a user faces genuine technical or service-related
          issues that prevent the proper use of paid job posting or featured listing services.
        </p>

        <h3>2. Non-Refundable Situations</h3>
        <ul>
          <li>Change of mind or voluntary cancellation of an active listing.</li>
          <li>Violation of our posting guidelines or policy terms.</li>
          <li>Applicant or employer contact already initiated.</li>
        </ul>

        <h3>3. Refund Request Timeline</h3>
        <p>
          Refund requests must be raised within 7 days of purchase. Approved refunds are
          processed within 7–10 business days to the original payment method.
        </p>

        <h3>4. Contact for Refund</h3>
        <p>
          To request a refund, email us at{" "}
          <a href="mailto:support@jobcareer.in">support@jobcareer.in</a> with your order
          details.
        </p>

        <h2>Terms and Conditions</h2>
        <h3>1. Use of Services</h3>
        <p>
          By using JobCareer, you agree to use the platform only for lawful job-related
          purposes and to provide accurate information at all times.
        </p>

        <h3>2. User Responsibilities</h3>
        <ul>
          <li>Keep your account credentials secure and confidential.</li>
          <li>Do not post fraudulent, misleading, or prohibited content.</li>
          <li>Refrain from unauthorized scraping or misuse of data.</li>
        </ul>

        <h3>3. Limitation of Liability</h3>
        <p>
          JobCareer is not liable for any loss or damage resulting from the use of our
          services or reliance on third-party listings.
        </p>

        <h3>4. Policy Updates</h3>
        <p>
          We may update these terms from time to time. Continued use of the platform after
          changes constitutes acceptance of the revised terms.
        </p>

        <h2>Company Information</h2>
        <p>
          JobCareer • support@jobcareer.in • 98765 43210. For any questions about these
          terms, please contact us through our contact page.
        </p>
      </div>
    </main>
  );
}