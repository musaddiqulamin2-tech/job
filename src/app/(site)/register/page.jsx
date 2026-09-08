"use client";

import { useState } from "react";
import Link from "next/link";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

const workTypes = [
  "Mason", "Carpenter", "Painter", "Electrician", "Plumber", "Gardener",
  "Cleaner", "Welder", "Driver", "Construction Worker", "Helper",
  "AC Technician", "Mechanic", "Tiles Worker", "Furniture Worker",
  "Home Care", "Graphic Designer", "Other",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    state: "",
    district: "",
    workType: "",
    kycType: "",
    kycNumber: "",
  });
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleMobile(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile: value }));
  }

  function handleKycType(value) {
    setFormData((prev) => ({ ...prev, kycType: value, kycNumber: "" }));
    setDocument(null);
  }

  function handleKycNumber(e) {
    let value = e.target.value.toUpperCase();

    if (formData.kycType === "Aadhaar") {
      value = value.replace(/\D/g, "").slice(0, 12);
    } else if (formData.kycType === "PAN") {
      value = value.replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, kycNumber: value }));
  }

  function handleDocument(e) {
    const file = e.target.files[0];

    if (!file) {
      setDocument(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be less than 5MB.");
      e.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setErrorMessage("Only JPG, PNG or PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setDocument(file);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage("Please enter a valid 10 digit mobile number.");
      return;
    }
    if (!formData.state) {
      setErrorMessage("Please select your state.");
      return;
    }
    if (!formData.district.trim()) {
      setErrorMessage("Please enter your district.");
      return;
    }
    if (!formData.workType) {
      setErrorMessage("Please select your work type.");
      return;
    }
    if (!formData.kycType) {
      setErrorMessage("Please select your KYC document type.");
      return;
    }
    if (!formData.kycNumber) {
      setErrorMessage(
        formData.kycType === "PAN"
          ? "Please enter your PAN number."
          : "Please enter your Aadhaar number."
      );
      return;
    }
    if (!document) {
      setErrorMessage("Please upload your KYC document.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const documentBase64 = await fileToBase64(document);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          document: documentBase64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Register Error:", error);
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="jh-reg-page">
        <div className="jh-reg-success">
          <span className="jh-reg-success-icon">✓</span>
          <h1>Registration Successful</h1>
          <p>
            Thank you, {formData.name}! Your registration has been submitted.
            Our team will contact you with suitable job opportunities in your
            area.
          </p>
          <Link href="/" className="jh-btn jh-btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="jh-reg-page">
      <div className="jh-reg-wrap">
        <div className="jh-reg-head">
          <div className="jh-reg-head-icon">👷</div>
          <h1>Register as Worker</h1>
          <p>Register to receive job opportunities in your area.</p>
        </div>

        <div className="jh-reg-card">
          <div className="jh-reg-card-bar" />

          <form className="jh-reg-form" onSubmit={handleSubmit}>
            <div className="jh-reg-field">
              <label>
                Full Name <span className="jh-req">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="jh-reg-field">
              <label>
                Mobile Number <span className="jh-req">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.mobile}
                onChange={handleMobile}
                placeholder="10 digit mobile number"
                maxLength={10}
                disabled={loading}
              />
            </div>

            <div className="jh-reg-row">
              <div className="jh-reg-field">
                <label>
                  State <span className="jh-req">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select State</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="jh-reg-field">
                <label>
                  District <span className="jh-req">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  disabled={loading}
                />
                <p className="jh-reg-hint">Enter your current district</p>
              </div>
            </div>

            <div className="jh-reg-field">
              <label>
                Work Type <span className="jh-req">*</span>
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Work Type</option>
                {workTypes.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="jh-reg-field">
              <label>
                KYC Document <span className="jh-req">*</span>
              </label>
              <div className="jh-reg-kyc">
                <label
                  className={`jh-reg-kyc-opt ${
                    formData.kycType === "Aadhaar" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="kycType"
                    value="Aadhaar"
                    checked={formData.kycType === "Aadhaar"}
                    onChange={() => handleKycType("Aadhaar")}
                    disabled={loading}
                  />
                  Aadhaar
                </label>
                <label
                  className={`jh-reg-kyc-opt ${
                    formData.kycType === "PAN" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="kycType"
                    value="PAN"
                    checked={formData.kycType === "PAN"}
                    onChange={() => handleKycType("PAN")}
                    disabled={loading}
                  />
                  PAN
                </label>
              </div>
            </div>

            <div className="jh-reg-field">
              <label>
                {formData.kycType === "PAN" ? "PAN Number" : "Aadhaar Number"}{" "}
                <span className="jh-req">*</span>
              </label>
              <input
                type="text"
                value={formData.kycNumber}
                onChange={handleKycNumber}
                placeholder={
                  formData.kycType === "PAN"
                    ? "Enter PAN number"
                    : "Enter 12 digit Aadhaar number"
                }
                maxLength={formData.kycType === "PAN" ? 10 : 12}
                disabled={!formData.kycType || loading}
              />
            </div>

            <div className="jh-reg-field">
              <label>
                Upload KYC Document <span className="jh-req">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleDocument}
                disabled={loading}
                className="jh-reg-file"
              />
              <p className="jh-reg-hint">JPG, PNG or PDF — Maximum 5MB</p>
              {document && (
                <div className="jh-reg-file-ok">✓ {document.name}</div>
              )}
            </div>

            <div className="jh-reg-note">
              <p className="jh-reg-note-strong">Registration Information</p>
              <p>
                Your State, District and Work Type will be used to send you
                relevant job notifications in your area.
              </p>
            </div>

            {errorMessage && (
              <div className="jh-reg-error">{errorMessage}</div>
            )}

            <button type="submit" className="jh-reg-submit" disabled={loading}>
              {loading ? "Creating Registration..." : "Register"}
            </button>
          </form>
        </div>

        <p className="jh-reg-foot">
          Your information is used only for worker registration and job
          matching.
        </p>
      </div>
    </main>
  );
}