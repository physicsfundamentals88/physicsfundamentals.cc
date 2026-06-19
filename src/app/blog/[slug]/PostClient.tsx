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
  List
} from "lucide-react";

interface PostClientProps {
  article: Article;
  latestArticles: { title: string; date: string; category: string; href: string; heroImage?: string | null }[];
}

function getCategorySlug(categoryName: string) {
  if (!categoryName) return "classical-mechanics";
  const cat = categoryName.toLowerCase();
  if (cat.includes("mechanic")) return "classical-mechanics";
  if (cat.includes("electro")) return "electromagnetism";
  if (cat.includes("thermo")) return "thermodynamics";
  if (cat.includes("wave") || cat.includes("optic")) return "waves-optics";
  if (cat.includes("kinematic")) return "kinematics";
  if (cat.includes("modern") || cat.includes("quantum")) return "modern-physics";
  return "classical-mechanics";
}

function processContent(html: string) {
  if (!html) return "";
  
  // Convert block equations: <p>$$Equation$$</p> to <pre><code>Equation</code></pre>
  let processed = html.replace(/<p>\s*\$\$([\s\S]*?)\$\$\s*<\/p>/g, (_match, equation) => {
    return `<pre><code>${equation.trim()}</code></pre>`;
  });

  // Convert inline equations: $Equation$ to <code>Equation</code>
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_match, inlineEq) => {
    return `<code>${inlineEq.trim()}</code>`;
  });

  return processed;
}

export default function PostClient({ article, latestArticles }: PostClientProps) {
  const [activeSection, setActiveSection] = useState("");
  const [tocOpen, setTocOpen] = useState(true); // Default open for desktop-like feel
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Select all images inside the article body and add click listeners to open them in lightbox
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target && target.src) {
        setLightboxImage(target.src);
      }
    };

    const articleBody = document.querySelector(".article-body");
    const images = articleBody?.querySelectorAll("img");
    
    images?.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", handleImageClick);
    });

    return () => {
      images?.forEach((img) => {
        img.removeEventListener("click", handleImageClick);
      });
    };
  }, [article.content, article.sections]);

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

  const categorySlug = getCategorySlug(article.category);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafb] text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Navbar />

      {/* Main Content Area */}
      <div className="pb-24 pt-[106px]">
        <div className="max-w-[1140px] mx-auto px-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <Link href={`/category/${categorySlug}`} className="hover:text-blue-600 transition-colors">{article.category}</Link>
          </nav>

          {/* Article Header Info (Category, Title, Metadata) */}
          <header className="mb-8">
            <span className="inline-block text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100/60 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-slate-950 leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontWeight: 400 }}>
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[10px] uppercase shadow-sm ${article.authorBg || "bg-blue-600"}`}>
                  {article.authorInitials || "PL"}
                </div>
                <span className="font-extrabold text-slate-700">{article.author || "PhysicsLab Team"}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                <span>{article.date}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/7] md:aspect-[21/9] w-full rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm bg-slate-900 mb-12">
            {article.heroImage ? (
              <img 
                src={article.heroImage} 
                alt={article.title} 
                className="w-full h-full object-cover cursor-zoom-in" 
                onClick={() => setLightboxImage(article.heroImage)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0c1524] to-[#1e293b] flex items-center justify-center p-8 text-center text-white/5 font-black text-4xl uppercase select-none font-serif tracking-wider leading-none">
                {article.title}
              </div>
            )}
          </div>

          {/* Two-Column Grid: Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            
            {/* LEFT COLUMN: Article Content */}
            <div className="min-w-0">
              
              {/* Collapsible Table of Contents (Inline, helpful for Mobile/Tablet) */}
              {tocItems.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8 max-w-[540px]">
                  <button 
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full flex items-center justify-between font-black text-slate-700 text-xs tracking-wider uppercase"
                  >
                    <span className="flex items-center gap-2">
                      <List size={15} className="text-slate-500" />
                      Table of Contents
                    </span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {tocOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 border-t border-slate-200 pt-3 flex flex-col gap-2.5 pl-1.5">
                          {tocItems.map((item: any, idx: number) => (
                            <li key={item.id}>
                              <a
                                href={`#${item.id}`}
                                className="text-[13px] text-slate-600 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
                              >
                                <span className="text-[11px] text-slate-400 font-mono font-bold">0{idx + 1}.</span>
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Article content (HTML-based or sections-based) */}
              {article.content ? (
                <>
                  <style>{`
                    .article-body {
                      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                      font-size: 1.1rem;
                      line-height: 1.85;
                      color: #1e293b;
                    }
                    .article-body h1,
                    .article-body h2,
                    .article-body h3,
                    .article-body h4 {
                      color: #0f172a;
                      font-family: var(--font-instrument-serif), Georgia, Cambria, serif;
                      font-weight: 400;
                      letter-spacing: -0.01em;
                    }
                    .article-body h1 {
                      font-size: 2.5rem;
                      margin-top: 3.5rem;
                      margin-bottom: 1.5rem;
                      line-height: 1.15;
                    }
                    .article-body h2 { 
                      font-size: 2rem; 
                      margin-top: 3rem; 
                      margin-bottom: 1.25rem; 
                      line-height: 1.2;
                      border-bottom: 1px solid #e2e8f0;
                      padding-bottom: 0.5rem;
                    }
                    .article-body h3 { 
                      font-size: 1.5rem; 
                      margin-top: 2.25rem; 
                      margin-bottom: 0.85rem; 
                      line-height: 1.25;
                    }
                    .article-body p { 
                      margin-bottom: 1.5rem; 
                    }
                    .article-body pre {
                      background: #f8fafc;
                      border-radius: 1rem;
                      padding: 1.25rem 2rem;
                      margin: 1.25rem 0;
                      text-align: center;
                      overflow-x: auto;
                      border: 1px solid #e2e8f0;
                      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
                    }
                    .article-body pre code {
                      font-size: 1.15rem;
                      font-weight: 500;
                      color: #0f172a;
                      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                      background: none;
                      padding: 0;
                      letter-spacing: 0.02em;
                      border: none;
                    }
                    .article-body :not(pre) > code {
                      background: #f1f5f9;
                      color: #0f172a;
                      padding: 0.2rem 0.4rem;
                      border-radius: 0.35rem;
                      font-size: 0.9em;
                      font-weight: 600;
                      border: 1px solid #e2e8f0;
                    }
                    .article-body blockquote {
                      border-left: 4px solid #2563eb;
                      background: #f8fafc;
                      border-radius: 0 0.75rem 0.75rem 0;
                      padding: 1.5rem;
                      margin: 2rem 0;
                      font-style: italic;
                      color: #475569;
                      font-size: 1.1rem;
                      line-height: 1.7;
                    }
                    .article-body img { 
                      border-radius: 0.75rem; 
                      max-width: 100%; 
                      margin: 2.5rem auto; 
                      border: 1px solid #e2e8f0;
                      display: block;
                    }
                    .article-body ul { 
                      list-style-type: none; 
                      padding-left: 0; 
                      margin-bottom: 1.5rem; 
                    }
                    .article-body ul li { 
                      position: relative; 
                      padding-left: 1.75rem; 
                      margin-bottom: 0.75rem; 
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
                      margin-bottom: 1.5rem;
                    }
                    .article-body ol li {
                      margin-bottom: 0.75rem;
                      padding-left: 0.25rem;
                    }
                    .article-body a { 
                      color: #2563eb; 
                      text-decoration: underline; 
                      text-underline-offset: 3px; 
                      font-weight: 600;
                    }
                    .article-body a:hover {
                      color: #1d4ed8;
                    }
                    .article-body table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 2.5rem 0;
                      font-size: 0.95rem;
                      text-align: left;
                      border-radius: 0.75rem;
                      overflow: hidden;
                      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                      border: 1px solid #e2e8f0;
                    }
                    .article-body th {
                      background-color: #0f172a;
                      color: #ffffff;
                      font-weight: 700;
                      padding: 0.85rem 1.15rem;
                      font-size: 0.85rem;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      border: 1px solid #334155;
                    }
                    .article-body td {
                      padding: 0.85rem 1.15rem;
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
                    dangerouslySetInnerHTML={{ __html: processContent(article.content) }}
                  />
                </>
              ) : (
                /* Fallback for section-based legacy posts */
                <div className="space-y-6">
                  {(article.sections as any[]).map((section: any, idx: number) => {
                    switch (section.type) {
                      case "h2":
                        return <h2 key={idx} id={section.id} className="text-2xl font-bold text-slate-900 mt-10 mb-4 font-serif border-b border-slate-100 pb-2">{section.content}</h2>;
                      case "p":
                        return <p key={idx} className="text-[16px] leading-[1.8] text-slate-600 mb-4">{section.content}</p>;
                      case "formula":
                        return (
                          <div 
                            key={idx} 
                            className="my-4 py-5 px-8 rounded-2xl bg-[#f8fafc] border border-slate-200/80 text-[#0f172a] text-center font-mono text-[1.15rem] font-medium shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                          >
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
            </div>

            {/* RIGHT COLUMN: Sidebar (Sticky on Desktop) */}
            <aside className="lg:sticky lg:top-[100px] space-y-8 pb-12">
              
              {/* Dynamic Scroll-aware Table of Contents Widget */}
              {tocItems.length > 0 && (
                <div className="hidden lg:block bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4">
                    On This Page
                  </h3>
                  <nav className="flex flex-col gap-3">
                    {tocItems.map((item: any) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`text-[13px] font-semibold transition-all pl-3 border-l-2 ${
                            isActive 
                              ? "text-blue-600 border-blue-600 font-bold" 
                              : "text-slate-500 border-slate-100 hover:text-slate-800 hover:border-slate-300"
                          }`}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Latest Posts List Widget */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-5">
                  Latest Articles
                </h3>
                <div className="flex flex-col gap-5">
                  {latestArticles.map((a, i) => (
                    <Link key={i} href={a.href} className="flex gap-3.5 group items-start">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50">
                        {a.heroImage ? (
                          <img src={a.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-[9px] text-white/30 font-bold uppercase select-none">
                            PL
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-0.5">
                          {a.category}
                        </span>
                        <h4 className="text-[13.5px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                        <span className="text-[10.5px] text-slate-400 mt-1 block">{a.date}</span>
                      </div>
                    </Link>
                  ))}
                  {latestArticles.length === 0 && (
                    <p className="text-[12px] text-slate-400 italic">No posts found</p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Section */}
          {related.length > 0 && (
            <section className="mt-20 pt-16 border-t border-slate-200">
              <h3 className="text-2xl font-black text-slate-900 mb-8 font-serif">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <div className="aspect-[16/10] w-full bg-[#0b1221] overflow-hidden flex items-center justify-center relative border-b border-slate-100">
                      {a.heroImage ? (
                        <img src={a.heroImage} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-xs text-white/10 font-bold uppercase italic select-none">
                          {a.category}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
                        {a.category}
                      </span>
                      <h4 className="text-[14.5px] font-extrabold text-slate-900 leading-snug mb-5 flex-1 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={a.href}>{a.title}</Link>
                      </h4>
                      <Link 
                        href={a.href}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close button */}
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
              aria-label="Close image viewer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Zoomed Image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-[85vh] md:max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            >
              <img 
                src={lightboxImage} 
                alt="Fullscreen view" 
                className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
