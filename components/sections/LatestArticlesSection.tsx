"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const articles = [
  {
    title: "Circular Motion and Centripetal Force: Complete Physics Guide",
    date: "May 3, 2026",
    readTime: "14 min read",
    author: "Dr. Marcus Webb",
    category: "CLASSICAL MECHANICS",
    avatarBg: "bg-emerald-800",
    Illustration: () => (
      <div className="w-full h-full bg-[#0B1221] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" fill="none">
          <path d="M 50 80 A 40 40 0 0 1 100 20 A 40 40 0 0 1 150 80" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="20" r="4" fill="#3b82f6" />
          <path d="M 100 20 L 140 20" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
          <path d="M 100 20 L 100 50" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
          <text x="145" y="15" fill="#10b981" fontSize="8">v</text>
          <text x="105" y="45" fill="#ef4444" fontSize="8">a</text>
        </svg>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="text-[10px] text-blue-500/70 tracking-widest font-bold mb-1">CLASSICAL MECHANICS</span>
          <span className="font-serif text-2xl">a = v²/r</span>
          <span className="text-[7px] tracking-[0.2em] text-slate-500 mt-2">CENTRIPETAL ACCELERATION</span>
        </div>
      </div>
    )
  },
  {
    title: "Ohm's Law Explained: V = IR, Resistance and Examples",
    date: "May 1, 2026",
    readTime: "13 min read",
    author: "Dr. Sarah Kim",
    category: "ELECTROMAGNETISM",
    avatarBg: "bg-amber-700",
    Illustration: () => (
      <div className="w-full h-full bg-[#0B1221] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" fill="none">
          <rect x="20" y="40" width="30" height="20" rx="4" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="35" y="53" fill="#f59e0b" fontSize="8" textAnchor="middle">R (Ω)</text>
          <path d="M 60 50 L 140 50" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow-amber)" />
          <text x="100" y="45" fill="#f59e0b" fontSize="8" textAnchor="middle">I (Amperes)</text>
        </svg>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="text-[10px] text-blue-500/70 tracking-widest font-bold mb-1">ELECTROMAGNETISM</span>
          <span className="font-serif text-2xl">V = IR</span>
          <span className="text-[7px] tracking-[0.2em] text-slate-500 mt-2">OHM'S LAW</span>
        </div>
      </div>
    )
  },
  {
    title: "Electric Charge and Coulomb's Law Explained",
    date: "Apr 30, 2026",
    readTime: "14 min read",
    author: "Dr. Sarah Kim",
    category: "ELECTROMAGNETISM",
    avatarBg: "bg-amber-700",
    Illustration: () => (
      <div className="w-full h-full bg-[#0B1221] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" fill="none">
          <circle cx="40" cy="50" r="10" stroke="#ef4444" strokeWidth="1" fill="#ef4444" fillOpacity="0.2" />
          <text x="40" y="53" fill="#ef4444" fontSize="8" textAnchor="middle">+q</text>
          <circle cx="120" cy="50" r="10" stroke="#3b82f6" strokeWidth="1" fill="#3b82f6" fillOpacity="0.2" />
          <text x="120" y="53" fill="#3b82f6" fontSize="8" textAnchor="middle">-q</text>
          <path d="M 55 50 L 105 50" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M 25 50 L 10 50" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red)" />
          <path d="M 135 50 L 150 50" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
          <text x="80" y="45" fill="#475569" fontSize="8" textAnchor="middle">r (distance)</text>
        </svg>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="text-[10px] text-blue-500/70 tracking-widest font-bold mb-1">ELECTROMAGNETISM</span>
          <span className="font-serif text-2xl">F = kq₁q₂/r²</span>
          <span className="text-[7px] tracking-[0.2em] text-slate-500 mt-2">COULOMB'S LAW</span>
        </div>
      </div>
    )
  },
  {
    title: "Simple Harmonic Motion: Definition, Formula, and Examples",
    date: "Apr 28, 2026",
    readTime: "15 min read",
    author: "Dr. Marcus Webb",
    category: "CLASSICAL MECHANICS",
    avatarBg: "bg-emerald-800",
    Illustration: () => (
      <div className="w-full h-full bg-[#0B1221] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" fill="none">
          <path d="M 20 60 Q 60 20 100 60 T 180 60" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4" />
          <line x1="100" y1="10" x2="100" y2="60" stroke="#64748b" strokeWidth="1" />
          <circle cx="100" cy="60" r="8" fill="#10b981" />
          <circle cx="100" cy="10" r="2" fill="#64748b" />
        </svg>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="text-[10px] text-blue-500/70 tracking-widest font-bold mb-1">CLASSICAL MECHANICS</span>
          <span className="font-serif text-2xl" dangerouslySetInnerHTML={{ __html: "T = 2π√(m/k)" }}></span>
          <span className="text-[7px] tracking-[0.2em] text-slate-500 mt-2">SIMPLE HARMONIC MOTION</span>
        </div>
      </div>
    )
  },
  {
    title: "The Doppler Effect: Definition, Formula, and Real-World Examples",
    date: "Apr 25, 2026",
    readTime: "13 min read",
    author: "Dr. Elena Vasquez",
    category: "WAVES & OPTICS",
    avatarBg: "bg-purple-800",
    Illustration: () => (
      <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg className="w-12 h-12 text-blue-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    )
  },
  {
    title: "Ideal Gas Law: PV = nRT Explained with Examples and Derivation",
    date: "Apr 24, 2026",
    readTime: "14 min read",
    author: "Dr. Sarah Kim",
    category: "THERMODYNAMICS",
    avatarBg: "bg-amber-700",
    Illustration: () => (
      <div className="w-full h-full bg-[#0B1221] relative flex items-center justify-center p-6 text-white overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-80" fill="none">
          <rect x="20" y="20" width="50" height="60" stroke="#3b82f6" strokeWidth="2" fill="#1e3a8a" fillOpacity="0.2" />
          <circle cx="35" cy="40" r="2" fill="#60a5fa" />
          <circle cx="55" cy="60" r="2" fill="#60a5fa" />
          <circle cx="45" cy="30" r="2" fill="#60a5fa" />
          <circle cx="60" cy="40" r="2" fill="#60a5fa" />
          <circle cx="30" cy="70" r="2" fill="#60a5fa" />
          <circle cx="50" cy="75" r="2" fill="#60a5fa" />
        </svg>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <span className="text-[10px] text-blue-500/70 tracking-widest font-bold mb-1">THERMODYNAMICS</span>
          <span className="font-serif text-2xl">PV = nRT</span>
          <span className="text-[7px] tracking-[0.2em] text-slate-500 mt-2">IDEAL GAS LAW</span>
        </div>
      </div>
    )
  }
];

export default function LatestArticlesSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span 
              className="uppercase font-bold tracking-[0.2em] mb-3 block"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgb(59, 130, 246)" }}
            >
              LATEST ARTICLES
            </span>
            <h2 
              className="text-[clamp(32px,4vw,40px)] leading-[1.1] text-slate-900"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "rgb(15, 23, 42)" }}
            >
              Start learning now
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/blog"
              className="text-blue-600 bg-transparent hover:bg-blue-50 px-5 py-2.5 -mr-5 rounded-full transition-all duration-300 flex items-center gap-1.5 group"
              style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "15px" }}
            >
              View all articles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[1px] transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-[20px] overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-300 flex flex-col h-full"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }}
            >
              {/* Illustration Area */}
              <div className="h-[220px] w-full relative">
                <article.Illustration />
                {/* Category Pill Overlaid */}
                <div className="absolute left-6 bottom-5 bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase leading-none">
                  {article.category}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-7 flex flex-col flex-1">
                <div 
                  className="flex items-center gap-2 text-[13px] text-slate-400 mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <span className="text-slate-400/80">{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-slate-400/80">{article.readTime}</span>
                </div>
                
                <h3 
                  className="text-[18px] leading-[1.4] mb-8"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "rgb(15, 23, 42)" }}
                >
                  {article.title}
                </h3>
                
                {/* Author Area */}
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${article.avatarBg} text-[10px]`}>
                      👩‍🔬
                    </div>
                    <span 
                      className="text-[13px]"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "rgb(100, 116, 139)" }}
                    >
                      {article.author}
                    </span>
                  </div>
                  <Link 
                    href="#"
                    className="text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2 -mr-4 rounded-full transition-all duration-300 text-[14px] flex items-center gap-1 group/read"
                    style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
                  >
                    Read
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[1px] transition-transform group-hover/read:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
