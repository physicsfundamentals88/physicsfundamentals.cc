"use client";

import React, { useState, useEffect } from "react";
import PostClient from "./PostClient";
import { renderMath } from "@/lib/renderMath";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

interface PostPageClientProps {
  slug: string;
}

export default function PostPageClient({ slug }: PostPageClientProps) {
  const [data, setData] = useState<{ article: any; latestArticles: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.json();
      })
      .then((resData) => {
        if (resData.article) {
          setData(resData);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blog post client-side:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0b1220] text-slate-400">
        <Navbar />
        <main className="flex-1 max-w-[1200px] mx-auto px-6 py-24 w-full animate-pulse">
          <div className="h-6 w-32 bg-slate-800 rounded mb-6" />
          <div className="h-12 w-3/4 bg-slate-800 rounded mb-8" />
          <div className="flex gap-4 mb-12">
            <div className="w-10 h-10 bg-slate-800 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-slate-800 rounded" />
              <div className="w-24 h-3 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="h-[360px] bg-slate-800 rounded-2xl w-full mb-12" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0b1220] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-serif mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8 max-w-md">
            The article you are looking for does not exist or may have been moved.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const { article, latestArticles } = data;
  
  // Render math client-side
  const renderedContent = article.content ? renderMath(article.content) : null;

  return (
    <PostClient
      article={article}
      latestArticles={latestArticles}
      renderedContent={renderedContent}
    />
  );
}
