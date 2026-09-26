export default function PrivacyPage() {
  return (
    <main className="jh-legal-page">
      <div className="jh-legal-card">
        <h1>Privacy Policy</h1>
        <p className="jh-legal-meta">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. About JobCareer</h2>
        <p>
          JobCareer is an online job portal that connects job seekers with employers. We
          respect your privacy and are committed to protecting your personal information.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li>Account details such as name, email, and mobile number.</li>
          <li>Resume, skills, and application information you provide.</li>
          <li>Usage data such as pages visited and jobs applied to.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use your information to match you with relevant jobs, process applications,
          improve our platform, and send you job alerts you have opted in to.
        </p>

        <h2>4. Data Protection &amp; Security</h2>
        <p>
          We take reasonable technical and organisational measures to keep your data safe
          from unauthorised access, alteration, or disclosure.
        </p>

        <h2>5. Sharing Your Information</h2>
        <p>
          Your profile and application details are shared with the employers you apply to.
          We do not sell your personal data to third parties.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use cookies to remember your preferences and improve your experience on the
          platform. You can manage cookies from your browser settings.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          You may access, correct, or delete your personal data at any time by contacting
          us or updating your profile settings.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          For any questions, concerns, or support regarding this Privacy Policy, contact us
          at <a href="mailto:support@jobcareer.in">support@jobcareer.in</a>.
        </p>
      </div>
    </main>
  );
}