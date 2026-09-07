"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplyPage() {
  const [jobTitle, setJobTitle] = useState("Job");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverMessage: "",
  });

  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const job = params.get("job");

    if (job) {
      setJobTitle(job);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleResume(e) {
    const file = e.target.files[0];

    if (file) {
      setResume(file);
    }
  }

  function handlePhoto(e) {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!resume) {
      setErrorMessage("Please select your resume.");
      return;
    }

    if (!photo) {
      setErrorMessage("Please select your profile photo.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const resumeBase64 = await fileToBase64(resume);
      const photoBase64 = await fileToBase64(photo);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          jobTitle,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          coverMessage: formData.coverMessage,
          resume: resumeBase64,
          photo: photoBase64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Application submission failed"
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Submit Error:", error);

      setErrorMessage(
        "Application submit nahi hui. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="jh-apply-page">
        <div className="jh-container jh-apply-narrow">
          <div className="jh-apply-success">
            <div className="jh-check-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <h1>Application Submitted!</h1>

            <p className="jh-apply-success-sub">
              Thank you for applying for <strong>{jobTitle}</strong>.
            </p>

            <p className="jh-apply-success-text">
              Your application, resume and photo have been received successfully.
              The hiring team will reach out to you soon.
            </p>

            <div className="jh-apply-success-btns">
              <button
                className="jh-btn jh-btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    coverMessage: "",
                  });
                  setResume(null);
                  setPhoto(null);
                  setErrorMessage("");
                }}
              >
                Submit Another Application
              </button>
              <Link href="/" className="jh-btn jh-btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="jh-apply-page">
      <div className="jh-container jh-apply-narrow">
        <div className="jh-apply-header">
          <Link href="/#jobs" className="jh-detail-back">
            ← Back to Jobs
          </Link>

          <h1>
            Apply <span className="jh-gradient-text">for a Job</span>
          </h1>

          <p className="jh-apply-sub">
            Fill in your details to apply for this position.
          </p>

          <div className="jh-apply-job-chip">
            <span>Applying For</span>
            <strong>{jobTitle}</strong>
          </div>
        </div>

        {errorMessage && (
          <div className="jh-apply-error">
            {errorMessage}
          </div>
        )}

        <form className="jh-apply-form" onSubmit={handleSubmit}>
          <div className="jh-apply-form-grid">
            <div className="jh-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="jh-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="jh-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="jh-form-group">
              <label htmlFor="resume">Resume</label>
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResume}
                required
              />
              {resume && (
                <p className="jh-file-name">Selected: {resume.name}</p>
              )}
            </div>

            <div className="jh-form-group">
              <label htmlFor="photo">Profile Photo</label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                required
              />
              {photo && (
                <p className="jh-file-name">Selected: {photo.name}</p>
              )}
            </div>
          </div>

          <div className="jh-form-group jh-form-full">
            <label htmlFor="coverMessage">Cover Message</label>
            <textarea
              id="coverMessage"
              name="coverMessage"
              placeholder="Write something about yourself..."
              rows="6"
              value={formData.coverMessage}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="jh-btn jh-btn-primary jh-apply-submit"
            disabled={loading}
          >
            {loading
              ? "Uploading Files..."
              : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}
