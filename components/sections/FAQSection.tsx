"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What are the fundamentals of physics?", answer: "At its core, physics fundamentals include classical mechanics, electromagnetism, thermodynamics, and quantum mechanics. These form the basis for understanding everything from falling apples to stars." },
  { question: "Is Physics Fundamentals really free?", answer: "Yes, our core articles and basic interactive simulations are entirely free for students and educators." },
  { question: "Who creates the content on Physics Fundamentals?", answer: "Our content is authored by experienced physics educators, researchers, and PhDs who have a passion for making difficult concepts intuitive." },
  { question: "What topics does Physics Fundamentals cover?", answer: "We cover high school and introductory college-level topics: mechanics, waves, thermodynamics, electricity, magnetism, and modern physics." },
  { question: "How is Physics Fundamentals different from a textbook?", answer: "We use interactive simulations, visual explanations, and modern web technologies to let you play with variables rather than just reading equations." },
  { question: "What is the best way to learn physics fundamentals?", answer: "Active problem solving and playing with simulations. Don't just read—test your intuition by predicting what happens when you change a variable." }
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
            Common questions about physics fundamentals
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
