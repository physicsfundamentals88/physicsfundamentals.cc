"use client";

import { useState, useEffect } from "react";
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
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-amber-500 focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{
          background: "#0b1221",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Physics Fundamentals – Go to homepage">
            <img src="/logo.png" alt="Physics Fundamentals" className="h-14 w-auto object-contain" fetchPriority="high" width="140" height="56" />
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
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <div className="absolute bottom-1 w-4 h-0.5 bg-blue-500 rounded-full" aria-hidden="true" />
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
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-400" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Games
            </Link>
            <Link
              href="/login?mode=register"
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
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[60px] z-40 md:hidden nav-slide-anim" role="dialog" aria-label="Navigation menu">
          <div
            className="m-3 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,15,30,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <nav className="px-4 py-3 flex flex-col gap-1" style={{ fontFamily: "var(--font-dm-sans)" }} aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl transition-all text-sm font-medium"
                    style={{ 
                      color: isActive ? "#ffffff" : "rgb(203,213,225)",
                      background: isActive ? "rgba(255,255,255,0.05)" : "transparent"
                    }}
                    aria-current={isActive ? "page" : undefined}
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
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 11, height: 11 }} aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Games
                </Link>
                <Link
                  href="/login?mode=register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ color: "#0a0f1e", background: "#f59e0b" }}
                >
                  Get Early Access
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
