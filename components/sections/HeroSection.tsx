"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4 mt-[70px] pt-[40px] pb-[40px]"
      style={{ background: "#0a0f1e" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          opacity: 0;
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* ── Background glows ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Animated Physics Orbital System */}
        <div className="absolute top-[40%] left-1/2 w-[1100px] h-[1100px] -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none select-none">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 border-t-blue-400/50 animate-[spin_30s_linear_infinite]" style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }} />
          {/* Middle Ring 1 */}
          <div className="absolute inset-[150px] rounded-full border border-white/5 border-r-indigo-400/50 animate-[spin_20s_linear_infinite_reverse]" style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }} />
          {/* Middle Ring 2 */}
          <div className="absolute inset-[300px] rounded-full border border-white/5 border-b-purple-400/50 animate-[spin_15s_linear_infinite]" style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }} />
          {/* Inner Ring */}
          <div className="absolute inset-[400px] rounded-full border border-white/5 border-l-cyan-400/50 animate-[spin_10s_linear_infinite_reverse]" style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }} />
          
          {/* Central Core glow */}
          <div className="absolute inset-[450px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        </div>
        
        {/* Top-center diffuse blue glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(56,97,172,0.55) 0%, transparent 70%)",
          }}
        />
        {/* Subtle left accent */}
        <div
          className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(30,60,120,0.8) 0%, transparent 70%)",
          }}
        />
        {/* Floating particle dots */}
        {[...Array(28)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${5 + ((i * 17 + 7) % 90)}%`,
              left: `${3 + ((i * 23 + 11) % 94)}%`,
              background: "rgba(255,255,255,0.15)",
              opacity: 0.08 + (i % 5) * 0.05,
              animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm animate-fade-in-down"
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 500, color: "rgb(191,219,254)" }}
        >
          {/* Animated green dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
          </span>
          Now building — Join the early access list
        </div>

        {/* ── H1 Heading ── */}
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontWeight: 400,
            fontSize: "clamp(38px, 5.2vw, 70px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "#ffffff",
            animationDelay: "0.1s",
          }}
          className="mt-2 animate-fade-in-up"
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
            animationDelay: "0.2s",
          }}
          className="animate-fade-in-up"
        >
          Interact with virtual labs, run real-time simulations, and explore everything from{" "}
          <span style={{ color: "rgb(96,165,250)" }}>classical mechanics</span>{" "}
          to{" "}
          <span style={{ color: "rgb(96,165,250)" }}>quantum physics</span>. A free visual education library built to make complex concepts click.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 items-center mt-2 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Primary: amber */}
          <Link
            id="hero-get-early-access"
            href="/login?mode=register"
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
            Get Early Access
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Secondary: dark bordered */}
          <Link
            id="hero-browse-articles"
            href="/#features"
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

        {/* Trust signal */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 13,
            color: "rgb(100,116,139)",
            animationDelay: "0.4s",
          }}
          className="animate-fade-in"
        >
          Trusted by{" "}
          <span style={{ fontWeight: 600, color: "rgb(148,163,184)" }}>
            500+
          </span>{" "}
          students already on the list
        </p>
      </div>
    </section>
  );
}
