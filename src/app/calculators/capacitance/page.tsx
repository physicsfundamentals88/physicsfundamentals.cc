"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "C" | "Q" | "V";

export default function CapacitanceCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("C");
  const [charge, setCharge] = useState("10"); // Coulombs
  const [voltage, setVoltage] = useState("5"); // Volts
  const [capacitance, setCapacitance] = useState(""); // Farads

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, charge, voltage, capacitance]);

  const calculate = () => {
    let q = parseFloat(charge);
    let v = parseFloat(voltage);
    let c = parseFloat(capacitance);

    let res = 0;
    let unit = "";
    let steps: string[] = [];

    if (solveFor === "C" && !isNaN(q) && !isNaN(v) && v !== 0) {
      res = q / v;
      unit = "F";
      steps = [
        `C = Q / V`,
        `C = ${q} C / ${v} V`,
        `C = ${res.toFixed(2)} F`
      ];
    } else if (solveFor === "Q" && !isNaN(c) && !isNaN(v)) {
      res = c * v;
      unit = "C";
      steps = [
        `C = Q / V  =>  Q = C · V`,
        `Q = ${c} F · ${v} V`,
        `Q = ${res.toFixed(2)} C`
      ];
    } else if (solveFor === "V" && !isNaN(q) && !isNaN(c) && c !== 0) {
      res = q / c;
      unit = "V";
      steps = [
        `C = Q / V  =>  V = Q / C`,
        `V = ${q} C / ${c} F`,
        `V = ${res.toFixed(2)} V`
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
            <Link href="/calculators" className="text-slate-400 hover:text-red-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Electromagnetism</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Capacitance Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate capacitance, charge, or potential difference for a capacitor. Matches C = Q/V.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px]">
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="flex bg-slate-100/70 p-1 rounded-xl">
                  {["Capacitance", "Charge", "Voltage"].map(type => {
                    const val = type === "Capacitance" ? "C" : type === "Charge" ? "Q" : "V";
                    return (
                      <button
                        key={type}
                        onClick={() => setSolveFor(val as any)}
                        className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === val ? "bg-red-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {solveFor !== "C" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Capacitance (C, Farads)</label>
                    <input type="number" value={capacitance} onChange={(e) => setCapacitance(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-red-500 transition-colors" />
                  </div>
                )}
                {solveFor !== "Q" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Charge (Q, Coulombs)</label>
                    <input type="number" value={charge} onChange={(e) => setCharge(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-red-500 transition-colors" />
                  </div>
                )}
                {solveFor !== "V" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Voltage (V, Volts)</label>
                    <input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-red-500 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-red-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveFor === "C" ? "CAPACITANCE" : solveFor === "Q" ? "CHARGE" : "VOLTAGE"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-red-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
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
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-1">Result</p>
                      <p className="text-red-700 font-bold">{result.steps[2]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="capacitance" category="Electromagnetism" />
      <Footer />
    </div>
  );
}
