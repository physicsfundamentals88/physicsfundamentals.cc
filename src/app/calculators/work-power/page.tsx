"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "W" | "P" | "F" | "d" | "t";

export default function WorkPowerCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("W");
  const [force, setForce] = useState("100");
  const [distance, setDistance] = useState("5");
  const [time, setTime] = useState("10");
  const [work, setWork] = useState("");
  const [power, setPower] = useState("");
  const [angle, setAngle] = useState("0");
  const [result, setResult] = useState<{ value: string; unit: string; extra?: string; steps: string[] } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, force, distance, time, work, power, angle]);

  const calculate = () => {
    const F = parseFloat(force), d = parseFloat(distance), t = parseFloat(time);
    const W = parseFloat(work), P = parseFloat(power);
    const θ = (parseFloat(angle) * Math.PI) / 180;
    let steps: string[] = [], value = 0, unit = "", extra: string | undefined;

    if (solveFor === "W" && !isNaN(F) && !isNaN(d)) {
      value = F * d * Math.cos(θ); unit = "J";
      const Pval = !isNaN(t) && t !== 0 ? value / t : null;
      extra = Pval !== null ? `Power = ${Pval.toFixed(2)} W` : undefined;
      steps = [`W = F·d·cos(θ)`, `W = ${F} × ${d} × cos(${angle}°)`, `W = ${F} × ${d} × ${Math.cos(θ).toFixed(4)}`, `W = ${value.toFixed(2)} J`];
    } else if (solveFor === "P" && !isNaN(W) && !isNaN(t) && t !== 0) {
      value = W / t; unit = "W";
      steps = [`P = W/t`, `P = ${W} / ${t}`, ``, `P = ${value.toFixed(2)} W`];
    } else if (solveFor === "F" && !isNaN(W) && !isNaN(d) && d !== 0) {
      value = W / (d * Math.cos(θ)); unit = "N";
      steps = [`F = W/(d·cosθ)`, `F = ${W} / (${d} × ${Math.cos(θ).toFixed(4)})`, ``, `F = ${value.toFixed(2)} N`];
    } else if (solveFor === "d" && !isNaN(W) && !isNaN(F) && F !== 0) {
      value = W / (F * Math.cos(θ)); unit = "m";
      steps = [`d = W/(F·cosθ)`, `d = ${W} / (${F} × ${Math.cos(θ).toFixed(4)})`, ``, `d = ${value.toFixed(2)} m`];
    } else if (solveFor === "t" && !isNaN(P) && !isNaN(W) && P !== 0) {
      value = W / P; unit = "s";
      steps = [`t = W/P`, `t = ${W} / ${P}`, ``, `t = ${value.toFixed(2)} s`];
    } else { setResult(null); return; }

    setResult({ value: value.toLocaleString(undefined, { maximumFractionDigits: 4 }), unit, extra, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all";
  const opts: { key: SolveFor; label: string }[] = [
    { key: "W", label: "Work" }, { key: "P", label: "Power" }, { key: "F", label: "Force" }, { key: "d", label: "Distance" }, { key: "t", label: "Time" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-yellow-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Work &amp; Power Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Calculate mechanical work (W = Fd·cosθ) and power (P = W/t). Supports angle of force and all cross-variable solving.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {opts.slice(0, 3).map(o => (
                    <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-yellow-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 mt-1 rounded-xl">
                  {opts.slice(3).map(o => (
                    <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-yellow-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>
                  ))}
                </div>
                <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center space-y-1">
                  <p className="text-[15px] font-bold text-yellow-700">W = F · d · cos(θ)</p>
                  <p className="text-[14px] font-bold text-yellow-600">P = W / t</p>
                </div>
              </div>
              <div className="space-y-4">
                {solveFor !== "F" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Force (N)</label><input type="number" value={force} onChange={e => setForce(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "d" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Distance (m)</label><input type="number" value={distance} onChange={e => setDistance(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "t" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Time (s)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {(solveFor === "F" || solveFor === "d" || solveFor === "t" || solveFor === "P") && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Work (J)</label><input type="number" value={work} onChange={e => setWork(e.target.value)} className={inputCls} placeholder="Enter work" style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor === "t" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Power (W)</label><input type="number" value={power} onChange={e => setPower(e.target.value)} className={inputCls} placeholder="Enter power" style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Angle θ (°)</label><input type="number" value={angle} onChange={e => setAngle(e.target.value)} className={inputCls} placeholder="0" style={{ fontFamily: "var(--font-dm-sans)" }} /></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-yellow-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#fefce8 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-yellow-600 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{opts.find(o => o.key === solveFor)?.label}</span>
                    <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    <span className="text-[18px] font-bold text-yellow-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    {result.extra && <p className="text-[13px] text-slate-500 mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.extra}</p>}
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                    <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  </div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p></div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-yellow-500 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-yellow-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>Work vs. Power</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>Work is energy transferred by a force over displacement. Power is how quickly that work is done. If the force and displacement are not parallel, only the component of force along the displacement does work — hence the cosθ term.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="work-power" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
