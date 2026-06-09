"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "F" | "m" | "v" | "r" | "a";

export default function CentripetalForceCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("F");
  const [mass, setMass] = useState("5");
  const [velocity, setVelocity] = useState("10");
  const [radius, setRadius] = useState("2");
  const [force, setForce] = useState("");
  const [accel, setAccel] = useState("");

  const [result, setResult] = useState<{ value: string; unit: string; extra?: string; steps: string[] } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, mass, velocity, radius, force, accel]);

  const calculate = () => {
    let m = parseFloat(mass);
    let v = parseFloat(velocity);
    let r = parseFloat(radius);
    let F = parseFloat(force);
    let steps: string[] = [];
    let value = 0;
    let unit = "";
    let extra: string | undefined;

    if (solveFor === "F" && !isNaN(m) && !isNaN(v) && !isNaN(r) && r !== 0) {
      value = (m * v * v) / r;
      unit = "N";
      const a = (v * v) / r;
      extra = `Centripetal acceleration a = v²/r = ${a.toFixed(2)} m/s²`;
      steps = [`F = mv²/r`, `F = ${m} × ${v}² / ${r}`, `F = ${(m * v * v).toFixed(3)} / ${r}`, `F = ${value.toFixed(2)} N`];
    } else if (solveFor === "m" && !isNaN(F) && !isNaN(v) && !isNaN(r) && v !== 0) {
      value = (F * r) / (v * v);
      unit = "kg";
      steps = [`m = Fr/v²`, `m = ${F} × ${r} / ${v}²`, `m = ${(F * r).toFixed(3)} / ${v * v}`, `m = ${value.toFixed(4)} kg`];
    } else if (solveFor === "v" && !isNaN(F) && !isNaN(m) && !isNaN(r) && m !== 0) {
      value = Math.sqrt((F * r) / m);
      unit = "m/s";
      steps = [`v = √(Fr/m)`, `v = √(${F} × ${r} / ${m})`, `v = √(${(F * r / m).toFixed(4)})`, `v = ${value.toFixed(2)} m/s`];
    } else if (solveFor === "r" && !isNaN(F) && !isNaN(m) && !isNaN(v) && F !== 0) {
      value = (m * v * v) / F;
      unit = "m";
      steps = [`r = mv²/F`, `r = ${m} × ${v}² / ${F}`, `r = ${(m * v * v).toFixed(3)} / ${F}`, `r = ${value.toFixed(2)} m`];
    } else if (solveFor === "a" && !isNaN(v) && !isNaN(r) && r !== 0) {
      value = (v * v) / r;
      unit = "m/s²";
      steps = [`a = v²/r`, `a = ${v}² / ${r}`, `a = ${(v * v).toFixed(3)} / ${r}`, `a = ${value.toFixed(2)} m/s²`];
    } else { setResult(null); return; }

    setResult({ value: value.toLocaleString(undefined, { maximumFractionDigits: 4 }), unit, extra, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all";
  const solveOpts: { key: SolveFor; label: string }[] = [
    { key: "F", label: "Force" }, { key: "m", label: "Mass" }, { key: "v", label: "Velocity" }, { key: "r", label: "Radius" }, { key: "a", label: "Accel" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-cyan-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-cyan-500 bg-cyan-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Centripetal Force Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Find centripetal force, mass, velocity, or radius for circular motion. Also computes centripetal acceleration directly.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px] space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {solveOpts.slice(0, 3).map(o => (
                    <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-cyan-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 mt-1 rounded-xl">
                  {solveOpts.slice(3).map(o => (
                    <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-cyan-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>
                  ))}
                </div>
                <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-xl p-4 text-center">
                  <span className="text-[18px] font-bold text-cyan-700">F = mv²/r</span>
                  <p className="text-[11px] text-cyan-400 mt-1 font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>a = v²/r</p>
                </div>
              </div>
              <div className="space-y-4">
                {solveFor !== "m" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass (kg)</label><input type="number" value={mass} onChange={e => setMass(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "v" && solveFor !== "a" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Velocity (m/s)</label><input type="number" value={velocity} onChange={e => setVelocity(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor === "a" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Velocity (m/s)</label><input type="number" value={velocity} onChange={e => setVelocity(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "r" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Radius (m)</label><input type="number" value={radius} onChange={e => setRadius(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "m" || solveFor === "v" || solveFor === "r") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Force (N)</label><input type="number" value={force} onChange={e => setForce(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="Enter force" /></div>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-cyan-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#ecfeff 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-cyan-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveOpts.find(o => o.key === solveFor)?.label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-cyan-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    {result.extra && <p className="text-[13px] text-slate-500 mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.extra}</p>}
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>

              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                    <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  </div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p><p className="text-slate-500 mt-1">{result.steps[2]}</p></div>
                    <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-cyan-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is centripetal force?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>Centripetal force is the net force directed toward the centre of a circular path that keeps an object in circular motion. It is not a separate type of force but rather any force (tension, gravity, friction) acting centripetally. Without it, the object would move in a straight line by Newton&apos;s first law.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="centripetal-force" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
