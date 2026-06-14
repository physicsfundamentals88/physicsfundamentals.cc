import type { Metadata } from "next";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { eq, ne, and, desc } from "drizzle-orm";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { notFound } from "next/navigation";
import React from "react";
import Breadcrumbs from "@components/Breadcrumbs";

// Category slug mapping
const categoryMapping: Record<string, { name: string; desc: string; color: string; bg: string; icon: string }> = {
  "classical-mechanics": {
    name: "Classical Mechanics",
    desc: "Explore Newtonian dynamics, forces, projectile trajectories, orbital mechanics, gravity, and kinetics with interactive solvers.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    icon: "☄️"
  },
  "electromagnetism": {
    name: "Electromagnetism",
    desc: "Determine electrostatic forces, electric fields, capacitor properties, resistance, and charge distribution.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    icon: "⚡"
  },
  "thermodynamics": {
    name: "Thermodynamics",
    desc: "Understand ideal gas behaviors, PV=nRT state equations, thermal expansion, entropy, and heat transfer equations.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    icon: "🔥"
  },
  "waves-optics": {
    name: "Waves & Optics",
    desc: "Analyze sound frequency shifts, refraction indexes, Doppler effects, wavelengths, and interference properties.",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    icon: "🌊"
  },
  "kinematics": {
    name: "Kinematics",
    desc: "Study the motion of points, objects, and groups of objects without reference to the causes of motion.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    icon: "⏱️"
  },
  "modern-physics": {
    name: "Modern Physics",
    desc: "Delve into quantum mechanics, relativity, atomic structure, and modern theories of the universe.",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
    icon: "⚛️"
  }
};

const staticCalculators = [
  { title: "Projectile Motion Calculator", category: "Classical Mechanics", desc: "Calculate max height, flight time, range, and trajectories.", href: "/calculators/projectile-motion" },
  { title: "Newton's Second Law Calculator", category: "Classical Mechanics", desc: "Calculate force, mass, or acceleration with F = ma.", href: "/calculators/newtons-second-law" },
  { title: "Kinetic Energy Calculator", category: "Classical Mechanics", desc: "Compute kinetic energy, mass, or speed easily.", href: "/calculators/kinetic-energy" },
  { title: "Ohm's Law Calculator", category: "Electromagnetism", desc: "Solve voltage, current, and resistance equations.", href: "/calculators/ohms-law" },
  { title: "Free Fall Calculator", category: "Classical Mechanics", desc: "Determine height, speed, and time of falling bodies.", href: "/calculators/free-fall" },
  { title: "Ideal Gas Law Calculator", category: "Thermodynamics", desc: "Input state values to calculate PV = nRT variables.", href: "/calculators/ideal-gas-law" },
  { title: "Centripetal Force Calculator", category: "Classical Mechanics", desc: "Calculate circular acceleration and required center-seeking force.", href: "/calculators/centripetal-force" },
  { title: "Snell's Law Calculator", category: "Waves & Optics", desc: "Solve light refraction angles and medium refractive indexes.", href: "/calculators/snells-law" },
  { title: "Coulomb's Law Calculator", category: "Electromagnetism", desc: "Calculate electrostatic attraction and repulsion forces.", href: "/calculators/coulombs-law" },
  { title: "Work & Power Calculator", category: "Classical Mechanics", desc: "Evaluate work done and mechanical energy output per unit of time.", href: "/calculators/work-power" },
  { title: "Doppler Effect Calculator", category: "Waves & Optics", desc: "Compute frequency changes for moving sound sources or observers.", href: "/calculators/doppler-effect" },
  { title: "Momentum Calculator", category: "Classical Mechanics", desc: "Find momentum and impulse changes with p = mv.", href: "/calculators/momentum" },
  { title: "Thermal Expansion Calculator", category: "Thermodynamics", desc: "Predict structural length differences due to heat changes.", href: "/calculators/thermal-expansion" },
  { title: "Wave Speed Calculator", category: "Waves & Optics", desc: "Solve frequency, speed, and wavelength variables.", href: "/calculators/wave-speed" },
  { title: "Gravitational Potential Energy Calculator", category: "Classical Mechanics", desc: "Calculate potential energy height factors with U = mgh.", href: "/calculators/gravitational-potential-energy" },
  { title: "Capacitance Calculator", category: "Electromagnetism", desc: "Calculate capacitance, potential, and charge ratios with C = Q/V.", href: "/calculators/capacitance" },
  { title: "Circular Motion Calculator", category: "Classical Mechanics", desc: "Find angular frequency, linear velocity, and time periods.", href: "/calculators/circular-motion" },
  { title: "Pressure & Density Calculator", category: "Classical Mechanics", desc: "Calculate fluid density or forces exerted over a surface area.", href: "/calculators/pressure-density" },
  { title: "Frequency Calculator", category: "Waves & Optics", desc: "Calculate cycle frequencies, intervals, and angular rates.", href: "/calculators/frequency" },
  { title: "Escape Velocity Calculator", category: "Classical Mechanics", desc: "Compute launch velocities needed to exit planetary gravitation fields.", href: "/calculators/escape-velocity" }
];

const staticSimulations = [
  { id: "orbital", title: "Orbital Mechanics", category: "Classical Mechanics", desc: "Visualize gravitational pull and stable planetary orbits with real physics parameters.", color: "#3b82f6", isLive: true },
  { id: "projectile", title: "Projectile Dynamics", category: "Classical Mechanics", desc: "Launch objects and calculate air resistance, parabolic arcs, and landing zones.", color: "#10b981", isLive: true },
  { id: "electric-field", title: "Electric Field Lines", category: "Electromagnetism", desc: "Map the invisible forces between point charges and understand potential gradients.", color: "#8b5cf6", isLive: false },
  { id: "waves", title: "Wave Interference", category: "Waves & Optics", desc: "Experiment with constructive and destructive interference in ripple tanks.", color: "#ec4899", isLive: false },
  { id: "gas", title: "Kinetic Gas Theory", category: "Thermodynamics", desc: "Watch how temperature and pressure affect particle collisions in a closed system.", color: "#f97316", isLive: true },
  { id: "light", title: "Light Refraction", category: "Waves & Optics", desc: "Adjust indices of refraction to see Snell's Law and total internal reflection in action.", color: "#06b6d4", isLive: false }
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = categoryMapping[slug];
  if (!config) return {};

  return {
    title: `${config.name} Hub | Physics Fundamentals`,
    description: config.desc,
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = categoryMapping[slug];
  if (!config) {
    notFound();
  }

  // Query articles in this category from SQLite
  let categoryArticles: any[] = [];
  try {
    const db = getDb();
    categoryArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.category, config.name),
          ne(articles.status, "Draft"),
          ne(articles.status, "draft")
        )
      )
      .orderBy(desc(articles.createdAt));
  } catch (e) {
    console.error(`Failed to fetch articles for category ${config.name}:`, e);
  }

  const categoryCalculators = staticCalculators.filter(c => c.category === config.name);
  const categorySimulations = staticSimulations.filter(s => s.category === config.name);

  // Breadcrumbs items
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Topics", item: "/calculators" },
    { name: config.name, item: `/category/${slug}` }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />

      {/* Header Hub Section */}
      <div className="pt-[110px] pb-12 bg-white border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <Breadcrumbs items={breadcrumbItems} themeColor="blue" />
          
          <div className="flex items-center gap-4 mt-6">
            <span className="text-4xl p-3 bg-slate-50 rounded-2xl border border-slate-100">
              {config.icon}
            </span>
            <div>
              <h1 
                className="text-[38px] md:text-[48px] leading-[1.1] font-bold text-slate-900" 
                style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
              >
                {config.name}
              </h1>
              <p 
                className="text-[16px] text-slate-500 max-w-[700px] leading-relaxed mt-2" 
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {config.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 sm:px-8 py-16 flex-1 w-full">
        {/* Hub grid sections */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
          <div className="space-y-16">
            
            {/* 1. Simulations section */}
            {categorySimulations.length > 0 && (
              <div>
                <h2 
                  className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2" 
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <span>Interactive Simulations</span>
                  <span className="text-[12px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {categorySimulations.length}
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {categorySimulations.map(sim => (
                    <div 
                      key={sim.title} 
                      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span 
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                            style={{ color: sim.color }}
                          >
                            Interactive
                          </span>
                          {!sim.isLive && (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">
                              Beta / Soon
                            </span>
                          )}
                        </div>
                        <h3 className="text-[18px] font-bold text-slate-800 mb-2">{sim.title}</h3>
                        <p className="text-[13px] text-slate-500 leading-relaxed mb-6">{sim.desc}</p>
                      </div>
                      
                      <Link 
                        href="/simulations" 
                        className="w-full text-center py-3 rounded-xl bg-[#0b1221] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {sim.isLive ? "Launch Simulator" : "Preview"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Calculators section */}
            <div>
              <h2 
                className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2" 
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <span>Step-by-Step Solvers</span>
                <span className="text-[12px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                  {categoryCalculators.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {categoryCalculators.map(calc => (
                  <div 
                    key={calc.title} 
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-800 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {calc.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                        {calc.desc}
                      </p>
                    </div>
                    
                    <Link 
                      href={calc.href}
                      className="inline-flex items-center justify-between text-[13px] font-bold text-indigo-600 group-hover:translate-x-1 transition-transform"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <span>Go to Calculator</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Blog Articles */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 
              className="text-lg font-bold text-slate-900 mb-6" 
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Latest {config.name} Articles
            </h2>
            
            {categoryArticles.length > 0 ? (
              <div className="space-y-6">
                {categoryArticles.map(art => (
                  <Link 
                    key={art.slug} 
                    href={`/blog/${art.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-4 items-start">
                      {art.heroImage && (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          <img src={art.heroImage} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[12px] text-slate-400 mt-1">{art.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                No articles published under this topic yet. Check back soon!
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
