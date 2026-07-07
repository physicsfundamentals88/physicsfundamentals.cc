"use client";

import Link from "next/link";

const fundamentals = [
  {
    title: "Classical Mechanics",
    description: (
      <>
        Analyze <span className="text-blue-600">Newtonian mechanics</span> from the ground up. Master force interaction, particle acceleration <span className="text-blue-600">(F = ma)</span>, action-reaction equilibrium, and conservation laws. Build the foundational intuition required to solve complex projectile and orbital mechanics problems.
      </>
    ),
    linkText: "ALL MECHANICS ARTICLES",
    linkUrl: "/blog"
  },
  {
    title: "Waves & Optics",
    description: (
      <>
        Study the physics of propagation and oscillations. Walk through how <span className="text-blue-600">transverse waves</span> transfer energy, map key parameters via the fundamental <span className="text-blue-600">wave equation v = fλ</span>, and explore light refraction, diffraction, and sound wave interference.
      </>
    ),
    linkText: "ALL WAVES ARTICLES",
    linkUrl: "/blog"
  },
  {
    title: "Energy & Thermodynamics",
    description: (
      <>
        Examine energy conservation and heat exchange mechanisms. Learn how <span className="text-blue-600">mechanical energy</span> transforms into thermal energy, apply the <span className="text-blue-600">first law of thermodynamics</span>, and model gas behavior using the kinetic molecular theory.
      </>
    ),
    linkText: "ALL THERMODYNAMICS ARTICLES",
    linkUrl: "/blog"
  },
  {
    title: "Forces & Conservation Laws",
    description: (
      <>
        Explore the immutable principles of momentum and gravity. Investigate collision mathematics, apply <span className="text-blue-600">Newton&apos;s universal law of gravitation</span> to planetary motion, and understand why <span className="text-blue-600">conservation laws</span> form the backbone of modern physics.
      </>
    ),
    linkText: "ALL FORCES ARTICLES",
    linkUrl: "/blog"
  }
];

export default function WhatAreFundamentalsSection() {
  return (
    <section className="py-24 bg-[#f8fafc]" aria-label="Core physics principles">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 
            className="text-[clamp(28px,4vw,36px)] leading-[1.2] mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, color: "rgb(15, 23, 42)" }}
          >
            Demystifying the Core Principles
          </h2>
          <p 
            className="text-[16px] leading-[1.65] max-w-[700px]"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
          >
            Our modular approach breaks down complex natural laws into accessible concepts. Grasping these fundamental frameworks prepares you for advanced physics and engineering studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fundamentals.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[16px] p-8 flex flex-col border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.03)" }}
            >
              <h3 
                className="text-[18px] leading-[30px] mb-3"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, color: "rgb(11, 18, 33)" }}
              >
                {item.title}
              </h3>
              <p 
                className="text-[14px] leading-[1.7] flex-1 mb-8"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
              >
                {item.description}
              </p>
              <Link 
                href={item.linkUrl}
                className="text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2.5 -ml-4 rounded-full transition-all duration-300 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.05em] uppercase w-fit group/link mt-auto"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {item.linkText}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
