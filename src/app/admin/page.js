import connectDB from "../lib/mongodb";
import mongoose from "mongoose";
import Job from "../lib/models/Job";
import AdminBarChart from "./components/AdminBarChart";

export const dynamic = "force-dynamic";

const applicationSchema = new mongoose.Schema(
  {
    jobTitle: String,
    fullName: String,
    email: String,
    phone: String,
    coverMessage: String,
    resumeUrl: String,
    photoUrl: String,
    createdAt: Date,
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
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

export default async function AdminDashboard() {
  const now = new Date();

  let totalApplications = 0;
  let weeklyCount = 0;
  let recentApplications = [];
  let perDay = [];
  let perJob = [];
  let openJobs = [];
  let jobCategories = 0;

  try {
    await connectDB();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const [total, weekly] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ createdAt: { $gte: weekStart } }),
    ]);

    totalApplications = total;
    weeklyCount = weekly;

    openJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    jobCategories = await Job.distinct("category");

    recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      days.push({ day: d, next });
    }

    const dailyCounts = await Application.aggregate([
      { $match: { createdAt: { $gte: days[0].day } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    perDay = days.map(({ day, next }) => {
      const match = dailyCounts.find(
        (c) =>
          c._id.year === day.getFullYear() &&
          c._id.month === day.getMonth() + 1 &&
          c._id.day === day.getDate()
      );
      return { label: formatDate(day), value: match ? match.count : 0 };
    });

    const jobCounts = await Application.aggregate([
      { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const jobTotals = jobCounts.reduce((sum, j) => sum + j.count, 0);
    perJob = jobCounts.map((j) => ({
      title: j._id,
      count: j.count,
      percent: jobTotals ? Math.round((j.count / jobTotals) * 100) : 0,
    }));
  } catch (error) {
    console.error("Dashboard data error:", error);
  }

  const colors = ["#2563eb", "#16a34a", "#f59e0b", "#db2777", "#7c3aed"];

  return (
    <div className="admin-page">
      {/* Welcome banner */}
      <div className="admin-welcome">
        <div className="admin-welcome-text">
          <h1>Dashboard</h1>
          <p>
            Welcome back, Admin! Here's your overview for{" "}
            {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <a href="/admin/jobs" className="admin-welcome-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post New Job
        </a>
      </div>

      {/* Colorful gradient stat cards */}
      <div className="admin-stats">
        <div className="admin-stat-card grad-blue">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="admin-stat-badge">↑ {weeklyCount} this week</span>
          </div>
          <p className="admin-stat-value">{totalApplications}</p>
          <p className="admin-stat-label">Total Applications</p>
        </div>

        <div className="admin-stat-card grad-green">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>
            <span className="admin-stat-badge">Active</span>
          </div>
          <p className="admin-stat-value">{openJobs.filter((j) => j.active !== false).length || 0}</p>
          <p className="admin-stat-label">Open Positions</p>
        </div>

        <div className="admin-stat-card grad-orange">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span className="admin-stat-badge">Last 7 days</span>
          </div>
          <p className="admin-stat-value">{weeklyCount}</p>
          <p className="admin-stat-label">New This Week</p>
        </div>

        <div className="admin-stat-card grad-purple">
          <div className="admin-stat-top">
            <span className="admin-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            </span>
            <span className="admin-stat-badge">{jobCategories.length} Types</span>
          </div>
          <p className="admin-stat-value">{jobCategories.length}</p>
          <p className="admin-stat-label">Job Categories</p>
        </div>
      </div>

      {/* Chart + Distribution */}
      <div className="admin-dash-row">
        <div className="admin-card admin-chart-card">
          <div className="admin-card-header">
            <div>
              <h2>Applications Overview</h2>
              <p className="admin-card-sub">Applications received — last 7 days</p>
            </div>
            <span className="admin-chip">
              <span className="chip-dot" />
              Live
            </span>
          </div>

          {totalApplications === 0 ? (
            <div className="no-jobs">
              <h3>No data yet</h3>
              <p>The chart will populate once candidates apply.</p>
            </div>
          ) : (
            <AdminBarChart data={perDay} />
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>By Position</h2>
              <p className="admin-card-sub">Top 5 most applied roles</p>
            </div>
          </div>

          {perJob.length === 0 ? (
            <div className="no-jobs">
              <h3>No applications yet</h3>
            </div>
          ) : (
            <div className="admin-progress-list">
              {perJob.map((job, i) => (
                <div className="admin-progress-item" key={i}>
                  <div className="admin-progress-top">
                    <span className="admin-progress-title">
                      <i style={{ background: colors[i % colors.length] }} />
                      {titleCase(job.title)}
                    </span>
                    <span className="admin-progress-value">
                      {job.count} <small>({job.percent}%)</small>
                    </span>
                  </div>
                  <div className="admin-progress-track">
                    <div
                      className="admin-progress-bar"
                      style={{
                        width: `${job.percent}%`,
                        background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lists */}
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Recent Applications</h2>
              <p className="admin-card-sub">Latest candidates to apply</p>
            </div>
            <a href="/admin/applications" className="admin-link">
              View All →
            </a>
          </div>

          {recentApplications.length === 0 ? (
            <div className="no-jobs">
              <h3>No applications yet</h3>
            </div>
          ) : (
            <div className="admin-app-list">
              {recentApplications.map((app, idx) => (
                <div className="admin-app-row" key={String(app._id)}>
                  <div
                    className="admin-app-avatar"
                    style={{ background: colors[idx % colors.length] + "1a", color: colors[idx % colors.length] }}
                  >
                    {app.photoUrl ? (
                      <img src={app.photoUrl} alt={app.fullName} />
                    ) : (
                      titleCase(app.fullName)?.charAt(0) || "?"
                    )}
                  </div>
                  <div className="admin-app-main">
                    <strong>{titleCase(app.fullName)}</strong>
                    <span>{app.jobTitle}</span>
                  </div>
                  <div className="admin-app-right">
                    <span className="admin-app-date">
                      {formatDate(app.createdAt)}
                    </span>
                    <span className="admin-badge admin-badge-blue">New</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Available Jobs</h2>
              <p className="admin-card-sub">Currently hiring roles</p>
            </div>
            <a href="/admin/jobs" className="admin-link">
              Manage →
            </a>
          </div>

          <div className="admin-position-list">
            {openJobs.length > 0 ? (
              openJobs.map((job, i) => (
                <div className="admin-position-row" key={String(job._id)}>
                  <div className="admin-position-icon" style={{ background: colors[i % colors.length] + "1a", color: colors[i % colors.length] }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <div className="admin-position-main">
                    <strong>{job.title}</strong>
                    <span>{job.company}</span>
                  </div>
                  <div className="admin-app-right">
                    <span className="admin-app-date">{job.location}</span>
                    <span className={`admin-badge ${job.active === false ? "admin-badge-red" : "admin-badge-green"}`}>
                      {job.active === false ? "Inactive" : "Open"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <h3>No jobs posted yet</h3>
                <a href="/admin/jobs" className="admin-link">Post your first job →</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}