"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, Layers, Zap, Wind, Orbit, X } from "lucide-react";
import dynamic from "next/dynamic";

const ProjectileSim = dynamic(() => import("@components/simulations/ProjectileSim"), {
  ssr: false,
  loading: () => <div className="text-white text-center py-20 bg-[#0B1221] border border-white/10 rounded-[32px] shadow-2xl">Loading Simulator Engine...</div>
});

const OrbitalSim = dynamic(() => import("@components/simulations/OrbitalSim"), {
  ssr: false,
  loading: () => <div className="text-white text-center py-20 bg-[#0B1221] border border-white/10 rounded-[32px] shadow-2xl">Loading orbital graphics...</div>
});

const simulations = [
  {
    id: "orbital",
    title: "Orbital Mechanics",
    category: "Classical Mechanics",
    desc: "Visualize gravitational pull and stable planetary orbits with real physics parameters.",
    icon: <Orbit className="w-6 h-6" />,
    color: "#3b82f6",
    status: "Interactive",
    component: OrbitalSim
  },
  {
    id: "electric-field",
    title: "Electric Field Lines",
    category: "Electromagnetism",
    desc: "Map the invisible forces between point charges and understand potential gradients.",
    icon: <Zap className="w-6 h-6" />,
    color: "#8b5cf6",
    status: "Coming Soon"
  },
  {
    id: "waves",
    title: "Wave Interference",
    category: "Waves & Optics",
    desc: "Experiment with constructive and destructive interference in ripple tanks.",
    icon: <Wind className="w-6 h-6" />,
    color: "#ec4899",
    status: "Coming Soon"
  },
  {
    id: "gas",
    title: "Kinetic Gas Theory",
    category: "Thermodynamics",
    desc: "Watch how temperature and pressure affect particle collisions in a closed system.",
    icon: <Layers className="w-6 h-6" />,
    color: "#f97316",
    status: "Beta"
  },
  {
    id: "projectile",
    title: "Projectile Dynamics",
    category: "Classical Mechanics",
    desc: "Launch objects and calculate air resistance, parabolic arcs, and landing zones.",
    icon: <Play className="w-6 h-6 text-blue-400 fill-blue-400" />,
    color: "#10b981",
    status: "Interactive",
    component: ProjectileSim
  },
  {
    id: "light",
    title: "Light Refraction",
    category: "Waves & Optics",
    desc: "Adjust indices of refraction to see Snell's Law and total internal reflection in action.",
    icon: <Zap className="w-6 h-6" />,
    color: "#06b6d4",
    status: "Coming Soon"
  }
];

export default function SimulationsClient() {
  const [selectedSim, setSelectedSim] = useState<string | null>(null);

  const ActiveComponent = simulations.find(s => s.id === selectedSim)?.component;

  return (
    <>
      {/* Simulator Modal/Overlay */}
      {selectedSim && ActiveComponent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedSim(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl z-10"
          >
            <button 
              onClick={() => setSelectedSim(null)}
              className="absolute -top-16 right-0 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <ActiveComponent />
          </motion.div>
        </div>
      )}
      
      <section className="pt-[140px] pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase font-bold tracking-[0.3em] text-blue-400 text-[11px] mb-4 block" style={{ fontFamily: "var(--font-dm-sans)" }}>
              INTERACTIVE SIMULATIONS
            </span>
            <h1 className="text-[44px] md:text-[64px] text-white leading-tight mb-6" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              SEE THE PHYSICS <br /> <span className="italic text-blue-400">IN MOTION</span>
            </h1>
            <p className="text-[17px] text-slate-400 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Manipulate variables, test hypotheses, and visualize complex phenomena with our purpose-built physics simulators. 
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {simulations.map((sim, i) => (
              <motion.div
                key={sim.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-[#111827]/40 border border-white/5 rounded-[32px] p-8 hover:bg-[#111827]/60 transition-all hover:border-white/10 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                {/* Status Badge */}
                <div className="absolute top-8 right-8">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    sim.status === "Coming Soon" ? "bg-slate-800 text-slate-400" : 
                    sim.status === "Beta" ? "bg-amber-900/30 text-amber-500" : 
                    "bg-blue-900/30 text-blue-400"
                  }`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {sim.status}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-300" style={{ color: sim.color }}>
                  {sim.icon}
                </div>

                <div className="mb-8">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {sim.category}
                  </span>
                  <h3 className="text-[22px] text-white mb-3" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
                    {sim.title}
                  </h3>
                  <p className="text-[14px] text-slate-400 leading-relaxed font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {sim.desc}
                  </p>
                </div>

                <button 
                  disabled={sim.status === "Coming Soon"}
                  onClick={() => setSelectedSim(sim.id)}
                  className={`flex items-center justify-center w-full py-4 rounded-2xl font-bold text-[14px] transition-all ${
                    sim.status === "Coming Soon" ? "bg-slate-800/50 text-slate-600 cursor-not-allowed" : 
                    "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                  }`}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {sim.status === "Coming Soon" ? "Enabling Soon" : "Launch Simulator"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
