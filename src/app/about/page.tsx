"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

// ── SVG icons ──────────────────────────────────────────────────────────────

const AtomIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <ellipse cx="24" cy="24" rx="10" ry="22" />
    <ellipse cx="24" cy="24" rx="22" ry="10" />
    <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
  </svg>
);

const LensIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="21" cy="21" r="13" />
    <path d="M30.5 30.5 L42 42" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15 21 h12 M21 15 v12" strokeWidth="1.4" />
  </svg>
);

const ChalkboardIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="4" y="6" width="40" height="28" rx="3" />
    <path d="M16 40 h16 M24 34 v6" />
    <path d="M12 18 Q18 12 24 18 Q30 24 36 18" strokeWidth="1.4" />
  </svg>
);

const RocketIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M24 4 C30 4 40 12 40 26 L24 44 L8 26 C8 12 18 4 24 4Z" />
    <circle cx="24" cy="20" r="4" />
    <path d="M8 26 L4 34 L12 30" />
    <path d="M40 26 L44 34 L36 30" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="24" cy="24" r="20" />
    <ellipse cx="24" cy="24" rx="8" ry="20" />
    <path d="M4 24 h40 M7 14 h34 M7 34 h34" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M24 40 C24 40 6 28 6 16 A8 8 0 0 1 24 12 A8 8 0 0 1 42 16 C42 28 24 40 24 40Z" />
  </svg>
);

const principles = [
  {
    icon: <LensIcon />,
    title: "Intuition before equations",
    body: "We always build physical intuition first. Once you feel why a ball curves through the air, the mathematics that describes it becomes inevitable rather than arbitrary.",
  },
  {
    icon: <ChalkboardIcon />,
    title: "Worked examples that teach",
    body: "Every solved problem in our library is annotated with the reasoning behind each step — not just what to write, but why that step is the natural next move.",
  },
  {
    icon: <AtomIcon />,
    title: "Minimal jargon, maximum precision",
    body: "We write in plain language without sacrificing accuracy. If a technical term earns its place, we define it precisely the first time and reinforce it in context.",
  },
  {
    icon: <GlobeIcon />,
    title: "Connected knowledge",
    body: "Physics is one coherent story. Every article links concepts across branches — the same mathematics behind a pendulum appears in electrical circuits and quantum mechanics.",
  },
];

const stats = [
  { value: "250+", label: "In-depth articles" },
  { value: "18k+", label: "Monthly readers" },
  { value: "100%", label: "Free forever" },
  { value: "6", label: "Physics branches covered" },
];

const team = [
  {
    name: "Dr. Marcus Webb",
    role: "Classical Mechanics Lead",
    bio: "Formerly at the University of Edinburgh. Spent 12 years teaching undergraduate mechanics before turning full-time to online science communication.",
    initials: "MW",
    color: "bg-emerald-800",
  },
  {
    name: "Dr. Sarah Kim",
    role: "Electromagnetism & Thermodynamics",
    bio: "PhD in condensed matter physics. Believes the biggest barrier to learning physics is bad explanations, not student ability.",
    initials: "SK",
    color: "bg-amber-700",
  },
  {
    name: "Dr. Elena Vasquez",
    role: "Waves, Optics & Modern Physics",
    bio: "Research background in quantum optics. Writes with the conviction that modern physics is no harder than classical physics — just less familiar.",
    initials: "EV",
    color: "bg-purple-800",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-[120px] pb-24 bg-[#0b1221] relative overflow-hidden">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-[900px] mx-auto px-6 sm:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-400"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              ABOUT US
            </span>
            <h1
              className="text-[clamp(38px,6vw,68px)] leading-[1.08] text-white mb-8"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              Our mission: make physics
              <br className="hidden sm:block" /> accessible to everyone
            </h1>
            <p
              className="text-[17px] leading-[1.75] text-slate-400 max-w-[680px]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Physics Fundamentals was founded on a single conviction — that the laws governing
              the universe are not the exclusive property of elite universities. Clear writing,
              honest explanations, and interactive tools can put genuine understanding within
              reach of any motivated student, anywhere in the world, for free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Why We Exist ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-500"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              WHY PHYSICS FUNDAMENTALS EXISTS
            </span>
            <div className="grid md:grid-cols-2 gap-10 text-[16px] leading-[1.8] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
              <div className="space-y-5">
                <p>
                  Most physics resources fall into one of two traps: the oversimplification
                  that strips out the mathematics entirely, leaving students with colourful
                  analogies but no real understanding; or the dense academic textbook that
                  demands prior fluency in the very language it is trying to teach.
                </p>
                <p>
                  Physics Fundamentals occupies the space between those extremes. We write at
                  the level of a capable first-year university student — rigorous enough to
                  build genuine competence, readable enough to be followed without a tutor
                  sitting beside you.
                </p>
              </div>
              <div className="space-y-5">
                <p>
                  We also believe physics education is fundamentally broken in one specific way:
                  it is taught as a collection of disconnected formulas to memorise rather than
                  as a unified, beautifully consistent description of reality. Our curriculum is
                  structured to show those connections at every turn.
                </p>
                <p>
                  Every article, simulation, and practice problem on this platform is written
                  with a single reader in mind — someone who is curious, smart, and has been
                  let down by explanations that talked around the hard parts instead of through
                  them.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-[900px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-[42px] leading-none font-bold text-[#0b1221] mb-2"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {s.value}
                </div>
                <div className="text-[13px] text-slate-500 font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What Makes Us Different ───────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-500"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              OUR APPROACH
            </span>
            <h2
              className="text-[clamp(28px,4vw,40px)] leading-[1.2] text-slate-900"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              What makes us different
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <AtomIcon />,
                title: "Written by researchers",
                body: "Every article is authored or reviewed by a physicist with a research background. We don't outsource to generalists — accuracy comes from domain mastery.",
              },
              {
                icon: <RocketIcon />,
                title: "Built for self-learners",
                body: "The platform is structured so that a determined student can follow a coherent thread from Newtonian mechanics all the way to quantum theory without external guidance.",
              },
              {
                icon: <HeartIcon />,
                title: "Genuinely free",
                body: "No paywalls, no premium tiers, no ads. Physics Fundamentals is supported by the belief that knowledge compounds when shared freely.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="border border-slate-100 rounded-[20px] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: "0 8px 32px -8px rgba(0,0,0,0.04)" }}
              >
                <div className="text-blue-500 mb-5">{item.icon}</div>
                <h3
                  className="text-[17px] font-semibold text-slate-900 mb-3"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[1.75] text-slate-500" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pedagogical Principles ────────────────────────────────── */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-500"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              HOW WE TEACH
            </span>
            <h2
              className="text-[clamp(28px,4vw,40px)] leading-[1.2] text-slate-900"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              Our pedagogical principles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[20px] p-8 border border-slate-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-blue-500 mb-5">{p.icon}</div>
                <h3
                  className="text-[16px] font-semibold text-slate-900 mb-3"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {p.title}
                </h3>
                <p className="text-[14px] leading-[1.75] text-slate-500" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0b1221]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-400"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              THE TEAM
            </span>
            <h2
              className="text-[clamp(28px,4vw,40px)] leading-[1.2] text-white"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              Built by physicists, for students
            </h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-slate-400 max-w-[600px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Every person on our core team holds a graduate degree in physics and has spent
              meaningful time teaching. We write from classrooms and labs, not from the outside
              looking in.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-[#141d2e] rounded-[20px] p-8 border border-white/5 hover:border-blue-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] mb-5 ${member.color}`}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {member.initials}
                </div>
                <div className="text-[16px] font-bold text-white mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {member.name}
                </div>
                <div className="text-[12px] text-blue-400 font-semibold tracking-wide mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {member.role}
                </div>
                <p className="text-[14px] leading-[1.75] text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[600px] mx-auto px-6 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-[clamp(28px,4vw,40px)] leading-[1.2] text-slate-900 mb-5"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              Join us on this journey
            </h2>
            <p className="text-[16px] leading-[1.75] text-slate-500 mb-10" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Whether you are studying for an exam, exploring physics out of curiosity, or
              looking for the clearest explanation of a concept you have encountered before —
              this platform is built for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-white transition-all duration-300 hover:brightness-110 active:scale-95"
                style={{ fontFamily: "var(--font-dm-sans)", background: "#0b1221" }}
              >
                Explore articles
              </Link>
              <Link
                href="/#early-access"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] text-[#0a0f1e] transition-all duration-300 hover:brightness-110 active:scale-95 hover:bg-amber-400"
                style={{ fontFamily: "var(--font-dm-sans)", background: "#f59e0b" }}
              >
                Get early access
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
