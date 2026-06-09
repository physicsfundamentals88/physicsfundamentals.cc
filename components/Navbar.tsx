"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Play } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/calculators", label: "Calculators" },
  { href: "/simulations", label: "Simulations" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{
          background: "#0b1221",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="Physics Fundamentals" className="h-14 w-auto object-contain" />
          </Link>

          {/* nav links */}
          <ul className="hidden md:flex items-center gap-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative px-4 py-2.5 rounded-xl text-[14px] transition-all duration-200 flex flex-col items-center justify-center font-semibold"
                    style={{
                      color: isActive ? "#ffffff" : "rgb(148,163,184)",
                      background: isActive ? "#1e293b" : "transparent",
                    }}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <div className="absolute bottom-1 w-4 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/simulations"
              className="flex items-center gap-2 transition-all duration-200 hover:bg-[#1e293b] active:scale-95"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 600,
                fontSize: 14,
                color: "#60a5fa",
                padding: "8px 18px",
                borderRadius: 8,
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Play className="fill-blue-400 w-3 h-3 text-blue-400" />
              Play Games
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 transition-all duration-200 hover:bg-amber-400 active:scale-95 whitespace-nowrap"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 700,
                fontSize: 14,
                color: "#0a0f1e",
                padding: "9px 20px",
                borderRadius: 8,
                background: "#f59e0b",
              }}
            >
              Get Early Access
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden"
          >
            <div
              className="m-3 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(10,15,30,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="px-4 py-3 flex flex-col gap-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl transition-all text-sm font-medium"
                      style={{ 
                        color: isActive ? "#ffffff" : "rgb(148,163,184)",
                        background: isActive ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 pb-1 flex flex-col gap-2">
                  <Link
                    href="/simulations"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold"
                    style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
                  >
                    <Play style={{ width: 11, height: 11, fill: "currentColor" }} />
                    Play Games
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold"
                    style={{ color: "#0a0f1e", background: "#f59e0b" }}
                  >
                    Get Early Access
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
