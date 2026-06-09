"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Plus, 
  MoreVertical,
  ArrowRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    categories: 0
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [gscStats, setGscStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parallel fetch for stats, articles, and GSC data
    Promise.all([
      fetch("/api/admin/stats").then(res => res.json()),
      fetch("/api/admin/articles").then(res => res.json()),
      fetch("/api/admin/gsc").then(res => res.json())
    ]).then(([statsData, articlesData, gscData]) => {
      if (statsData) {
        setStats({
          total: statsData.totalPosts || 0,
          published: statsData.totalPosts || 0,
          drafts: 0,
          categories: statsData.totalCategories || 0
        });
      }
      if (Array.isArray(articlesData)) {
        setRecentPosts(articlesData.slice(0, 5));
      }
      if (gscData) {
        setGscStats(gscData);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Posts", value: stats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published Posts", value: stats.published, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Draft Posts", value: stats.drafts, icon: Clock, color: "text-slate-400", bg: "bg-slate-50" },
    { label: "Categories", value: stats.categories, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Overview</h1>
           <p className="text-[#64748B] font-medium mt-1">Welcome back, here's what's happening with your content today.</p>
        </div>
        <Link 
          href="/admin/blog/create" 
          className="flex items-center gap-2 bg-[#FACC15] text-[#0F172A] px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 w-fit"
        >
          <Plus size={18} />
          Create New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div className="flex flex-col">
               <span className="text-3xl font-black text-[#0F172A]">{card.value}</span>
               <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest mt-1">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search Performance Section (GSC) */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-xl font-black text-[#0F172A]">Search Performance</h2>
               <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-0.5">Google Search Console Insights (Last 28 Days)</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A] transition-all">
               <TrendingUp size={14} />
               Full Report
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GSCStatCard 
               label="Total Clicks" 
               value={gscStats?.summary?.clicks || "1.2k"} 
               trend={gscStats?.trends?.clicks || "+0.0%"} 
               icon={<TrendingUp size={20} />} 
               color="text-blue-600" 
            />
            <GSCStatCard 
               label="Impressions" 
               value={gscStats?.summary?.impressions || "45.8k"} 
               trend={gscStats?.trends?.impressions || "+0.0%"} 
               icon={<TrendingUp size={20} />} 
               color="text-indigo-600" 
            />
            <GSCStatCard 
               label="Avg. CTR" 
               value={gscStats?.summary?.ctr || "2.6%"} 
               trend={gscStats?.trends?.ctr || "+0.0%"} 
               icon={<TrendingUp size={20} />} 
               color="text-emerald-600" 
            />
            <GSCStatCard 
               label="Avg. Position" 
               value={gscStats?.summary?.position || "14.2"} 
               trend={gscStats?.trends?.position || "+0.0"} 
               icon={<TrendingUp size={20} />} 
               color="text-amber-600" 
            />
         </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Recent Posts Table */}
         <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
               <div>
                  <h2 className="text-lg font-black text-[#0F172A]">Recent Activity</h2>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-0.5">Latest Content Updates</p>
               </div>
               <Link href="/admin/blog" className="text-[11px] font-black text-[#64748B] hover:text-[#0F172A] uppercase tracking-widest flex items-center gap-1.5 transition-colors group">
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                        <th className="px-6 py-4">Article details</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] whitespace-nowrap">
                     {loading ? (
                        Array(3).fill(0).map((_, i) => <tr key={i}><td colSpan={3} className="px-6 py-8 animate-pulse bg-slate-50/50"></td></tr>)
                     ) : recentPosts.length === 0 ? (
                        <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold">No active posts yet</td></tr>
                     ) : (
                        recentPosts.map((post) => (
                           <tr key={post.id} className="hover:bg-[#F8FAFC] transition-colors group">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                       {post.heroImage ? (
                                          <img src={post.heroImage} alt="" className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-300">NO IMG</div>
                                       )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                       <span className="font-bold text-[#0F172A] text-sm group-hover:text-[#3b82f6] transition-colors truncate max-w-[300px]">{post.title}</span>
                                       <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{post.category} • {post.date}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <StatusBadge status="Published" />
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-all">
                                       <ExternalLink size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-all">
                                       <MoreVertical size={16} />
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

         {/* Sidebar Actions / Quick Links */}
         <div className="space-y-8 flex flex-col">
            <div className="bg-[#0F172A] p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#FACC15]/20 transition-all duration-700" />
               <TrendingUp className="text-[#FACC15] mb-6" size={32} />
               <h3 className="text-xl font-black mb-3 leading-tight">Master your publishing workflow.</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">Optimize your content for SEO and manage all your physics articles in one place.</p>
               <Link href="/admin/blog" className="flex items-center gap-2 text-[#FACC15] text-[13px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                  Get Started <ArrowRight size={16} />
               </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
               <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest mb-6">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton label="New Post" href="/admin/blog/create" />
                  <QuickActionButton label="New Page" href="/admin/pages/new" />
                  <QuickActionButton label="Library" href="/admin/media" />
                  <QuickActionButton label="Dashboard" href="/admin" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function GSCStatCard({ label, value, trend, icon, color }: { label: string, value: string, trend: string, icon: any, color: string }) {
   const isPositive = trend.startsWith("+");
   return (
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#FACC15]/50 transition-all">
         <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 bg-slate-50 ${color} rounded-xl flex items-center justify-center`}>
               {icon}
            </div>
            <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
               {trend}
            </span>
         </div>
         <p className="text-2xl font-black text-[#0F172A]">{value}</p>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
   );
}

function StatusBadge({ status }: { status: "Published" | "Draft" | "Scheduled" }) {
   const styles = {
      Published: "bg-green-50 text-green-600 border-green-100 hover:bg-green-100",
      Draft: "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100",
      Scheduled: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
   };
   
   return (
      <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors cursor-default ${styles[status]}`}>
         {status}
      </span>
   );
}

function QuickActionButton({ label, href }: { label: string; href: string }) {
   return (
      <Link 
         href={href}
         className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] font-black text-[#64748B] uppercase tracking-widest text-center hover:bg-[#FACC15] hover:text-[#0F172A] hover:border-[#FACC15] transition-all"
      >
         {label}
      </Link>
   );
}
