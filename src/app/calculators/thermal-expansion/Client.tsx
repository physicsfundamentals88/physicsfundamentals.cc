"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const MATERIALS = [
  { name: "Custom", α: null },
  { name: "Aluminum", α: 23.1e-6 },
  { name: "Copper", α: 17e-6 },
  { name: "Steel (carbon)", α: 12e-6 },
  { name: "Iron", α: 11.8e-6 },
  { name: "Glass (soda)", α: 8.5e-6 },
  { name: "Concrete", α: 12e-6 },
  { name: "Gold", α: 14.2e-6 },
  { name: "Silver", α: 18.9e-6 },
  { name: "Rubber", α: 80e-6 },
  { name: "Quartz (fused)", α: 0.59e-6 },
  { name: "Diamond", α: 1e-6 },
];

type SolveFor = "ΔL" | "L0" | "α" | "ΔT";

export default function ThermalExpansionCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("ΔL");
  const [material, setMaterial] = useState("Steel (carbon)");
  const [alpha, setAlpha] = useState("12e-6");
  const [L0, setL0] = useState("10");
  const [deltaT, setDeltaT] = useState("100");
  const [deltaL, setDeltaL] = useState("");
  const [result, setResult] = useState<{ value: string; unit: string; finalLength?: string; steps: string[] } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, alpha, L0, deltaT, deltaL]);

  useEffect(() => {
    const m = MATERIALS.find(x => x.name === material);
    if (m?.α !== null && m?.α !== undefined) setAlpha(m.α.toExponential(3));
  }, [material]);

  const calculate = () => {
    const α = parseFloat(alpha);
    const l0 = parseFloat(L0);
    const dT = parseFloat(deltaT);
    const dL = parseFloat(deltaL);
    let steps: string[] = [], value = 0, unit = "", finalLength: string | undefined;

    if (solveFor === "ΔL" && !isNaN(α) && !isNaN(l0) && !isNaN(dT)) {
      value = α * l0 * dT; unit = "m";
      finalLength = `Final length L = ${(l0 + value).toFixed(6)} m`;
      steps = [`ΔL = α · L₀ · ΔT`, `ΔL = ${α.toExponential(3)} × ${l0} × ${dT}`, `ΔL = ${(α * l0).toExponential(4)} × ${dT}`, `ΔL = ${value.toExponential(4)} m`];
    } else if (solveFor === "L0" && !isNaN(α) && !isNaN(dL) && !isNaN(dT) && α !== 0 && dT !== 0) {
      value = dL / (α * dT); unit = "m";
      steps = [`L₀ = ΔL / (α · ΔT)`, `L₀ = ${dL} / (${α.toExponential(3)} × ${dT})`, `L₀ = ${dL} / ${(α * dT).toExponential(4)}`, `L₀ = ${value.toFixed(4)} m`];
    } else if (solveFor === "α" && !isNaN(dL) && !isNaN(l0) && !isNaN(dT) && l0 !== 0 && dT !== 0) {
      value = dL / (l0 * dT); unit = "/°C";
      steps = [`α = ΔL / (L₀ · ΔT)`, `α = ${dL} / (${l0} × ${dT})`, `α = ${dL} / ${l0 * dT}`, `α = ${value.toExponential(4)} /°C`];
    } else if (solveFor === "ΔT" && !isNaN(dL) && !isNaN(α) && !isNaN(l0) && α !== 0 && l0 !== 0) {
      value = dL / (α * l0); unit = "°C";
      steps = [`ΔT = ΔL / (α · L₀)`, `ΔT = ${dL} / (${α.toExponential(3)} × ${l0})`, `ΔT = ${dL} / ${(α * l0).toExponential(4)}`, `ΔT = ${value.toFixed(2)} °C`];
    } else { setResult(null); return; }

    setResult({ value: value.toExponential(4), unit, finalLength, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all";
  const opts: { key: SolveFor; label: string }[] = [
    { key: "ΔL", label: "Expansion" }, { key: "L0", label: "Init. Length" }, { key: "α", label: "Coefficient" }, { key: "ΔT", label: "Temp Δ" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-pink-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">Thermodynamics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Thermal Expansion Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Predict the change in length of a solid material when its temperature changes. Includes preset expansion coefficients for 12 common materials.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {opts.map(o => <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-pink-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>)}
                </div>
                <div className="mt-4 bg-pink-50 border border-pink-100 rounded-xl p-4 text-center">
                  <span className="text-[17px] font-bold text-pink-700">ΔL = α · L₀ · ΔT</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Material (preset α)</label>
                <select value={material} onChange={e => setMaterial(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 outline-none focus:border-pink-400 transition-all cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {MATERIALS.map(m => <option key={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                {solveFor !== "α" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Coefficient α (/°C)</label><input type="text" value={alpha} onChange={e => setAlpha(e.target.value)} className={`${inputCls} font-mono`} placeholder="e.g. 12e-6" /></div>}
                {solveFor !== "L0" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Initial length L₀ (m)</label><input type="number" value={L0} onChange={e => setL0(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "ΔT" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Temperature change ΔT (°C)</label><input type="number" value={deltaT} onChange={e => setDeltaT(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "L0" || solveFor === "α" || solveFor === "ΔT") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Expansion ΔL (m)</label><input type="number" value={deltaL} onChange={e => setDeltaL(e.target.value)} className={inputCls} placeholder="Known expansion" style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-[12px] space-y-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                <p className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-2">Material reference (α × 10⁻⁶/°C)</p>
                {MATERIALS.filter(m => m.α !== null).slice(0, 6).map(m => (
                  <div key={m.name} className="flex justify-between text-slate-500">
                    <span>{m.name}</span><span className="font-mono font-bold text-slate-700">{((m.α as number) * 1e6).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-pink-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#fdf2f8 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-pink-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{opts.find(o => o.key === solveFor)?.label}</span>
                    <span className="text-[52px] font-bold text-slate-900 leading-none tracking-tight font-mono">{result.value}</span>
                    <span className="text-[16px] font-bold text-pink-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    {result.finalLength && <p className="text-[13px] text-slate-500 mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.finalLength}</p>}
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6"><div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div><h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3></div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p><p className="text-slate-500 mt-1">{result.steps[2]}</p></div>
                    <div className="bg-pink-50 border border-pink-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-pink-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-pink-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm"><h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is thermal expansion?</h3><p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>When materials absorb heat, their atoms vibrate more and move apart, causing expansion. The coefficient of linear thermal expansion (α) quantifies this per unit length per degree. Engineers must account for this in bridges, railways and pipelines — expansion joints allow structures to grow and contract safely without buckling.</p></div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="thermal-expansion" category="Thermodynamics" />
      <Footer />
    </div>
  );
}
