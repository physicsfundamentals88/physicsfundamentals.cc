"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Rigorous Academic Coverage",
    description: "From basic kinematics to quantum field principles, explore detailed guides structured to meet high academic standards.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    )
  },
  {
    title: "Hands-On Experiments",
    description: "Tweak variables and immediately watch equations come to life. Run real-time browser labs that replace passive reading.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M10 2v7.31M14 9.31V2M8.5 2h7M14 9.31l6.32 9.5A2 2 0 0 1 18.66 22H5.34a2 2 0 0 1-1.66-3.19L10 9.31" />
        <path d="M6.5 15h11" />
      </svg>
    )
  },
  {
    title: "Targeted Problem Sets",
    description: "Tackle 1,000+ interactive challenges with detailed, step-by-step guidance designed to build deep analytical skills.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    )
  },
  {
    title: "Physical Intuition First",
    description: "Grasp the underlying mechanics before writing any formulas. We train your physical intuition to make learning permanent.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    title: "Animated Vector Models",
    description: "Visualize vector fields, wave behavior, and complex collisions with precision diagram models and animations.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    )
  },
  {
    title: "Open-Access Education",
    description: "High-quality academic resources should be open to all. Access every single lecture, lab, and quiz free of charge.",
    Icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    )
  }
];

export default function HowItWorksSection() {
  return (
    <section 
      id="why" 
      className="py-24 relative" 
      style={{ 
        backgroundColor: "#f8fafc",
        backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "rgb(59, 130, 246)" }}
          >
            The PhysicsLab Difference
          </span>
          <h2 
            className="mb-6 text-[clamp(40px,5vw,60px)] leading-[1.1] text-slate-900 max-w-[800px]"
            style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400, color: "rgb(15, 23, 42)" }}
          >
            The modern learning tools you&apos;ve been waiting for
          </h2>
          <p 
            className="max-w-[800px] text-[20px] leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
          >
            More than a website — it&apos;s a complete learning ecosystem where physics laws become intuitive through real-time interaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[24px] overflow-hidden p-8 flex flex-col border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }}
            >
              <div className="w-[45px] h-[45px] rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <feature.Icon />
              </div>
              <h3 
                className="text-[18px] mb-4"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "rgb(15, 23, 42)" }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-[14px] leading-[1.6]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "rgb(100, 116, 139)" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
