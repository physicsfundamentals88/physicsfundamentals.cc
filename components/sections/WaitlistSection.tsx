"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const leftFeatures = [
  "Interactive lectures across major scientific disciplines",
  "Extensive library of verified problem sets with answers",
  "Handy reference cards and equation cheat-sheets",
  "Collaborative student forums and study boards",
];

const rightFeatures = [
  "Real-time sandbox labs and dynamic vector modeling",
  "Step-by-step video lessons and experiment visualizers",
  "Personalized study roadmaps matched to your curriculum",
  "No subscription fees or paywalls ever",
];

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="py-24 bg-[#0a0f1e] my-[40px] relative">
      <div className="max-w-[900px] mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgb(59, 130, 246)" }}
          >
            COMING SOON
          </span>
          <h2 
            className="text-[clamp(40px,5vw,60px)] leading-[1.05]"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "rgb(255, 255, 255)" }}
          >
            A Complete Arsenal of Tools<br className="hidden md:block"/> for Aspiring Scientists
          </h2>
        </motion.div>

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-20">
          <div className="flex flex-col gap-6">
            {leftFeatures.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <Check className="w-[18px] h-[18px] text-[#3b82f6] shrink-0 mt-[4px]" strokeWidth={3} />
                <span 
                  className="text-[16px] leading-[28px]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(226, 232, 240)" }}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {rightFeatures.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <Check className="w-[18px] h-[18px] text-[#3b82f6] shrink-0 mt-[4px]" strokeWidth={3} />
                <span 
                  className="text-[16px] leading-[28px]"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(226, 232, 240)" }}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link 
            href="#join"
            className="inline-flex items-center justify-center transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 600,
              fontSize: "16px",
              color: "rgb(11, 18, 33)",
              backgroundColor: "#f59e0b",
              padding: "16px 36px",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(245,158,11,0.2)",
            }}
          >
            Join the waitlist — it&apos;s free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
