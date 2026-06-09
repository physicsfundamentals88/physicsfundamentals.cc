"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronDown, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckSquare,
  Square,
  BarChart3,
  Calendar,
  FileText
} from "lucide-react";

export default function AdminBlogListing() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then(res => res.json())
      .then(data => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleSelectAll = () => {
    if (selected.length === articles.length) {
      setSelected([]);
    } else {
      setSelected(articles.map(a => a.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Content Library</h1>
           <p className="text-[#64748B] font-medium mt-1">Manage and optimize your published physics articles and educational content.</p>
        </div>
        <Link 
          href="/admin/blog/create" 
          className="flex items-center gap-2 bg-[#FACC15] text-[#0F172A] px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 w-fit"
        >
          <Plus size={18} />
          Add New Post
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-[#0F172A]" />
           <input 
            type="text" 
            placeholder="Search posts by title, slug or tag..." 
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:border-[#FACC15] focus:bg-white outline-none transition-all placeholder:text-slate-400"
           />
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
           <div className="flex-1 md:flex-none relative">
              <select className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-5 py-3 pr-10 text-xs font-black uppercase tracking-widest text-[#64748B] outline-none focus:border-[#FACC15] cursor-pointer w-full">
                 <option>All Status</option>
                 <option>Published</option>
                 <option>Drafts</option>
                 <option>Scheduled</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
           <div className="flex-1 md:flex-none relative">
              <select className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-5 py-3 pr-10 text-xs font-black uppercase tracking-widest text-[#64748B] outline-none focus:border-[#FACC15] cursor-pointer w-full">
                 <option>Categories</option>
                 <option>Electromagnetism</option>
                 <option>Thermodynamics</option>
                 <option>Mechanics</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
           <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1E293B] transition-colors">
              Bulk Actions
              <ChevronDown size={14} />
           </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                <th className="px-6 py-5 w-10">
                   <button onClick={toggleSelectAll} className="text-slate-400 hover:text-[#FACC15] transition-colors">
                      {selected.length === articles.length && articles.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                   </button>
                </th>
                <th className="px-6 py-5">Article details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">SEO Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] whitespace-nowrap">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-6 py-10 animate-pulse bg-slate-50/20"></td></tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                           <FileText size={40} />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[#0F172A] font-black text-lg">No posts found</p>
                           <p className="text-[#64748B] text-sm font-medium">Get started by creating your first professional article.</p>
                        </div>
                        <Link href="/admin/blog/new" className="mt-4 px-8 py-3 bg-[#FACC15] text-[#0F172A] rounded-xl font-black text-[13px] uppercase tracking-widest shadow-lg shadow-yellow-500/10">
                           Create New Post
                        </Link>
                     </div>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className={`hover:bg-[#F8FAFC] transition-colors group ${selected.includes(article.id) ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-6">
                       <button onClick={() => toggleSelect(article.id)} className={`transition-colors ${selected.includes(article.id) ? "text-[#FACC15]" : "text-slate-300 hover:text-slate-400"}`}>
                          {selected.includes(article.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                       </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4 min-w-[300px]">
                         <div className="w-12 h-12 rounded-xl border border-[#E2E8F0] bg-slate-50 flex-shrink-0 relative overflow-hidden group-hover:border-[#FACC15] transition-all">
                            {article.heroImage ? (
                               <img src={article.heroImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <div className="flex items-center justify-center w-full h-full text-[10px] font-black text-slate-300 uppercase">IMG</div>
                            )}
                         </div>
                         <div className="flex flex-col min-w-0">
                            <span className="font-black text-[#0F172A] group-hover:text-[#3b82f6] transition-colors truncate">{article.title}</span>
                            <span className="text-[11px] font-bold text-slate-400 mt-0.5 font-mono">{article.slug}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-[11px] text-[#64748B] uppercase tracking-widest">
                       {article.category}
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-1.5">
                          <BarChart3 size={14} className="text-emerald-500" />
                          <span className="font-black text-[13px] text-emerald-600">85</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <span className="px-3 py-1.5 rounded-lg border border-green-100 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                          Published
                       </span>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                          <Calendar size={14} className="text-slate-300" />
                          {article.date}
                       </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blog/${article.slug}`} target="_blank" className="p-2.5 text-slate-400 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all shadow-sm">
                          <ExternalLink size={18} />
                        </Link>
                        <Link href={`/admin/blog/${article.id}`} className="p-2.5 text-slate-400 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all shadow-sm">
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={async () => {
                            if (!confirm("Are you sure?")) return;
                            try {
                              const res = await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
                              if (res.ok) setArticles(articles.filter(a => a.id !== article.id));
                            } catch (err) { console.error(err); }
                          }}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100 rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Showing {articles.length} total posts</span>
            <div className="flex items-center gap-3">
               <button className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[11px] font-black text-slate-400 hover:text-[#0F172A] transition-all">Previous</button>
               <button className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[11px] font-black text-slate-400 hover:text-[#0F172A] transition-all">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
