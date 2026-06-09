"use client";

import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";

export default function EarlyAccessSection() {
  return (
    <section className="py-28 bg-[#0B1221] text-center">
      <div className="max-w-[700px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-6 block"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgb(59, 130, 246)" }}
          >
            EARLY ACCESS
          </span>
          <h2 
            className="text-[clamp(44px,5vw,56px)] leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "white" }}
          >
            Be first to experience<br className="hidden md:block"/> Physics Fundamentals
          </h2>
          <p 
            className="text-[17px] leading-[1.65] mb-12 text-slate-400 font-normal"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            We're building this platform in public. Sign up and you'll get exclusive early access, weekly physics insights, and the chance to shape what we build next.
          </p>

          <form className="flex flex-col sm:flex-row justify-center items-stretch gap-4 max-w-[550px] mx-auto mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full h-[52px] bg-slate-800/40 border border-slate-700/50 rounded-xl px-5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500/10 rounded flex items-center justify-center">
                <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <button 
              type="submit"
              className="px-8 h-[52px] bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-bold transition-colors whitespace-nowrap shadow-[0_4px_14px_rgba(245,158,11,0.2)]"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}
            >
              Get Early Access
            </button>
          </form>
          
          <p className="text-[13px] text-slate-500" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Join 500+ students already on the list. No spam — unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
