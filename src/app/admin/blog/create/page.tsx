"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  Upload,
  Clock,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { compressImageToFile } from "@/utils/imageCompressor";
import SEOAnalyzer from "@/components/admin/SEOAnalyzer";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="wp-editor-area" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "var(--wp-text-muted)", fontSize: 13 }}>
      Loading editor...
    </div>
  ),
});

/* ── Main Page ──────────────────────────────────── */
export default function NewArticlePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [status, setStatus] = useState<"Published" | "Draft" | "Scheduled">("Draft");

  // Sidebar panels
  const AUTHORS = [
    { name: "Dr. James Carter", initials: "JC", bg: "#1e40af" },
    { name: "Dr. Elena Vasquez", initials: "EV", bg: "#6b21a8" },
    { name: "Dr. Marcus Webb", initials: "MW", bg: "#065f46" },
    { name: "Dr. Sarah Kim", initials: "SK", bg: "#b45309" },
  ];
  const [author, setAuthor] = useState("Dr. Marcus Webb");
  const [authorInitials, setAuthorInitials] = useState("MW");
  const [authorBg, setAuthorBg] = useState("#065f46");
  const [authorPanel, setAuthorPanel] = useState(true);

  const handleAuthorChange = (name: string) => {
    setAuthor(name);
    const selected = AUTHORS.find((a) => a.name === name);
    if (selected) {
      setAuthorInitials(selected.initials);
      setAuthorBg(selected.bg);
    }
  };

  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [category, setCategory] = useState("Uncategorized");
  const [categoriesList, setCategoriesList] = useState<string[]>([
    "Uncategorized", "Classical Mechanics", "Thermodynamics", "Waves & Optics", "Electromagnetism", "Kinematics", "Modern Physics"
  ]);
  const [newCatInput, setNewCatInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [publishPanel, setPublishPanel] = useState(true);
  const [categoryPanel, setCategoryPanel] = useState(true);
  const [featuredPanel, setFeaturedPanel] = useState(true);
  const [seoMetaPanel, setSeoMetaPanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [focusTopic, setFocusTopic] = useState("");
  const [seoPanel, setSeoPanel] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const DRAFT_KEY = "sa_create_draft_v1";

  // Load categories
  useEffect(() => {
    const saved = localStorage.getItem("sa_categories_list_v3");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const names = parsed.map((c: any) => c.name || c);
          if (!names.includes("Uncategorized")) {
            names.unshift("Uncategorized");
          }
          setCategoriesList(names);
          return;
        }
      } catch (err) {
        console.error("Failed to parse categories:", err);
      }
    }
    // Fallback if not saved or empty
    const names = ["Uncategorized", "Classical Mechanics", "Thermodynamics", "Waves & Optics", "Electromagnetism", "Kinematics", "Modern Physics"];
    setCategoriesList(names);
  }, []);

  // Auto-save draft to localStorage (3s debounce)
  useEffect(() => {
    if (!title && !content && !slug) return; // nothing to save yet
    setAutoSaveStatus("idle");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        const draft = { title, slug, content, category, featuredImage, metaTitle, metaDescription, excerpt, focusTopic, author, authorInitials, authorBg, savedAt: new Date().toISOString() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      } catch {
        // Silently ignore storage errors
      }
    }, 3000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [title, slug, content, category, featuredImage, metaTitle, metaDescription, excerpt, focusTopic, author, authorInitials, authorBg]);

  // Restore draft on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.title) setTitle(draft.title);
        if (draft.slug) setSlug(draft.slug);
        if (draft.content) setContent(draft.content);
        if (draft.category) setCategory(draft.category);
        if (draft.featuredImage) setFeaturedImage(draft.featuredImage);
        if (draft.metaTitle) setMetaTitle(draft.metaTitle);
        if (draft.metaDescription) setMetaDescription(draft.metaDescription);
        if (draft.excerpt) setExcerpt(draft.excerpt);
        if (draft.focusTopic) setFocusTopic(draft.focusTopic);
        if (draft.author) setAuthor(draft.author);
        if (draft.authorInitials) setAuthorInitials(draft.authorInitials);
        if (draft.authorBg) setAuthorBg(draft.authorBg);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategory = () => {
    const name = newCatInput.trim();
    if (!name) return;

    // Check if category already exists (case-insensitive)
    const exists = categoriesList.some((c) => c.toLowerCase() === name.toLowerCase());
    if (exists) {
      const existingName = categoriesList.find((c) => c.toLowerCase() === name.toLowerCase()) || name;
      setCategory(existingName);
      setNewCatInput("");
      return;
    }

    const updatedList = [...categoriesList, name];
    setCategoriesList(updatedList);
    setCategory(name);

    // Save to localStorage
    const saved = localStorage.getItem("sa_categories_list_v3");
    let fullCats = [];
    if (saved) {
      try {
        fullCats = JSON.parse(saved);
      } catch (e) {}
    }
    if (!Array.isArray(fullCats) || fullCats.length === 0) {
      fullCats = [
        { id: 1, name: "Classical Mechanics", slug: "classical-mechanics", count: 0, description: "Newtonian dynamics, forces, motion, and gravity" },
        { id: 2, name: "Thermodynamics", slug: "thermodynamics", count: 0, description: "Heat, temperature, entropy, and energy systems" },
        { id: 3, name: "Waves & Optics", slug: "waves-optics", count: 0, description: "Wave propagation, acoustics, light, and refraction" },
        { id: 4, name: "Electromagnetism", slug: "electromagnetism", count: 0, description: "Electric charges, magnetic fields, and circuits" },
        { id: 5, name: "Kinematics", slug: "kinematics", count: 0, description: "Motion of points, bodies, and equations of motion" },
        { id: 6, name: "Modern Physics", slug: "modern-physics", count: 0, description: "Quantum mechanics, relativity, and atomic physics" }
      ];
    }
    const catExistsInSaved = fullCats.some((c: any) => (c.name || c).toLowerCase() === name.toLowerCase());
    if (!catExistsInSaved) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const newCatObj = {
        id: Date.now(),
        name,
        slug,
        count: 0,
        description: "",
      };
      fullCats.push(newCatObj);
      localStorage.setItem("sa_categories_list_v3", JSON.stringify(fullCats));
    }
    setNewCatInput("");
  };


  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);


  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSave = async (status: "Published" | "Draft" | "Scheduled", date?: string) => {
    if (!title.trim()) { showNotice("error", "Please add a title before publishing."); return; }
    if (!slug.trim()) { showNotice("error", "Please add a permalink/slug before saving."); return; }
    if (featuredImage && featuredImage.startsWith("blob:")) {
      showNotice("error", "Featured image is still uploading. Please wait.");
      return;
    }
    if (content && content.includes("blob:")) {
      showNotice("error", "One or more images in the content are still uploading. Please wait.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title, slug, content,
        heroImage: featuredImage,
        category,
        author,
        authorInitials,
        authorBg,
        status,
        scheduledDate: date || scheduledDate,
        date: status === "Scheduled"
          ? (date || scheduledDate)
          : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        metaTitle, metaDescription, excerpt,
      };
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }
      showNotice("success", `Post ${status.toLowerCase()} successfully!`);
      setStatus(status);
      // Clear draft after successful publish
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setTimeout(() => router.push("/admin/blog"), 1500);
    } catch (err: any) {
      showNotice("error", err.message || "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedFile = await compressImageToFile(file);
      setFeaturedImage(URL.createObjectURL(compressedFile));
      const fd = new FormData();
      fd.append("file", compressedFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      if (data.url) {
        setFeaturedImage(data.url);
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (err: any) {
      showNotice("error", err.message || "Failed to upload image.");
      setFeaturedImage(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="wp-animate-in">
      {/* Notice */}
      {notice && (
        <div className={`wp-notice ${notice.type === "success" ? "wp-notice--success" : "wp-notice--error"}`}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          {notice.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {notice.message}
          <button onClick={() => setNotice(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="wp-box" style={{ width: 340, padding: 0 }}>
            <div className="wp-box-header">
              <h3 className="wp-box-title">Schedule Post</h3>
              <button onClick={() => setScheduleOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--wp-text-muted)" }}>
                <X size={16} />
              </button>
            </div>
            <div className="wp-box-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--wp-text-muted)" }}>Select date and time to publish this post.</p>
              <input
                type="datetime-local"
                className="wp-input"
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="wp-btn wp-btn-primary"
                  disabled={!scheduledDate || isSubmitting || uploading}
                  onClick={() => { if (scheduledDate) { handleSave("Scheduled", scheduledDate); setScheduleOpen(false); } }}
                >
                  Schedule
                </button>
                <button className="wp-btn wp-btn-secondary" onClick={() => setScheduleOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="wp-page-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 className="wp-page-title">Add New Post</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--wp-text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, background: "#00a32a", borderRadius: "50%", display: "inline-block" }} />
            {wordCount} words · {readTime} min read
          </div>
          {autoSaveStatus === "saving" && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#94a3b8" }}>
              <Loader2 size={11} className="animate-spin" /> Saving draft…
            </span>
          )}
          {autoSaveStatus === "saved" && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontWeight: 600 }}>
              <CheckCircle2 size={11} /> Draft saved
            </span>
          )}
        </div>
      </div>

      {/* Editor Layout */}
      <div className="wp-editor-layout">
        {/* Main Editor */}
        <div className="wp-editor-main">
          {/* Title */}
          <input
            type="text"
            className="wp-title-input"
            placeholder="Add title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <div className="wp-slug-row" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--wp-text-muted)", marginTop: 8 }}>
            <span className="wp-slug-label" style={{ fontWeight: 600 }}>Permalink:</span>
            <span>physicsfundamentals.cc/blog/</span>
            <input
              type="text"
              className="wp-input"
              style={{ width: "auto", minWidth: 200, padding: "2px 6px", height: "auto", fontSize: 13, display: "inline-block" }}
              placeholder="post-url-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, ""))}
            />
          </div>

          {/* Editor */}
          <div className="wp-editor-area">
            <RichTextEditor
              content={content}
              onChange={setContent}
              title={title}
              setTitle={setTitle}
              slug={slug}
              setSlug={setSlug}
              hideTitle
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="wp-editor-sidebar">

          {/* Publish Box */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setPublishPanel(!publishPanel)}>
              <h3 className="wp-metabox-title">Publish</h3>
              <ChevronDown size={14} style={{ transform: publishPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {publishPanel && (
              <div className="wp-metabox-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--wp-text-muted)" }}>Status:</span>
                    <span style={{ fontWeight: 600 }}>{status}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--wp-text-muted)" }}>Visibility:</span>
                    <span style={{ fontWeight: 600 }}>Public</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={13} style={{ color: "var(--wp-text-muted)" }} />
                    <span style={{ color: "var(--wp-text-muted)" }}>Publish:</span>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>Immediately</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--wp-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    <button
                      className="wp-btn wp-btn-secondary wp-btn-sm"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => handleSave("Draft")}
                      disabled={isSubmitting || uploading}
                    >
                      {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Save Draft
                    </button>
                    <button 
                      className="wp-btn wp-btn-secondary wp-btn-sm" 
                      style={{ flex: 1, justifyContent: "center" }}
                      disabled
                    >
                      <Eye size={12} />
                      Preview
                    </button>
                  </div>
                  <button
                    className="wp-btn wp-btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "8px 14px" }}
                    onClick={() => handleSave("Published")}
                    disabled={isSubmitting || uploading}
                  >
                    {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : null}
                    Publish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setCategoryPanel(!categoryPanel)}>
              <h3 className="wp-metabox-title">Categories</h3>
              <ChevronDown size={14} style={{ transform: categoryPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {categoryPanel && (
              <div className="wp-metabox-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                  {categoriesList.map((cat) => (
                    <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ accentColor: "var(--wp-blue)" }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
                <hr style={{ margin: "10px 0", borderColor: "var(--wp-border)" }} />
                <details style={{ fontSize: 12 }}>
                  <summary style={{ cursor: "pointer", color: "var(--wp-blue)", userSelect: "none" }}>+ Add New Category</summary>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      type="text"
                      className="wp-input"
                      placeholder="New category name"
                      style={{ fontSize: 12 }}
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <button
                      className="wp-btn wp-btn-secondary wp-btn-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddCategory();
                      }}
                    >
                      Add
                    </button>
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* Author Selection */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setAuthorPanel(!authorPanel)}>
              <h3 className="wp-metabox-title">Author</h3>
              <ChevronDown size={14} style={{ transform: authorPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {authorPanel && (
              <div className="wp-metabox-body">
                <select
                  value={author}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  className="wp-input"
                  style={{ width: "100%", fontSize: 13, padding: "6px 10px", appearance: "none", cursor: "pointer" }}
                >
                  {AUTHORS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    backgroundColor: authorBg, color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: "bold"
                  }}>
                    {authorInitials}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--wp-text-muted)" }}>
                    Selected Author
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setFeaturedPanel(!featuredPanel)}>
              <h3 className="wp-metabox-title">Featured Image</h3>
              <ChevronDown size={14} style={{ transform: featuredPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {featuredPanel && (
              <div className="wp-metabox-body">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} style={{ display: "none" }} />
                {featuredImage ? (
                  <div>
                    <div className="wp-img-preview">
                      <img src={featuredImage} alt="Featured" />
                    </div>
                    {uploading && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--wp-text-muted)", marginTop: 6 }}>
                        <Loader2 size={12} className="animate-spin" /> Uploading...
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <button className="wp-btn wp-btn-secondary wp-btn-sm" onClick={() => fileRef.current?.click()}>
                        Replace image
                      </button>
                      <button
                        className="wp-btn wp-btn-sm"
                        style={{ color: "var(--wp-red)", border: "1px solid var(--wp-border)", background: "white" }}
                        onClick={() => setFeaturedImage(null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="wp-img-upload" onClick={() => fileRef.current?.click()}>
                      <Upload size={24} style={{ color: "var(--wp-text-muted)", margin: "0 auto", display: "block" }} />
                      <p className="wp-img-upload-text">Click to set featured image</p>
                      <p style={{ fontSize: 11, color: "var(--wp-text-muted)", marginTop: 4 }}>WebP, JPG, PNG — max 5 MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEO Meta */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setSeoMetaPanel(!seoMetaPanel)}>
              <h3 className="wp-metabox-title">SEO Settings</h3>
              <ChevronDown size={14} style={{ transform: seoMetaPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {seoMetaPanel && (
              <div className="wp-metabox-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* SERP Preview */}
                <div style={{ border: "1px solid var(--wp-border)", borderRadius: 4, padding: "10px 12px", background: "#f6f7f7" }}>
                  <p style={{ fontSize: 10, color: "var(--wp-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>SERP Preview</p>
                  <p style={{ color: "#1a0dab", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{metaTitle || title || "Post title"}</p>
                  <p style={{ color: "#006621", fontSize: 11, marginBottom: 3 }}>physicsfundamentals.cc › blog › {slug || "permalink"}</p>
                  <p style={{ color: "#545454", fontSize: 12, lineHeight: 1.4 }}>{metaDescription || "Meta description will appear here..."}</p>
                </div>

                <div className="wp-form-row" style={{ marginBottom: 0 }}>
                  <label className="wp-label">Meta Title</label>
                  <input type="text" className="wp-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO title" />
                  <p className="wp-input-note">{metaTitle.length} / 60 characters</p>
                </div>
                <div className="wp-form-row" style={{ marginBottom: 0 }}>
                  <label className="wp-label">Meta Description</label>
                  <textarea className="wp-textarea" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Search result description" />
                  <p className="wp-input-note">{metaDescription.length} / 160 characters</p>
                </div>
                <div className="wp-form-row" style={{ marginBottom: 0 }}>
                  <label className="wp-label">Excerpt</label>
                  <textarea className="wp-textarea" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short post summary" />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="wp-metabox">
            <div className="wp-metabox-header">
              <h3 className="wp-metabox-title">Post Details</h3>
            </div>
            <div className="wp-metabox-body">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wp-text-muted)" }}>Word count</span>
                  <span style={{ fontWeight: 600 }}>{wordCount.toLocaleString()}</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wp-text-muted)" }}>Reading time</span>
                  <span style={{ fontWeight: 600 }}>{readTime} min</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--wp-text-muted)" }}>Category</span>
                  <span style={{ fontWeight: 600 }}>{category}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SEO Analyzer */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => setSeoPanel(!seoPanel)}>
              <h3 className="wp-metabox-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, background: "#2271b1", color: "white", padding: "1px 6px", borderRadius: 10, fontWeight: 700, letterSpacing: "0.04em" }}>SEO</span>
                Analysis
              </h3>
              <ChevronDown size={14} style={{ transform: seoPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }} />
            </div>
            {seoPanel && (
              <div className="wp-metabox-body">
                <SEOAnalyzer
                  title={title}
                  content={content}
                  slug={slug}
                  metaTitle={metaTitle}
                  metaDescription={metaDescription}
                  excerpt={excerpt}
                  focusTopic={focusTopic}
                  onFocusTopicChange={setFocusTopic}
                  featuredImage={featuredImage}
                />
              </div>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}
