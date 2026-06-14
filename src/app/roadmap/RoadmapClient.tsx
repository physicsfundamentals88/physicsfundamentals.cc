"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

// ── Data ───────────────────────────────────────────────────────────────────

const phases = [
  {
    number: "01",
    name: "Foundation",
    status: "live",
    eta: "Available now",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.08)",
    colorBorder: "rgba(16,185,129,0.2)",
    description: "The core content layer — everything a student needs to understand the bedrock of classical physics with depth and clarity.",
    items: [
      "In-depth articles covering core physics branches",
      "Newton's Laws, Kinematics, Forces, Momentum, Energy",
      "Thermodynamics — Laws, Entropy, Gas Laws, Heat Transfer",
      "Waves & Optics — Transverse waves, Wave equation, Sound, Light",
      "Electromagnetism — Coulomb's Law, Ohm's Law, Magnetic Forces",
      "Every article annotated with full diagrams and worked examples",
    ],
  },
  {
    number: "02",
    name: "Depth & Interactivity",
    status: "building",
    eta: "Q3 2026",
    color: "#3b82f6",
    colorBg: "rgba(59,130,246,0.06)",
    colorBorder: "rgba(59,130,246,0.18)",
    description: "Transforming static explanations into living, adjustable simulations — so you can test your intuition in real time.",
    items: [
      "Interactive simulations for 30+ core physics scenarios",
      "PDF formula sheets (downloadable, print-ready)",
      "Video walkthroughs and animations for difficult concepts",
      "Exam-style practice problems with full solution breakdowns",
      "Advanced search and filtering across all content",
    ],
  },
  {
    number: "03",
    name: "Advanced Features",
    status: "planned",
    eta: "Q1 2027",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.06)",
    colorBorder: "rgba(245,158,11,0.18)",
    description: "Expanding the curriculum into higher-level and specialised physics for students going beyond the fundamentals.",
    items: [
      "Advanced topics — Fluid Mechanics, Solid State, Modern Physics, Quantum Mechanics",
      "Difficulty levels within each topic section",
      "Community discussion threads on every article",
      "Progress tracking dashboard",
    ],
  },
  {
    number: "04",
    name: "Full Platform",
    status: "planned",
    eta: "Q3 2027",
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.06)",
    colorBorder: "rgba(139,92,246,0.18)",
    description: "The complete Physics Fundamentals ecosystem — structured learning paths, community, and global access.",
    items: [
      "Complete curriculum covering BSc physics fundamentals topics",
      "Study guides for common university exams",
      "Community-contributed resources",
      "Simulator and formula builder",
      "Mobile app for offline reading",
      "Multi-language support",
    ],
  },
];

const statusConfig: Record<string, { label: string; dotColor: string; textColor: string; bgColor: string }> = {
  live: { label: "Live", dotColor: "#10b981", textColor: "#065f46", bgColor: "#d1fae5" },
  building: { label: "In Progress", dotColor: "#3b82f6", textColor: "#1e40af", bgColor: "#dbeafe" },
  planned: { label: "Planned", dotColor: "#94a3b8", textColor: "#475569", bgColor: "#f1f5f9" },
};

// ── SVG Icons ──────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function RoadmapClient() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-[140px] pb-20 bg-[#0b1221] relative overflow-hidden">
        {/* decorative orbit rings */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className="opacity-[0.04] -mr-40">
            <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="40" fill="white" opacity="0.3" />
          </svg>
        </div>
        <div className="max-w-[920px] mx-auto px-6 sm:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-400" style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}>
              ROADMAP
            </span>
            <h1 className="text-[clamp(36px,6vw,60px)] leading-[1.1] text-white mb-6" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              What&apos;s coming to<br className="hidden sm:block" /> Physics Fundamentals
            </h1>
            <p className="text-[17px] leading-[1.75] text-slate-400 max-w-[580px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              We&apos;re building this platform in step-by-step phases with your input. Here&apos;s exactly
              what we&apos;re working on and what comes next.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Timeline ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[920px] mx-auto px-6 sm:px-8">
          <div className="relative">
            {/* vertical connector line */}
            <div className="absolute left-[31px] top-10 bottom-10 w-px bg-slate-200 hidden md:block" />

            <div className="flex flex-col gap-8">
              {phases.map((phase, i) => {
                const status = statusConfig[phase.status];
                return (
                  <motion.div
                    key={phase.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: i * 0.08 }}
                    className="flex gap-6 md:gap-10"
                  >
                    {/* Phase number bubble */}
                    <div className="shrink-0 hidden md:flex flex-col items-center">
                      <div
                        className="w-[62px] h-[62px] rounded-2xl flex items-center justify-center text-[22px] font-bold z-10"
                        style={{
                          fontFamily: "var(--font-instrument-serif)",
                          background: phase.colorBg,
                          border: `1.5px solid ${phase.colorBorder}`,
                          color: phase.color,
                        }}
                      >
                        {phase.number}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 rounded-[22px] p-8 border transition-all duration-300 hover:shadow-lg"
                      style={{ background: "#ffffff", borderColor: `${phase.colorBorder}` }}
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                        <div>
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>
                              Phase {phase.number}: {phase.name}
                            </h2>
                            {/* live/planned badge */}
                            <span
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                              style={{ color: status.textColor, background: status.bgColor, fontFamily: "var(--font-dm-sans)" }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: status.dotColor }} />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-400 font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            {phase.eta}
                          </p>
                        </div>
                      </div>

                      <p className="text-[15px] leading-[1.7] text-slate-500 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {phase.description}
                      </p>

                      {/* Feature List */}
                      <ul className="space-y-2.5">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span
                              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                              style={{ background: phase.colorBg, color: phase.color }}
                            >
                              <CheckIcon />
                            </span>
                            <span className="text-[14px] leading-[1.6] text-slate-700" style={{ fontFamily: "var(--font-dm-sans)" }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Influence CTA ────────────────────────────────────────── */}
      <section className="py-24 bg-[#0b1221] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-900/20 blur-3xl" />
        </div>
        <div className="max-w-[680px] mx-auto px-6 sm:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            {/* icon */}
            <div className="w-14 h-14 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <h2 className="text-[clamp(26px,4vw,38px)] leading-[1.2] text-white mb-5" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              Want to influence what we build?
            </h2>
            <p className="text-[16px] leading-[1.75] text-slate-400 mb-10" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Your feedback directly shapes our priorities. The features and topics you see on
              this roadmap came from real users — sign up for early access to vote on what we
              build next and tell us what&apos;s missing most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-[#0a0f1e] transition-all hover:bg-amber-400 active:scale-95 group"
                style={{ fontFamily: "var(--font-dm-sans)", background: "#f59e0b" }}
              >
                Get Early Access
                <ArrowIcon />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white border border-white/20 hover:bg-white/10 transition-all active:scale-95 group"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Share Feedback
                <ArrowIcon />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
