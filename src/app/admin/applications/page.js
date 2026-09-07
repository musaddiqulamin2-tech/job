import connectDB from "../../lib/mongodb";
import Application from "../../lib/models/Application";

export const dynamic = "force-dynamic";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function titleCase(str) {
  return str
    ? str
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "";
}

export default async function AdminApplications() {
  let applications = [];

  try {
    await connectDB();
    applications = await Application.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Admin fetch applications error:", error);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Applications</h1>
          <p>Review candidates who applied to your jobs.</p>
        </div>
      </div>

      <div className="admin-apps-filterbar">
        <div className="admin-search admin-search-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search by name, email, or job..." />
        </div>
        <div className="admin-filter-chips">
          <button className="admin-fchip active">All</button>
          <button className="admin-fchip">New</button>
          <button className="admin-fchip">Reviewed</button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="admin-card">
          <div className="no-jobs">
            <h3>No Applications Found</h3>
            <p>Applications will appear here when candidates apply.</p>
          </div>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {applications.map((app, idx) => {
            const initials = titleCase(app.fullName)
              ?.split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            const avatarGradients = [
              "linear-gradient(135deg, #2563eb, #7c3aed)",
              "linear-gradient(135deg, #16a34a, #0d9488)",
              "linear-gradient(135deg, #f59e0b, #db2777)",
              "linear-gradient(135deg, #0ea5e9, #6366f1)",
            ];

            return (
              <div className="admin-app-card" key={String(app._id)}>
                <div className="admin-app-card-top">
                  <div
                    className="admin-app-card-avatar"
                    style={{ background: avatarGradients[idx % avatarGradients.length] }}
                  >
                    {app.photoUrl ? (
                      <img src={app.photoUrl} alt={app.fullName} />
                    ) : (
                      initials || "?"
                    )}
                  </div>

                  <div className="admin-app-card-info">
                    <strong>{titleCase(app.fullName)}</strong>
                    <span>{app.jobTitle}</span>
                    <span className="admin-app-card-date">
                      {formatDate(app.createdAt)} • {formatTime(app.createdAt)}
                    </span>
                  </div>

                  <span className="admin-badge admin-badge-blue">New</span>
                </div>

                <div className="admin-app-card-body">
                  <div className="admin-app-contact">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <a href={`mailto:${app.email}`}>{app.email}</a>
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {app.phone}
                    </span>
                  </div>

                  {app.coverMessage && (
                    <p className="admin-app-card-message">
                      “{app.coverMessage.length > 180
                        ? app.coverMessage.slice(0, 180) + "..."
                        : app.coverMessage}”
                    </p>
                  )}
                </div>

                <div className="admin-app-card-footer">
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-outline admin-btn-sm"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="admin-text-muted">No resume</span>
                  )}
                  <div className="admin-app-actions">
                    <button className="admin-action-btn admin-action-edit">Review</button>
                    <button className="admin-action-btn admin-action-delete">Reject</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}