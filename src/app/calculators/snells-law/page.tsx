"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const MATERIALS = [
  { name: "Vacuum", n: 1.0000 },
  { name: "Air", n: 1.0003 },
  { name: "Ice", n: 1.309 },
  { name: "Water", n: 1.333 },
  { name: "Glass (crown)", n: 1.52 },
  { name: "Glass (flint)", n: 1.62 },
  { name: "Quartz", n: 1.544 },
  { name: "Diamond", n: 2.417 },
  { name: "Sapphire", n: 1.77 },
  { name: "Acrylic (PMMA)", n: 1.49 },
];

const SNELL_EQUATIONS = [
  { name: "Snell's Law", formula: "n₁sinθ₁ = n₂sinθ₂", color: "#0ea5e9" },
  { name: "Refraction angle", formula: "θ₂ = arcsin(n₁sinθ₁/n₂)", color: "#8b5cf6" },
  { name: "Critical angle", formula: "θc = arcsin(n₂/n₁)", color: "#ec4899" },
  { name: "Refractive index", formula: "n = c/v", color: "#f97316" },
  { name: "Relative index", formula: "n₂₁ = n₂/n₁", color: "#10b981" },
  { name: "TIR condition", formula: "θ > θc when n₁ > n₂", color: "#eab308" },
];

export default function SnellsLawCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [n1Name, setN1Name] = useState("Air");
  const [n2Name, setN2Name] = useState("Glass (crown)");
  const [n1Custom, setN1Custom] = useState("");
  const [n2Custom, setN2Custom] = useState("");
  const [angleDeg, setAngleDeg] = useState(38);

  const n1 = parseFloat(n1Custom) || MATERIALS.find(m => m.name === n1Name)!.n;
  const n2 = parseFloat(n2Custom) || MATERIALS.find(m => m.name === n2Name)!.n;

  const angleRad = (angleDeg * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(angleRad)) / n2;
  const tir = sinTheta2 > 1; // total internal reflection
  const theta2Rad = tir ? Math.PI / 2 : Math.asin(sinTheta2);
  const theta2Deg = tir ? null : (theta2Rad * 180) / Math.PI;

  const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // ── Draw Ray Diagram ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Background – upper medium (n1)
    ctx.fillStyle = "#f0f9ff";
    ctx.fillRect(0, 0, W, cy);
    // Background – lower medium (n2)
    ctx.fillStyle = n2 > n1 ? "#e0f2fe" : "#fef3c7";
    ctx.fillRect(0, cy, W, cy);

    // Interface line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Normal (dashed vertical)
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - 90);
    ctx.lineTo(cx, cy + 90);
    ctx.stroke();
    ctx.setLineDash([]);

    const rayLen = 130;

    // Incident ray
    const incAngle = Math.PI / 2 - angleRad;
    const ix = cx - Math.sin(incAngle) * rayLen;
    const iy = cy - Math.cos(incAngle) * rayLen;
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Refracted / TIR ray
    if (!tir) {
      const refAngle = Math.PI / 2 - theta2Rad;
      const rx = cx + Math.sin(refAngle) * rayLen;
      const ry = cy + Math.cos(refAngle) * rayLen;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    } else {
      // TIR – reflected ray
      const rx = cx + Math.sin(incAngle) * rayLen;
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, iy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Labels
    ctx.font = "bold 11px var(--font-dm-sans, sans-serif)";
    ctx.fillStyle = "#475569";
    ctx.fillText(`n₁ = ${n1.toFixed(4)}`, 10, 20);
    ctx.fillText(`n₂ = ${n2.toFixed(4)}`, 10, cy + 20);

    // Incident angle arc
    ctx.strokeStyle = "#f9731680";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + angleRad, false);
    ctx.stroke();
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText(`${angleDeg}°`, cx - 48, cy - 18);

    // Refracted angle arc
    if (!tir && theta2Deg !== null) {
      ctx.strokeStyle = "#10b98180";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, Math.PI / 2 - theta2Rad, Math.PI / 2, false);
      ctx.stroke();
      ctx.fillStyle = "#10b981";
      ctx.fillText(`${theta2Deg.toFixed(1)}°`, cx + 8, cy + 22);
    }

    if (tir) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("TIR", cx + 10, cy - 12);
    }
  }, [n1, n2, angleDeg, tir, theta2Rad, theta2Deg]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-pink-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md">Waves &amp; Optics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Snell&apos;s Law Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[620px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate refraction angle, find the critical angle for total internal reflection, and look up refractive indices for common materials. Live ray diagram updates instantly.
          </p>
        </div>
      </div>

      {/* ── Calculator ── */}
      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">

            {/* ── Inputs ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px] space-y-6">

              {/* Formula display */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                <span className="text-[18px] font-bold text-indigo-600">n₁sinθ₁ = n₂sinθ₂</span>
              </div>

              {/* Medium 1 */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Medium 1 (incident)</label>
                <select value={n1Name} onChange={e => { setN1Name(e.target.value); setN1Custom(""); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 outline-none focus:border-indigo-400 transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {MATERIALS.map(m => <option key={m.name}>{m.name} ({m.n})</option>)}
                  <option value="custom">Custom…</option>
                </select>
                {n1Name === "custom" && (
                  <input type="number" placeholder="Enter n₁" value={n1Custom} onChange={e => setN1Custom(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-400 transition-all"
                    style={{ fontFamily: "var(--font-dm-sans)" }} />
                )}
              </div>

              {/* Medium 2 */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Medium 2 (refracted)</label>
                <select value={n2Name} onChange={e => { setN2Name(e.target.value); setN2Custom(""); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 outline-none focus:border-indigo-400 transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {MATERIALS.map(m => <option key={m.name}>{m.name} ({m.n})</option>)}
                  <option value="custom">Custom…</option>
                </select>
                {n2Name === "custom" && (
                  <input type="number" placeholder="Enter n₂" value={n2Custom} onChange={e => setN2Custom(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-400 transition-all"
                    style={{ fontFamily: "var(--font-dm-sans)" }} />
                )}
              </div>

              {/* Angle slider */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Angle of incidence θ₁ (degrees)
                </label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <input type="number" min={0} max={90} value={angleDeg} onChange={e => setAngleDeg(Math.min(90, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-16 bg-transparent text-[18px] font-bold text-slate-800 outline-none"
                    style={{ fontFamily: "var(--font-dm-sans)" }} />
                  <span className="text-slate-400 font-bold">°</span>
                </div>
                <input type="range" min={0} max={90} step={0.5} value={angleDeg} onChange={e => setAngleDeg(parseFloat(e.target.value))}
                  className="w-full mt-3 accent-indigo-500" />
              </div>

              {/* Quick examples */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Quick examples</p>
                <div className="space-y-2">
                  {[
                    { label: "Light → Glass 45°", n1: "Air", n2: "Glass (crown)", angle: 45 },
                    { label: "Diamond TIR test", n1: "Diamond", n2: "Air", angle: 25 },
                    { label: "Optical fibre", n1: "Glass (crown)", n2: "Air", angle: 30 },
                    { label: "Water surface 40°", n1: "Air", n2: "Water", angle: 40 },
                  ].map(ex => (
                    <button key={ex.label}
                      onClick={() => { setN1Name(ex.n1); setN2Name(ex.n2); setAngleDeg(ex.angle); setN1Custom(""); setN2Custom(""); }}
                      className="w-full text-left text-[13px] px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Results ── */}
            <div className="space-y-6">

              {/* Ray Diagram */}
              <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>Ray Diagram</p>
                </div>
                <canvas ref={canvasRef} width={600} height={220} className="w-full" style={{ display: "block" }} />
              </div>

              {/* Result metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-[20px] border border-indigo-200 shadow-sm text-center p-5 ring-1 ring-indigo-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Refraction θ₂</p>
                  <p className="text-[32px] font-bold leading-none text-indigo-700" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {tir ? "TIR" : theta2Deg?.toFixed(2)}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">{tir ? "reflected" : "degrees"}</p>
                </div>
                <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm text-center p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>n₁ (incident)</p>
                  <p className="text-[32px] font-bold leading-none text-slate-800" style={{ fontFamily: "var(--font-dm-sans)" }}>{n1.toFixed(4)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">index</p>
                </div>
                <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm text-center p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>n₂ (refracted)</p>
                  <p className="text-[32px] font-bold leading-none text-slate-800" style={{ fontFamily: "var(--font-dm-sans)" }}>{n2.toFixed(4)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">index</p>
                </div>
              </div>

              {/* Step-by-step working */}
              <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step working</h3>
                </div>
                <div className="space-y-3 font-mono text-[13px]">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Apply Snell&apos;s Law</p>
                    <p className="text-slate-700">n₁sinθ₁ = n₂sinθ₂</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitute values</p>
                    <p className="text-slate-700">{n1.toFixed(4)} × sin({angleDeg}°) = {n2.toFixed(4)} × sin(θ₂)</p>
                    <p className="text-slate-500 mt-1">sin(θ₂) = {sinTheta2.toFixed(4)}</p>
                  </div>
                  {!tir ? (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p>
                      <p className="text-indigo-700 font-bold text-[15px]">θ₂ = arcsin({sinTheta2.toFixed(4)}) = {theta2Deg?.toFixed(2)}°</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Total Internal Reflection</p>
                      <p className="text-red-700 font-bold text-[15px]">sin(θ₂) = {sinTheta2.toFixed(4)} &gt; 1 — TIR occurs</p>
                      {criticalAngle && <p className="text-red-500 text-[13px] mt-1">Critical angle = {criticalAngle.toFixed(2)}°</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Critical angle info */}
              {criticalAngle && (
                <div className={`rounded-[20px] border p-6 ${angleDeg >= criticalAngle ? "border-red-300 bg-red-50" : "border-slate-200 bg-white shadow-sm"}`}>
                  <p className="text-[13px] font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Critical angle (n₁ → n₂)</p>
                  <p className="text-[28px] font-bold text-pink-600" style={{ fontFamily: "var(--font-dm-sans)" }}>{criticalAngle.toFixed(2)}°</p>
                  <p className="text-[13px] text-slate-500 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {angleDeg >= criticalAngle ? "⚠️ Current angle exceeds critical angle — Total Internal Reflection." : `Increase θ₁ above ${criticalAngle.toFixed(1)}° for Total Internal Reflection.`}
                  </p>
                </div>
              )}

              {/* Snell's equations reference */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[16px] font-bold text-slate-900 mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>Snell&apos;s Law — key equations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {SNELL_EQUATIONS.map(eq => (
                    <div key={eq.name} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>{eq.name}</p>
                      <p className="font-mono text-[12px] font-bold" style={{ color: eq.color }}>{eq.formula}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is Snell&apos;s Law?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Snell&apos;s Law describes how light bends when it passes between media with different refractive indices. A higher index means light travels slower. When moving from a denser to a less dense medium beyond the critical angle, Total Internal Reflection occurs — the principle behind optical fibres and diamond brilliance.
                </p>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                  <p className="text-[14px] text-indigo-800 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    &ldquo;Diamond has the highest refractive index (n ≈ 2.42) of naturally occurring transparent solids, giving it a critical angle of only ~24° — meaning most light that enters undergoes TIR multiple times, creating its signature sparkle.&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="snells-law" category="Waves & Optics" />
      <Footer />
    </div>
  );
}
