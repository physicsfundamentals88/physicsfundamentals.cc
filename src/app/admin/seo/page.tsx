"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Globe, 
  FileJson, 
  Map as MapIcon, 
  ChevronRight, 
  CheckCircle2, 
  Settings, 
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart4
} from "lucide-react";

export default function SEOModulePage() {
  const [activeTab, setActiveTab] = useState("Redirects");

  const tabs = ["Redirects", "Global SEO", "Sitemap", "Schema"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">SEO Module</h1>
           <p className="text-[#64748B] font-medium mt-1">Manage redirects, sitemaps, and global search engine optimization state.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-black uppercase tracking-widest leading-none">Health: 94%</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-2xl w-fit">
         {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-6">
            {activeTab === "Redirects" && (
               <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-fade-in">
                  <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                     <h2 className="text-lg font-black text-[#0F172A]">Redirect Manager</h2>
                     <button className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1E293B] transition-all">
                        <Plus size={14} /> Add Redirect
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-[#E2E8F0] text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                              <th className="px-6 py-4">Source URL</th>
                              <th className="px-6 py-4">Target URL</th>
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4 text-right">Hits</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] whitespace-nowrap">
                           {[
                              { from: "/old-gravity-guide", to: "/blog/gravity-laws", type: "301", hits: 1420 },
                              { from: "/phys-intro", to: "/blog/introduction-to-physics", type: "301", hits: 850 },
                              { from: "/lessons/mechanics", to: "/categories/mechanics", type: "301", hits: 340 }
                           ].map((r, i) => (
                              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors group">
                                 <td className="px-6 py-5 text-sm font-bold text-slate-500 font-mono italic">{r.from}</td>
                                 <td className="px-6 py-5 text-sm font-black text-[#0F172A] flex items-center gap-2">
                                    <ChevronRight size={14} className="text-[#FACC15]" /> {r.to}
                                 </td>
                                 <td className="px-6 py-5">
                                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 text-[10px] font-black">{r.type}</span>
                                 </td>
                                 <td className="px-6 py-5 text-right font-black text-slate-900 text-sm">
                                    {r.hits}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === "Sitemap" && (
                <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm animate-fade-in space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                         <MapIcon size={28} />
                      </div>
                      <div>
                         <h2 className="text-xl font-black text-[#0F172A]">XML Sitemap</h2>
                         <p className="text-sm font-medium text-slate-400">Regularly updated for top search engines indexing.</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                            <span className="text-[13px] font-bold text-[#0F172A]">sitemap.xml is active and optimized</span>
                         </div>
                         <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-all">
                            View Sitemap <ExternalLink size={14} />
                         </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <SitemapStat label="Total URLs" value="48" />
                         <SitemapStat label="Last Update" value="Just now" />
                      </div>
                   </div>
                   <button className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#1E293B] transition-all">
                      <RefreshCw size={16} /> Rebuild Sitemap Index
                   </button>
                </div>
            )}
         </div>

         <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
               <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-widest mb-6">Global Identity</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Name</label>
                     <input type="text" value="PhysicsLab" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-black text-[#0F172A] outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                     <textarea readOnly className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs font-bold text-[#64748B] outline-none resize-none" rows={4}>PhysicsLab – Interactive Physics Simulations & Visual Learning. Explore gravity, waves, and orbital mechanics.</textarea>
                  </div>
               </div>
            </div>

            <div className="bg-[#0F172A] p-8 rounded-2xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
               <Zap className="text-[#FACC15] mb-6" size={32} />
               <h3 className="text-xl font-black mb-3">Google Search Console</h3>
               <p className="text-slate-400 text-sm font-medium mb-8">Integrated performance tracking is currently active.</p>
               <button className="text-[11px] font-black text-[#FACC15] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Open Analytics <BarChart4 size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function SitemapStat({ label, value }: { label: string; value: string }) {
    return (
       <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-[#0F172A] mt-1">{value}</p>
       </div>
    );
}
