"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Layers, 
  MoreVertical, 
  ExternalLink, 
  Edit3, 
  Trash2,
  Filter,
  ArrowUpDown
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electromagnetism", slug: "electromagnetism", count: 12, date: "Oct 12, 2024" },
    { id: 2, name: "Thermodynamics", slug: "thermodynamics", count: 8, date: "Oct 10, 2024" },
    { id: 3, name: "Quantum Physics", slug: "quantum-physics", count: 5, date: "Sep 28, 2024" },
    { id: 4, name: "Classical Mechanics", slug: "mechanics", count: 15, date: "Sep 15, 2024" },
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Categories</h1>
           <p className="text-[#64748B] font-medium mt-1">Organize your physics educational content into logical topics and subjects.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-[#FACC15] text-[#0F172A] px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 w-fit"
        >
          <Plus size={18} />
          Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Add New Category Card */}
         <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm sticky top-[100px]">
               <h2 className="text-lg font-black text-[#0F172A] mb-6">Add New Category</h2>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                     <input type="text" placeholder="e.g. Astrophysics" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium focus:border-[#FACC15] focus:bg-white outline-none transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug (URL)</label>
                     <input type="text" placeholder="e.g. astrophysics" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium focus:border-[#FACC15] focus:bg-white outline-none transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Category</label>
                     <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-bold text-[#64748B] outline-none focus:border-[#FACC15] cursor-pointer">
                        <option>None</option>
                        <option>Classical Physics</option>
                        <option>Modern Physics</option>
                     </select>
                  </div>
                  <button className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1E293B] transition-all shadow-lg shadow-slate-900/10">
                     Save Category
                  </button>
               </div>
            </div>
         </div>

         {/* Categories List */}
         <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
               <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                  <div className="relative flex-1 max-w-[300px]">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Search categories..." className="w-full bg-white border border-[#E2E8F0] rounded-lg py-2 pl-10 pr-4 text-[12px] font-bold outline-none focus:border-[#FACC15] transition-all" />
                  </div>
                  <button className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#E2E8F0]">
                     <Filter size={18} />
                  </button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-[#E2E8F0] text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                           <th className="px-6 py-4">Name</th>
                           <th className="px-6 py-4">Slug</th>
                           <th className="px-6 py-4 text-center">Post count</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#F1F5F9] whitespace-nowrap">
                        {categories.map((cat) => (
                           <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors group">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#FACC15] transition-colors">
                                       <Layers size={14} />
                                    </div>
                                    <span className="font-bold text-[#0F172A] text-sm">{cat.name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5 text-xs font-bold text-slate-400 font-mono">
                                 /{cat.slug}
                              </td>
                              <td className="px-6 py-5 text-center">
                                 <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-black text-[#0F172A]">
                                    {cat.count}
                                 </span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-xl transition-all">
                                       <Edit3 size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100 rounded-xl transition-all">
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
