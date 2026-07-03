"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldAlert,
  Sliders,
  Eye,
  MessageSquare,
  Key,
  Save,
  Check,
  RotateCcw,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "writing" | "reading" | "discussion" | "security">("general");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // General Settings
  const [siteTitle, setSiteTitle] = useState("PhysicsLab");
  const [siteTagline, setSiteTagline] = useState("Interactive Physics Simulations & Visual Learning");
  const [siteUrl, setSiteUrl] = useState("https://physicsfundamentals.cc");
  const [adminEmail, setAdminEmail] = useState("admin@physicsfundamentals.cc");
  const [timezone, setTimezone] = useState("UTC+0");

  // Writing Settings
  const [defaultCategory, setDefaultCategory] = useState("Classical Mechanics");
  const [excerptLength, setExcerptLength] = useState(150);

  // Reading Settings
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [discourageSearch, setDiscourageSearch] = useState(false);

  // Discussion Settings
  const [allowComments, setAllowComments] = useState(true);
  const [requireModeration, setRequireModeration] = useState(false);
  const [blacklist, setBlacklist] = useState("spam, buy cheap, click here");

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load from local storage
  useEffect(() => {
    const title = localStorage.getItem("settings_site_title");
    const tagline = localStorage.getItem("settings_site_tagline");
    const url = localStorage.getItem("settings_site_url");
    const email = localStorage.getItem("settings_admin_email");
    const tz = localStorage.getItem("settings_timezone");
    
    const dCat = localStorage.getItem("settings_default_category");
    const exLen = localStorage.getItem("settings_excerpt_length");
    
    const pPage = localStorage.getItem("settings_posts_per_page");
    const dSearch = localStorage.getItem("settings_discourage_search");
    
    const aComm = localStorage.getItem("settings_allow_comments");
    const rMod = localStorage.getItem("settings_require_moderation");
    const bList = localStorage.getItem("settings_blacklist");

    if (title) setSiteTitle(title);
    if (tagline) setSiteTagline(tagline);
    if (url) setSiteUrl(url);
    if (email) setAdminEmail(email);
    if (tz) setTimezone(tz);

    if (dCat) setDefaultCategory(dCat);
    if (exLen) setExcerptLength(parseInt(exLen));

    if (pPage) setPostsPerPage(parseInt(pPage));
    if (dSearch) setDiscourageSearch(dSearch === "true");

    if (aComm) setAllowComments(aComm === "true");
    if (rMod) setRequireModeration(rMod === "true");
    if (bList) setBlacklist(bList);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem("settings_site_title", siteTitle);
      localStorage.setItem("settings_site_tagline", siteTagline);
      localStorage.setItem("settings_site_url", siteUrl);
      localStorage.setItem("settings_admin_email", adminEmail);
      localStorage.setItem("settings_timezone", timezone);
      
      localStorage.setItem("settings_default_category", defaultCategory);
      localStorage.setItem("settings_excerpt_length", excerptLength.toString());
      
      localStorage.setItem("settings_posts_per_page", postsPerPage.toString());
      localStorage.setItem("settings_discourage_search", discourageSearch.toString());
      
      localStorage.setItem("settings_allow_comments", allowComments.toString());
      localStorage.setItem("settings_require_moderation", requireModeration.toString());
      localStorage.setItem("settings_blacklist", blacklist);

      setSaving(false);
      triggerToast("Configuration settings updated successfully!");
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert("Please enter your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      triggerToast("Administrator password updated successfully!");
    }, 1200);
  };

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset all settings to default values?")) return;
    
    setSiteTitle("PhysicsLab");
    setSiteTagline("Interactive Physics Simulations & Visual Learning");
    setSiteUrl("https://physicsfundamentals.cc");
    setAdminEmail("admin@physicsfundamentals.cc");
    setTimezone("UTC+0");
    setDefaultCategory("Classical Mechanics");
    setExcerptLength(150);
    setPostsPerPage(10);
    setDiscourageSearch(false);
    setAllowComments(true);
    setRequireModeration(false);
    setBlacklist("spam, buy cheap, click here");

    localStorage.removeItem("settings_site_title");
    localStorage.removeItem("settings_site_tagline");
    localStorage.removeItem("settings_site_url");
    localStorage.removeItem("settings_admin_email");
    localStorage.removeItem("settings_timezone");
    localStorage.removeItem("settings_default_category");
    localStorage.removeItem("settings_excerpt_length");
    localStorage.removeItem("settings_posts_per_page");
    localStorage.removeItem("settings_discourage_search");
    localStorage.removeItem("settings_allow_comments");
    localStorage.removeItem("settings_require_moderation");
    localStorage.removeItem("settings_blacklist");

    triggerToast("Settings reset to defaults.");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="wp-animate-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "var(--wp-sidebar-bg)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "var(--radius-card)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontSize: 13,
            fontWeight: 500,
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--wp-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={12} color="white" />
          </div>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="wp-page-header">
        <div>
          <h1 className="wp-page-title">Settings</h1>
          <p style={{ fontSize: 12, color: "var(--wp-text-muted)", marginTop: 4 }}>
            Manage core configuration variables, content rules, and security profiles.
          </p>
        </div>
      </div>

      {/* Settings Layout with Sidebar Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "flex-start" }}>
        
        {/* Navigation Sidebar */}
        <div className="wp-box" style={{ padding: "6px 0" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { id: "general", label: "General Settings", icon: Settings },
              { id: "writing", label: "Writing Defaults", icon: Sliders },
              { id: "reading", label: "Reading & SEO", icon: Eye },
              { id: "discussion", label: "Discussion", icon: MessageSquare },
              { id: "security", label: "Security & Pass", icon: Key },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: active ? "var(--wp-blue-light)" : "transparent",
                      color: active ? "var(--wp-blue-dark)" : "var(--wp-text)",
                      textAlign: "left",
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      borderLeft: active ? "3px solid var(--wp-blue)" : "3px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <tab.icon size={15} style={{ opacity: active ? 1 : 0.6 }} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content Box */}
        <div className="wp-box" style={{ minHeight: 400 }}>
          <div className="wp-box-header" style={{ borderBottom: "1px solid var(--wp-border)", padding: "16px 20px" }}>
            <h2 className="wp-box-title" style={{ fontSize: 15, textTransform: "capitalize" }}>
              {activeTab} Configuration Settings
            </h2>
          </div>
          
          <div className="wp-box-body" style={{ padding: 24 }}>
            {activeTab !== "security" ? (
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* GENERAL SETTINGS */}
                {activeTab === "general" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Site Title</label>
                      <input
                        type="text"
                        required
                        className="wp-input"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Tagline</label>
                      <div>
                        <input
                          type="text"
                          className="wp-input"
                          value={siteTagline}
                          onChange={(e) => setSiteTagline(e.target.value)}
                          style={{ width: "100%" }}
                        />
                        <span style={{ display: "block", fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>
                          In a few words, explain what this site is about.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Site URL</label>
                      <input
                        type="url"
                        required
                        className="wp-input"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Admin Email Address</label>
                      <div>
                        <input
                          type="email"
                          required
                          className="wp-input"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                        <span style={{ display: "block", fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>
                          This address is used for admin purposes, like notification updates.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Timezone</label>
                      <select
                        className="wp-select"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        style={{ width: "fit-content" }}
                      >
                        <option value="UTC-5">UTC-5 (EST)</option>
                        <option value="UTC+0">UTC+0 (GMT)</option>
                        <option value="UTC+1">UTC+1 (CET)</option>
                        <option value="UTC+5">UTC+5 (PKT)</option>
                        <option value="UTC+8">UTC+8 (SGT)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* WRITING SETTINGS */}
                {activeTab === "writing" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Default Post Category</label>
                      <select
                        className="wp-select"
                        value={defaultCategory}
                        onChange={(e) => setDefaultCategory(e.target.value)}
                        style={{ width: "fit-content" }}
                      >
                        <option>Classical Mechanics</option>
                        <option>Thermodynamics</option>
                        <option>Electromagnetism</option>
                        <option>Quantum Physics</option>
                        <option>Uncategorized</option>
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Excerpt Character Limit</label>
                      <div>
                        <input
                          type="number"
                          required
                          min={50}
                          max={500}
                          className="wp-input"
                          value={excerptLength}
                          onChange={(e) => setExcerptLength(parseInt(e.target.value) || 150)}
                          style={{ width: 100 }}
                        />
                        <span style={{ display: "block", fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>
                          Maximum characters to generate automatically for summary excerpts.
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* READING SETTINGS */}
                {activeTab === "reading" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Blog Posts Per Page</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={50}
                        className="wp-input"
                        value={postsPerPage}
                        onChange={(e) => setPostsPerPage(parseInt(e.target.value) || 10)}
                        style={{ width: 100 }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "flex-start", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)", paddingTop: 4 }}>Search Engine Visibility</label>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <input
                          type="checkbox"
                          id="discourage"
                          className="wp-checkbox"
                          checked={discourageSearch}
                          onChange={(e) => setDiscourageSearch(e.target.checked)}
                          style={{ marginTop: 4 }}
                        />
                        <label htmlFor="discourage" style={{ fontSize: 13, color: "var(--wp-text)" }}>
                          Discourage search engines from indexing this site
                          <span style={{ display: "block", fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>
                            It is up to search engines to honor this request.
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* DISCUSSION SETTINGS */}
                {activeTab === "discussion" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "flex-start", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Article Comments</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          id="allowComm"
                          className="wp-checkbox"
                          checked={allowComments}
                          onChange={(e) => setAllowComments(e.target.checked)}
                        />
                        <label htmlFor="allowComm" style={{ fontSize: 13 }}>Allow people to submit comments on new posts</label>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "flex-start", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Comment Moderation</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          id="reqMod"
                          className="wp-checkbox"
                          checked={requireModeration}
                          onChange={(e) => setRequireModeration(e.target.checked)}
                        />
                        <label htmlFor="reqMod" style={{ fontSize: 13 }}>Comments must be manually approved by administrator</label>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "flex-start", gap: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)", paddingTop: 4 }}>Keyword Blacklist</label>
                      <div>
                        <textarea
                          className="wp-textarea"
                          rows={4}
                          value={blacklist}
                          onChange={(e) => setBlacklist(e.target.value)}
                          placeholder="spam, advertise, url..."
                          style={{ width: "100%" }}
                        />
                        <span style={{ display: "block", fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>
                          When a comment contains any of these words in its content, it will be automatically marked as spam.
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Bottom buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--wp-border)" }}>
                  <button
                    type="submit"
                    className="wp-btn wp-btn-primary"
                    disabled={saving}
                    style={{ gap: 8 }}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="wp-btn wp-btn-secondary"
                    onClick={handleReset}
                    disabled={saving}
                    style={{ gap: 8 }}
                  >
                    <RotateCcw size={14} />
                    Reset to Defaults
                  </button>
                </div>
              </form>
            ) : (
              /* SECURITY SETTINGS */
              <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Current Password</label>
                  <input
                    type="password"
                    required
                    className="wp-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>New Password</label>
                  <input
                    type="password"
                    required
                    className="wp-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--wp-text)" }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="wp-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--wp-border)" }}>
                  <button
                    type="submit"
                    className="wp-btn wp-btn-primary"
                    disabled={saving}
                    style={{ gap: 8 }}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Update Administrator Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
