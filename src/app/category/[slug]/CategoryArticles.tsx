"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CategoryArticlesProps {
  categoryName: string;
}

export default function CategoryArticles({ categoryName }: CategoryArticlesProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter articles by category name (case-insensitive check)
          const filtered = data.filter(
            (art: any) => art.category?.toLowerCase() === categoryName.toLowerCase()
          );
          setArticles(filtered);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load category articles:", err);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-slate-100 rounded" />
              <div className="w-1/4 h-3 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <p className="text-slate-400 text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
        No articles published under this topic yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((art) => (
        <Link key={art.slug} href={`/blog/${art.slug}`} className="block group">
          <div className="flex gap-4 items-start">
            {art.heroImage && (
              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={art.heroImage}
                  alt={art.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div>
              <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {art.title}
              </h3>
              <p className="text-[12px] text-slate-400 mt-1">{art.date}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
