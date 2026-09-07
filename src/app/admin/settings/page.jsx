"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [toggles, setToggles] = useState({
    newApplication: true,
    weeklyDigest: true,
    emailAlerts: false,
    jobExpiry: true,
  });

  function toggleSetting(key) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs = [
    { key: "general", label: "General", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { key: "notifications", label: "Notifications", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" },
    { key: "security", label: "Security", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your site preferences and notifications.</p>
        </div>
      </div>

      {saved && (
        <div className="admin-alert admin-alert-success">
          Settings saved successfully!
        </div>
      )}

      <div className="admin-settings-layout">
        {/* Sidebar tabs */}
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

        {/* Content */}
        <div className="admin-card admin-settings-content">
          {activeTab === "general" && (
            <form onSubmit={handleSave}>
              <h2>General Settings</h2>
              <p className="admin-card-sub">Basic site information</p>

              <div className="admin-form-group">
                <label>Site Name</label>
                <input type="text" defaultValue="JobCareer" />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Contact Email</label>
                  <input type="email" defaultValue="info@jobcareer.com" />
                </div>

                <div className="admin-form-group">
                  <label>Contact Phone</label>
                  <input type="text" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Site Tagline</label>
                <input type="text" defaultValue="Find your dream job today" />
              </div>

              <div className="admin-form-group">
                <label>About Text</label>
                <textarea
                  rows="4"
                  defaultValue="JobCareer helps thousands of job seekers connect with top companies and land their dream roles."
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSave}>
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
                      checked={toggles.newApplication}
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
                      checked={toggles.weeklyDigest}
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
                      checked={toggles.jobExpiry}
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
                      checked={toggles.emailAlerts}
                      onChange={() => toggleSetting("emailAlerts")}
                    />
                    <span className="admin-switch-slider" />
                  </label>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSave}>
              <h2>Security</h2>
              <p className="admin-card-sub">Manage password and account security</p>

              <div className="admin-form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>

                <div className="admin-form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}