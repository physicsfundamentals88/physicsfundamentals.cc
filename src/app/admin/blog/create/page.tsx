"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  Send,
  ChevronDown,
  Calendar,
  X,
  Plus,
  ChevronRight,
  Bell,
  Upload,
  Clock,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-slate-50 border border-slate-200 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 text-sm font-bold">
      Loading block editor...
    </div>
  ),
});

const sidebarTabs = ["Post Settings", "SEO"];

const AUTHORS = [
  { name: "Sarah Jenkins", role: "Physicist", avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0F172A&color=fff" },
  { name: "Marcus Thorne", role: "Science Writer", avatar: "https://ui-avatars.com/api/?name=Marcus+Thorne&background=FACC15&color=0F172A" },
  { name: "Dr. Elena Rossi", role: "Researcher", avatar: "https://ui-avatars.com/api/?name=Elena+Rossi&background=3b82f6&color=fff" },
  { name: "John Doe", role: "Admin", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=E2E8F0&color=0F172A" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [activeTab, setActiveTab] = useState("Post Settings");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  // SEO & Content state
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [category, setCategory] = useState("Uncategorized");
  const [author, setAuthor] = useState(AUTHORS[0]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [siteName, setSiteName] = useState("Physics Blog");
  const [siteDescription, setSiteDescription] = useState("Exploring the Universe through Physics");

  // Sync title to meta title if empty
  useEffect(() => {
    if (!metaTitle) setMetaTitle(title);
  }, [title]);

  // Auto-generate excerpt & meta description from content
  useEffect(() => {
    if (content) {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      const generated = plainText.substring(0, 155) + (plainText.length > 155 ? "..." : "");
      if (!metaDescription) setMetaDescription(generated);
      if (!excerpt) setExcerpt(generated);
    }
  }, [content]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (status: "Published" | "Draft" | "Scheduled", date?: string) => {
    if (!title) {
       showNotification("error", "Please enter a title before saving.");
       return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        content,
        heroImage: featuredImage,
        category,
        author: author.name,
        authorInitials: author.name.split(" ").map(n => n[0]).join(""),
        authorBg: "#0F172A",
        status,
        scheduledDate: date || scheduledDate,
        date: status === "Scheduled" ? (date || scheduledDate) : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        metaTitle,
        metaDescription,
        excerpt,
        siteName,
      };

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save article");
      }

      showNotification("success", `Post ${status.toLowerCase()} successfully!`);
      setTimeout(() => router.push("/admin/blog"), 1500);
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] -m-8 lg:-m-12 relative font-sans">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up ${
          notification.type === "success" ? "bg-[#0F172A] text-white" : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="text-[#FACC15]" size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-black tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-[#0F172A]">Schedule Post</h3>
                        <button onClick={() => setScheduleOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-400">Select a date and time to automatically publish this article.</p>
                        <input 
                            type="datetime-local" 
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#3b82f6] transition-all"
                            onChange={(e) => setScheduledDate(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            if (!scheduledDate) return;
                            handleSave("Scheduled", scheduledDate);
                            setScheduleOpen(false);
                        }}
                        disabled={!scheduledDate || isSubmitting}
                        className="w-full py-4 bg-[#3b82f6] text-white rounded-2xl font-black text-sm hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-[45] bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between h-[68px]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2.5">
          <Link href="/admin" className="text-sm font-bold text-slate-400 hover:text-[#0F172A] transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <Link href="/admin/blog" className="text-sm font-bold text-slate-400 hover:text-[#0F172A] transition-colors">
            Posts
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-sm font-black text-[#0F172A]">Create Post</span>
        </div>

        {/* Centered autosave */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">Live Editor</span>
          <div className="w-px h-3 bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-[#0F172A] hover:bg-slate-50 transition-all shadow-sm">
            <Eye size={16} /> Preview
          </button>
          
          <div className="relative group">
            <div className="flex items-center overflow-hidden rounded-xl shadow-lg shadow-blue-500/20">
              <button 
                onClick={() => handleSave("Published")}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white font-black text-sm hover:bg-[#2563eb] transition-all border-r border-[#ffffff20] disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="rotate-45" />} 
                Publish Now
              </button>
              <button className="px-2.5 py-2.5 bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all dropdown-toggle">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5 translate-y-2 group-hover:translate-y-0">
               <button 
                onClick={() => handleSave("Draft")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-all"
               >
                  <Save size={16} className="text-blue-500" /> Save as Draft
               </button>
               <button 
                onClick={() => setScheduleOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-all"
               >
                  <Calendar size={16} className="text-amber-500" /> Schedule Post...
               </button>
               <div className="h-px bg-slate-100 my-1 mx-2" />
               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all" onClick={() => router.push("/admin/blog")}>
                  <X size={16} /> Discard Changes
               </button>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-200 ml-2" />
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 ring-[#FACC15] ring-offset-2 transition-all">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=FACC15&color=0F172A"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── Body: Editor + Sidebar ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Main editor — fluid ── */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-16 py-16">
            <RichTextEditor 
               content={content} 
               onChange={setContent}
               title={title}
               setTitle={setTitle}
               slug={slug}
               setSlug={setSlug}
            />
          </div>
        </div>

        {/* ── Right Sidebar — 20% ── */}
        <aside className="w-[20%] min-w-[240px] border-l border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sticky top-[68px] h-[calc(100vh-68px)]">
          <div className="flex border-b border-slate-100 px-4 pt-5">
            {sidebarTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-3.5 text-[11px] font-black uppercase tracking-widest relative transition-all
                  ${activeTab === tab ? "text-[#3b82f6]" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-5 space-y-8 overflow-y-auto">
            {activeTab === "Post Settings" && (
                <PostSettingsPanel 
                  featuredImage={featuredImage} 
                  setFeaturedImage={setFeaturedImage}
                  category={category}
                  setCategory={setCategory}
                  author={author}
                  setAuthor={setAuthor}
                  content={content}
                />
            )}
            {activeTab === "SEO" && (
              <SEOPanel 
                content={content} 
                title={title} 
                slug={slug}
                metaTitle={metaTitle}
                setMetaTitle={setMetaTitle}
                metaDescription={metaDescription}
                setMetaDescription={setMetaDescription}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                siteName={siteName}
                setSiteName={setSiteName}
                siteDescription={siteDescription}
                setSiteDescription={setSiteDescription}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Image Compression Helper ────────────────── */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/* ─── Post Settings ─────────────────────────────── */
function PostSettingsPanel({ featuredImage, setFeaturedImage, category, setCategory, author, setAuthor, content }: any) {
  const [uploading, setUploading] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const preview = URL.createObjectURL(compressedBlob);
      setFeaturedImage(preview);
      const fd = new FormData();
      fd.append("file", compressedBlob, file.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setFeaturedImage(data.url);
    } catch {
      const preview = URL.createObjectURL(file);
      setFeaturedImage(preview);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <>
      <div className="space-y-3">
        <SectionLabel>Featured Image</SectionLabel>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} />

        {featuredImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/10]">
            <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
            {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="text-white animate-spin" size={24} />
                </div>
            )}
            <button
              onClick={() => setFeaturedImage(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-[16/10] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#3b82f6] hover:bg-blue-50/30 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#3b82f6] group-hover:scale-110 transition-all">
              <Upload size={20} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest">Click to upload</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">JPG, PNG, WebP — max 5 MB</p>
            </div>
          </button>
        )}

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] font-black text-[#0F172A] uppercase tracking-widest hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all"
        >
          <Upload size={13} /> {featuredImage ? "Change Image" : "Select Image"}
        </button>
      </div>

      <SidebarSelect label="Category" value={category} />
      
      {/* Author Dropdown */}
      <div className="space-y-2 relative">
          <SectionLabel>Author</SectionLabel>
          <button 
            onClick={() => setAuthorOpen(!authorOpen)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-[#0F172A] leading-tight">{author.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{author.role}</p>
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${authorOpen ? "rotate-180" : ""}`} />
          </button>

          {authorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl z-[60] p-1.5 animate-slide-up">
                {AUTHORS.map((a) => (
                    <button 
                        key={a.name}
                        onClick={() => { setAuthor(a); setAuthorOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <img src={a.avatar} className="w-8 h-8 rounded-full border border-slate-200" />
                        <div className="text-left">
                            <p className="text-sm font-black text-[#0F172A] leading-tight">{a.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role}</p>
                        </div>
                    </button>
                ))}
            </div>
          )}
      </div>

      <div className="space-y-2">
        <SectionLabel>Publish Date</SectionLabel>
        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-all text-slate-400 text-sm font-bold">
          <Calendar size={16} /> <span>Automatic (on publish)</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
        <MetricCard icon={<Clock size={15} />} value={`${readTime} min read`} label="Reading Time" />
        <MetricCard icon={<FileText size={15} />} value={wordCount.toLocaleString()} label="Words" />
      </div>
    </>
  );
}

/* ─── SEO Panel ─────────────────────────────────── */
function SEOPanel({ 
  content, title, slug, 
  metaTitle, setMetaTitle, 
  metaDescription, setMetaDescription, 
  excerpt, setExcerpt,
  siteName, setSiteName,
  siteDescription, setSiteDescription
}: any) {
  return (
    <div className="space-y-6">
      {/* SERP Preview */}
      <div className="space-y-3">
        <SectionLabel>Google SERP Preview</SectionLabel>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#F8FAFC] border border-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">P</div>
            <div className="flex flex-col">
               <span className="text-[12px] text-[#1a0dab] font-medium leading-none">{siteName}</span>
               <span className="text-[11px] text-[#4d5156] leading-tight">yourdomain.com › blog › {slug || "permalink"}</span>
            </div>
          </div>
          <h3 className="text-[18px] text-[#1a0dab] font-medium hover:underline cursor-pointer leading-tight">
            {metaTitle || title || "Article Title"}
          </h3>
          <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
            <span className="text-[#70757a]">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — </span>
            {metaDescription || "Start writing to see your meta description appear here..."}
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="space-y-2">
        <SectionLabel>Site Name</SectionLabel>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          placeholder="e.g. Physics Blog"
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#3b82f6] outline-none"
        />
      </div>

      <div className="space-y-2">
        <SectionLabel>Site Description</SectionLabel>
        <textarea
          rows={2}
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          placeholder="General site description..."
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <SectionLabel>SEO Meta Title</SectionLabel>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Title for search"
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#3b82f6] outline-none"
        />
        <p className="text-[10px] text-slate-400 font-bold text-right">{metaTitle.length} / 60 characters</p>
      </div>

      <div className="space-y-2">
        <SectionLabel>Meta Description</SectionLabel>
        <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Search result snippet..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none resize-none leading-relaxed"
        />
        <p className="text-[10px] text-slate-400 font-bold text-right">{metaDescription.length} / 160 characters</p>
      </div>

      <div className="space-y-2">
        <SectionLabel>Post Excerpt</SectionLabel>
        <textarea
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary for your blog feed..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none resize-none leading-relaxed"
        />
        <p className="text-[10px] text-slate-400 font-bold text-right">{excerpt.length} characters</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{children}</p>;
}

function SidebarSelect({ label, value }: any) {
  return (
    <div className="space-y-2">
      <SectionLabel>{label}</SectionLabel>
      <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300">
        <span className="text-sm font-bold text-[#0F172A]">{value}</span>
        <ChevronDown size={15} className="text-slate-400" />
      </div>
    </div>
  );
}

function MetricCard({ icon, value, label }: any) {
  return (
    <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#3b82f6] shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-black text-[#0F172A] leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}
