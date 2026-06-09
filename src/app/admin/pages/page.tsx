"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Copy, 
  MoreVertical, 
  ExternalLink, 
  Edit3, 
  Trash2,
  Filter,
  Eye
} from "lucide-react";

export default function PagesManagement() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, using hardcoded primary pages to fulfill "add the pages of the site" requirement.
    // In a real app, these would come from the 'pages' table we just added.
    const initialPages = [
      { id: 1, title: "Home Page", slug: "/", status: "Published", updated: "2 days ago" },
      { id: 2, title: "About Us", slug: "/about", status: "Published", updated: "1 week ago" },
      { id: 3, title: "Contact", slug: "/contact", status: "Published", updated: "3 days ago" },
      { id: 4, title: "Disclaimer", slug: "/disclaimer", status: "Published", updated: "2 months ago" },
      { id: 5, title: "Privacy Policy", slug: "/privacy-policy", status: "Published", updated: "2 months ago" },
      { id: 6, title: "Terms & Conditions", slug: "/terms-conditions", status: "Published", updated: "2 months ago" },
      { id: 7, title: "Simulations", slug: "/simulations", status: "Published", updated: "1 day ago" },
      { id: 8, title: "Roadmap", slug: "/roadmap", status: "Draft", updated: "Just now" },
    ];
    setPages(initialPages);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Site Pages</h1>
           <p className="text-[#64748B] font-medium mt-1">Manage static-like content and informational pages of your platform.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-[#FACC15] text-[#0F172A] px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 w-fit"
        >
          <Plus size={18} />
          Create New Page
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Modern Filter Bar */}
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center gap-4 bg-[#F8FAFC]/50">
           <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search pages by title or slug..." 
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#FACC15] focus:ring-4 focus:ring-yellow-500/5 transition-all" 
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-black text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A] transition-all">
                 <Filter size={16} />
                 Filter
              </button>
           </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[10px] font-black text-[#64748B] uppercase tracking-widest bg-white">
                <th className="px-8 py-5">Page details</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5">Last modified</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] whitespace-nowrap">
              {loading ? (
                 Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={4} className="px-8 py-10 animate-pulse bg-slate-50/50"></td></tr>)
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#FACC15] group-hover:text-[#0F172A] transition-all duration-300">
                            <Copy size={18} />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-black text-[#0F172A] text-base group-hover:text-[#3b82f6] transition-colors">{page.title}</span>
                            <span className="text-xs font-bold text-slate-400 font-mono mt-0.5">{page.slug}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                        page.status === "Published" 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#64748B]">
                      {page.updated}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <button className="p-2.5 text-slate-400 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all shadow-sm" title="Preview">
                            <Eye size={18} />
                         </button>
                         <button className="p-2.5 text-slate-400 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all shadow-sm" title="Edit">
                            <Edit3 size={18} />
                         </button>
                         <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100 rounded-xl transition-all shadow-sm" title="Delete">
                            <Trash2 size={18} />
                         </button>
                         <button className="p-2.5 text-slate-400 hover:text-[#0F172A] transition-all">
                            <MoreVertical size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
