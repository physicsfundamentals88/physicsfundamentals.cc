"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4 mt-[70px] pt-[40px] pb-[40px]"
      style={{ background: "#0a0f1e" }}
      aria-label="Hero section – Physics learning platform"
    >
      {/* ── Background glows ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Simplified Orbital System – fewer elements, CSS-only, prefer-reduced-motion aware */}
        <div className="absolute top-[40%] left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none select-none hero-orbits">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 border-t-blue-400/40 hero-spin-30" />
          {/* Middle Ring */}
          <div className="absolute inset-[200px] rounded-full border border-white/5 border-r-indigo-400/40 hero-spin-20-rev" />
          {/* Inner Ring */}
          <div className="absolute inset-[350px] rounded-full border border-white/5 border-l-cyan-400/40 hero-spin-15" />
        </div>

        {/* Top-center diffuse blue glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[500px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(56,97,172,0.55) 0%, transparent 70%)",
          }}
        />
        {/* Subtle left accent */}
        <div
          className="absolute left-0 top-1/3 w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(30,60,120,0.8) 0%, transparent 70%)",
          }}
        />
        {/* Reduced floating particles – 8 instead of 28 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span
            key={i}
            className="absolute rounded-full hero-particle"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${10 + ((i * 23 + 7) % 80)}%`,
              left: `${5 + ((i * 29 + 11) % 90)}%`,
              background: "rgba(255,255,255,0.18)",
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6">

        {/* ── H1 Heading ── */}
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontWeight: 400,
            fontSize: "clamp(38px, 5.2vw, 70px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "#ffffff",
          }}
          className="mt-2 hero-anim-up"
        >
          {"Understand "}
          <span style={{ color: "rgb(96,165,250)", fontStyle: "italic" }}>
            Physics
          </span>
          {" with Visuals,"}
          <br />
          Examples, and Simulations
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "clamp(15px, 1.2vw, 17px)",
            lineHeight: 1.65,
            color: "rgb(191,219,254)",
            maxWidth: 600,
          }}
          className="hero-anim-up hero-anim-delay-1"
        >
          Interact with virtual labs, run real-time simulations, and explore everything from{" "}
          <Link
            href="/blog?category=classical%20mechanics"
            className="hover:text-blue-300 transition-colors font-medium"
            style={{ color: "rgb(96,165,250)" }}
          >
            classical mechanics
          </Link>{" "}
          to{" "}
          <Link
            href="/blog?category=modern%20physics"
            className="hover:text-blue-300 transition-colors font-medium"
            style={{ color: "rgb(96,165,250)" }}
          >
            quantum physics
          </Link>
          . A free visual education library built to make complex concepts click.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 items-center mt-2 hero-anim-up hero-anim-delay-2"
        >
          {/* Primary: amber */}
          <Link
            id="hero-try-calculators"
            href="/calculators"
            className="flex items-center gap-2 active:scale-95 transition-all duration-200 hover:brightness-110"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 600,
              fontSize: 15,
              background: "#f59e0b",
              color: "#0a0f1e",
              padding: "13px 28px",
              borderRadius: 10,
              boxShadow: "0 4px 24px rgba(245,158,11,0.25)",
            }}
          >
            Try the Calculators
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }} aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Secondary: dark bordered */}
          <Link
            id="hero-browse-articles"
            href="/blog"
            className="flex items-center gap-2 active:scale-95 transition-all duration-200 hover:bg-white/10"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 600,
              fontSize: 15,
              background: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              padding: "13px 28px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
