"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }
    const logged = localStorage.getItem("admin_logged");
    if (logged === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#1d2327]">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100vh", 
          background: "#0F172A", 
          color: "white",
          fontFamily: "var(--font-dm-sans, sans-serif)",
          gap: 12
        }}
      >
        <Loader2 className="animate-spin" size={24} style={{ color: "#FACC15" }} />
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Loading administration panel...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting
  }

  return (
    <div className="wp-layout">
      <AdminSidebar />

      <div className="wp-main">
        {/* Top Admin Bar */}
        <header className="wp-topbar">
          <div className="wp-topbar-left">
            <Link
              href="/"
              target="_blank"
              className="wp-topbar-site-link"
            >
              <ExternalLink size={14} />
              Visit Site
            </Link>
          </div>

          <div className="wp-topbar-right">
            <div className="wp-topbar-search">
              <Search size={14} className="wp-topbar-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="wp-topbar-search-input"
              />
            </div>
            <button className="wp-topbar-notif">
              <Bell size={16} />
              <span className="wp-topbar-notif-dot" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="wp-content">
          {children}
        </main>
      </div>
    </div>
  );
}

