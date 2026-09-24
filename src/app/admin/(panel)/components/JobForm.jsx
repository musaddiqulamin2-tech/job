"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOB_STATUSES } from "./AdminUI";

const typeOptions = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
const categoryOptions = [
  "Government Job",
  "Banking Job",
  "Railway Job",
  "PSU Job",
  "Private Job",
  "Teaching Job",
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Sales",
  "Marketing",
  "Engineering",
  "Design",
  "Other",
];

const empty = {
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
  status: "Active",
  vacancies: 0,
  lastDate: "",
  officialLink: "",
};

export default function JobForm({ initial = null, jobId = null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    ...empty,
    ...(initial
      ? {
          ...initial,
          requirements: Array.isArray(initial.requirements)
            ? initial.requirements.join("\n")
            : initial.requirements || "",
          responsibilities: Array.isArray(initial.responsibilities)
            ? initial.responsibilities.join("\n")
            : initial.responsibilities || "",
          vacancies: initial.vacancies || 0,
          status: initial.status || "Active",
        }
      : {}),
  }));

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      salary: form.salary,
      type: form.type,
      category: form.category,
      experience: form.experience,
      description: form.description,
      requirements: String(form.requirements || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: String(form.responsibilities || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      posted: form.posted || "Just now",
      featured: Boolean(form.featured),
      status: form.status,
      vacancies: Number(form.vacancies) || 0,
      lastDate: form.lastDate || "",
      officialLink: form.officialLink || "",
    };

    try {
      const url = jobId ? `/api/admin/jobs/${jobId}` : "/api/admin/jobs";
      const method = jobId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save job.");
      }

      if (jobId) {
        window.alert(data.message || "Job updated successfully.");
      } else {
        router.push("/admin/jobs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-card admin-job-form">
      <div className="admin-card-header">
        <div>
          <h2>{jobId ? "Edit Job" : "Add New Job"}</h2>
          <p className="admin-card-sub">Fill in the job details below</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="company">Company *</label>
            <input
              id="company"
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
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai, India"
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
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
            <label htmlFor="type">Job Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              {typeOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categoryOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label htmlFor="experience">Experience</label>
            <input
              id="experience"
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 2 - 4 Years"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="vacancies">Vacancies</label>
            <input
              id="vacancies"
              type="number"
              name="vacancies"
              min="0"
              value={form.vacancies}
              onChange={handleChange}
              placeholder="e.g. 10"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="lastDate">Last Date to Apply</label>
            <input
              id="lastDate"
              type="text"
              name="lastDate"
              value={form.lastDate}
              onChange={handleChange}
              placeholder="e.g. 30 Oct 2026"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {JOB_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="officialLink">Official Application Link</label>
          <input
            id="officialLink"
            type="url"
            name="officialLink"
            value={form.officialLink}
            onChange={handleChange}
            placeholder="https://example.gov.in/apply"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role..."
            rows="4"
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="requirements">Requirements (one per line)</label>
            <textarea
              id="requirements"
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder={"2+ years of React experience\nExcellent communication skills"}
              rows="5"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="responsibilities">Responsibilities (one per line)</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              placeholder={"Build responsive interfaces\nCollaborate with design team"}
              rows="5"
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
            onClick={() => router.push("/admin/jobs")}
          >
            Cancel
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : jobId ? "Update Job" : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
}