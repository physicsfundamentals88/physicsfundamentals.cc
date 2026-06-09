"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

// ── Data ───────────────────────────────────────────────────────────────────

const categories = ["All Topics", "Classical Mechanics", "Thermodynamics", "Waves & Optics", "Electromagnetism"];

const calculators = [
  {
    title: "Projectile Motion Calculator",
    category: "Classical Mechanics",
    description: "Calculate max height, time of flight, range, and current trajectory position given an initial velocity and angle.",
    tags: ["Range", "Time", "Velocity", "Trajectory"],
    color: "#4f46e5",
    colorBg: "rgba(79,70,229,0.1)",
    href: "/calculators/projectile-motion",
  },
  {
    title: "Newton's Second Law Calculator",
    category: "Classical Mechanics",
    description: "Calculate force, mass, or acceleration using F = ma. Supports unit conversions.",
    tags: ["Force", "Mass", "Acceleration", "Newton"],
    color: "#3b82f6",
    colorBg: "rgba(59,130,246,0.1)",
    href: "/calculators/newtons-second-law",
  },
  {
    title: "Kinetic Energy Calculator",
    category: "Classical Mechanics",
    description: "Compute kinetic energy from mass and velocity, or find the required velocity and mass for a target energy level.",
    tags: ["Energy", "Joules", "Mass", "Speed"],
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.1)",
    href: "/calculators/kinetic-energy",
  },
  {
    title: "Ohm's Law Calculator",
    category: "Electromagnetism",
    description: "Easily calculate voltage, current, or resistance. Finds missing values based on identical formulas.",
    tags: ["Voltage", "Current", "Resistance"],
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.1)",
    href: "/calculators/ohms-law",
  },
  {
    title: "Free Fall Calculator",
    category: "Classical Mechanics",
    description: "Calculates distance, velocity, and time for objects in free fall. Uses Earth's standard gravity by default.",
    tags: ["Gravity", "Velocity", "Time", "Distance"],
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.1)",
    href: "/calculators/free-fall",
  },
  {
    title: "Ideal Gas Law Calculator",
    category: "Thermodynamics",
    description: "Solver for the equation PV = nRT. Input any three variables to instantly find the fourth.",
    tags: ["Pressure", "Volume", "Moles", "Temp"],
    color: "#f97316",
    colorBg: "rgba(249,115,22,0.1)",
    href: "/calculators/ideal-gas-law",
  },
  {
    title: "Centripetal Force Calculator",
    category: "Classical Mechanics",
    description: "Find the centripetal force holding an object in a circle, given mass, velocity, and radius. Also outputs acceleration.",
    tags: ["Force", "Mass", "Radius", "Velocity"],
    color: "#06b6d4",
    colorBg: "rgba(6,182,212,0.1)",
    href: "/calculators/centripetal-force",
  },
  {
    title: "Snell's Law Calculator",
    category: "Waves & Optics",
    description: "Calculate angles of refraction between two different mediums based on their refractive indices.",
    tags: ["Refraction", "Angle", "Indices"],
    color: "#ec4899",
    colorBg: "rgba(236,72,153,0.1)",
    href: "/calculators/snells-law",
  },
  {
    title: "Coulomb's Law Calculator",
    category: "Electromagnetism",
    description: "Determine the electrostatic force between two point charges separated by a specific distance in a vacuum.",
    tags: ["Force", "Charge", "Distance"],
    color: "#6366f1",
    colorBg: "rgba(99,102,241,0.1)",
    href: "/calculators/coulombs-law",
  },
  {
    title: "Work & Power Calculator",
    category: "Classical Mechanics",
    description: "Calculate mechanical work from force and distance, and power by dividing work by time taken.",
    tags: ["Work", "Power", "Force", "Time"],
    color: "#eab308",
    colorBg: "rgba(234,179,8,0.1)",
    href: "/calculators/work-power",
  },
  {
    title: "Doppler Effect Calculator",
    category: "Waves & Optics",
    description: "Find the observed frequency of sound waves when the source or observer are moving relative to each other.",
    tags: ["Frequency", "Speed", "Sound"],
    color: "#14b8a6",
    colorBg: "rgba(20,184,166,0.1)",
    href: "/calculators/doppler-effect",
  },
  {
    title: "Momentum Calculator",
    category: "Classical Mechanics",
    description: "Solve for momentum (p = mv) given mass and velocity, or calculate the impulse from a force over time.",
    tags: ["Mass", "Velocity", "Impulse"],
    color: "#ef4444",
    colorBg: "rgba(239,68,68,0.1)",
    href: "/calculators/momentum",
  },
  {
    title: "Thermal Expansion Calculator",
    category: "Thermodynamics",
    description: "Predict the change in length for a solid material when its temperature changes, given the expansion coefficient.",
    tags: ["Length", "Temperature", "Coefficient"],
    color: "#db2777",
    colorBg: "rgba(219,39,119,0.1)",
    href: "/calculators/thermal-expansion",
  },
  {
    title: "Wave Speed Calculator",
    category: "Waves & Optics",
    description: "Calculate wave speed, frequency, or wavelength using the wave equation v = fλ.",
    tags: ["Speed", "Frequency", "Wavelength"],
    color: "#0ea5e9",
    colorBg: "rgba(14,165,233,0.1)",
    href: "/calculators/wave-speed",
  },
  {
    title: "Gravitational Potential Energy",
    category: "Classical Mechanics",
    description: "Find the potential energy of an object at a certain height above the ground using U = mgh.",
    tags: ["Energy", "Gravity", "Height"],
    color: "#1dc0b0",
    colorBg: "rgba(29,192,176,0.1)",
    href: "/calculators/gravitational-potential-energy",
  },
  {
    title: "Capacitance Calculator",
    category: "Electromagnetism",
    description: "Solve for capacitance, charge, or voltage in a capacitor using the formula C = Q/V.",
    tags: ["Capacitor", "Charge", "Voltage"],
    color: "#f43f5e",
    colorBg: "rgba(244,63,94,0.1)",
    href: "/calculators/capacitance",
  },
  {
    title: "Circular Motion Calculator",
    category: "Classical Mechanics",
    description: "Calculate angular velocity, linear velocity, and period for objects in uniform circular motion.",
    tags: ["Angular", "Period", "Velocity"],
    color: "#06b6d4",
    colorBg: "rgba(6,182,212,0.1)",
    href: "/calculators/circular-motion",
  },
  {
    title: "Pressure & Density Calculator",
    category: "Classical Mechanics",
    description: "Find the pressure exerted by a force over an area or calculate the density of a substance.",
    tags: ["Pressure", "Density", "Force"],
    color: "#64748b",
    colorBg: "rgba(100,116,139,0.1)",
    href: "/calculators/pressure-density",
  },
  {
    title: "Frequency Calculator",
    category: "Waves & Optics",
    description: "Convert between frequency, period, and angular frequency for oscillating systems.",
    tags: ["Frequency", "Period", "Cycles"],
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.1)",
    href: "/calculators/frequency",
  },
  {
    title: "Escape Velocity Calculator",
    category: "Classical Mechanics",
    description: "Calculate the minimum speed an object needs to escape the gravitational pull of a celestial body.",
    tags: ["Space", "Gravity", "Velocity"],
    color: "#6366f1",
    colorBg: "rgba(99,102,241,0.1)",
    href: "/calculators/escape-velocity",
  },
];

const faqs = [
  {
    q: "Are the calculators completely free to use?",
    a: "Yes, all our physics calculators are 100% free with no limits. We believe foundational learning tools should be accessible to everyone."
  },
  {
    q: "Do the calculators show step-by-step working?",
    a: "Yes! Every calculator displays the initial formula used, the variable substitution, and the algebraic steps taken to reach the final answer. This makes them perfect for homework checking."
  },
  {
    q: "Can I use scientific notation for inputs?",
    a: "Absolutely. Our input fields support standard scientific notation (e.g., 6.67e-11 or 6.67E-11) allowing you to work with realistic physics constants easily."
  },
  {
    q: "What units are supported?",
    a: "Calculators default to standard SI units (meters, kilograms, seconds, etc.), but most include a dropdown toggle for common alternatives (like km/h or feet)."
  },
  {
    q: "How accurate are the results?",
    a: "Results are calculated using 64-bit floating point precision. By default, final answers are rounded to 4 significant figures, but you can expand this to 8."
  }
];

// ── Icons ──────────────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? "rotate-45 text-slate-400" : "text-blue-500"}`}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ── Components ─────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-[18px] bg-white overflow-hidden transition-all duration-300 hover:border-blue-200" style={{ boxShadow: open ? "0 12px 32px -12px rgba(0,0,0,0.06)" : "none" }}>
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 bg-transparent outline-none">
        <span className="text-[16px] font-bold text-slate-800" style={{ fontFamily: "var(--font-dm-sans)" }}>{question}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><PlusIcon open={open} /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-6 pb-6 pt-1">
              <p className="text-[15px] leading-[1.7] text-slate-500" style={{ fontFamily: "var(--font-dm-sans)" }}>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function CalculatorsPage() {
  const [activeCategory, setActiveCategory] = useState("All Topics");

  const filtered = activeCategory === "All Topics" 
    ? calculators 
    : calculators.filter(c => c.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ─── Hero (Clean, no shadow) ─────────────────────────────── */}
      <section className="mt-[76px] bg-[#0b1221] relative overflow-hidden py-24">
        {/* Subtle grid background, no shadow at the bottom */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-[760px] mx-auto px-6 sm:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="uppercase font-bold tracking-[0.22em] mb-4 block text-blue-400" style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}>
              PHYSICS TOOLKIT
            </span>
            <h1 className="text-[clamp(40px,7vw,68px)] leading-[1.05] text-white mb-6" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              Physics Calculators.
            </h1>
            <p className="text-[17px] leading-[1.75] text-slate-400 max-w-[560px] mx-auto mb-14" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Free online calculators for every major physics topic. Enter known variables and instantly receive full solutions with step-by-step working.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {[
                { val: "20+", label: "Calculators" },
                { val: "100+", label: "Formulas" },
                { val: "Free", label: "Access" },
                { val: "Step-by-step", label: "Solutions" },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-[28px] font-bold text-white mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{stat.val}</div>
                  <div className="text-[12px] font-bold tracking-wider text-slate-500 uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Category Filter — Sticky ──────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-[76px] z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-5 py-2.5 rounded-full text-[13px] font-bold tracking-[0.05em] transition-all duration-200 whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  background: activeCategory === cat ? "#0b1221" : "transparent",
                  color: activeCategory === cat ? "#ffffff" : "#64748b",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Calculator Grid ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {activeCategory} Calculators
            </h2>
            <p className="text-[14px] font-semibold text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {filtered.length} matching tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((calc, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  key={calc.title}
                  className="bg-[#0f172a] rounded-[24px] p-7 flex flex-col border border-[#1e293b] group relative overflow-hidden"
                >
                  {/* Background gradient hover effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${calc.colorBg} 0%, transparent 70%)` }}
                  />

                  {/* Make the entire card a clickable link */}
                  <Link href={calc.href} className="flex flex-col flex-1 relative z-10 outline-none">
                    {/* Top: Category & Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-sans)", color: calc.color }}>
                        {calc.category}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-[18px] font-bold text-white mb-3 leading-[1.3]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {calc.title}
                    </h3>
                    <p className="text-[13px] leading-[1.65] text-slate-400 mb-6 flex-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {calc.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {calc.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 border border-slate-700/50 bg-slate-800/30" style={{ fontFamily: "var(--font-dm-sans)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <div
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-300 group-active:scale-[0.98] group/btn relative outline-none"
                      style={{ fontFamily: "var(--font-dm-sans)", background: calc.color }}
                    >
                      Calculate
                      <ArrowIcon />
                      {/* Inner button glow */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `0 0 20px ${calc.color}55` }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── Info & FAQ Section ────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
          
          <div className="text-center mb-16">
            <span className="text-[12px] font-bold tracking-[0.15em] text-blue-500 uppercase block mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Why Free?</span>
            <h2 className="text-[36px] font-bold text-slate-900 mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>Instant physics answers with shown working</h2>
            <p className="text-[17px] text-slate-500 max-w-[680px] mx-auto leading-[1.7]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Every calculator on this page reveals the formula and substitution. You won&apos;t just receive an empty answer; you&apos;ll see exactly how the physics leads to that answer. No premium paywalls.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
            {/* Left side info */}
            <div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>A calculator for every physics topic</h3>
              <p className="text-[15px] text-slate-600 leading-[1.8] mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                From high school mechanics to complex thermodynamics, we&apos;ve built solvers that handle units natively and map directly to textbook notation.
              </p>
              
              <h4 className="text-[13px] font-bold tracking-widest text-slate-400 uppercase mb-4 mt-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Calculators by topic</h4>
              <ul className="space-y-3">
                {[
                  { name: "Classical Mechanics", count: "11 Calculators", color: "bg-blue-500" },
                  { name: "Thermodynamics", count: "2 Calculators", color: "bg-orange-500" },
                  { name: "Waves & Optics", count: "4 Calculators", color: "bg-pink-500" },
                  { name: "Electromagnetism", count: "3 Calculators", color: "bg-indigo-500" },
                ].map(topic => (
                  <li key={topic.name} className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${topic.color}`} />
                      <span className="text-[14px] font-bold text-slate-700" style={{ fontFamily: "var(--font-dm-sans)" }}>{topic.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>{topic.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side FAQs */}
            <div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>Frequently asked questions</h3>
              <div className="space-y-3">
                {faqs.map(faq => (
                  <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
