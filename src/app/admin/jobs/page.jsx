"use client";

import { useEffect, useState } from "react";

const typeOptions = ["Full Time", "Part Time", "Remote", "Contract", "Internship"];
const categoryOptions = [
  "Technology", "Design", "Marketing", "Finance", "Healthcare",
  "Education", "Sales", "Management", "Data Science", "Engineering",
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    category: "Technology",
    experience: "",
    description: "",
    requirements: "",
    responsibilities: "",
    posted: "Just now",
    featured: false,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error("Load jobs error:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleAddJob(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        type: form.type,
        category: form.category,
        experience: form.experience,
        description: form.description,
        requirements: form.requirements
          ? form.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        responsibilities: form.responsibilities
          ? form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        posted: "Just now",
        featured: form.featured,
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add job");

      setMessage(`Job "${data.job.title}" added successfully!`);
      setShowForm(false);
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "Full Time",
        category: "Technology",
        experience: "",
        description: "",
        requirements: "",
        responsibilities: "",
        posted: "Just now",
        featured: false,
      });
      loadJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete job");

      setJobs((prev) => prev.filter((j) => j._id !== id));
      setMessage(`Job "${title}" deleted.`);
    } catch (err) {
      setError(err.message);
    }
  }

  const statusCount = {
    total: jobs.length,
    active: jobs.filter((j) => j.active !== false).length,
    featured: jobs.filter((j) => j.featured).length,
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>Add, edit, and delete job listings.</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Job"}
        </button>
      </div>

      {/* Mini stats */}
      <div className="admin-stats-small-grid">
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{statusCount.total}</span>
          <span className="admin-small-stat-label">Total Jobs</span>
        </div>
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{statusCount.active}</span>
          <span className="admin-small-stat-label">Active</span>
        </div>
        <div className="admin-small-stat">
          <span className="admin-small-stat-value">{statusCount.featured}</span>
          <span className="admin-small-stat-label">Featured</span>
        </div>
      </div>

      {message && (
        <div className="admin-alert admin-alert-success" onClick={() => setMessage("")}>
          {message}
        </div>
      )}
      {error && (
        <div className="admin-alert admin-alert-error" onClick={() => setError("")}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="admin-card admin-job-form">
          <div className="admin-card-header">
            <div>
              <h2>Add New Job</h2>
              <p className="admin-card-sub">Fill in the job details below</p>
            </div>
          </div>

          <form onSubmit={handleAddJob}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Company *</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Solutions"
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, India"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹5 - ₹8 LPA"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Job Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {typeOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {categoryOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2 - 4 Years"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role..."
                rows="3"
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Requirements (one per line)</label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  placeholder={"2+ years of React experience\nExcellent communication skills"}
                  rows="4"
                />
              </div>

              <div className="admin-form-group">
                <label>Responsibilities (one per line)</label>
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  placeholder={"Build responsive interfaces\nCollaborate with design team"}
                  rows="4"
                />
              </div>
            </div>

            <div className="admin-form-check">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <span>Mark as Featured</span>
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? "Adding..." : "Add Job"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Jobs ({jobs.length})</h2>
          <span className="admin-chip"><span className="chip-dot" /> Live from database</span>
        </div>

        {loading ? (
          <div className="no-jobs">
            <h3>Loading jobs...</h3>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No Jobs Found</h3>
            <p>Add your first job listing using the button above.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="admin-td-title">
                        <strong>{job.title}</strong>
                        {job.featured && (
                          <span className="admin-badge admin-badge-purple">Featured</span>
                        )}
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.salary || "—"}</td>
                    <td>
                      <span className="admin-badge admin-badge-slate">{job.type}</span>
                    </td>
                    <td>{job.category}</td>
                    <td>
                      <span className={`admin-badge ${job.active === false ? "admin-badge-red" : "admin-badge-green"}`}>
                        {job.active === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-action-edit" title="Edit">
                          Edit
                        </button>
                        <button
                          className="admin-action-btn admin-action-delete"
                          onClick={() => deleteJob(job._id, job.title)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}