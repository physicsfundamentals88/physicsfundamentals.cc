"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Image,
  BarChart2,
  Settings,
  LogOut,
  ChevronDown,
  BookOpen,
  Zap,
  Users,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Posts",
    href: "/admin/blog",
    icon: FileText,
    children: [
      { name: "All Posts", href: "/admin/blog" },
      { name: "Add New Post", href: "/admin/blog/create" },
      { name: "Categories", href: "/admin/categories" },
    ],
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: Image,
    children: [
      { name: "Library", href: "/admin/media" },
      { name: "Image Compressor", href: "/admin/media/watermark-remover" },
    ],
  },
  {
    name: "Pages",
    href: "/admin/pages",
    icon: BookOpen,
    children: [
      { name: "All Pages", href: "/admin/pages" },
      { name: "Add New Page", href: "/admin/pages/new" },
    ],
  },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Users", href: "/admin/users", icon: Users },
];

const bottomNav = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggleCollapse = (name: string) => {
    setCollapsed((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the administration panel?")) {
      localStorage.removeItem("admin_logged");
      window.location.href = "/admin/login";
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <aside className="wp-sidebar">
      {/* Brand */}
      <div className="wp-brand">
        <div className="wp-brand-icon" style={{ backgroundColor: "#d63638" }}>
          <Zap size={16} fill="currentColor" />
        </div>
        <div className="wp-brand-text">
          <span className="wp-brand-name" style={{ color: "#ffffff", fontWeight: 800 }}>Super Admin</span>
          <span className="wp-brand-sub" style={{ color: "#facc15" }}>v1.0 (Enterprise)</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="wp-nav">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = hasChildren && (active || !collapsed.includes(item.name));

          return (
            <div key={item.name} className="wp-nav-group">
              {hasChildren ? (
                <button
                  onClick={() => toggleCollapse(item.name)}
                  className={`wp-nav-item ${active ? "wp-nav-item--active" : ""}`}
                >
                  <item.icon size={16} className="wp-nav-icon" />
                  <span className="wp-nav-label">{item.name}</span>
                  <ChevronDown
                    size={14}
                    className={`wp-nav-chevron ${isOpen ? "wp-nav-chevron--open" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`wp-nav-item ${active ? "wp-nav-item--active" : ""}`}
                >
                  <item.icon size={16} className="wp-nav-icon" />
                  <span className="wp-nav-label">{item.name}</span>
                </Link>
              )}

              {hasChildren && isOpen && (
                <div className="wp-subnav">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`wp-subnav-item ${childActive ? "wp-subnav-item--active" : ""}`}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="wp-sidebar-spacer" />

      {/* Bottom */}
      <div className="wp-nav wp-nav--bottom">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`wp-nav-item ${isActive(item.href) ? "wp-nav-item--active" : ""}`}
          >
            <item.icon size={16} className="wp-nav-icon" />
            <span className="wp-nav-label">{item.name}</span>
          </Link>
        ))}

        {/* User */}
        <div className="wp-user">
          <div className="wp-user-avatar" style={{ backgroundColor: "#d63638" }}>SA</div>
          <div className="wp-user-info">
            <span className="wp-user-name">Super Admin</span>
            <span className="wp-user-role" style={{ color: "#facc15" }}>Super Administrator</span>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "inherit",
              display: "flex",
              alignItems: "center"
            }}
          >
            <LogOut size={14} className="wp-user-logout" />
          </button>
        </div>
      </div>
    </aside>
  );
}
