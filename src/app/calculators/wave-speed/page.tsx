"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

type SolveFor = "v" | "f" | "λ";

export default function WaveSpeedCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("v");
  const [velocity, setVelocity] = useState("");
  const [frequency, setFrequency] = useState("440");
  const [wavelength, setWavelength] = useState("0.78");

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, velocity, frequency, wavelength]);

  const calculate = () => {
    let v = parseFloat(velocity);
    let f = parseFloat(frequency);
    let l = parseFloat(wavelength);

    let res = 0;
    let unit = "";
    let steps: string[] = [];

    if (solveFor === "v" && !isNaN(f) && !isNaN(l)) {
      res = f * l;
      unit = "m/s";
      steps = [
        `v = f · λ`,
        `v = ${f} Hz · ${l} m`,
        `v = ${res.toFixed(2)} m/s`
      ];
    } else if (solveFor === "f" && !isNaN(v) && !isNaN(l) && l !== 0) {
      res = v / l;
      unit = "Hz";
      steps = [
        `v = f · λ  =>  f = v / λ`,
        `f = ${v} m/s / ${l} m`,
        `f = ${res.toFixed(2)} Hz`
      ];
    } else if (solveFor === "λ" && !isNaN(v) && !isNaN(f) && f !== 0) {
      res = v / f;
      unit = "m";
      steps = [
        `v = f · λ  =>  λ = v / f`,
        `λ = ${v} m/s / ${f} Hz`,
        `λ = ${res.toFixed(4)} m`
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
            <Link href="/calculators" className="text-slate-400 hover:text-blue-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Waves & Optics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Wave Speed Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate wave velocity, frequency, or wavelength. Works for sound, light, and any recurring wave motion.
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
                  {["Velocity", "Frequency", "Wavelength"].map(type => {
                    const val = type === "Velocity" ? "v" : type === "Frequency" ? "f" : "λ";
                    return (
                      <button
                        key={type}
                        onClick={() => setSolveFor(val as any)}
                        className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {type === "Velocity" ? "Speed" : type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {solveFor !== "v" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Wave Speed (v, m/s)</label>
                    <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                )}
                {solveFor !== "f" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Frequency (f, Hz)</label>
                    <input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                )}
                {solveFor !== "λ" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Wavelength (λ, m)</label>
                    <input type="number" value={wavelength} onChange={(e) => setWavelength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{solveFor === "v" ? "SPEED" : solveFor === "f" ? "FREQUENCY" : "WAVELENGTH"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-blue-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
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
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Result</p>
                      <p className="text-blue-700 font-bold">{result.steps[2]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="wave-speed" category="Waves & Optics" />
      <Footer />
    </div>
  );
}
