"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { type Article } from "@/db/schema";

interface PostClientProps {
  article: Article;
  latestArticles: { title: string; date: string; category: string; href: string }[];
}

// ── Shared UI Components ───────────────────────────────────────────────────

function Formula({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-8 rounded-2xl border border-blue-100 bg-[#f0f6ff] overflow-hidden">
      {label && (
        <div className="px-6 py-2 border-b border-blue-100 bg-blue-50">
          <span className="text-[11px] font-bold tracking-[0.16em] text-blue-500 uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>{label}</span>
        </div>
      )}
      <div className="px-6 py-5 text-center text-[22px] font-bold text-slate-800 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
        {children}
      </div>
    </div>
  );
}

function Quote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-blue-400 bg-slate-50 rounded-r-xl py-5 pr-6">
      <p className="text-[16px] leading-[1.8] text-slate-700 italic" style={{ fontFamily: "var(--font-instrument-serif)" }}>
        {children}
      </p>
      {author && (
        <cite className="block mt-3 text-[13px] font-semibold text-slate-500 not-italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
          — {author}
        </cite>
      )}
    </blockquote>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[26px] leading-[1.3] font-bold text-slate-900 mt-14 mb-5 scroll-mt-36" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[19px] leading-[1.4] font-semibold text-slate-800 mt-9 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] leading-[1.85] text-slate-600 mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {children}
    </p>
  );
}

export default function PostClient({ article, latestArticles }: PostClientProps) {
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const tocItems = (article.toc as any[]) || [];
    if (tocItems.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    tocItems.forEach(({ id }: any) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [article.toc]);

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-yellow-200 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-[76px] overflow-hidden bg-[#0b1221]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 pt-20 pb-24 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">{article.category}</span>
            </div>
            
            <h1 className="text-[clamp(32px,6vw,64px)] leading-[1.1] text-white mb-10 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-[14px] text-slate-400">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${article.authorBg} flex items-center justify-center text-[12px] font-bold text-white border-2 border-white/10`}>
                  {article.authorInitials}
                </div>
                <span className="text-white font-medium">{article.author}</span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Published</span>
                <span className="text-slate-300">{article.date}</span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Read Time</span>
                <span className="text-slate-300">{article.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Image Frame */}
        <div className="max-w-[1000px] mx-auto px-6 relative z-20 -mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-[16/9] bg-slate-900"
          >
            {article.heroImage ? (
              <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 text-white/5 font-serif text-6xl break-all px-10 text-center select-none uppercase italic">
                {article.title}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-slate-50/50 pt-32 pb-20">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-16 items-start">
          
          {/* Sidebar Left: TOC */}
          <aside className="hidden lg:block sticky top-32">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-6 flex items-center gap-2">
                  <span className="w-5 h-px bg-slate-200" /> ON THIS PAGE
                </p>
                <nav className="flex flex-col gap-1">
                  {((article.toc as any[]) || []).map((item: any) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`text-[13px] py-2 px-4 rounded-xl transition-all duration-200 border-l-2 ${
                        activeSection === item.id 
                          ? "bg-white border-yellow-400 text-slate-900 shadow-sm font-bold translate-x-1" 
                          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50"
                      }`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {item.label}
                    </a>
                  ))}
                  {((article.toc as any[]) || []).length === 0 && (
                    <p className="text-[12px] text-slate-400 italic px-4">Scroll to read</p>
                  )}
                </nav>
              </div>

              {/* Share Component */}
              <div className="pt-8 border-t border-slate-200">
                 <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">SHARE</p>
                 <div className="flex gap-3">
                    {['fb', 'tw', 'ln'].map(s => (
                      <button key={s} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <div className="w-3 h-3 bg-current rounded-sm" />
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* Article Middle: Content */}
          <article className="min-w-0 bg-white rounded-[40px] p-8 sm:p-12 md:p-16 shadow-sm border border-slate-100">
            {/* Rich Text Content */}
            {article.content ? (
              <>
                {/* Global Equation & Content Styles (scoped to article) */}
                <style>{`
                  .article-body h1 { font-size: 2.4rem; font-weight: 900; color: #0f172a; line-height: 1.2; margin-top: 0.5rem; margin-bottom: 1.75rem; }
                  .article-body h2 { font-size: 1.9rem; font-weight: 800; color: #0f172a; line-height: 1.25; margin-top: 3rem; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid #fde047; }
                  .article-body h3 { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-top: 2rem; margin-bottom: 0.75rem; }
                  .article-body h4 { font-size: 1.15rem; font-weight: 700; color: #334155; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                  .article-body p { font-size: 1.075rem; line-height: 1.9; color: #475569; margin-bottom: 1.25rem; }
                  .article-body pre {
                    background: #0f172a;
                    border-radius: 1.5rem;
                    padding: 2.25rem 2rem;
                    margin: 2.5rem 0;
                    text-align: center;
                    overflow-x: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.07);
                    position: relative;
                  }
                  .article-body pre::before {
                    content: '📐 Physics Equation';
                    display: block;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 1rem;
                  }
                  .article-body pre code {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fbbf24;
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: none;
                    padding: 0;
                    border: none;
                  }
                  .article-body :not(pre) > code {
                    background: #eff6ff;
                    color: #1d4ed8;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.4rem;
                    font-size: 0.9em;
                    font-weight: 700;
                    border: 1px solid #bfdbfe;
                  }
                  .article-body blockquote {
                    border-left: 4px solid #facc15;
                    background: #fffbeb;
                    border-radius: 0 1rem 1rem 0;
                    padding: 1.25rem 1.5rem;
                    margin: 2rem 0;
                    font-style: normal;
                  }
                  .article-body blockquote strong { color: #92400e; }
                  .article-body img { border-radius: 1.5rem; max-width: 100%; margin: 2rem 0; box-shadow: 0 8px 40px rgba(0,0,0,0.1); }
                  .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1.25rem; color: #475569; }
                  .article-body li { margin-bottom: 0.4rem; line-height: 1.75; }
                  .article-body a { color: #2563eb; text-decoration: underline; text-underline-offset: 3px; }
                `}</style>
                <div 
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </>
            ) : (
              /* Fallback for legacy section-based articles */
              <div className="space-y-0">
                {(article.sections as any[]).map((section: any, idx: number) => {
                  switch (section.type) {
                    case "h2":
                      return <h2 key={idx} id={section.id} className="text-3xl font-black text-slate-900 mt-16 mb-6 leading-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{section.content}</h2>;
                    case "p":
                      return <p key={idx} className="text-[17px] leading-[1.9] text-slate-600 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>{section.content}</p>;
                    case "formula":
                      return (
                        <div key={idx} className="my-10 p-8 rounded-3xl bg-slate-900 text-yellow-400 text-center text-2xl font-serif shadow-xl">
                           <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-4">{section.label || "The Formula"}</span>
                           {section.content}
                        </div>
                      );
                    case "quote":
                      return (
                        <blockquote key={idx} className="my-12 px-8 py-6 border-l-4 border-yellow-400 bg-yellow-50/50 rounded-r-3xl italic text-xl text-slate-800">
                           "{section.content}"
                           {section.author && <cite className="block mt-4 text-sm font-bold text-slate-500 not-italic">— {section.author}</cite>}
                        </blockquote>
                      );
                    case "image":
                      return (
                        <figure key={idx} className="my-12">
                           <img src={section.src} alt="Article visual" className="w-full rounded-[32px] border border-slate-100 shadow-lg" />
                        </figure>
                      );
                    default: return <div key={idx} dangerouslySetInnerHTML={{ __html: section.content }} />;
                  }
                })}
              </div>
            )}

            {/* Author Footer Card */}
            <div className="mt-20 pt-12 border-t border-slate-100">
               <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start p-8 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className={`w-20 h-20 rounded-2xl ${article.authorBg} flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 rotate-3`}>
                    {article.authorInitials}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{article.author}</h4>
                    <p className="text-[15px] text-slate-500 leading-relaxed max-w-[500px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      A leading physics researcher and educator dedicated to visual storytelling and mathematical clarity. 
                      Sarah contributes to the PhysicsLab initiative to inspire the next generation of scientists.
                    </p>
                    <div className="flex gap-4 mt-6">
                       <button className="text-[12px] font-bold text-blue-600 hover:underline">Follow Author</button>
                       <button className="text-[12px] font-bold text-slate-400 hover:underline">View Publications</button>
                    </div>
                  </div>
               </div>
            </div>
          </article>

          {/* Sidebar Right: Trending/Latest */}
          <aside className="hidden lg:block sticky top-32 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[12px] font-bold tracking-widest text-slate-900 uppercase">Latest Insights</h3>
               </div>
               <div className="p-2 space-y-1">
                  {latestArticles.map((a, i) => (
                    <Link key={i} href={a.href} className="flex flex-col p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                       <span className="text-[9px] font-black tracking-widest text-blue-500 uppercase mb-1.5">{a.category}</span>
                       <span className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                         {a.title}
                       </span>
                    </Link>
                  ))}
               </div>
               <div className="p-6 border-t border-slate-100">
                 <Link href="/blog" className="w-full py-3 bg-[#0b1221] text-white rounded-xl text-center text-[12px] font-bold block hover:bg-slate-800 transition-colors shadow-lg shadow-black/10">
                   Explore All Posts
                 </Link>
               </div>
            </div>

            {/* Newsletter Mini Callout */}
            <div className="rounded-3xl bg-yellow-400 p-8 shadow-xl shadow-yellow-200/50 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
               <h3 className="text-xl font-black text-[#0b1221] mb-2 leading-tight">Master Physics Visuals.</h3>
               <p className="text-[13px] text-[#0b1221]/70 font-medium mb-6">Weekly insights on interactive learning delivered to your inbox.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="bg-white/30 border-none outline-none rounded-lg px-3 py-2 text-[12px] w-full placeholder:text-[#0b1221]/50" />
                  <button className="bg-[#0b1221] text-white p-2 rounded-lg"><div className="w-3 h-3 bg-white mask-[url(https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/send.svg)]" /></button>
               </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
