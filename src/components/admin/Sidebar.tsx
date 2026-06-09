"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Copy, 
  Layers, 
  Image, 
  Search, 
  BarChart2, 
  Users, 
  FormInput, 
  RefreshCw, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { 
    name: "Posts", 
    href: "/admin/blog", 
    icon: FileText,
    children: [
      { name: "All Posts", href: "/admin/blog" },
      { name: "Add New Post", href: "/admin/blog/create" },
      { name: "Drafts", href: "/admin/blog/drafts" },
      { name: "Scheduled", href: "/admin/blog/scheduled" },
      { name: "Published", href: "/admin/blog/published" },
    ]
  },
  { name: "Pages", href: "/admin/pages", icon: Copy },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Media Library", href: "/admin/media", icon: Image },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[18%] bg-[#0F172A] min-h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#FACC15] rounded-xl flex items-center justify-center">
            <span className="font-black text-[#0F172A] text-lg">P</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-tight">Physics CMS</span>
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">Professional</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href));
          
          return (
            <div key={item.name} className="space-y-1">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all group relative ${
                  isActive 
                    ? "bg-[#1E293B] text-[#FACC15]" 
                    : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-[#FACC15]" : "text-slate-500 group-hover:text-slate-300"} />
                <span className="flex-1">{item.name}</span>
                {item.children && <ChevronRight size={14} className={`transition-transform ${isActive ? "rotate-90" : ""}`} />}
                {isActive && (
                    <div className="absolute left-[-16px] w-[3px] h-6 bg-[#FACC15] rounded-r-full" />
                )}
              </Link>

              {/* Submenu */}
              {item.children && isActive && (
                <div className="ml-10 space-y-1 mt-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block py-2 text-[12px] font-bold transition-all ${
                          isChildActive ? "text-[#FACC15]" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-[#1E293B] p-3 rounded-xl flex items-center gap-3 hover:bg-[#26334a] transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center text-[#0F172A] font-black text-xs shadow-lg shadow-yellow-500/10">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-white truncate">Admin User</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Manager</p>
          </div>
          <LogOut size={14} className="text-slate-500 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
