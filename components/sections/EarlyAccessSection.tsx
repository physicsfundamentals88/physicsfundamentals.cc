"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EarlyAccessSection() {
  return (
    <section id="early-access" className="py-28 bg-[#0B1221] text-center relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div id="join" className="max-w-[700px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span 
            className="inline-flex items-center gap-1.5 uppercase font-bold tracking-[0.2em]"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "rgb(59, 130, 246)" }}
          >
            <Sparkles size={12} className="text-[#FACC15]" />
            EARLY ACCESS
          </span>
          <h2 
            className="text-[clamp(44px,5vw,56px)] leading-[1.1]"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "white" }}
          >
            Join the PhysicsLab Launch
          </h2>
          <p 
            className="text-[17px] leading-[1.65] text-slate-400 font-normal max-w-[580px] mx-auto"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            We're building this platform in public. Secure your early access invite to explore newly launched simulations, receive weekly math insights, and help shape our next visual labs.
          </p>
 
          <div className="pt-4">
            <Link 
              href="/login?mode=register"
              className="inline-flex items-center gap-3 px-10 py-4.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Get Early Access Now
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <p className="text-[13px] text-slate-500 pt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Be part of a growing group of science students and educators. Free and open-access.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

