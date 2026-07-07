"use client";

import Link from "next/link";

const curricula = [
  {
    title: "Classical Mechanics",
    topics: "Newton's Laws, Forces, Energy, Momentum, Circular Motion",
  },
  {
    title: "Thermodynamics",
    topics: "Conservation Laws, Heat Transfer, Entropy, Gas Laws",
  },
  {
    title: "Waves & Optics",
    topics: "Transverse Waves, Sound, Light, Interference, Doppler",
  },
  {
    title: "Electromagnetism",
    topics: "Electric Fields, Circuits, Magnetism, Magnetic Forces",
  },
  {
    title: "Modern Physics",
    topics: "Special Relativity, Quantum Mechanics, Nuclear, Radioactivity",
  },
  {
    title: "Kinematics",
    topics: "SUVAT Equations, Velocity, Acceleration, Graphs of Motion",
  },
];

export default function CurriculumSection() {
  return (
    <section id="curriculum" className="py-24 bg-white" aria-label="Learning pathways">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgb(59, 130, 246)" }}
          >
            LEARNING PATHWAYS
          </span>
          <h2 
            className="mb-6 text-[clamp(40px,5vw,56px)] leading-[1.1]"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "rgb(15, 23, 42)" }}
          >
            Every major branch of physics,<br className="hidden md:block"/> laid out systematically
          </h2>
          <p 
            className="max-w-[700px] text-[17px] leading-[1.7]"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
          >
            Explore our comprehensive interactive syllabus. We break down complex topics—from Newtonian kinematics and forces to electromagnetic fields and thermodynamics—to build genuine physical intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {curricula.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[20px] p-6 lg:p-8 flex flex-col border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.04)" }}
            >
              <div className="flex justify-between items-start gap-4 mb-5">
                <h3 
                  className="text-[18px]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, color: "rgb(15, 23, 42)" }}
                >
                  {item.title}
                </h3>
                <span 
                  className="bg-[#eff6ff] text-blue-700 text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-[6px] shrink-0 uppercase"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                  aria-label="Status: Live"
                >
                  LIVE
                </span>
              </div>
              <p 
                className="text-[14px] leading-relaxed mt-auto"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
              >
                {item.topics}
              </p>
            </div>
          ))}
        </div>

        {/* See full roadmap CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/roadmap"
            className="flex items-center gap-2 text-blue-600 font-medium text-[15px] px-6 py-3 rounded-full bg-transparent hover:bg-blue-50 transition-all duration-300 group"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            See full roadmap
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
