"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

const categories = ["ALL", "CLASSICAL MECHANICS", "THERMODYNAMICS", "WAVES & OPTICS", "ELECTROMAGNETISM", "KINEMATICS", "MODERN PHYSICS"];

interface BlogClientProps {
  initialArticles: any[];
}

export default function BlogClient({ initialArticles }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [articles, setArticles] = useState<any[]>(initialArticles);

  useEffect(() => {
    // Parse category query parameter from URL on client side
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    if (catParam) {
      const matched = categories.find((c) => c.toLowerCase() === catParam.toLowerCase());
      if (matched) {
        setActiveCategory(matched);
      }
    }
  }, []);

  const filtered =
    activeCategory === "ALL"
      ? articles
      : articles.filter((a) => a.category?.toUpperCase() === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero section */}
      <section className="mt-[76px] py-16 bg-[#0b1221] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 60% 50%, rgba(59,130,246,0.6) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(99,102,241,0.4) 0%, transparent 50%)",
          }}
        />

        <div className="max-w-[860px] mx-auto px-6 sm:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span
              className="uppercase font-bold tracking-[0.22em] mb-5 block text-blue-400"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11 }}
            >
              BLOG
            </span>
            <h1
              className="text-[clamp(36px,6vw,64px)] leading-[1.1] text-white mb-6"
              style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}
            >
              Physics Fundamentals Blog
            </h1>
            <p
              className="text-[17px] leading-[1.75] text-slate-400 max-w-[600px]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              In-depth articles on physics fundamentals written by physicists and educators.
              Clear explanations, real-world examples, and the conceptual depth you won&apos;t find in
              a typical textbook.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.08em] transition-all duration-200 whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  background: activeCategory === cat ? "#0b1221" : "transparent",
                  color: activeCategory === cat ? "#ffffff" : "#64748b",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="pt-10 pb-16 bg-white flex-1">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((article, index) => (
              <Link 
                key={article.slug} 
                href={`/blog/${article.slug}`}
                className="group flex flex-col h-full"
              >
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="bg-white rounded-[20px] overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full"
                >
                  <div className="h-[200px] relative w-full bg-[#0b1221] overflow-hidden flex items-center justify-center">
                    {article.heroImage ? (
                      <img 
                        src={article.heroImage} 
                        alt={article.title} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                           <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at center, #3b82f6 0%, transparent 70%)", opacity: 0.2 }}></div>
                        </div>
                        <div className="relative z-10 text-center p-6">
                           <span className="text-[10px] text-blue-400 tracking-[0.2em] font-bold block mb-2">{article.category}</span>
                           <span className="font-serif text-xl block leading-tight text-white">{article.title}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${article.authorBg || 'bg-blue-600'} text-white text-[9px] font-bold shrink-0`}>
                        {article.authorInitials || 'PL'}
                      </div>
                      <span className="text-[13px] text-slate-400">{article.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-[13px] text-slate-400">{article.readTime}</span>
                    </div>

                    <h2
                      className="text-[17px] leading-[1.45] font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {article.title}
                    </h2>

                    <p
                      className="text-[14px] leading-[1.75] text-slate-500 mb-6 flex-1 line-clamp-3"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {article.excerpt}
                    </p>

                    <div
                      className="flex items-center gap-1.5 text-blue-600 font-medium text-[14px] rounded-full transition-all duration-300 w-fit"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Read article
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>
              No articles in this category yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
