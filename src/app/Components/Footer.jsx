export default function Footer() {
  return (
    <footer className="jh-footer">
      <div className="jh-container">
        <div className="jh-footer-grid">
          <div className="jh-footer-brand">
            <div className="jh-logo">
              <span className="jh-logo-badge">JC</span>
              <span className="jh-logo-text jh-logo-white">
                Job<span>Career</span>
              </span>
            </div>
            <p>
              Connecting talent with opportunity. Your dream job is just one
              click away.
            </p>
            <div className="jh-footer-social">
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3>For Job Seekers</h3>
            <a href="#jobs">Browse Jobs</a>
            <a href="#jobs">Apply for Jobs</a>
            <a href="#about">Career Advice</a>
            <a href="#">Resume Builder</a>
          </div>

          <div>
            <h3>For Employers</h3>
            <a href="#">Post a Job</a>
            <a href="#">Browse Candidates</a>
            <a href="#">Pricing</a>
            <a href="#">Employer Dashboard</a>
          </div>

          <div>
            <h3>Company</h3>
            <a href="#about">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="jh-footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobCareer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}