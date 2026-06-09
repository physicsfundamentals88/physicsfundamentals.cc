"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const g = 9.81;

export default function ProjectileMotionCalculator() {
  const [velocity, setVelocity] = useState("20");
  const [angle, setAngle] = useState("45");
  const [height, setHeight] = useState("0");
  
  const [result, setResult] = useState<{
    time: string;
    maxHeight: string;
    range: string;
    v0x: string;
    v0y: string;
    steps: string[];
    graphData: { x: number; y: number }[];
    scaleX: number;
    scaleY: number;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [velocity, angle, height]);

  const calculate = () => {
    const v = parseFloat(velocity);
    const theta = parseFloat(angle);
    const h0 = parseFloat(height);

    if (isNaN(v) || isNaN(theta) || isNaN(h0) || v < 0 || theta < 0 || theta > 90 || h0 < 0) {
      setResult(null);
      return;
    }

    const rad = theta * (Math.PI / 180);
    const v0x = v * Math.cos(rad);
    const v0y = v * Math.sin(rad);

    // Time of flight: h0 + v0y*t - 0.5*g*t^2 = 0
    // t = (v0y + sqrt(v0y^2 + 2*g*h0)) / g
    const tFlight = (v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g;
    
    // Max Height
    const tPeak = v0y / g;
    const hMax = h0 + v0y * tPeak - 0.5 * g * tPeak * tPeak;

    // Range
    const range = v0x * tFlight;

    // Generate graph points
    const points = [];
    const numPoints = 50;
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * tFlight;
      const x = v0x * t;
      const y = h0 + v0y * t - 0.5 * g * t * t;
      points.push({ x, y: Math.max(0, y) });
    }

    const steps = [
      `1. Initial Velocity Components:`,
      `   v_0x = v_0 · cos(θ) = ${v} · cos(${theta}°) = ${v0x.toFixed(2)} m/s`,
      `   v_0y = v_0 · sin(θ) = ${v} · sin(${theta}°) = ${v0y.toFixed(2)} m/s`,
      ``,
      `2. Maximum Height (H):`,
      `   H = h_0 + (v_0y² / 2g) = ${h0} + (${v0y.toFixed(2)}² / 19.62) = ${hMax.toFixed(2)} m`,
      ``,
      `3. Time of Flight (t):`,
      `   t = [v_0y + √(v_0y² + 2g·h_0)] / g`,
      `   t = [${v0y.toFixed(2)} + √(${Math.pow(v0y, 2).toFixed(2)} + ${(2*g*h0).toFixed(2)})] / 9.81 = ${tFlight.toFixed(2)} s`,
      ``,
      `4. Range (R):`,
      `   R = v_0x · t = ${v0x.toFixed(2)} · ${tFlight.toFixed(2)} = ${range.toFixed(2)} m`
    ];

    setResult({
      time: tFlight.toFixed(2),
      maxHeight: hMax.toFixed(2),
      range: range.toFixed(2),
      v0x: v0x.toFixed(2),
      v0y: v0y.toFixed(2),
      steps,
      graphData: points,
      scaleX: range > 0 ? range : 10,
      scaleY: hMax > 0 ? Math.max(hMax, range / 2) : 10, // Try to keep roughly proportional aspect ratio
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      {/* ── Page Header ── */}
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-blue-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Projectile Motion Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate range, maximum height, time of flight and full trajectory for any projectile. Enter launch speed and angle to see results instantly with step-by-step working.
          </p>
        </div>
      </div>

      {/* ── Calculator Layout ── */}
      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            
            {/* ── Inputs Panel ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px]">
              
              <h3 className="text-[16px] font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>Inputs</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Launch Speed (m/s)</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <input 
                      type="number" 
                      value={velocity} 
                      onChange={(e) => setVelocity(e.target.value)}
                      className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[13px] font-bold text-slate-700" style={{ fontFamily: "var(--font-dm-sans)" }}>Launch Angle (degrees)</label>
                    <span className="text-[13px] font-bold text-blue-600">{angle}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="90" 
                    value={angle} 
                    onChange={(e) => setAngle(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
                    <span>0°</span>
                    <span>45°</span>
                    <span>90°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Launch Height, h₀ (m)</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Results Panel ── */}
            <div className="space-y-6">
              
              {/* Primary Output & Graph */}
              <div className="bg-white rounded-[24px] border border-blue-100 p-8 shadow-sm flex flex-col" style={{ background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    {/* Graph Area */}
                    <div className="w-full aspect-[2/1] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8 relative px-8 pt-8 pb-12">
                      <p className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trajectory Y vs X</p>
                      
                      <div className="absolute inset-0 pt-12 pb-12 px-8">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                          {/* X Axis */}
                          <line x1="0" y1="100" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                          {/* Y Axis */}
                          <line x1="0" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="2" />

                          {/* Trajectory */}
                          <polyline 
                            points={result.graphData.map(p => {
                              const pctX = (p.x / result.scaleX) * 100;
                              const pctY = 100 - ((p.y / result.scaleY) * 100);
                              return `${pctX},${pctY}`;
                            }).join(" ")}
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="drop-shadow-sm"
                          />

                          {/* Max Height Marker */}
                          {(() => {
                            const maxP = result.graphData.reduce((prev, curr) => (curr.y > prev.y ? curr : prev));
                            const mx = (maxP.x / result.scaleX) * 100;
                            const my = 100 - ((maxP.y / result.scaleY) * 100);
                            return (
                              <circle cx={mx} cy={my} r="3" fill="#3b82f6" className="drop-shadow-md" />
                            );
                          })()}
                        </svg>

                        {/* Labels for Graph */}
                        <div className="absolute left-0 bottom-6 text-[10px] text-slate-400 font-medium">0m</div>
                        <div className="absolute right-8 bottom-6 text-[10px] text-slate-400 font-medium">{result.range}m</div>
                        <div className="absolute left-2 top-10 text-[10px] text-slate-400 font-medium">{result.maxHeight}m</div>
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white border border-blue-100 rounded-xl p-4 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Range</p>
                        <p className="text-[20px] font-bold text-blue-600 leading-none">{result.range} <span className="text-[13px]">m</span></p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Max Height</p>
                        <p className="text-[20px] font-bold text-slate-800 leading-none">{result.maxHeight} <span className="text-[13px]">m</span></p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Flight Time</p>
                        <p className="text-[20px] font-bold text-slate-800 leading-none">{result.time} <span className="text-[13px]">s</span></p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="bg-white border border-slate-200 rounded-xl flex-1 flex flex-col items-center justify-center py-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">V₀x</p>
                          <p className="text-[14px] font-bold text-slate-800 leading-none">{result.v0x} m/s</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl flex-1 flex flex-col items-center justify-center py-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">V₀y</p>
                          <p className="text-[14px] font-bold text-slate-800 leading-none">{result.v0y} m/s</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-center py-20 min-h-[400px] flex items-center justify-center">
                    <p className="font-medium mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter valid values to generate trajectory</p>
                  </div>
                )}
              </div>

              {/* Step by Step */}
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  </div>
                  
                  <div className="font-mono text-[13px] leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-xl p-6 whitespace-pre-wrap shadow-sm">
                    {result.steps.join('\n')}
                  </div>
                </div>
              )}

              {/* Informational Cards */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is projectile motion?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Projectile motion describes the path of an object launched into the air that moves only under the influence of gravity (ignoring air resistance). The key insight is that horizontal and vertical motion are completely independent — horizontal velocity stays constant throughout the flight, while vertical velocity changes constantly due to Earth's gravitational pull.
                </p>
                <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mt-6">
                  <p className="text-[14px] text-slate-700 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    "The path traced by a projectile is always a parabola. When launched from the ground, a 45° angle provides the maximum possible range. Any two angles that add up to 90° (e.g. 30° and 60°) will produce the exact same range at identical launch speeds."
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="projectile-motion" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
