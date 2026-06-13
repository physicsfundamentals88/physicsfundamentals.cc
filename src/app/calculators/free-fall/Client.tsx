"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const PLANETS = [
  { name: "Earth", g: 9.81, color: "#10b981", icon: "🌍" },
  { name: "Moon", g: 1.62, color: "#94a3b8", icon: "🌕" },
  { name: "Mars", g: 3.71, color: "#ef4444", icon: "🔴" },
  { name: "Jupiter", g: 24.79, color: "#f59e0b", icon: "🪐" },
  { name: "Saturn", g: 10.44, color: "#fbbf24", icon: "🪐" },
  { name: "Venus", g: 8.87, color: "#f97316", icon: "🌎" },
  { name: "Sun", g: 274.0, color: "#eab308", icon: "☀️" },
];

export default function FreeFallCalculator() {
  const [solveFor, setSolveFor] = useState<"Distance" | "Velocity" | "Time">("Distance");
  const [time, setTime] = useState("10"); // seconds
  const [velocity, setVelocity] = useState(""); // final velocity m/s
  const [distance, setDistance] = useState("490.5"); // meters
  const [v0, setV0] = useState("0"); // initial velocity
  const [activePlanet, setActivePlanet] = useState(PLANETS[0]);

  const [result, setResult] = useState<{
    d: string;
    v: string;
    t: string;
    steps: string[];
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, time, v0, distance, velocity, activePlanet]);

  const calculate = () => {
    let t = parseFloat(time);
    let d = parseFloat(distance);
    let vFinal = parseFloat(velocity);
    let vi = parseFloat(v0);
    const g = activePlanet.g;

    if (isNaN(vi)) vi = 0;

    let steps: string[] = [];
    let ans_d = 0;
    let ans_v = 0;
    let ans_t = 0;

    if (solveFor === "Distance" && !isNaN(t) && t >= 0) {
      ans_d = vi * t + 0.5 * g * t * t;
      ans_v = vi + g * t;
      ans_t = t;
      steps = [
        `Given: t = ${t} s, v₀ = ${vi} m/s, g = ${g} m/s²`,
        `d = v₀t + ½gt²`,
        `d = (${vi})(${t}) + 0.5(${g})(${t})²`,
        `d = ${ans_d.toFixed(2)} m`
      ];
    } else if (solveFor === "Velocity" && !isNaN(d) && d >= 0) {
      ans_v = Math.sqrt(vi * vi + 2 * g * d);
      ans_t = (ans_v - vi) / g;
      ans_d = d;
      steps = [
        `Given: d = ${d} m, v₀ = ${vi} m/s, g = ${g} m/s²`,
        `v = √(v₀² + 2gd)`,
        `v = √(${vi}² + 2(${g})(${d}))`,
        `v = ${ans_v.toFixed(2)} m/s`
      ];
    } else if (solveFor === "Time" && !isNaN(d) && d >= 0) {
      ans_t = (-vi + Math.sqrt(vi * vi + 2 * g * d)) / g;
      ans_v = vi + g * ans_t;
      ans_d = d;
      steps = [
        `Given: d = ${d} m, v₀ = ${vi} m/s, g = ${g} m/s²`,
        `t = (-v₀ + √(v₀² + 2gd)) / g`,
        `t = (-${vi} + √(${vi}² + 2(${g})(${d}))) / ${g}`,
        `t = ${ans_t.toFixed(2)} s`
      ];
    } else {
      setResult(null);
      return;
    }

    setResult({
      d: ans_d.toFixed(1),
      v: ans_v.toFixed(1),
      t: ans_t.toFixed(1),
      steps
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      {/* ── Page Header ── */}
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-emerald-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Kinematics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Free Fall Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate distance fallen, velocity reached, or time in free fall. Supports initial velocity and works for any planet — Earth, Moon, Mars and more.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            
            {/* ── Inputs Panel ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm">
              
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="flex bg-slate-100/70 p-1 rounded-xl">
                  {["Distance", "Velocity", "Time"].map((type: any) => (
                    <button
                      key={type}
                      onClick={() => setSolveFor(type)}
                      className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${solveFor === type ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {(solveFor === "Distance" || solveFor === "Velocity") && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Time (s)</label>
                    <input 
                      type="number" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-emerald-500 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                )}
                
                {(solveFor === "Velocity" || solveFor === "Time") && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Distance dropped (m)</label>
                    <input 
                      type="number" 
                      value={distance} 
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-emerald-500 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Initial velocity (m/s)</label>
                  <input 
                    type="number" 
                    value={v0} 
                    onChange={(e) => setV0(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0 for dropped from rest"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Planet (gravity)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PLANETS.map((planet) => (
                      <button
                        key={planet.name}
                        onClick={() => setActivePlanet(planet)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activePlanet.name === planet.name ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" : "border-slate-200 bg-white hover:border-slate-300"}`}
                      >
                        <span className="text-[18px] mb-1">{planet.icon}</span>
                        <span className="text-[10px] font-bold text-slate-700">{planet.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Results Panel ── */}
            <div className="space-y-6">
              
              {/* Output Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`bg-white rounded-[20px] border ${solveFor === "Distance" ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-slate-200 shadow-sm"} text-center p-6 flex items-center justify-center flex-col`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Distance</p>
                  <p className={`text-[32px] font-bold leading-none ${solveFor === "Distance" ? "text-emerald-600" : "text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {result ? result.d : "0.0"}
                  </p>
                  <p className="text-[12px] font-semibold text-slate-400 mt-1">m</p>
                </div>
                <div className={`bg-white rounded-[20px] border ${solveFor === "Velocity" ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-slate-200 shadow-sm"} text-center p-6 flex items-center justify-center flex-col`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Velocity</p>
                  <p className={`text-[32px] font-bold leading-none ${solveFor === "Velocity" ? "text-emerald-600" : "text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {result ? result.v : "0.0"}
                  </p>
                  <p className="text-[12px] font-semibold text-slate-400 mt-1">m/s</p>
                </div>
                <div className={`bg-white rounded-[20px] border ${solveFor === "Time" ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-slate-200 shadow-sm"} text-center p-6 flex items-center justify-center flex-col`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Time</p>
                  <p className={`text-[32px] font-bold leading-none ${solveFor === "Time" ? "text-emerald-600" : "text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {result ? result.t : "0.0"}
                  </p>
                  <p className="text-[12px] font-semibold text-slate-400 mt-1">s</p>
                </div>
              </div>

              {/* Comparison Visualization */}
              {result && (
                <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>Same Fall Time on Different Planets</p>
                  <div className="space-y-4">
                    {PLANETS.map((planet) => {
                      const t = parseFloat(result.t);
                      const vi = isNaN(parseFloat(v0)) ? 0 : parseFloat(v0);
                      const d = vi * t + 0.5 * planet.g * t * t;
                      const maxD = vi * t + 0.5 * 274 * t * t; // Sun distance
                      const pct = Math.max(2, (d / maxD) * 100);
                      return (
                        <div key={planet.name} className="flex items-center gap-4">
                          <div className="w-20 text-[12px] font-bold flex items-center gap-2 text-slate-700">
                            <span>{planet.icon}</span> {planet.name}
                          </div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: planet.color }} />
                          </div>
                          <div className="w-20 text-right text-[12px] font-mono text-slate-500">
                            {d.toFixed(1)} m
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step by Step */}
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  <div className="font-mono text-[13px] leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-xl p-6 whitespace-pre-wrap shadow-sm">
                    {result.steps.join('\n')}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is free fall?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Free fall is the motion of an object under gravity alone, with no air resistance. Near Earth's surface, all objects fall with the same acceleration g ≈ 9.81 m/s² regardless of mass — a fact Galileo established and which seems counterintuitive until you understand that heavier objects need more force to accelerate but also have more gravity acting on them.
                </p>
                <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg mt-6">
                  <p className="text-[14px] text-slate-700 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    "Real falling objects experience air drag, which creates a terminal velocity — the speed at which drag force equals gravitational force and acceleration reaches zero."
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="free-fall" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
