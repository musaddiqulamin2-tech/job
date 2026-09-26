"use client";

import { useEffect, useState } from "react";
import { Spinner, ErrorState, Toast } from "../components/AdminUI";
import { csrfToken } from "../components/api";
import { POST_CATEGORY_META } from "../../../lib/postMeta";

const CMS_CATEGORY_KEYS = Object.keys(POST_CATEGORY_META);
const SOCIAL_KEYS = ["facebook", "twitter", "instagram", "linkedin", "youtube", "telegram", "whatsapp"];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [general, setGeneral] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    siteTagline: "",
    aboutText: "",
    siteLogo: "",
    favicon: "",
    footerText: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      telegram: "",
      whatsapp: "",
    },
    homepageCategories: CMS_CATEGORY_KEYS.slice(0, 5),
    featuredSlots: { enabled: false, count: 4 },
    postOrder: "latest",
  });

  const [notifications, setNotifications] = useState({
    newApplication: true,
    weeklyDigest: true,
    emailAlerts: false,
    jobExpiry: true,
  });

  const [profile, setProfile] = useState({ name: "" });
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function loadSettings() {
    setError("");
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load settings.");
      }
      setGeneral({
        siteName: json.settings.siteName,
        contactEmail: json.settings.contactEmail,
        contactPhone: json.settings.contactPhone,
        siteTagline: json.settings.siteTagline,
        aboutText: json.settings.aboutText,
        siteLogo: json.settings.siteLogo,
        favicon: json.settings.favicon,
        footerText: json.settings.footerText,
        socialLinks: {
          facebook: json.settings.socialLinks?.facebook || "",
          twitter: json.settings.socialLinks?.twitter || "",
          instagram: json.settings.socialLinks?.instagram || "",
          linkedin: json.settings.socialLinks?.linkedin || "",
          youtube: json.settings.socialLinks?.youtube || "",
          telegram: json.settings.socialLinks?.telegram || "",
          whatsapp: json.settings.socialLinks?.whatsapp || "",
        },
        homepageCategories: json.settings.homepageCategories || CMS_CATEGORY_KEYS.slice(0, 5),
        featuredSlots: {
          enabled: Boolean(json.settings.featuredSlots?.enabled),
          count: Number(json.settings.featuredSlots?.count) || 4,
        },
        postOrder: json.settings.postOrder || "latest",
      });
      setNotifications(json.settings.notifications);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoaded(true);
    }
  }

  async function loadProfile() {
    try {
      const res = await fetch("/api/admin/profile");
      const json = await res.json();
      if (res.ok) {
        setProfile({ name: json.admin.name || "Admin" });
      }
    } catch {
      // non-blocking
    }
  }

  useEffect(() => {
    loadSettings();
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSetting(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function saveGeneral(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
        body: JSON.stringify(general),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to save settings.");
      }
      showToast("success", json.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveNotifications(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
        body: JSON.stringify({ notifications }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to save preferences.");
      }
      showToast("success", json.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!profile.name.trim() || profile.name.trim().length < 2) {
      showToast("error", "Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update profile.");
      }
      showToast("success", json.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (!pw.currentPassword) {
      showToast("error", "Enter your current password.");
      return;
    }
    if (pw.newPassword.length < 8) {
      showToast("error", "New password must be at least 8 characters.");
      return;
    }
    if (pw.newPassword !== pw.confirmPassword) {
      showToast("error", "New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pw.currentPassword,
          newPassword: pw.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to change password.");
      }
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", json.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    {
      key: "general",
      label: "General",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    },
    {
      key: "security",
      label: "Security",
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    },
  ];

  if (!loaded) {
    return (
      <div className="admin-page">
        <Spinner label="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your site preferences, profile, and security.</p>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
          <button onClick={loadSettings}>Retry</button>
        </div>
      )}

      <div className="admin-settings-layout">
        <div className="admin-settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-settings-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-card admin-settings-content">
          {activeTab === "general" && (
            <form onSubmit={saveGeneral}>
              <h2>General Settings</h2>
              <p className="admin-card-sub">Basic site information</p>

              <div className="admin-form-group">
                <label htmlFor="siteName">Site Name</label>
                <input
                  id="siteName"
                  type="text"
                  value={general.siteName}
                  onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                  placeholder="e.g. JobCareer"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="contactEmail">Contact Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={general.contactEmail}
                    onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                    placeholder="info@example.com"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input
                    id="contactPhone"
                    type="text"
                    value={general.contactPhone}
                    onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="siteTagline">Site Tagline</label>
                <input
                  id="siteTagline"
                  type="text"
                  value={general.siteTagline}
                  onChange={(e) => setGeneral({ ...general, siteTagline: e.target.value })}
                  placeholder="Find your dream job today"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="aboutText">About Text</label>
                <textarea
                  id="aboutText"
                  rows="4"
                  value={general.aboutText}
                  onChange={(e) => setGeneral({ ...general, aboutText: e.target.value })}
                  placeholder="Short description about your site"
                />
              </div>

              <h3 className="t-section-title">Branding</h3>
              <div className="admin-form-row t-row2">
                <div className="admin-form-group">
                  <label htmlFor="siteLogo">Site Logo URL</label>
                  <input
                    id="siteLogo"
                    type="text"
                    value={general.siteLogo}
                    onChange={(e) => setGeneral({ ...general, siteLogo: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../logo.png"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="favicon">Favicon URL</label>
                  <input
                    id="favicon"
                    type="text"
                    value={general.favicon}
                    onChange={(e) => setGeneral({ ...general, favicon: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../favicon.ico"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label htmlFor="footerText">Footer Text</label>
                <textarea
                  id="footerText"
                  rows="2"
                  value={general.footerText}
                  onChange={(e) => setGeneral({ ...general, footerText: e.target.value })}
                  placeholder="Footer copyright / short description"
                />
              </div>

              <h3 className="t-section-title">Social Links</h3>
              <div className="admin-form-row t-row2">
                {SOCIAL_KEYS.map((key) => (
                  <div className="admin-form-group" key={key}>
                    <label htmlFor={`social-${key}`}>{key[0].toUpperCase() + key.slice(1)}</label>
                    <input
                      id={`social-${key}`}
                      type="text"
                      value={general.socialLinks[key] || ""}
                      onChange={(e) =>
                        setGeneral({ ...general, socialLinks: { ...general.socialLinks, [key]: e.target.value } })
                      }
                      placeholder={`https://.../${key}`}
                    />
                  </div>
                ))}
              </div>

              <h3 className="t-section-title">Homepage Sections</h3>
              <p className="admin-card-sub">Choose which categories appear on the public homepage.</p>
              <div className="t-cat-grid">
                {CMS_CATEGORY_KEYS.map((c) => {
                  const active = general.homepageCategories.includes(c);
                  return (
                    <label className={`t-cat-chip ${active ? "active" : ""}`} key={c}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() =>
                          setGeneral({
                            ...general,
                            homepageCategories: active
                              ? general.homepageCategories.filter((x) => x !== c)
                              : [...general.homepageCategories, c].slice(0, 7),
                          })
                        }
                      />
                      {POST_CATEGORY_META[c].plural}
                    </label>
                  );
                })}
              </div>

              <div className="admin-form-row t-row2">
                <div className="admin-form-group">
                  <label htmlFor="postOrder">Post Order</label>
                  <select
                    id="postOrder"
                    value={general.postOrder}
                    onChange={(e) => setGeneral({ ...general, postOrder: e.target.value })}
                  >
                    <option value="latest">Latest first</option>
                    <option value="featured">Featured first</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label htmlFor="featuredCount">Featured Slots</label>
                  <div className="t-inline-row">
                    <select
                      id="featuredCount"
                      value={general.featuredSlots.count}
                      onChange={(e) =>
                        setGeneral({ ...general, featuredSlots: { enabled: true, count: Number(e.target.value) || 4 } })
                      }
                    >
                      {[4, 6, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={general.featuredSlots.enabled}
                        onChange={(e) =>
                          setGeneral({ ...general, featuredSlots: { ...general.featuredSlots, enabled: e.target.checked } })
                        }
                      />
                      <span className="admin-switch-slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={saveNotifications}>
              <h2>Notifications</h2>
              <p className="admin-card-sub">Choose what you want to be notified about</p>

              <div className="admin-toggle-list">
                <div className="admin-toggle-row">
                  <div>
                    <strong>New Application</strong>
                    <span>Get notified when a candidate applies</span>
                  </div>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={notifications.newApplication}
                      onChange={() => toggleSetting("newApplication")}
                    />
                    <span className="admin-switch-slider" />
                  </label>
                </div>

                <div className="admin-toggle-row">
                  <div>
                    <strong>Weekly Digest</strong>
                    <span>Receive a summary of activity every week</span>
                  </div>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyDigest}
                      onChange={() => toggleSetting("weeklyDigest")}
                    />
                    <span className="admin-switch-slider" />
                  </label>
                </div>

                <div className="admin-toggle-row">
                  <div>
                    <strong>Job Expiry Alerts</strong>
                    <span>Remind me when a job listing is about to expire</span>
                  </div>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={notifications.jobExpiry}
                      onChange={() => toggleSetting("jobExpiry")}
                    />
                    <span className="admin-switch-slider" />
                  </label>
                </div>

                <div className="admin-toggle-row">
                  <div>
                    <strong>Promotional Emails</strong>
                    <span>Product updates and offers</span>
                  </div>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={() => toggleSetting("emailAlerts")}
                    />
                    <span className="admin-switch-slider" />
                  </label>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div className="admin-security-tabs">
              <div className="admin-security-block">
                <h2>Profile</h2>
                <p className="admin-card-sub">Update your display name</p>

                <form onSubmit={saveProfile}>
                  <div className="admin-form-group">
                    <label htmlFor="profileName">Display Name</label>
                    <input
                      id="profileName"
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ name: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Name"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="admin-security-block">
                <h2>Change Password</h2>
                <p className="admin-card-sub">Manage password and account security</p>

                <form onSubmit={savePassword}>
                  <div className="admin-form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      value={pw.currentPassword}
                      onChange={(e) =>
                        setPw({ ...pw, currentPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Min 8 characters"
                        value={pw.newPassword}
                        onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Re-enter new password"
                        value={pw.confirmPassword}
                        onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}