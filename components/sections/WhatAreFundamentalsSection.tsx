"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fundamentals = [
  {
    title: "Classical Mechanics",
    description: (
      <>
        Classical Mechanics begins with <span className="text-blue-500">Newton's three laws</span>. The <span className="text-blue-500">second (F = ma)</span> relates force to mass and acceleration. The third states forces come in pairs. Together they predict everything from projectiles to orbits, and forces in structural engineering.
      </>
    ),
    linkText: "ALL MECHANICS ARTICLES",
    linkUrl: "#"
  },
  {
    title: "Waves & Optics",
    description: (
      <>
        Wave physics governs how energy propagates. <span className="text-blue-500">Transverse waves</span> — oscillation perpendicular to propagation — include all electromagnetic radiation. The <span className="text-blue-500">wave equation v = fλ</span> connects speed, frequency, and wavelength for every wave type in the universe.
      </>
    ),
    linkText: "ALL WAVES ARTICLES",
    linkUrl: "#"
  },
  {
    title: "Energy & Thermodynamics",
    description: (
      <>
        <span className="text-blue-500">Energy</span> is the central concept connecting all physics. Conservation of energy — it cannot be created or destroyed, only transformed — is one of the deepest truths in science. The <span className="text-blue-500">first law of thermodynamics</span> applies this to heat and work. The <span className="text-blue-500">kinetic theory of gases</span> links molecular motion to pressure.
      </>
    ),
    linkText: "ALL THERMODYNAMICS ARTICLES",
    linkUrl: "#"
  },
  {
    title: "Forces & Conservation Laws",
    description: (
      <>
        Conservation laws are the deepest principles in physics. <span className="text-blue-500">Conservation of momentum</span> governs every collision. <span className="text-blue-500">Newton's law of gravitation</span> describes the force between any two masses — from dropping a ball to the orbit of the Moon. These are exact laws with no known exceptions.
      </>
    ),
    linkText: "ALL FORCES ARTICLES",
    linkUrl: "#"
  }
];

export default function WhatAreFundamentalsSection() {
  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h2 
            className="text-[clamp(28px,4vw,36px)] leading-[1.2] mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, color: "rgb(15, 23, 42)" }}
          >
            What Are Physics Fundamentals?
          </h2>
          <p 
            className="text-[16px] leading-[1.65] max-w-[700px]"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
          >
            Physics fundamentals are the core laws and principles describing how the universe behaves at every scale. Mastering them is the single most effective investment any science or engineering student can make.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fundamentals.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                className="text-blue-500 bg-transparent hover:bg-blue-50 px-4 py-2.5 -ml-4 rounded-full transition-all duration-300 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.05em] uppercase w-fit group/link mt-auto"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {item.linkText}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
