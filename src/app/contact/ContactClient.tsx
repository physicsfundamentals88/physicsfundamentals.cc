"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

// ── SVG Icons ──────────────────────────────────────────────────────────────

const EmailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.636-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const socials = [
  { icon: TwitterIcon, label: "X / Twitter", handle: "@physicsfundamentals", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", handle: "Physics Fundamentals", href: "#" },
  { icon: GithubIcon, label: "GitHub", handle: "github.com/physicsfundamentals", href: "#" },
  { icon: LinkedInIcon, label: "LinkedIn", handle: "Physics Fundamentals", href: "#" },
];

const subjects = ["General Question", "Content Suggestion", "Bug Report", "Partnership", "Press Inquiry", "Other"];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="pt-[140px] pb-20 bg-[#0b1221] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl" />
        </div>
        <div className="max-w-[860px] mx-auto px-6 sm:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-400" style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}>
              CONTACT
            </span>
            <h1 className="text-[clamp(36px,6vw,58px)] leading-[1.1] text-white mb-6" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              We&apos;d love to hear from you
            </h1>
            <p className="text-[17px] leading-[1.75] text-slate-400 max-w-[560px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Whether you&apos;ve found an error in an article, have a suggestion for a topic, or just want to say hello — this is the place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Grid ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#f8fafc] flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">

            {/* ── Form ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-100"
              style={{ boxShadow: "0 12px 48px -12px rgba(0,0,0,0.06)" }}
            >
              {sent ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[22px] font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Message sent!</h3>
                  <p className="text-slate-500 text-[15px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Thanks for reaching out. We typically reply within 2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Your name</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Email address</label>
                        <input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Subject</label>
                      <select
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {subjects.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Tell us what's on your mind..."
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all hover:brightness-110 active:scale-[0.99] group"
                      style={{ fontFamily: "var(--font-dm-sans)", background: "#0b1221" }}
                    >
                      Send Message
                      <SendIcon />
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Direct email */}
              <div className="bg-white rounded-[20px] p-7 border border-slate-100" style={{ boxShadow: "0 8px 32px -8px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-5">
                  <EmailIcon />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Direct email</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  For urgent issues, content errors, or press enquiries, you can email us directly.
                </p>
                <a
                  href="mailto:physicsfundamentals88@gmail.com"
                  className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  physicsfundamentals88@gmail.com
                </a>
              </div>

              {/* Response time */}
              <div className="bg-white rounded-[20px] p-7 border border-slate-100" style={{ boxShadow: "0 8px 32px -8px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[13px] font-semibold text-emerald-600" style={{ fontFamily: "var(--font-dm-sans)" }}>Typically replies in 2 business days</span>
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  We&apos;re a small team of physicists and educators. We read every message and genuinely appreciate well-described bug reports and content suggestions.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
