"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const concepts = [
  {
    category: "CLASSICAL MECHANICS",
    title: "Newton's Laws of Motion",
    description: "Detailed explanation of exactly how every force and interaction works, starting from first classical mechanics principles to predict rocket trajectories.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="75" y="40" width="50" height="40" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <path d="M125 60 L165 60" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-amber)" />
        <path d="M75 60 L35 60" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-amber)" />
        <path d="M100 40 L100 15" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-blue)" />
        <defs>
          <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    )
  },
  {
    category: "WAVES & OPTICS",
    title: "Transverse Waves Explained",
    description: "Definition, labeled diagram, wavelength, amplitude, frequency, polarization — with real examples from light to guitar strings. 6,800 words.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 50 Q 50 10, 80 50 T 140 50 T 200 50" stroke="#3b82f6" strokeWidth="3" fill="transparent" />
        <path d="M20 50 L 200 50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M80 50 L 140 50" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" markerStart="url(#arrow-green-start)" />
        <text x="110" y="45" fill="#22c55e" fontSize="10" textAnchor="middle" fontWeight="bold">λ</text>
        <defs>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="arrow-green-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>
      </svg>
    )
  },
  {
    category: "THERMODYNAMICS",
    title: "What Is Energy?",
    description: "Kinetic, potential, and thermal energy explained. The conservation of energy law and why it is the most important principle in all of physics.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="100" cy="50" r="12" fill="#3b82f6" />
        <circle cx="50" cy="50" r="8" fill="#f59e0b" />
        <circle cx="150" cy="50" r="8" fill="#f59e0b" />
        <path d="M100 50 L50 50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M100 50 L150 50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <text x="100" y="30" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">KE</text>
        <text x="50" y="30" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">PE</text>
        <text x="150" y="30" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">PE</text>
      </svg>
    )
  },
  {
    category: "CLASSICAL MECHANICS",
    title: "Projectile Motion",
    description: "Range, max height, time of flight equations with full worked examples. Why 45° maximises range and common exam mistakes corrected.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M 20 80 Q 100 0, 180 80" stroke="#3b82f6" strokeWidth="3" fill="transparent" />
        <path d="M 20 80 L 180 80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="20" cy="80" r="6" fill="#3b82f6" />
        <path d="M 20 80 L 60 40" stroke="#f59e0b" strokeWidth="2" />
        <path d="M 100 80 L 100 40" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
        <text x="100" y="35" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">H</text>
        <text x="35" y="50" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">V₀</text>
        <text x="45" y="75" fill="#10b981" fontSize="8" textAnchor="middle" fontWeight="bold">θ</text>
      </svg>
    )
  },
  {
    category: "WAVES & OPTICS",
    title: "Wave Speed, Frequency & Wavelength",
    description: "The universal wave equation v = fλ explained from first principles. From sound waves to light — worked examples and Doppler effect.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="100" y="35" fill="#0f172a" fontSize="20" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-dm-sans)">v = fλ</text>
        <rect x="30" y="50" width="40" height="20" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
        <text x="50" y="64" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">v</text>
        <rect x="80" y="50" width="40" height="20" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
        <text x="100" y="64" fill="#f59e0b" fontSize="12" textAnchor="middle" fontWeight="bold">f</text>
        <rect x="130" y="50" width="40" height="20" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
        <text x="150" y="64" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold">λ</text>
        <text x="50" y="85" fill="#64748b" fontSize="8" textAnchor="middle">speed</text>
        <text x="100" y="85" fill="#64748b" fontSize="8" textAnchor="middle">frequency</text>
        <text x="150" y="85" fill="#64748b" fontSize="8" textAnchor="middle">wavelength</text>
      </svg>
    )
  },
  {
    category: "CLASSICAL MECHANICS",
    title: "Conservation of Momentum",
    description: "The principle behind every collision. Elastic vs inelastic collisions, centre of mass, worked examples, and why momentum never disappears.",
    link: "/blog",
    Illustration: () => (
      <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="60" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle" letterSpacing="1">BEFORE</text>
        <text x="140" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle" letterSpacing="1">AFTER</text>
        <circle cx="30" cy="50" r="10" fill="#60a5fa" />
        <circle cx="65" cy="50" r="6" fill="#818cf8" />
        <circle cx="130" cy="50" r="14" fill="#a78bfa" opacity="0.6" />
        <path d="M 45 50 L 55 50" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-amber)" />
        <path d="M 150 50 L 170 50" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
        <path d="M 90 50 L 105 50" stroke="#cbd5e1" strokeWidth="1" markerEnd="url(#arrow-gray)" />
        <text x="100" y="80" fill="#0f172a" fontSize="8" textAnchor="middle" fontWeight="bold">p₁ + p₂ = p₁&apos; + p₂&apos;</text>
        <text x="100" y="90" fill="#64748b" fontSize="7" textAnchor="middle">Total momentum is conserved</text>
        <defs>
          <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
          </marker>
        </defs>
      </svg>
    )
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white" aria-label="Core physics concepts">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "rgb(59, 130, 246)" }}
          >
            Core Concepts
          </span>
          <h2 
            className="mb-5 text-[clamp(40px,5vw,60px)] leading-[1.1] text-slate-900"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "rgb(15, 23, 42)" }}
          >
            The laws that run our universe
          </h2>
          <p 
            className="max-w-[700px] text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(51, 65, 85)" }}
          >
            Physics fundamentals are precise descriptions of how every force and matter exists, moves, and interacts. Every branch of science and engineering builds on these foundations.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {concepts.map((concept, index) => (
            <div
              key={index}
              className="group bg-white rounded-[24px] overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 flex flex-col"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }}
            >
              {/* Card Illustration Area */}
              <div className="h-[200px] bg-[#f8fafc] w-full flex items-center justify-center p-6 border-b border-slate-100 relative overflow-hidden" aria-hidden="true">
                <concept.Illustration />
              </div>

              {/* Card Content Area */}
              <div className="p-8 flex flex-col flex-1">
                <div 
                  className="inline-block px-3 py-1 bg-[#eff6ff] rounded-full text-blue-600 text-xs font-bold tracking-wider mb-4 self-start"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {concept.category}
                </div>
                <h3 
                  className="text-xl mb-3"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "rgb(15, 23, 42)" }}
                >
                  {concept.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
                >
                  {concept.description}
                </p>
                <Link 
                  href={concept.link}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors group/link mt-auto w-fit"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "15px" }}
                >
                  Read the guide
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <Link 
            href="/blog"
            className="flex items-center gap-2 text-blue-600 bg-transparent hover:bg-blue-50 hover:text-blue-700 px-6 py-3 rounded-full transition-all duration-300 font-medium text-[16px] group"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Browse all physics articles
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
