"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

// k = 8.9875517923 × 10⁹ N·m²/C²
const K = 8.9875517923e9;

type SolveFor = "F" | "q1" | "q2" | "r";

export default function CoulombsLawCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("F");
  const [q1, setQ1] = useState("1e-6");   // Coulombs
  const [q2, setQ2] = useState("2e-6");   // Coulombs
  const [r, setR] = useState("0.1");      // meters
  const [force, setForce] = useState(""); // Newtons

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, q1, q2, r, force]);

  const parseSci = (s: string) => parseFloat(s);

  const calculate = () => {
    let Q1 = parseSci(q1);
    let Q2 = parseSci(q2);
    let R = parseSci(r);
    let F = parseSci(force);
    let steps: string[] = [];
    let value = 0;
    let unit = "";

    if (solveFor === "F" && !isNaN(Q1) && !isNaN(Q2) && !isNaN(R) && R !== 0) {
      value = K * Math.abs(Q1 * Q2) / (R * R);
      unit = "N";
      steps = [
        "F = k|q₁q₂| / r²",
        `F = 8.9876×10⁹ × |${Q1} × ${Q2}| / (${R})²`,
        `F = 8.9876×10⁹ × ${Math.abs(Q1 * Q2).toExponential(3)} / ${(R * R).toExponential(3)}`,
        `F = ${value.toExponential(4)} N`,
      ];
    } else if (solveFor === "q1" && !isNaN(F) && !isNaN(Q2) && !isNaN(R) && Q2 !== 0) {
      value = (F * R * R) / (K * Math.abs(Q2));
      unit = "C";
      steps = ["q₁ = Fr² / (k|q₂|)", `q₁ = ${F} × ${R}² / (8.9876×10⁹ × |${Q2}|)`, `q₁ = ${(F * R * R).toExponential(3)} / ${(K * Math.abs(Q2)).toExponential(3)}`, `q₁ = ${value.toExponential(4)} C`];
    } else if (solveFor === "q2" && !isNaN(F) && !isNaN(Q1) && !isNaN(R) && Q1 !== 0) {
      value = (F * R * R) / (K * Math.abs(Q1));
      unit = "C";
      steps = ["q₂ = Fr² / (k|q₁|)", `q₂ = ${F} × ${R}² / (8.9876×10⁹ × |${Q1}|)`, `q₂ = ${(F * R * R).toExponential(3)} / ${(K * Math.abs(Q1)).toExponential(3)}`, `q₂ = ${value.toExponential(4)} C`];
    } else if (solveFor === "r" && !isNaN(F) && !isNaN(Q1) && !isNaN(Q2) && F !== 0) {
      value = Math.sqrt(K * Math.abs(Q1 * Q2) / F);
      unit = "m";
      steps = ["r = √(k|q₁q₂| / F)", `r = √(8.9876×10⁹ × |${Q1} × ${Q2}| / ${F})`, `r = √(${(K * Math.abs(Q1 * Q2)).toExponential(3)} / ${F})`, `r = ${value.toExponential(4)} m`];
    } else { setResult(null); return; }

    setResult({ value: value.toExponential(4), unit, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-mono";
  const opts: { key: SolveFor; label: string }[] = [{ key: "F", label: "Force" }, { key: "q1", label: "Charge q₁" }, { key: "q2", label: "Charge q₂" }, { key: "r", label: "Distance" }];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-indigo-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Electromagnetism</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Coulomb&apos;s Law Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Calculate the electrostatic force between two point charges, or solve for charge or separation distance. Supports scientific notation inputs.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px] space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {opts.map(o => <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>)}
                </div>
                <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                  <span className="text-[17px] font-bold text-indigo-700">F = k|q₁q₂| / r²</span>
                  <p className="text-[11px] text-indigo-400 mt-1 font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>k = 8.9876 × 10⁹ N·m²/C²</p>
                </div>
              </div>
              <div className="space-y-4">
                {solveFor !== "q1" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Charge q₁ (C)</label><input type="text" value={q1} onChange={e => setQ1(e.target.value)} className={inputCls} placeholder="e.g. 1e-6" /></div>}
                {solveFor !== "q2" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Charge q₂ (C)</label><input type="text" value={q2} onChange={e => setQ2(e.target.value)} className={inputCls} placeholder="e.g. 2e-6" /></div>}
                {solveFor !== "r" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Separation r (m)</label><input type="text" value={r} onChange={e => setR(e.target.value)} className={inputCls} placeholder="0.1" /></div>}
                {solveFor !== "F" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Force F (N)</label><input type="text" value={force} onChange={e => setForce(e.target.value)} className={inputCls} placeholder="Enter force" /></div>}
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-300 p-3 rounded-r-lg text-[12px] text-amber-700" style={{ fontFamily: "var(--font-dm-sans)" }}>Tip: use scientific notation, e.g. <code>6.67e-11</code> for very small values.</div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-indigo-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#eef2ff 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-indigo-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{opts.find(o => o.key === solveFor)?.label}</span>
                    <span className="text-[52px] font-bold text-slate-900 leading-none tracking-tight font-mono">{result.value}</span>
                    <span className="text-[18px] font-bold text-indigo-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>

              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6"><div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div><h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3></div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p><p className="text-slate-500 mt-1">{result.steps[2]}</p></div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-indigo-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is Coulomb&apos;s Law?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>Coulomb&apos;s Law states that the electrostatic force between two point charges is directly proportional to the product of their magnitudes and inversely proportional to the square of the distance between them. Like charges repel; opposite charges attract.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="coulombs-law" category="Electromagnetism" />
      <Footer />
    </div>
  );
}
