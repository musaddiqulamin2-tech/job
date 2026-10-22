"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { apiJson, readFileAsDataUrl } from "./api";
import { JOB_STATUSES } from "./AdminUI";
import { clearPreviewPayload, createPreviewId, savePreviewPayload } from "./previewStore";

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

function legacyCategoryToCms(category) {
  const c = String(category || "").toLowerCase();
  if (c.includes("government") || c.includes("banking") || c.includes("railway") || c.includes("psu")) {
    return "government-job";
  }
  return "private-job";
}

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
  featuredImage: "",
};

export default function JobForm({ initial = null, jobId = null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const previewWin = useRef(null);
  const previewId = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
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
          featuredImage: initial.featuredImage || "",
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

  async function handleImageFile(e) {
    const input = e.target;
    const file = input.files && input.files[0];
    input.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setImageError("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError("Image must be under 8 MB.");
      return;
    }

    setImageError("");
    setImageUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { res, data } = await apiJson("/api/admin/media", {
        method: "POST",
        body: { dataUrl, filename: file.name, resourceType: "image" },
      });
      if (!res.ok) throw new Error(data?.message || "Upload failed.");
      const url = data?.item?.secureUrl || data?.item?.url;
      if (!url) throw new Error("Upload failed.");
      setForm((prev) => ({ ...prev, featuredImage: url }));
    } catch (err) {
      setImageError(err.message || "Upload failed.");
    } finally {
      setImageUploading(false);
    }
  }

  function handleRemoveImage() {
    setForm((prev) => ({ ...prev, featuredImage: "" }));
    setImageError("");
  }

  function buildPreviewPayload() {
    const lines = (v) => String(v || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    return {
      title: form.title,
      slug: "",
      category: legacyCategoryToCms(form.category),
      status: form.status,
      summary: form.description,
      featuredImage: form.featuredImage,
      organization: form.company,
      location: form.location,
      qualification: lines(form.requirements).join("\n"),
      vacancyCount: form.vacancies,
      salary: form.salary,
      jobType: form.type,
      experience: form.experience,
      eligibility: lines(form.requirements).join("\n"),
      responsibilities: lines(form.responsibilities),
      lastDate: form.lastDate,
      applicationUrl: form.officialLink,
      importantLinks: form.officialLink
        ? [{ label: "Apply Online", url: form.officialLink, type: "apply" }]
        : [],
      tags: [],
      contentHtml: "",
      seo: {},
    };
  }

  function openPreview() {
    const id = createPreviewId();
    if (!savePreviewPayload(id, buildPreviewPayload())) {
      setError("Preview could not be prepared. Please try again.");
      return;
    }
    previewId.current = id;
    const back = jobId ? `/admin/jobs/${jobId}` : "/admin/jobs/new";
    const url = `/admin/preview?k=${encodeURIComponent(id)}&back=${encodeURIComponent(back)}`;
    const win = window.open(url, "jobcareer-preview");
    if (!win) {
      clearPreviewPayload(id);
      previewId.current = null;
      setError("Popup blocked. Allow popups for this site to open the preview page.");
      return;
    }
    previewWin.current = win;
    setPreviewOpen(true);
    win.focus();
  }

  useEffect(() => {
    if (!previewOpen) return undefined;
    const timer = window.setInterval(() => {
      const win = previewWin.current;
      if (!win || win.closed) {
        previewWin.current = null;
        if (previewId.current) clearPreviewPayload(previewId.current);
        previewId.current = null;
        setPreviewOpen(false);
      }
    }, 1500);
    return () => window.clearInterval(timer);
  }, [previewOpen]);

  useEffect(() => {
    if (!previewOpen) return undefined;
    const id = previewId.current;
    if (!id) return undefined;
    const timer = window.setTimeout(() => {
      const win = previewWin.current;
      if (!win || win.closed) return;
      savePreviewPayload(id, buildPreviewPayload());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [previewOpen, form]);

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
      featuredImage: form.featuredImage || "",
    };

    try {
      const url = jobId ? `/api/admin/jobs/${jobId}` : "/api/admin/jobs";
      const method = jobId ? "PUT" : "POST";

      const res = await apiFetch(url, {
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
          <label htmlFor="featuredImageFile">Featured Image</label>
          <div className="t-featured-row">
            <div className="t-featured-preview">
              {form.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.featuredImage} alt="Featured image preview" />
              ) : (
                <span>No image uploaded</span>
              )}
            </div>
            <div className="t-featured-actions">
              <label className="admin-btn admin-btn-primary" htmlFor="featuredImageFile">
                {imageUploading
                  ? "Uploading..."
                  : form.featuredImage
                    ? "Replace Image"
                    : "Upload Image"}
              </label>
              <input
                id="featuredImageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageFile}
                style={{ display: "none" }}
              />
              {form.featuredImage && (
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="admin-field-hint">
            JPG, PNG, WEBP or GIF, up to 8 MB. Recommended 1200x675 (16:9). This image is shown on the
            job listing card.
          </p>
          {imageError && <div className="admin-alert admin-alert-error">{imageError}</div>}
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
          <button type="button" className="admin-btn" onClick={openPreview}>
            Preview
          </button>
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