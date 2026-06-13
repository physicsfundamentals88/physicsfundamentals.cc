"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What are the core topics covered on PhysicsLab?", answer: "PhysicsLab covers the essential foundations of physical science: classical mechanics, waves and optics, thermodynamics, electromagnetism, and introductory modern physics." },
  { question: "Is it free to use the labs and simulators?", answer: "Yes! Every simulation, virtual sandbox lab, course curriculum, and article on our platform is completely open-access and free to use for both self-directed students and teachers." },
  { question: "Who develops the learning material?", answer: "Our visual resources, mathematical explanations, and simulations are created by a dedicated team of physics educators, academic researchers, and developers focused on visual science learning." },
  { question: "What level of physics is this built for?", answer: "Our content is structured for AP physics, high school students, and college-level introductory courses. It works well as a study companion alongside standard textbooks." },
  { question: "How do interactive sandboxes help me learn?", answer: "Rather than reading passive formulas, you can directly tweak variables (like gravity strength, wavelength, or charge) in real-time, helping you build spatial intuition for how physical formulas translate to reality." },
  { question: "What is the most effective study routine?", answer: "We recommend starting with our visual explanations to build intuition, running interactive simulations to test scenarios, and practicing our step-by-step problem sets to reinforce the math." }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[700px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span 
            className="uppercase font-bold tracking-[0.2em] mb-4 block" 
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "rgb(59, 130, 246)" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 
            className="text-[clamp(28px,4vw,36px)] leading-[1.2]" 
            style={{ fontFamily: "var(--font-instrument-serif)", color: "rgb(15, 23, 42)" }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div key={i} className={`border-b border-slate-100 transition-colors ${openIndex === i ? 'border-transparent' : ''}`}>
               <button 
                 onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                 className={`w-full flex items-center justify-between py-5 text-left transition-all ${openIndex === i ? 'text-blue-600 bg-blue-50/50 border border-blue-400 rounded-lg px-4 -mx-4 mt-2 shadow-sm' : 'text-slate-800 px-0 hover:text-blue-600'}`}
                 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: "15px" }}
               >
                 {faq.question}
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180 text-blue-500' : ''}`} />
               </button>
               <AnimatePresence>
                 {openIndex === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className="overflow-hidden"
                   >
                     <div className="pb-5 pt-2 text-slate-500 leading-relaxed text-[15px] px-0" style={{ fontFamily: "var(--font-dm-sans)" }}>
                       {faq.answer}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
