"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "p" | "m" | "v" | "J";

export default function MomentumCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("p");
  const [mass, setMass] = useState("5");
  const [velocity, setVelocity] = useState("10");
  const [momentum, setMomentum] = useState("");
  const [force, setForce] = useState("20");
  const [time, setTime] = useState("3");
  const [result, setResult] = useState<{ value: string; unit: string; extra?: string; steps: string[] } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, mass, velocity, momentum, force, time]);

  const calculate = () => {
    const m = parseFloat(mass), v = parseFloat(velocity), p = parseFloat(momentum);
    const F = parseFloat(force), t = parseFloat(time);
    let steps: string[] = [], value = 0, unit = "", extra: string | undefined;

    if (solveFor === "p" && !isNaN(m) && !isNaN(v)) {
      value = m * v; unit = "kg·m/s";
      const J = !isNaN(F) && !isNaN(t) ? F * t : null;
      extra = J !== null ? `Impulse J = F·t = ${J.toFixed(2)} N·s` : undefined;
      steps = [`p = m × v`, `p = ${m} kg × ${v} m/s`, ``, `p = ${value.toFixed(2)} kg·m/s`];
    } else if (solveFor === "m" && !isNaN(p) && !isNaN(v) && v !== 0) {
      value = p / v; unit = "kg";
      steps = [`m = p/v`, `m = ${p} / ${v}`, ``, `m = ${value.toFixed(4)} kg`];
    } else if (solveFor === "v" && !isNaN(p) && !isNaN(m) && m !== 0) {
      value = p / m; unit = "m/s";
      steps = [`v = p/m`, `v = ${p} / ${m}`, ``, `v = ${value.toFixed(2)} m/s`];
    } else if (solveFor === "J" && !isNaN(F) && !isNaN(t)) {
      value = F * t; unit = "N·s";
      extra = `Δp = ${value.toFixed(2)} kg·m/s (impulse = change in momentum)`;
      steps = [`J = F × Δt`, `J = ${F} N × ${t} s`, ``, `J = ${value.toFixed(2)} N·s`];
    } else { setResult(null); return; }

    setResult({ value: value.toLocaleString(undefined, { maximumFractionDigits: 4 }), unit, extra, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";
  const opts: { key: SolveFor; label: string }[] = [
    { key: "p", label: "Momentum" }, { key: "m", label: "Mass" }, { key: "v", label: "Velocity" }, { key: "J", label: "Impulse" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-red-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Momentum &amp; Impulse Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for momentum (p = mv), mass, velocity, or impulse (J = FΔt). Calculates both linear momentum and impulse in one place.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {opts.map(o => <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-red-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>)}
                </div>
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-center space-y-1">
                  <p className="text-[16px] font-bold text-red-700">p = m · v</p>
                  <p className="text-[14px] font-bold text-red-500">J = F · Δt = Δp</p>
                </div>
              </div>
              <div className="space-y-4">
                {solveFor !== "m" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass (kg)</label><input type="number" value={mass} onChange={e => setMass(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "v" && solveFor !== "J" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Velocity (m/s)</label><input type="number" value={velocity} onChange={e => setVelocity(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "m" || solveFor === "v") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Momentum (kg·m/s)</label><input type="number" value={momentum} onChange={e => setMomentum(e.target.value)} className={inputCls} placeholder="Enter momentum" style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "p" || solveFor === "J") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Force (N)</label><input type="number" value={force} onChange={e => setForce(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "p" || solveFor === "J") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Time (s)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-red-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#fff5f5 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-red-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{opts.find(o => o.key === solveFor)?.label}</span>
                    <span className="text-[56px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    <span className="text-[16px] font-bold text-red-500 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    {result.extra && <p className="text-[13px] text-slate-500 mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.extra}</p>}
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6"><div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div><h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3></div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p></div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-red-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm"><h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>Momentum &amp; the Impulse-Momentum Theorem</h3><p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>Linear momentum (p = mv) is conserved in isolated systems. Impulse (J = FΔt) equals the change in momentum, meaning a larger force over a longer time produces a bigger velocity change. This is why airbags increase the collision time, reducing the peak force on passengers.</p></div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="momentum" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
