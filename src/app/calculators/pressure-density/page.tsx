"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "P" | "ρ";

export default function PressureDensityCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("P");
  
  // Pressure inputs
  const [force, setForce] = useState("100");
  const [area, setArea] = useState("2");
  
  // Density inputs
  const [mass, setMass] = useState("500");
  const [volume, setVolume] = useState("0.5");

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, force, area, mass, volume]);

  const calculate = () => {
    let res = 0;
    let unit = "";
    let steps: string[] = [];

    if (solveFor === "P") {
      let f = parseFloat(force);
      let a = parseFloat(area);
      if (!isNaN(f) && !isNaN(a) && a !== 0) {
        res = f / a;
        unit = "Pa (N/m²)";
        steps = [
          `P = F / A`,
          `P = ${f} N / ${a} m²`,
          `P = ${res.toFixed(2)} Pa`
        ];
      } else { setResult(null); return; }
    } else {
      let m = parseFloat(mass);
      let v = parseFloat(volume);
      if (!isNaN(m) && !isNaN(v) && v !== 0) {
        res = m / v;
        unit = "kg/m³";
        steps = [
          `ρ = m / V`,
          `ρ = ${m} kg / ${v} m³`,
          `ρ = ${res.toFixed(2)} kg/m³`
        ];
      } else { setResult(null); return; }
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
            <Link href="/calculators" className="text-slate-400 hover:text-slate-600 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Mechanics & Fluids</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Pressure & Density Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate the pressure exerted on a surface or determine the density of a substance.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px]">
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Calculate</label>
                <div className="flex bg-slate-100/70 p-1 rounded-xl">
                  {[
                    { label: "Pressure", val: "P" },
                    { label: "Density", val: "ρ" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSolveFor(opt.val as any)}
                      className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === opt.val ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {solveFor === "P" ? (
                  <>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Force (F, Newtons)</label>
                      <input type="number" value={force} onChange={(e) => setForce(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Area (A, m²)</label>
                      <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-500 transition-colors" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass (m, kg)</label>
                      <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Volume (V, m³)</label>
                      <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-slate-500 transition-colors" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveFor === "P" ? "PRESSURE" : "DENSITY"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-slate-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
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
                    <div className="bg-slate-200 border border-slate-300 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Result</p>
                      <p className="text-slate-800 font-bold">{result.steps[2]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="pressure-density" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
