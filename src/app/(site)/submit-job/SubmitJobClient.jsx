"use client";
import { useState, useRef } from "react";

const JOB_CATEGORIES = [
  "Government Job",
  "Banking Job",
  "Railway Job",
  "PSU Job",
  "Private Job",
  "Teaching Job",
  "Other",
];

const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Work From Home",
  "Other",
];

const APPLICATION_PROCESSES = [
  "",
  "Apply Online",
  "Email Application",
  "Apply Offline",
  "Walk-in Interview",
  "Phone / WhatsApp",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const URL_RE = /^https?:\/\/.+\..+/i;

const WHO_CAN_SUBMIT = [
  {
    title: "Employers",
    desc: "Companies and organizations hiring staff for current or upcoming vacancies.",
  },
  {
    title: "Recruiters & Staffing Agencies",
    desc: "Agencies sourcing candidates on behalf of their client companies.",
  },
  {
    title: "HR Consultants",
    desc: "Consultancies helping businesses find the right talent quickly.",
  },
  {
    title: "Startups & Small Businesses",
    desc: "Young companies looking to grow their teams affordably.",
  },
  {
    title: "NGOs & Social Organizations",
    desc: "Non-profits recruiting staff for projects and field operations.",
  },
  {
    title: "Training Institutes",
    desc: "Academies and institutes hiring faculty and support staff.",
  },
];

const SUBMIT_STEPS = [
  {
    title: "Fill the Submission Form",
    desc: "Enter employer details, job title, eligibility and application dates.",
  },
  {
    title: "Upload Required Documents",
    desc: "Add the official notification PDF and company logo if available.",
  },
  {
    title: "Review Your Information",
    desc: "Check every field carefully before submitting the form.",
  },
  {
    title: "Submit & Track",
    desc: "Your job moves to Pending Review and gets approved by our team.",
  },
];

const REQUIRED_INFO = [
  "Company / Organization Name (required)",
  "Official Email ID (required)",
  "Contact Number (required)",
  "Company Website (optional)",
  "Registered Office Address (required)",
  "Job Title (required)",
  "Number of Vacancies (required)",
  "Job Category (required)",
  "Job Location (required)",
  "Employment Type (required)",
  "Salary Details (optional)",
  "Required Qualification (required)",
  "Experience Required (required)",
  "Age Limit (optional)",
  "Job Start Date (required)",
  "Application Last Date (required)",
  "Notification PDF & Company Logo (optional)",
];

const REVIEW_STEPS = [
  {
    title: "Job Submitted",
    desc: "You complete the form and your submission is recorded with a submission ID.",
  },
  {
    title: "Team Review",
    desc: "Our team checks the details for completeness and accuracy.",
  },
  {
    title: "Approved & Published",
    desc: "Approved jobs are published on the JobCareer Jobs section.",
  },
  {
    title: "Visible in Search",
    desc: "The job appears in category listings and search results.",
  },
  {
    title: "Applicants Apply",
    desc: "Candidates reach you through the details you provided.",
  },
];

const BENEFITS = [
  {
    title: "Free Job Posting",
    desc: "Post your vacancy for free with no hidden charges.",
  },
  {
    title: "Pan-India Reach",
    desc: "Reach active job seekers across Assam and India.",
  },
  {
    title: "Quick Review",
    desc: "Jobs are reviewed and approved within 1-2 working days.",
  },
  {
    title: "Verified & Transparent",
    desc: "Every submission is checked before it goes live.",
  },
  {
    title: "Wide Coverage",
    desc: "Post government, banking, railway, teaching and private openings.",
  },
  {
    title: "Direct Applications",
    desc: "Applicants contact you through the details you provide.",
  },
];

const FAQS = [
  {
    q: "Is posting a job on JobCareer free?",
    a: "Yes, posting a job on JobCareer is completely free right now. There are no hidden charges for submitting a job.",
  },
  {
    q: "Will my job be published immediately?",
    a: "No. Every job is reviewed by our team before going live. Only approved jobs appear on the Jobs list and in search results.",
  },
  {
    q: "Can I submit more than one job?",
    a: "Yes, you can submit as many vacancies as you need. Each vacant position requires a separate submission.",
  },
  {
    q: "What documents do I need to upload?",
    a: "A PDF copy of the official notification is helpful, and you can also upload a company logo in JPG, JPEG, PNG or WEBP format. Both are optional.",
  },
  {
    q: "How will applicants contact me?",
    a: "Applicants reach you using the official email ID, contact number or the application link you provide in the form.",
  },
  {
    q: "Can I set my own application dates?",
    a: "Yes. You choose the start date and last date for your job opening. Last date cannot be before the start date.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={open ? "jh-submit-faq-chevron open" : "jh-submit-faq-chevron"}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const initialForm = {
  companyName: "",
  officialEmail: "",
  contactPhone: "",
  companyWebsite: "",
  address: "",
  jobTitle: "",
  vacancies: "",
  category: "",
  location: "",
  employmentType: "Full Time",
  salary: "",
  startDate: "",
  lastDate: "",
  qualification: "",
  experience: "",
  ageLimit: "",
  applicationProcess: "",
  applicationUrl: "",
  description: "",
  responsibilities: "",
  confirmWebsite: "",
  agree: false,
  notificationFile: null,
  companyLogo: null,
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function validateForm(f) {
  const errors = {};

  if (!f.companyName.trim()) errors.companyName = "Company name is required.";
  if (!EMAIL_RE.test(f.officialEmail.trim()))
    errors.officialEmail = "Enter a valid official email address.";
  if (!PHONE_RE.test(f.contactPhone.trim()))
    errors.contactPhone = "Enter a valid 10-digit contact number.";
  if (f.companyWebsite.trim() && !URL_RE.test(f.companyWebsite.trim()))
    errors.companyWebsite = "Enter a valid URL (https://...).";
  if (!f.address.trim()) errors.address = "Company address is required.";

  if (!f.jobTitle.trim()) errors.jobTitle = "Job title is required.";
  const v = Number(f.vacancies);
  if (!f.vacancies || !Number.isInteger(v) || v < 1 || v > 1000)
    errors.vacancies = "Enter a number between 1 and 1000.";
  if (!f.category) errors.category = "Select a job category.";
  if (!f.location.trim()) errors.location = "Job location is required.";
  if (!f.employmentType) errors.employmentType = "Select an employment type.";

  if (f.startDate && f.lastDate && new Date(f.lastDate) < new Date(f.startDate))
    errors.lastDate = "Last date cannot be before the start date.";

  if (!f.qualification.trim())
    errors.qualification = "Required qualification is required.";
  if (!f.experience.trim()) errors.experience = "Experience required is required.";
  if (f.applicationUrl.trim() && !URL_RE.test(f.applicationUrl.trim()))
    errors.applicationUrl = "Enter a valid URL (https://...).";

  if (!f.description.trim()) errors.description = "Job description is required.";
  if (!f.agree) errors.agree = "Please confirm that the information is correct.";

  return errors;
}

export default function SubmitJobClient() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const formRef = useRef(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleFile(field, file) {
    if (!file) {
      update(field, null);
      return;
    }

    if (field === "notificationFile") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          notificationFile: "Notification must be a PDF file.",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          notificationFile: "PDF must be under 10 MB.",
        }));
        return;
      }
    }

    if (field === "companyLogo") {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          companyLogo: "Logo must be JPG, JPEG, PNG, or WEBP.",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          companyLogo: "Logo must be under 2 MB.",
        }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const firstKey = Object.keys(validation)[0];
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setSubmitFailed(false);

    try {
      let notificationData = "";
      let logoData = "";

      if (form.notificationFile) {
        notificationData = await fileToBase64(form.notificationFile);
      }
      if (form.companyLogo) {
        logoData = await fileToBase64(form.companyLogo);
      }

      const res = await fetch("/api/submit-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          officialEmail: form.officialEmail.trim(),
          contactPhone: form.contactPhone.trim(),
          companyWebsite: form.companyWebsite.trim(),
          address: form.address.trim(),
          jobTitle: form.jobTitle.trim(),
          vacancies: Number(form.vacancies),
          category: form.category,
          location: form.location.trim(),
          employmentType: form.employmentType,
          salary: form.salary.trim(),
          startDate: form.startDate,
          lastDate: form.lastDate,
          qualification: form.qualification.trim(),
          experience: form.experience.trim(),
          ageLimit: form.ageLimit.trim(),
          applicationProcess: form.applicationProcess,
          applicationUrl: form.applicationUrl.trim(),
          description: form.description.trim(),
          responsibilities: form.responsibilities.trim(),
          confirmWebsite: form.confirmWebsite,
          notificationFile: notificationData,
          companyLogo: logoData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted({
          id: data.submission?._id || "JSC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          companyName: form.companyName,
          jobTitle: form.jobTitle,
          status: data.submission?.status || "PENDING_REVIEW",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitFailed(true);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
    setSubmitted(null);
    setSubmitFailed(false);
    setOpenFaq(0);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const fieldClass = (key) =>
    errors[key] ? "jh-submit-input jh-submit-input-error" : "jh-submit-input";

  return (
    <main className="jh-submit-page">
      <div className="jh-submit-container">
        {/* Hero */}
        <section className="jh-submit-hero">
          <div className="jh-submit-hero-orb jh-submit-hero-orb-1" />
          <div className="jh-submit-hero-orb jh-submit-hero-orb-2" />
          <span className="jh-submit-eyebrow">EMPLOYER PORTAL</span>
          <h1>Submit a Job</h1>
          <p>
            Post your job vacancy on <strong>JobCareer</strong> and reach
            active job seekers across Assam and India. Submit the job details
            below – our team reviews every posting before it goes live.
          </p>
          <div className="jh-submit-hero-actions">
            <a className="jh-submit-btn-primary" href="#submit-job-form">
              SUBMIT A JOB <span aria-hidden="true">→</span>
            </a>
            <a className="jh-submit-btn-ghost" href="/contact">
              CONTACT US
            </a>
          </div>
        </section>

        {/* Who Can Submit */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">Who Can Submit a Job?</h2>
          <p className="jh-submit-section-sub">
            JobCareer is open to every genuine employer looking to hire.
          </p>
          <div className="jh-submit-card-grid">
            {WHO_CAN_SUBMIT.map((item) => (
              <div className="jh-submit-card" key={item.title}>
                <div className="jh-submit-card-icon jh-submit-icon-indigo">
                  <BuildingIcon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Submit */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">How to Submit a Job</h2>
          <p className="jh-submit-section-sub">
            Get your vacancy live in four simple steps.
          </p>
          <div className="jh-submit-steps">
            {SUBMIT_STEPS.map((step, i) => (
              <div className="jh-submit-step" key={step.title}>
                <div className="jh-submit-step-num">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Required Information */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">Required Information</h2>
          <p className="jh-submit-section-sub">
            Keep these details ready before you start filling the form.
          </p>
          <div className="jh-submit-checklist">
            {REQUIRED_INFO.map((item) => (
              <div className="jh-submit-checklist-item" key={item}>
                <span className="jh-submit-checklist-check">
                  <CheckIcon />
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section id="submit-job-form" className="jh-submit-form-section">
          {submitted ? (
            <div className="jh-submit-done">
              <div className="jh-submit-done-badge">
                <CheckIcon />
              </div>
              <h2>Job Submitted Successfully!</h2>
              <p>
                Thank you for posting your vacancy on JobCareer. Our team will
                review your submission and publish it once approved.
              </p>
              <div className="jh-submit-done-card">
                <div className="jh-submit-done-row">
                  <span>Submission ID</span>
                  <strong>{submitted.id}</strong>
                </div>
                <div className="jh-submit-done-row">
                  <span>Company</span>
                  <strong>{submitted.companyName}</strong>
                </div>
                <div className="jh-submit-done-row">
                  <span>Job Title</span>
                  <strong>{submitted.jobTitle}</strong>
                </div>
                <div className="jh-submit-done-row">
                  <span>Status</span>
                  <span className="jh-submit-status-pill">Pending Review</span>
                </div>
              </div>
              <p className="jh-submit-done-note">
                You will receive a confirmation on the email ID you provided.
              </p>
              <button
                type="button"
                className="jh-submit-btn-primary"
                onClick={resetForm}
              >
                SUBMIT ANOTHER JOB
              </button>
            </div>
          ) : submitFailed ? (
            <div className="jh-submit-failed">
              <h2>Submission Failed</h2>
              <p>
                Unable to submit your job right now. Please check your
                information and try again.
              </p>
              <button
                type="button"
                className="jh-submit-btn-primary"
                onClick={() => setSubmitFailed(false)}
              >
                TRY AGAIN
              </button>
            </div>
          ) : (
            <form
              className="jh-submit-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Section 1: Employer Information */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">1</span>
                  <div>
                    <h3>Employer Information</h3>
                    <p>Details about your company / organization.</p>
                  </div>
                </div>

                <div className="jh-submit-field-row">
                  <div className="jh-submit-field">
                    <label htmlFor="companyName">
                      Company Name <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      className={fieldClass("companyName")}
                      placeholder="e.g. Tech Solutions Pvt Ltd"
                      value={form.companyName}
                      onChange={(e) => update("companyName", e.target.value)}
                    />
                    {errors.companyName && (
                      <span className="jh-submit-err">{errors.companyName}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="officialEmail">
                      Official Email ID{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="officialEmail"
                      name="officialEmail"
                      type="email"
                      className={fieldClass("officialEmail")}
                      placeholder="hr@company.com"
                      value={form.officialEmail}
                      onChange={(e) => update("officialEmail", e.target.value)}
                    />
                    {errors.officialEmail && (
                      <span className="jh-submit-err">
                        {errors.officialEmail}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="contactPhone">
                      Contact Number <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      className={fieldClass("contactPhone")}
                      placeholder="98765 43210"
                      value={form.contactPhone}
                      onChange={(e) => update("contactPhone", e.target.value)}
                    />
                    {errors.contactPhone && (
                      <span className="jh-submit-err">
                        {errors.contactPhone}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="companyWebsite">
                      Company Website (optional)
                    </label>
                    <input
                      id="companyWebsite"
                      name="companyWebsite"
                      type="text"
                      className={fieldClass("companyWebsite")}
                      placeholder="https://company.com"
                      value={form.companyWebsite}
                      onChange={(e) => update("companyWebsite", e.target.value)}
                    />
                    {errors.companyWebsite && (
                      <span className="jh-submit-err">
                        {errors.companyWebsite}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="address">
                      Registered Office Address{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      className={fieldClass("address")}
                      placeholder="Full postal address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                    {errors.address && (
                      <span className="jh-submit-err">{errors.address}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Job Details */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">2</span>
                  <div>
                    <h3>Job Details</h3>
                    <p>Basic information about the vacancy.</p>
                  </div>
                </div>

                <div className="jh-submit-field-row">
                  <div className="jh-submit-field">
                    <label htmlFor="jobTitle">
                      Job Title <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      className={fieldClass("jobTitle")}
                      placeholder="e.g. Graduate Engineer Trainee"
                      value={form.jobTitle}
                      onChange={(e) => update("jobTitle", e.target.value)}
                    />
                    {errors.jobTitle && (
                      <span className="jh-submit-err">{errors.jobTitle}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="vacancies">
                      Number of Vacancies{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="vacancies"
                      name="vacancies"
                      type="number"
                      min="1"
                      max="1000"
                      className={fieldClass("vacancies")}
                      placeholder="e.g. 10"
                      value={form.vacancies}
                      onChange={(e) => update("vacancies", e.target.value)}
                    />
                    {errors.vacancies && (
                      <span className="jh-submit-err">{errors.vacancies}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="category">
                      Job Category <span className="jh-submit-required">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      className={fieldClass("category")}
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {JOB_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="jh-submit-err">{errors.category}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="location">
                      Job Location <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className={fieldClass("location")}
                      placeholder="e.g. Guwahati, Assam"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                    />
                    {errors.location && (
                      <span className="jh-submit-err">{errors.location}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="employmentType">
                      Employment Type{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      className={fieldClass("employmentType")}
                      value={form.employmentType}
                      onChange={(e) =>
                        update("employmentType", e.target.value)
                      }
                    >
                      {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.employmentType && (
                      <span className="jh-submit-err">
                        {errors.employmentType}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="salary">Salary (optional)</label>
                    <input
                      id="salary"
                      name="salary"
                      type="text"
                      className={fieldClass("salary")}
                      placeholder="e.g. Rs. 25,000 - 35,000 per month"
                      value={form.salary}
                      onChange={(e) => update("salary", e.target.value)}
                    />
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="startDate">
                      Job Start Date{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className={fieldClass("startDate")}
                      value={form.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                    />
                    {errors.startDate && (
                      <span className="jh-submit-err">{errors.startDate}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="lastDate">
                      Application Last Date{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="lastDate"
                      name="lastDate"
                      type="date"
                      className={fieldClass("lastDate")}
                      value={form.lastDate}
                      onChange={(e) => update("lastDate", e.target.value)}
                    />
                    {errors.lastDate && (
                      <span className="jh-submit-err">{errors.lastDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Application Details */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">3</span>
                  <div>
                    <h3>Application Details</h3>
                    <p>Eligibility and instructions for applicants.</p>
                  </div>
                </div>

                <div className="jh-submit-field-row">
                  <div className="jh-submit-field">
                    <label htmlFor="qualification">
                      Required Qualification{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="qualification"
                      name="qualification"
                      type="text"
                      className={fieldClass("qualification")}
                      placeholder="e.g. B.Tech / B.E. in relevant stream"
                      value={form.qualification}
                      onChange={(e) => update("qualification", e.target.value)}
                    />
                    {errors.qualification && (
                      <span className="jh-submit-err">
                        {errors.qualification}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="experience">
                      Experience Required{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      className={fieldClass("experience")}
                      placeholder="e.g. 2-4 years / Freshers"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                    />
                    {errors.experience && (
                      <span className="jh-submit-err">{errors.experience}</span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="ageLimit">Age Limit (optional)</label>
                    <input
                      id="ageLimit"
                      name="ageLimit"
                      type="text"
                      className={fieldClass("ageLimit")}
                      placeholder="e.g. 18-35 years"
                      value={form.ageLimit}
                      onChange={(e) => update("ageLimit", e.target.value)}
                    />
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="applicationProcess">
                      Application Process
                    </label>
                    <select
                      id="applicationProcess"
                      name="applicationProcess"
                      className={fieldClass("applicationProcess")}
                      value={form.applicationProcess}
                      onChange={(e) =>
                        update("applicationProcess", e.target.value)
                      }
                    >
                      {APPLICATION_PROCESSES.map((p, i) => (
                        <option key={p || "none"} value={p}>
                          {p || "Select process"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="applicationUrl">
                      Application Link (optional)
                    </label>
                    <input
                      id="applicationUrl"
                      name="applicationUrl"
                      type="text"
                      className={fieldClass("applicationUrl")}
                      placeholder="https://company.com/apply"
                      value={form.applicationUrl}
                      onChange={(e) => update("applicationUrl", e.target.value)}
                    />
                    {errors.applicationUrl && (
                      <span className="jh-submit-err">
                        {errors.applicationUrl}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Job Description */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">4</span>
                  <div>
                    <h3>Job Description</h3>
                    <p>Tell applicants what the role involves.</p>
                  </div>
                </div>

                <div className="jh-submit-field-row">
                  <div className="jh-submit-field">
                    <label htmlFor="description">
                      Job Description{" "}
                      <span className="jh-submit-required">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      className={fieldClass("description")}
                      placeholder="Describe the role, duties, work environment and any other important details..."
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                    {errors.description && (
                      <span className="jh-submit-err">
                        {errors.description}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="responsibilities">
                      Responsibilities (optional)
                    </label>
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      rows={4}
                      className={fieldClass("responsibilities")}
                      placeholder="Key responsibilities day-to-day..."
                      value={form.responsibilities}
                      onChange={(e) => update("responsibilities", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Documents */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">5</span>
                  <div>
                    <h3>Documents</h3>
                    <p>Upload any supporting documents (optional).</p>
                  </div>
                </div>

                <div className="jh-submit-field-row">
                  <div className="jh-submit-field">
                    <label htmlFor="notificationFile">
                      Notification / Advertisement (PDF, max 10 MB)
                    </label>
                    <label className="jh-submit-file">
                      <span className="jh-submit-file-icon">
                        <FileIcon />
                      </span>
                      <span>
                        <strong>
                          {form.notificationFile
                            ? form.notificationFile.name
                            : "Choose PDF file"}
                        </strong>
                        <small>Official job notification or advertisement</small>
                      </span>
                      <input
                        id="notificationFile"
                        name="notificationFile"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFile("notificationFile", e.target.files[0])
                        }
                      />
                    </label>
                    {errors.notificationFile && (
                      <span className="jh-submit-err">
                        {errors.notificationFile}
                      </span>
                    )}
                  </div>

                  <div className="jh-submit-field">
                    <label htmlFor="companyLogo">
                      Company Logo (JPG / PNG / WEBP, max 2 MB)
                    </label>
                    <label className="jh-submit-file">
                      <span className="jh-submit-file-icon">
                        <UploadIcon />
                      </span>
                      <span>
                        <strong>
                          {form.companyLogo
                            ? form.companyLogo.name
                            : "Choose company logo"}
                        </strong>
                        <small>Shown next to your job posting</small>
                      </span>
                      <input
                        id="companyLogo"
                        name="companyLogo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                          handleFile("companyLogo", e.target.files[0])
                        }
                      />
                    </label>
                    {errors.companyLogo && (
                      <span className="jh-submit-err">
                        {errors.companyLogo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 6: Confirmation */}
              <div className="jh-submit-form-step">
                <div className="jh-submit-form-step-head">
                  <span className="jh-submit-form-step-no">6</span>
                  <div>
                    <h3>Confirmation</h3>
                    <p>Almost done – confirm before submitting.</p>
                  </div>
                </div>

                {/* Honeypot trap */}
                <div
                  className="jh-submit-hp"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  <label htmlFor="confirmWebsite">
                    Website (do not fill)
                  </label>
                  <input
                    id="confirmWebsite"
                    name="confirmWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.confirmWebsite}
                    onChange={(e) => update("confirmWebsite", e.target.value)}
                  />
                </div>

                <label className="jh-submit-agree">
                  <input
                    name="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => update("agree", e.target.checked)}
                  />
                  <span>
                    I confirm that the information provided above is correct
                    and that I am authorized to post this job on behalf of my
                    company / organization.
                  </span>
                </label>
                {errors.agree && (
                  <span className="jh-submit-err">{errors.agree}</span>
                )}

                <button
                  type="submit"
                  className="jh-submit-btn-primary jh-submit-btn-big"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="jh-submit-spinner" /> SUBMITTING...
                    </>
                  ) : (
                    <>SUBMIT JOB FOR REVIEW</>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Review Process */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">How Jobs Get Published</h2>
          <p className="jh-submit-section-sub">
            A transparent review keeps JobCareer safe for job seekers and
            employers.
          </p>
          <div className="jh-submit-steps">
            {REVIEW_STEPS.map((step, i) => (
              <div
                className="jh-submit-step jh-submit-step-review"
                key={step.title}
              >
                <div className="jh-submit-step-num">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Employer Registration */}
        <section className="jh-submit-section">
          <div className="jh-submit-register">
            <div className="jh-submit-register-icon">
              <BriefcaseIcon />
            </div>
            <h2>Employer Registration</h2>
            <p>
              Get priority review, bulk posting and a dedicated dashboard
              through verified employer accounts. Employer registration plans
              are coming soon – stay tuned.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">Why Post Jobs on JobCareer?</h2>
          <p className="jh-submit-section-sub">
            Simple, free and trusted by job seekers across the region.
          </p>
          <div className="jh-submit-card-grid">
            {BENEFITS.map((benefit, i) => (
              <div
                className="jh-submit-card"
                key={benefit.title}
              >
                <div
                  className={
                    i % 2 === 0
                      ? "jh-submit-card-icon jh-submit-icon-teal"
                      : "jh-submit-card-icon jh-submit-icon-indigo"
                  }
                >
                  <CheckIcon />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="jh-submit-section">
          <h2 className="jh-submit-section-title">Frequently Asked Questions</h2>
          <p className="jh-submit-section-sub">
            Everything employers usually ask before posting a job.
          </p>
          <div className="jh-submit-faq">
            {FAQS.map((faq, i) => (
              <div
                className={
                  openFaq === i
                    ? "jh-submit-faq-item open"
                    : "jh-submit-faq-item"
                }
                key={faq.q}
              >
                <button
                  type="button"
                  className="jh-submit-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {faq.q}
                  <ChevronDownIcon open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div className="jh-submit-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="jh-submit-section">
          <div className="jh-submit-cta">
            <h2>Need help posting your job?</h2>
            <p>
              Our support team is ready to assist you with every step of the
              submission process.
            </p>
            <div className="jh-submit-cta-actions">
              <a className="jh-submit-btn-ghost" href="mailto:support@jobcareer.in">
                support@jobcareer.in
              </a>
              <a className="jh-submit-btn-ghost" href="/contact">
                Visit Contact Page
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}