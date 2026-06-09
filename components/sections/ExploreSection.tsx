"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const allArticles = [
  "Newton's Laws of Motion",
  "Newton's Second Law (F=ma)",
  "Transverse Waves Explained",
  "What Is Energy?",
  "Projectile Motion: Complete Guide",
  "Conservation of Momentum",
  "First Law of Thermodynamics",
  "Gravitational Force",
  "Wave Speed, Frequency & Wavelength",
  "Kinetic Theory of Gases",
  "Why Is Projectile Motion a Parabola?",
  "Kinetic Energy: KE = ½mv²"
];

const topics = [
  "Classical Mechanics",
  "Thermodynamics",
  "Waves & Optics",
  "Electromagnetism",
  "Kinematics",
  "Modern Physics"
];

const authors = [
  { name: "Dr. James Carter", specialty: "Classical Mechanics" },
  { name: "Dr. Elena Vasquez", specialty: "Waves & Optics" },
  { name: "Dr. Marcus Webb", specialty: "Modern Physics" },
  { name: "Dr. Sarah Kim", specialty: "Thermodynamics" }
];

const siteLinks = [
  "All Articles",
  "About Us",
  "Roadmap",
  "Contact",
  "Privacy Policy",
  "Terms of Use"
];

export default function ExploreSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16 flex flex-col items-center"
        >
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block" 
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgb(59, 130, 246)" }}
          >
            EXPLORE
          </span>
          <h2 
            className="text-[clamp(32px,4vw,44px)] leading-[1.1] text-slate-900 mb-4" 
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Everything on Physics Fundamentals
          </h2>
          <p 
            className="text-[17px] text-slate-500 max-w-[500px]" 
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Every article, topic, author, and resource — all in one place for easy discovery.
          </p>
        </motion.div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[20px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-sans)" }}>All Articles</h3>
            <ul className="flex flex-col gap-4">
              {allArticles.map(a => (
                <li key={a}>
                  <Link href="#" className="flex items-start gap-2 text-[14px] text-slate-500 hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <span className="text-blue-500 mt-0.5">•</span> <span className="leading-[1.5]">{a}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[20px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-sans)" }}>Topics</h3>
            <ul className="flex flex-col gap-4">
              {topics.map(t => (
                <li key={t}>
                  <Link href="#" className="flex items-center gap-2 text-[14px] text-slate-500 hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <span className="w-[5px] h-[5px] rounded-full bg-amber-400"></span>
                    <span>{t}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-[20px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-sans)" }}>Our Authors</h3>
            <ul className="flex flex-col gap-6 mb-8">
              {authors.map(a => (
                <li key={a.name}>
                  <Link href="#" className="flex flex-col group/author" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <span className="text-[14px] text-slate-700 group-hover/author:text-blue-600 transition-colors font-medium mb-1">{a.name}</span>
                    <span className="text-[12.5px] text-slate-400">{a.specialty}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="#" className="text-[11px] font-bold tracking-[0.1em] text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2 -ml-4 rounded-full transition-all duration-300 uppercase flex items-center gap-1.5 mt-auto group/link" style={{ fontFamily: "var(--font-dm-sans)" }}>
              ALL AUTHORS
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[20px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest" style={{ fontFamily: "var(--font-dm-sans)" }}>Site</h3>
            <ul className="flex flex-col gap-4">
              {siteLinks.map(l => (
                <li key={l}>
                  <Link href="#" className="flex items-center gap-2 text-[14px] text-slate-500 hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{l}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
