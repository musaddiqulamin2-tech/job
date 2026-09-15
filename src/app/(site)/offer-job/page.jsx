"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Sales",
  "Engineering",
  "Other",
];

const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Freelance", "Remote"];

const tagColors = ["teal", "blue", "indigo", "emerald", "amber", "rose"];

export default function OfferJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    salary: "",
    category: "",
    type: "Full Time",
    location: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return alert("Please enter job title.");
    if (!form.company.trim()) return alert("Please enter company name.");
    if (!form.description.trim()) return alert("Please enter job description.");
    if (!form.location.trim()) return alert("Please enter job location.");

    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          company: form.company.trim(),
          description: form.description.trim(),
          salary: form.salary ? `₹${Number(form.salary).toLocaleString("en-IN")}` : "",
          category: form.category || "Other",
          type: form.type,
          location: form.location.trim(),
          tagColor: tagColors[Math.floor(Math.random() * tagColors.length)],
          posted: "Just now",
          active: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Job posted successfully!");
        router.push("/#jobs");
        router.refresh();
      } else {
        alert(data.message || "Failed to post job.");
      }
    } catch (err) {
      alert("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jh-oj-page">
      <div className="jh-oj-wrap">
        <Link href="/" className="jh-oj-back">← Back to Jobs</Link>

        <div className="jh-oj-head">
          <h1>Offer a Job</h1>
          <p>Find a suitable worker anywhere in India.</p>
        </div>

        <form onSubmit={handleSubmit} className="jh-oj-card">
          {/* Job Title */}
          <div className="jh-oj-field">
            <label>
              Job Title <span className="jh-oj-required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Electrician Required"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          {/* Company */}
          <div className="jh-oj-field">
            <label>
              Company Name <span className="jh-oj-required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tech Solutions Pvt Ltd"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="jh-oj-field">
            <label>
              Job Description <span className="jh-oj-required">*</span>
            </label>
            <textarea
              placeholder="Describe the work, requirements, and any other details..."
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          {/* Salary */}
          <div className="jh-oj-field">
            <label>
              Salary (₹) <span className="jh-oj-required">*</span>
            </label>
            <div className="jh-oj-rupee-wrap">
              <span className="jh-oj-rupee">₹</span>
              <input
                type="number"
                min="1"
                placeholder="e.g. 25000"
                value={form.salary}
                onChange={(e) => update("salary", e.target.value)}
              />
            </div>
          </div>

          {/* Category + Type */}
          <div className="jh-oj-row">
            <div className="jh-oj-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="jh-oj-field">
              <label>Job Type</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="jh-oj-field">
            <label>
              Job Location <span className="jh-oj-required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Maharashtra"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="jh-oj-submit">
            {loading ? "Posting..." : "Post Job →"}
          </button>
        </form>
      </div>
    </main>
  );
}