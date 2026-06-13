"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

export default function KineticEnergyCalculator() {
  const [solveFor, setSolveFor] = useState<"KE" | "m" | "v">("KE");
  
  const [mass, setMass] = useState("10");
  const [massUnit, setMassUnit] = useState("kg"); // kg, g
  
  const [velocity, setVelocity] = useState("20");
  const [velocityUnit, setVelocityUnit] = useState("m/s"); // m/s, km/h
  
  const [ke, setKe] = useState("");
  const [keUnit, setKeUnit] = useState("J"); // J, kJ
  
  const [result, setResult] = useState<{ value: string; unit: string; steps: string[] } | null>(null);

  useEffect(() => {
    calculate();
  }, [solveFor, mass, massUnit, velocity, velocityUnit, ke, keUnit]);

  const calculate = () => {
    let m = parseFloat(mass);
    let v = parseFloat(velocity);
    let k = parseFloat(ke);

    // Convert to standard SI (kg, m/s, J)
    if (massUnit === "g") m = m / 1000;
    if (velocityUnit === "km/h") v = v / 3.6;
    if (keUnit === "kJ") k = k * 1000;

    let ans = 0;
    let finalUnit = "";
    let steps: string[] = [];

    if (solveFor === "KE" && !isNaN(m) && !isNaN(v)) {
      ans = 0.5 * m * Math.pow(v, 2);
      finalUnit = "J";
      steps = [
        `KE = ½ · m · v²`,
        `KE = 0.5 · ${m} kg · (${v} m/s)²`,
        `KE = 0.5 · ${m} · ${v * v}`,
        `KE = ${ans.toFixed(2)} J`
      ];
      if (keUnit === "kJ") {
        ans = ans / 1000;
        finalUnit = "kJ";
      }
    } else if (solveFor === "m" && !isNaN(k) && !isNaN(v)) {
      if (v === 0) {
        setResult(null);
        return;
      }
      ans = (2 * k) / Math.pow(v, 2);
      finalUnit = "kg";
      steps = [
        `KE = ½ · m · v²  =>  m = 2·KE / v²`,
        `m = (2 · ${k} J) / (${v} m/s)²`,
        `m = ${2 * k} / ${v * v}`,
        `m = ${ans.toFixed(2)} kg`
      ];
      if (massUnit === "g") {
        ans = ans * 1000;
        finalUnit = "g";
      }
    } else if (solveFor === "v" && !isNaN(k) && !isNaN(m)) {
      if (m === 0 || k < 0) {
        setResult(null);
        return;
      }
      ans = Math.sqrt((2 * k) / m);
      finalUnit = "m/s";
      steps = [
        `KE = ½ · m · v²  =>  v = √(2·KE / m)`,
        `v = √(2 · ${k} J / ${m} kg)`,
        `v = √(${2 * k / m})`,
        `v = ${ans.toFixed(2)} m/s`
      ];
      if (velocityUnit === "km/h") {
        ans = ans * 3.6;
        finalUnit = "km/h";
      }
    } else {
      setResult(null);
      return;
    }

    setResult({
      value: ans.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      unit: finalUnit,
      steps
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      {/* ── Page Header (Clean, Light) ── */}
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-blue-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Classical Mechanics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Kinetic Energy Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Calculate kinetic energy from mass and velocity — or solve for mass or velocity when KE is known. Includes unit conversions and instant step-by-step solution.
          </p>
        </div>
      </div>

      {/* ── Calculator Layout ── */}
      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            
            {/* ── Inputs Panel ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm">
              
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="flex bg-slate-100/70 p-1 rounded-xl">
                  {["KE", "Mass", "Velocity"].map(type => {
                    const val = type === "Mass" ? "m" : type === "Velocity" ? "v" : "KE";
                    const active = solveFor === val;
                    return (
                      <button
                        key={type}
                        onClick={() => setSolveFor(val as any)}
                        className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-5">
                {solveFor !== "m" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Mass</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <input 
                        type="number" 
                        value={mass} 
                        onChange={(e) => setMass(e.target.value)}
                        className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      />
                      <select 
                        value={massUnit} 
                        onChange={(e) => setMassUnit(e.target.value)}
                        className="bg-slate-100 border-l border-slate-200 px-3 text-[13px] font-bold text-slate-600 outline-none cursor-pointer"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {solveFor !== "v" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Velocity</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <input 
                        type="number" 
                        value={velocity} 
                        onChange={(e) => setVelocity(e.target.value)}
                        className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      />
                      <select 
                        value={velocityUnit} 
                        onChange={(e) => setVelocityUnit(e.target.value)}
                        className="bg-slate-100 border-l border-slate-200 px-3 text-[13px] font-bold text-slate-600 outline-none cursor-pointer"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        <option value="m/s">m/s</option>
                        <option value="km/h">km/h</option>
                      </select>
                    </div>
                  </div>
                )}

                {solveFor !== "KE" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Kinetic Energy</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <input 
                        type="number" 
                        value={ke} 
                        onChange={(e) => setKe(e.target.value)}
                        className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      />
                      <select 
                        value={keUnit} 
                        onChange={(e) => setKeUnit(e.target.value)}
                        className="bg-slate-100 border-l border-slate-200 px-3 text-[13px] font-bold text-slate-600 outline-none cursor-pointer"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        <option value="J">J</option>
                        <option value="kJ">kJ</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Results Panel ── */}
            <div className="space-y-6">
              
              {/* Primary Output */}
              <div className="bg-white rounded-[24px] border border-blue-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {solveFor === "KE" ? "KINETIC ENERGY" : solveFor === "m" ? "MASS" : "VELOCITY"}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {result.value}
                      </span>
                    </div>
                    <span className="text-[18px] font-bold text-blue-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {result.unit}
                    </span>
                  </>
                ) : (
                  <div className="text-slate-400 text-center">
                    <p className="font-medium mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p>
                    <p className="text-[13px]">Calculation updates automatically</p>
                  </div>
                )}
              </div>

              {/* Step by Step */}
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  </div>
                  
                  <div className="space-y-4 font-mono text-[14px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p>
                      <p className="text-slate-700">{result.steps[0]}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p>
                      <p className="text-slate-700">{result.steps[1]}</p>
                      <p className="text-slate-500 mt-1">{result.steps[2]}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p>
                      <p className="text-blue-700 font-bold text-[15px]">{result.steps[3]}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informational Cards */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is kinetic energy?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Kinetic energy is the energy an object possesses due to its motion. It is defined as the work needed to accelerate a body of a given mass from rest to its stated velocity.
                </p>
                <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-lg mt-6">
                  <p className="text-[14px] text-slate-700 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    "The relationship is quadratic with velocity — meaning if you double your speed, your kinetic energy increases by a factor of 4. This is why car crashes at high speeds are exponentially more dangerous."
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="kinetic-energy" category="Classical Mechanics" />
      <Footer />
    </div>
  );
}
