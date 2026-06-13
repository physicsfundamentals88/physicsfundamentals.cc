"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "f" | "T" | "ω";

export default function FrequencyCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("f");
  const [frequency, setFrequency] = useState("");
  const [period, setPeriod] = useState("0.5");
  const [angularFrequency, setAngularFrequency] = useState("12.57");

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, frequency, period, angularFrequency]);

  const calculate = () => {
    let f = parseFloat(frequency);
    let t = parseFloat(period);
    let w = parseFloat(angularFrequency);

    let res = 0;
    let unit = "";
    let steps: string[] = [];

    if (solveFor === "f" && !isNaN(t) && t !== 0) {
      res = 1 / t;
      unit = "Hz";
      steps = [
        `f = 1 / T`,
        `f = 1 / ${t} s`,
        `f = ${res.toFixed(2)} Hz`
      ];
    } else if (solveFor === "T" && !isNaN(f) && f !== 0) {
      res = 1 / f;
      unit = "s";
      steps = [
        `T = 1 / f`,
        `T = 1 / ${f} Hz`,
        `T = ${res.toFixed(4)} s`
      ];
    } else if (solveFor === "ω" && !isNaN(f)) {
      res = 2 * Math.PI * f;
      unit = "rad/s";
      steps = [
        `ω = 2πf`,
        `ω = 2π · ${f} Hz`,
        `ω = ${res.toFixed(2)} rad/s`
      ];
    } else {
      setResult(null);
      return;
    }

    setResult({
      value: res.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      unit,
      steps
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-violet-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-violet-500 bg-violet-50 px-2 py-0.5 rounded-md">Waves & Optics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Frequency Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Convert between frequency, period, and angular frequency for any periodic system.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm">
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="flex bg-slate-100/70 p-1 rounded-xl">
                  {[
                    { label: "Frequency", val: "f" },
                    { label: "Period", val: "T" },
                    { label: "Angular", val: "ω" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSolveFor(opt.val as any)}
                      className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === opt.val ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {solveFor !== "f" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Frequency (f, Hz)</label>
                    <input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-violet-500 transition-colors" />
                  </div>
                )}
                {solveFor === "f" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Period (T, seconds)</label>
                    <input type="number" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-violet-500 transition-colors" />
                  </div>
                )}
                {solveFor === "ω" && (
                  <p className="text-[12px] text-slate-400 italic">Enter frequency above to find angular frequency.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-violet-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveFor === "f" ? "FREQUENCY" : solveFor === "T" ? "PERIOD" : "ANGULAR FREQUENCY"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-violet-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium">Enter values to see result</p></div>}
              </div>

              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  <div className="space-y-4 font-mono text-[14px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Formula</p>
                      <p className="text-slate-700">{result.steps[0]}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Substitution</p>
                      <p className="text-slate-700">{result.steps[1]}</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mb-1">Result</p>
                      <p className="text-violet-700 font-bold">{result.steps[2]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="frequency" category="Waves & Optics" />
      <Footer />
    </div>
  );
}
