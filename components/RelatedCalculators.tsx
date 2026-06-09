"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const calculators = [
  {
    title: "Projectile Motion",
    category: "Classical Mechanics",
    color: "#4f46e5",
    href: "/calculators/projectile-motion",
  },
  {
    title: "Newton's Second Law",
    category: "Classical Mechanics",
    color: "#3b82f6",
    href: "/calculators/newtons-second-law",
  },
  {
    title: "Kinetic Energy",
    category: "Classical Mechanics",
    color: "#8b5cf6",
    href: "/calculators/kinetic-energy",
  },
  {
    title: "Ohm's Law",
    category: "Electromagnetism",
    color: "#f59e0b",
    href: "/calculators/ohms-law",
  },
  {
    title: "Free Fall",
    category: "Classical Mechanics",
    color: "#10b981",
    href: "/calculators/free-fall",
  },
  {
    title: "Ideal Gas Law",
    category: "Thermodynamics",
    color: "#f97316",
    href: "/calculators/ideal-gas-law",
  },
  {
    title: "Centripetal Force",
    category: "Classical Mechanics",
    color: "#06b6d4",
    href: "/calculators/centripetal-force",
  },
  {
    title: "Snell's Law",
    category: "Waves & Optics",
    color: "#ec4899",
    href: "/calculators/snells-law",
  },
  {
    title: "Coulomb's Law",
    category: "Electromagnetism",
    color: "#6366f1",
    href: "/calculators/coulombs-law",
  },
  {
    title: "Work & Power",
    category: "Classical Mechanics",
    color: "#eab308",
    href: "/calculators/work-power",
  },
  {
    title: "Doppler Effect",
    category: "Waves & Optics",
    color: "#14b8a6",
    href: "/calculators/doppler-effect",
  },
  {
    title: "Momentum",
    category: "Classical Mechanics",
    color: "#ef4444",
    href: "/calculators/momentum",
  },
  {
    title: "Thermal Expansion",
    category: "Thermodynamics",
    color: "#db2777",
    href: "/calculators/thermal-expansion",
  },
  {
    title: "Wave Speed",
    category: "Waves & Optics",
    color: "#0ea5e9",
    href: "/calculators/wave-speed",
  },
  {
    title: "G.P.E",
    category: "Classical Mechanics",
    color: "#1dc0b0",
    href: "/calculators/gravitational-potential-energy",
  },
  {
    title: "Capacitance",
    category: "Electromagnetism",
    color: "#f43f5e",
    href: "/calculators/capacitance",
  },
  {
    title: "Circular Motion",
    category: "Classical Mechanics",
    color: "#06b6d4",
    href: "/calculators/circular-motion",
  },
  {
    title: "Pressure & Density",
    category: "Classical Mechanics",
    color: "#64748b",
    href: "/calculators/pressure-density",
  },
  {
    title: "Frequency",
    category: "Waves & Optics",
    color: "#8b5cf6",
    href: "/calculators/frequency",
  },
  {
    title: "Escape Velocity",
    category: "Classical Mechanics",
    color: "#6366f1",
    href: "/calculators/escape-velocity",
  },
];

export default function RelatedCalculators({ currentSlug, category }: { currentSlug: string; category?: string }) {
  // Filter by category first, then exclude current, then shuffle/slice
  let filtered = calculators.filter(c => c.href !== `/calculators/${currentSlug}`);
  
  if (category) {
    const sameCat = filtered.filter(c => c.category === category);
    if (sameCat.length >= 3) {
      filtered = sameCat;
    }
  }

  // Pick 4 random ones
  const displayed = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Explore More Tools</h2>
            <p className="text-[14px] text-slate-500" style={{ fontFamily: "var(--font-dm-sans)" }}>Continue your physics journey with related calculators.</p>
          </div>
          <Link href="/calculators" className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors" style={{ fontFamily: "var(--font-dm-sans)" }}>
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayed.map((calc, i) => (
            <Link key={calc.title} href={calc.href}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-500/5 group"
              >
                <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center" style={{ background: `${calc.color}15` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: calc.color }} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-dm-sans)" }}>{calc.title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>{calc.category}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
