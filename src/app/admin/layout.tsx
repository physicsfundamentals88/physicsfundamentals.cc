"use client";

import React from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import { ChevronRight, Bell, Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Determine breadcrumbs based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  if (isLoginPage) {
     return <div className="min-h-screen bg-[#0F172A]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-[18%] flex flex-col min-h-screen">
        {/* Global Admin Header */}
        <header className="h-[70px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest">
                 <span>CMS</span>
                 {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={crumb.href}>
                       <ChevronRight size={12} className="text-slate-300" />
                       <span className={i === breadcrumbs.length - 1 ? "text-[#0F172A]" : ""}>
                          {crumb.label}
                       </span>
                    </React.Fragment>
                 ))}
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group hidden md:block">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F172A] transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 pl-10 pr-4 text-sm font-medium w-[240px] focus:outline-none focus:border-[#FACC15] focus:bg-white transition-all"
                 />
              </div>
              <button className="p-2.5 text-slate-400 hover:text-[#0F172A] hover:bg-slate-50 rounded-xl transition-all relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 lg:p-12 animate-fade-in overflow-x-hidden">
           <div className="max-w-[1400px] mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
