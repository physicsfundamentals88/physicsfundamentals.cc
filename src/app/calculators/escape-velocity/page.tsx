"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const CELESTIAL_BODIES = [
  { name: "Earth", M: 5.972e24, R: 6.371e6 },
  { name: "Moon", M: 7.347e22, R: 1.737e6 },
  { name: "Mars", M: 6.39e23, R: 3.389e6 },
  { name: "Jupiter", M: 1.898e27, R: 6.991e7 },
  { name: "Sun", M: 1.989e30, R: 6.957e8 },
  { name: "Custom", M: null, R: null },
];

export default function EscapeVelocityCalculator() {
  const [body, setBody] = useState("Earth");
  const [mass, setMass] = useState("5.972e24");
  const [radius, setRadius] = useState("6371000");

  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  const G = 6.6743e-11;

  useEffect(() => {
    const selected = CELESTIAL_BODIES.find(b => b.name === body);
    if (selected && selected.M !== null) {
      setMass(selected.M.toExponential(3));
      setRadius(selected.R!.toString());
    }
  }, [body]);

  useEffect(() => {
    calculate();
  }, [mass, radius]);

  const calculate = () => {
    let m = parseFloat(mass);
    let r = parseFloat(radius);

    if (!isNaN(m) && !isNaN(r) && r !== 0) {
      const v_e = Math.sqrt((2 * G * m) / r);
      setResult({
        value: v_e.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        unit: "m/s",
        steps: [
          `v_e = √(2GM / r)`,
          `v_e = √(2 · 6.674e-11 · ${m} / ${r})`,
          `v_e = √(${(2 * G * m / r).toExponential(4)})`,
          `v_e = ${v_e.toFixed(0)} m/s`
        ]
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-indigo-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Astrophysics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Escape Velocity Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate the theoretical minimum speed needed to break free from a planet&apos;s gravitational pull.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px]">
              <div className="mb-6">
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Celestial Body Preset</label>
                <select 
                  value={body} 
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {CELESTIAL_BODIES.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass of Body (M, kg)</label>
                  <input type="text" value={mass} onChange={(e) => setMass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-500 transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Radius of Body (r, m)</label>
                  <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-500 transition-colors font-mono" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-indigo-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>ESCAPE VELOCITY</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    </div>
                    <span className="text-[18px] font-bold text-indigo-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    <p className="text-[14px] text-slate-400 mt-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      ≈ {(parseFloat(result.value.replace(/,/g, '')) * 3.6).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h
                    </p>
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
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-1">Result</p>
                      <p className="text-indigo-700 font-bold">{result.steps[3]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="escape-velocity" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
