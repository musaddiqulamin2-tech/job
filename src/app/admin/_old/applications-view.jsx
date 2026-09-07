"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/applications", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Applications load nahi hui"
        );
      }

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Admin Error:", error);
      setError("Applications load nahi hui.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage all job applications</p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchApplications}
            disabled={loading}
          >
            🔄 {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Total */}
        {!loading && !error && (
          <div className="admin-count">
            Total Applications:{" "}
            <strong>{applications.length}</strong>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="admin-message">
            Loading applications...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="admin-message">
              No applications found.
            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="applications-list">

              {applications.map((application) => (
                <div
                  className="application-card"
                  key={application._id}
                >

                  {/* Photo */}
                  <div className="applicant-photo">

                    {application.photoUrl ? (
                      <img
                        src={application.photoUrl}
                        alt={application.fullName}
                      />
                    ) : (
                      <div className="no-photo">
                        👤
                        <span>No Photo</span>
                      </div>
                    )}

                  </div>

                  {/* Details */}
                  <div className="application-details">

                    <div className="application-top">
                      <div>

                        <h2>
                          {application.fullName}
                        </h2>

                        <span className="job-badge">
                          💼 {application.jobTitle}
                        </span>

                      </div>
                    </div>

                    {/* Info */}
                    <div className="application-info">

                      <p>
                        <strong>📧 Email</strong>
                        <span>
                          {application.email}
                        </span>
                      </p>

                      <p>
                        <strong>📱 Phone</strong>
                        <span>
                          {application.phone}
                        </span>
                      </p>

                      <p>
                        <strong>📅 Applied</strong>
                        <span>
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </span>
                      </p>

                    </div>

                    {/* Cover Message */}
                    <div className="cover-message">

                      <strong>
                        📝 Cover Message
                      </strong>

                      <p>
                        {application.coverMessage}
                      </p>

                    </div>

                    {/* Buttons */}
                    <div className="application-actions">

                      {/* Photo */}
                      {application.photoUrl && (
                        <a
                          href={application.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="photo-btn"
                        >
                          🖼️ View Photo
                        </a>
                      )}

                      {/* Resume */}
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-btn"
                        >
                          📄 View Resume
                        </a>
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

      </div>
    </main>
  );
}