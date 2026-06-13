"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "U" | "m" | "g" | "h";

export default function GravitationalPotentialEnergyCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("U");
  const [mass, setMass] = useState("5");
  const [gravity, setGravity] = useState("9.81");
  const [height, setHeight] = useState("10");
  const [energy, setEnergy] = useState("");

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, mass, gravity, height, energy]);

  const calculate = () => {
    let m = parseFloat(mass);
    let g = parseFloat(gravity);
    let h = parseFloat(height);
    let u = parseFloat(energy);

    let res = 0;
    let unit = "";
    let steps: string[] = [];

    if (solveFor === "U" && !isNaN(m) && !isNaN(g) && !isNaN(h)) {
      res = m * g * h;
      unit = "J";
      steps = [
        `U = m · g · h`,
        `U = ${m} kg · ${g} m/s² · ${h} m`,
        `U = ${res.toFixed(2)} J`
      ];
    } else if (solveFor === "m" && !isNaN(u) && !isNaN(g) && !isNaN(h) && g !== 0 && h !== 0) {
      res = u / (g * h);
      unit = "kg";
      steps = [
        `U = mgh  =>  m = U / (gh)`,
        `m = ${u} J / (${g} m/s² · ${h} m)`,
        `m = ${res.toFixed(4)} kg`
      ];
    } else if (solveFor === "h" && !isNaN(u) && !isNaN(g) && !isNaN(m) && g !== 0 && m !== 0) {
      res = u / (g * m);
      unit = "m";
      steps = [
        `U = mgh  =>  h = U / (gm)`,
        `h = ${u} J / (${g} m/s² · ${m} kg)`,
        `h = ${res.toFixed(2)} m`
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
            <Link href="/calculators" className="text-slate-400 hover:text-teal-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-teal-500 bg-teal-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Gravitational Potential Energy
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate the energy stored in an object due to its position in a gravitational field. Matches U = mgh.
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
                  {["Energy", "Mass", "Height"].map(type => {
                    const val = type === "Energy" ? "U" : type === "Mass" ? "m" : "h";
                    return (
                      <button
                        key={type}
                        onClick={() => setSolveFor(val as any)}
                        className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === val ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {solveFor !== "U" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Energy (U, Joules)</label>
                    <input type="number" value={energy} onChange={(e) => setEnergy(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-500 transition-colors" />
                  </div>
                )}
                {solveFor !== "m" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass (m, kg)</label>
                    <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-500 transition-colors" />
                  </div>
                )}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Gravity (g, m/s²)</label>
                  <input type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-500 transition-colors" />
                </div>
                {solveFor !== "h" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Height (h, m)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-500 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-teal-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveFor === "U" ? "ENERGY" : solveFor === "m" ? "MASS" : "HEIGHT"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-teal-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
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
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400 mb-1">Result</p>
                      <p className="text-teal-700 font-bold">{result.steps[2]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="gravitational-potential-energy" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
