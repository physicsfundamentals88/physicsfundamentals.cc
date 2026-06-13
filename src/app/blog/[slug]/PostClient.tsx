"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { type Article } from "@/db/schema";
import { 
  Clock, 
  Calendar, 
  ChevronDown, 
  Share2
} from "lucide-react";

interface PostClientProps {
  article: Article;
  latestArticles: { title: string; date: string; category: string; href: string; heroImage?: string | null }[];
}

export default function PostClient({ article, latestArticles }: PostClientProps) {
  const [activeSection, setActiveSection] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const tocItems = (article.toc as any[]) || [];
    if (tocItems.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -60% 0px" }
    );

    tocItems.forEach(({ id }: any) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [article.toc]);

  const tocItems = (article.toc as any[]) || [];
  const activeLabel = tocItems.find((item) => item.id === activeSection)?.label || (tocItems[0]?.label ?? "Select Section");

  // Related articles: filter out current article, take up to 3
  const related = latestArticles
    .filter((a) => !a.href.endsWith(`/${article.slug}`))
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fb] text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section - Full-bleed dark blue/black hero block, height exactly 400px */}
      <section className="bg-[#0b1329] text-white pt-[76px] h-[400px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(circle_at_center,white_0%,transparent_80%)]" />
        <div className="max-w-[960px] mx-auto px-6 text-center w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight max-w-[900px] mx-auto font-sans"
          >
            {article.title}
          </motion.h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="pb-24">
        <div className="max-w-[960px] mx-auto px-6">
          
          {/* Featured Image - Centered wide block below hero, uncropped with blurred backdrop */}
          <div className="relative mt-8 mb-12 border border-slate-200/50 shadow-sm bg-slate-950 overflow-hidden rounded-none h-[300px] sm:h-[400px] md:h-[480px] flex items-center justify-center">
            {article.heroImage ? (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-105 pointer-events-none"
                  style={{ backgroundImage: `url(${article.heroImage})` }}
                />
                <img src={article.heroImage} alt={article.title} className="relative z-10 max-w-full max-h-full object-contain" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 text-indigo-100/10 font-bold text-5xl tracking-widest uppercase italic select-none p-10 text-center">
                {article.title}
              </div>
            )}
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-10 items-start">
            
            {/* LEFT COLUMN: Article content */}
            <article className="min-w-0">
              
              {/* Category, Date & Read Time */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[10px] font-extrabold text-[#2563eb] bg-[#eff6ff] px-2.5 py-1 rounded text-center uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-slate-300 mx-1">•</span>
                <span className="text-[12px] text-slate-500 font-bold">Published {article.date}</span>
                <span className="text-slate-300 mx-1">•</span>
                <span className="text-[12px] text-slate-500 font-bold">{article.readTime}</span>
              </div>

              {/* Headline Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-5">
                {article.title}
              </h2>

              {/* Excerpt Lead Paragraph */}
              {article.excerpt && (
                <p className="text-[15.5px] leading-[1.7] text-slate-500 font-normal mb-8">
                  {article.excerpt}
                </p>
              )}

              {/* Article Content */}
              {article.content ? (
                <>
                  <style>{`
                    .article-body h1 { 
                      font-size: 1.65rem; 
                      font-weight: 800; 
                      color: #0f172a; 
                      margin-top: 2.25rem; 
                      margin-bottom: 1rem; 
                    }
                    .article-body h2 { 
                      font-size: 1.45rem; 
                      font-weight: 800; 
                      color: #0f172a; 
                      margin-top: 2rem; 
                      margin-bottom: 1rem; 
                    }
                    .article-body h3 { 
                      font-size: 1.25rem; 
                      font-weight: 700; 
                      color: #1e293b; 
                      margin-top: 1.5rem; 
                      margin-bottom: 0.75rem; 
                    }
                    .article-body p { 
                      font-size: 1rem; 
                      line-height: 1.75; 
                      color: #334155; 
                      margin-bottom: 1.25rem; 
                    }
                    .article-body pre {
                      background: #0f172a;
                      border-radius: 0.75rem;
                      padding: 1.5rem;
                      margin: 2rem 0;
                      text-align: center;
                      overflow-x: auto;
                      border: 1px solid rgba(255,255,255,0.05);
                    }
                    .article-body pre::before {
                      content: '📐 Equation';
                      display: block;
                      font-size: 0.65rem;
                      font-weight: 800;
                      letter-spacing: 0.15em;
                      text-transform: uppercase;
                      color: rgba(255,255,255,0.3);
                      margin-bottom: 0.5rem;
                    }
                    .article-body pre code {
                      font-size: 1.2rem;
                      font-weight: 700;
                      color: #fbbf24;
                      font-family: 'Georgia', serif;
                      background: none;
                      padding: 0;
                    }
                    .article-body :not(pre) > code {
                      background: #f1f5f9;
                      color: #0f172a;
                      padding: 0.15rem 0.35rem;
                      border-radius: 0.25rem;
                      font-size: 0.9em;
                      font-weight: 600;
                      border: 1px solid #e2e8f0;
                    }
                    .article-body blockquote {
                      border-left: 4px solid #2563eb;
                      background: #f8fafc;
                      border-radius: 0 0.5rem 0.5rem 0;
                      padding: 1.25rem;
                      margin: 2rem 0;
                      font-style: italic;
                      color: #475569;
                    }
                    .article-body img { 
                      border-radius: 0.75rem; 
                      max-width: 100%; 
                      margin: 2rem 0; 
                      border: 1px solid #e2e8f0;
                    }
                    .article-body ul { 
                      list-style-type: none; 
                      padding-left: 0; 
                      margin-bottom: 1.25rem; 
                      color: #334155; 
                    }
                    .article-body ul li { 
                      position: relative; 
                      padding-left: 1.75rem; 
                      margin-bottom: 0.75rem; 
                      font-size: 1.025rem; 
                      line-height: 1.7; 
                    }
                    .article-body ul li::before {
                      content: '✓'; 
                      position: absolute; 
                      left: 0; 
                      top: 0; 
                      color: #2563eb; 
                      font-weight: 900; 
                      font-size: 1.1em;
                    }
                    .article-body ol {
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                      color: #334155;
                    }
                    .article-body ol li {
                      margin-bottom: 0.5rem;
                      line-height: 1.7;
                    }
                    .article-body a { 
                      color: #2563eb; 
                      text-decoration: underline; 
                      text-underline-offset: 3px; 
                    }
                    .article-body a:hover {
                      color: #1d4ed8;
                    }
                    .article-body table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 2rem 0;
                      font-size: 0.95rem;
                      text-align: left;
                      border-radius: 0.75rem;
                      overflow: hidden;
                      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                      border: 1px solid #e2e8f0;
                    }
                    .article-body th {
                      background-color: #0f172a;
                      color: #ffffff;
                      font-weight: 700;
                      padding: 0.75rem 1rem;
                      font-size: 0.9rem;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      border: 1px solid #334155;
                    }
                    .article-body td {
                      padding: 0.75rem 1rem;
                      border-bottom: 1px solid #e2e8f0;
                      border-right: 1px solid #e2e8f0;
                      color: #475569;
                    }
                    .article-body td:last-child {
                      border-right: none;
                    }
                    .article-body tr:last-child td {
                      border-bottom: none;
                    }
                    .article-body tr:nth-child(even) {
                      background-color: #f8fafc;
                    }
                  `}</style>
                  <div 
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </>
              ) : (
                /* Fallback for section-based legacy posts */
                <div className="space-y-6">
                  {(article.sections as any[]).map((section: any, idx: number) => {
                    switch (section.type) {
                      case "h2":
                        return <h2 key={idx} id={section.id} className="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4">{section.content}</h2>;
                      case "p":
                        return <p key={idx} className="text-[16px] leading-[1.75] text-slate-600 mb-4">{section.content}</p>;
                      case "formula":
                        return (
                          <div key={idx} className="my-8 p-6 rounded-xl bg-slate-950 text-amber-500 text-center text-xl font-serif">
                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Equation</span>
                            {section.content}
                          </div>
                        );
                      case "quote":
                        return (
                          <blockquote key={idx} className="my-8 px-6 py-4 border-l-4 border-blue-500 bg-slate-50 rounded-r-xl italic text-lg text-slate-700">
                            "{section.content}"
                            {section.author && <cite className="block mt-2 text-xs font-bold text-slate-500 not-italic">— {section.author}</cite>}
                          </blockquote>
                        );
                      case "image":
                        return (
                          <figure key={idx} className="my-8">
                            <img src={section.src} alt="Article visual" className="w-full rounded-xl border border-slate-200" />
                          </figure>
                        );
                      default: 
                        return <div key={idx} dangerouslySetInnerHTML={{ __html: section.content }} />;
                    }
                  })}
                </div>
              )}
            </article>

            {/* RIGHT COLUMN: Sidebar Cards */}
            <aside className="space-y-6">
              
              {/* TABLE OF CONTENTS */}
              <div className="bg-[#eff3f9] rounded-2xl p-5 border border-slate-200/40">
                <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase mb-3">
                  Table of Contents
                </p>
                <div className="relative">
                  <button 
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="truncate">{activeLabel}</span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {tocOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1.5"
                      >
                        {tocItems.map((item: any) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={() => setTocOpen(false)}
                            className={`block text-[12.5px] px-4 py-2 hover:bg-slate-50 transition-colors ${
                              activeSection === item.id 
                                ? "text-blue-600 font-extrabold bg-blue-50/50" 
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {item.label}
                          </a>
                        ))}
                        {tocItems.length === 0 && (
                          <p className="text-[12px] text-slate-400 px-4 py-2 italic">No sections found</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* LATEST POSTS */}
              <div className="bg-[#eff3f9] rounded-2xl p-5 border border-slate-200/40">
                <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase mb-4">
                  Latest Posts
                </p>
                <div className="flex flex-col gap-4">
                  {latestArticles.map((a, i) => (
                    <Link key={i} href={a.href} className="flex gap-3 items-center group">
                      <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200/50">
                        {a.heroImage ? (
                          <img src={a.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-[10px] text-white/20 font-bold select-none uppercase">
                            PL
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-0.5">{a.category}</span>
                        <h4 className="text-[19px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                  {latestArticles.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic">No posts found</p>
                  )}
                </div>
              </div>

            </aside>
          </div>

        </div>
      </div>

      {/* RELATED ARTICLES */}
      {related.length > 0 && (
        <section className="bg-[#edf2f9] border-t border-slate-200/50 py-16">
          <div className="max-w-[960px] mx-auto px-6">
            <h3 className="text-[24px] font-extrabold text-slate-900 mb-8">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="h-40 w-full bg-[#0b1221] overflow-hidden flex items-center justify-center relative">
                    {a.heroImage ? (
                      <img src={a.heroImage} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-[11px] text-white/10 font-bold uppercase italic select-none">
                        {a.category}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      {a.category}
                    </span>
                    <h4 className="text-[14px] font-extrabold text-slate-900 leading-snug mb-5 flex-1 line-clamp-2">
                      {a.title}
                    </h4>
                    <Link 
                      href={a.href}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-4 py-2 w-fit rounded-lg transition-colors inline-block"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
