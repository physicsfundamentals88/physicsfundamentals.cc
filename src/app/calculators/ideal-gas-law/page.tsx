"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

// R constant in J/(mol·K)
const R = 8.314;

type SolveFor = "P" | "V" | "n" | "T";

const GAS_LAWS = [
  { name: "Ideal Gas Law", formula: "PV = nRT", color: "#f97316" },
  { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", color: "#8b5cf6" },
  { name: "Charles' Law", formula: "V₁/T₁ = V₂/T₂", color: "#0ea5e9" },
  { name: "Gay-Lussac's", formula: "P₁/T₁ = P₂/T₂", color: "#10b981" },
  { name: "Combined Law", formula: "P₁V₁/T₁ = P₂V₂/T₂", color: "#f59e0b" },
  { name: "Avogadro's", formula: "V = nRT/P", color: "#ec4899" },
];

export default function IdealGasLawCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("P");
  const [pressure, setPressure] = useState("101325"); // Pa
  const [volume, setVolume] = useState("22.4"); // L
  const [moles, setMoles] = useState("1"); // mol
  const [temperature, setTemperature] = useState("273.15"); // K
  const [tempUnit, setTempUnit] = useState<"K" | "°C" | "°F">("K");

  const [result, setResult] = useState<{
    value: string;
    unit: string;
    allValues: { P: string; V: string; n: string; T: string };
    steps: string[];
  } | null>(null);

  useEffect(() => { calculate(); }, [solveFor, pressure, volume, moles, temperature, tempUnit]);

  const toKelvin = (val: number, unit: string) => {
    if (unit === "°C") return val + 273.15;
    if (unit === "°F") return (val - 32) * (5 / 9) + 273.15;
    return val;
  };

  const calculate = () => {
    let P = parseFloat(pressure);      // Pa
    let V = parseFloat(volume) / 1000; // L → m³
    let n = parseFloat(moles);         // mol
    let T_raw = parseFloat(temperature);
    let T = toKelvin(T_raw, tempUnit); // K

    let steps: string[] = [];
    let resultVal = 0;
    let resultUnit = "";

    if (solveFor === "P" && !isNaN(V) && !isNaN(n) && !isNaN(T)) {
      resultVal = (n * R * T) / V;
      resultUnit = "Pa";
      P = resultVal;
      steps = [
        "PV = nRT  →  P = nRT / V",
        `P = (${n} mol × 8.314 J·mol⁻¹·K⁻¹ × ${T.toFixed(2)} K) / ${V.toFixed(4)} m³`,
        `P = ${(n * R * T).toFixed(3)} / ${V.toFixed(4)}`,
        `P = ${resultVal.toFixed(2)} Pa`,
      ];
    } else if (solveFor === "V" && !isNaN(P) && !isNaN(n) && !isNaN(T)) {
      const V_m3 = (n * R * T) / P;
      resultVal = V_m3 * 1000; // m³ → L
      resultUnit = "L";
      V = V_m3;
      steps = [
        "PV = nRT  →  V = nRT / P",
        `V = (${n} mol × 8.314 × ${T.toFixed(2)} K) / ${P} Pa`,
        `V = ${(n * R * T).toFixed(3)} / ${P}`,
        `V = ${V_m3.toFixed(5)} m³ = ${resultVal.toFixed(3)} L`,
      ];
    } else if (solveFor === "n" && !isNaN(P) && !isNaN(V) && !isNaN(T)) {
      resultVal = (P * V) / (R * T);
      resultUnit = "mol";
      n = resultVal;
      steps = [
        "PV = nRT  →  n = PV / RT",
        `n = (${P} Pa × ${V.toFixed(4)} m³) / (8.314 × ${T.toFixed(2)} K)`,
        `n = ${(P * V).toFixed(4)} / ${(R * T).toFixed(3)}`,
        `n = ${resultVal.toFixed(4)} mol`,
      ];
    } else if (solveFor === "T" && !isNaN(P) && !isNaN(V) && !isNaN(n)) {
      T = (P * V) / (n * R);
      resultVal = T;
      resultUnit = "K";
      steps = [
        "PV = nRT  →  T = PV / nR",
        `T = (${P} Pa × ${V.toFixed(4)} m³) / (${n} mol × 8.314)`,
        `T = ${(P * V).toFixed(4)} / ${(n * R).toFixed(3)}`,
        `T = ${T.toFixed(2)} K`,
      ];
    } else {
      setResult(null);
      return;
    }

    setResult({
      value: resultVal.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      unit: resultUnit,
      allValues: {
        P: P.toFixed(2),
        V: (V * 1000).toFixed(3),
        n: n.toFixed(4),
        T: T.toFixed(2),
      },
      steps,
    });
  };

  const solveBtnClass = (key: SolveFor) =>
    `flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === key ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`;

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all";

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-orange-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">Thermodynamics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Ideal Gas Law Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[620px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Solve <strong style={{ color: "#f97316" }}>PV = nRT</strong> for pressure, volume, moles, or temperature. Full unit conversion — pascals, atm, bar, litres, celsius and fahrenheit.
          </p>
        </div>
      </div>

      {/* ── Calculator ── */}
      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">

            {/* ── Inputs ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm space-y-6">

              {/* Solve For */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {(["Pressure","Volume","Moles","Temp"] as const).map((label) => {
                    const key = label === "Pressure" ? "P" : label === "Volume" ? "V" : label === "Moles" ? "n" : "T";
                    return (
                      <button key={key} onClick={() => setSolveFor(key as SolveFor)}
                        className={solveBtnClass(key as SolveFor)}
                        style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Formula display */}
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                  <span className="text-[20px] font-bold text-orange-600">PV = nRT</span>
                  <p className="text-[11px] text-orange-400 mt-1 font-semibold tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    R = 8.314 J·mol⁻¹·K⁻¹
                  </p>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                {solveFor !== "P" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Pressure (Pa)</label>
                    <input type="number" value={pressure} onChange={e => setPressure(e.target.value)} className={inputClass} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="101325" />
                  </div>
                )}
                {solveFor !== "V" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Volume (L)</label>
                    <input type="number" value={volume} onChange={e => setVolume(e.target.value)} className={inputClass} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="22.4" />
                  </div>
                )}
                {solveFor !== "n" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Amount (mol)</label>
                    <input type="number" value={moles} onChange={e => setMoles(e.target.value)} className={inputClass} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="1" />
                  </div>
                )}
                {solveFor !== "T" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Temperature</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                      <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)}
                        className="flex-1 w-full bg-slate-50/50 px-4 py-3 text-[16px] text-slate-800 outline-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }} />
                      <select value={tempUnit} onChange={e => setTempUnit(e.target.value as any)}
                        className="bg-slate-100 border-l border-slate-200 px-3 text-[13px] font-bold text-slate-600 outline-none cursor-pointer"
                        style={{ fontFamily: "var(--font-dm-sans)" }}>
                        <option>K</option>
                        <option>°C</option>
                        <option>°F</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Standard Conditions note */}
              <div className="bg-slate-50 rounded-xl p-4 text-[12px] text-slate-500 space-y-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                <p className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-2">Standard Conditions</p>
                <p>STP (IUPAC): 0°C (273.15K), 100 kPa</p>
                <p>NTP (USA): 20°C (293.15K), 1 atm</p>
                <p>SATP: 25°C (298.15K), 100 kPa</p>
              </div>
            </div>

            {/* ── Results Panel ── */}
            <div className="space-y-6">

              {/* 4-Box summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([
                  { key: "P", label: "Pressure", unit: "Pa", color: "orange" },
                  { key: "V", label: "Volume", unit: "L", color: "orange" },
                  { key: "n", label: "Moles", unit: "mol", color: "orange" },
                  { key: "T", label: "Temp", unit: "K", color: "orange" },
                ]).map(({ key, label, unit }) => {
                  const active = solveFor === key;
                  const val = result?.allValues[key as keyof typeof result.allValues] ?? "—";
                  return (
                    <div key={key}
                      className={`rounded-[20px] border text-center p-5 flex flex-col items-center justify-center transition-all ${active ? "border-orange-400 bg-orange-50 shadow-md ring-1 ring-orange-300" : "bg-white border-slate-200 shadow-sm"}`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400" style={{ fontFamily: "var(--font-dm-sans)" }}>{label}</p>
                      <p className={`text-[28px] font-bold leading-none ${active ? "text-orange-600" : "text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{val}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-1">{unit}</p>
                    </div>
                  );
                })}
              </div>

              {/* Step-by-step */}
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  </div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p>
                      <p className="text-slate-700">{result.steps[0]}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p>
                      <p className="text-slate-700">{result.steps[1]}</p>
                      <p className="text-slate-500 mt-1">{result.steps[2]}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-orange-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p>
                      <p className="text-orange-700 font-bold text-[15px]">{result.steps[3]}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gas Law Equations reference */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[16px] font-bold text-slate-900 mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>Gas law equations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {GAS_LAWS.map(law => (
                    <div key={law.name} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-sans)" }}>{law.name}</p>
                      <p className="font-mono text-[13px] font-bold" style={{ color: law.color }}>{law.formula}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info card */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>The Ideal Gas Law</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  The ideal gas law <strong>PV = nRT</strong> combines Boyle&apos;s law (P ∝ 1/V), Charles&apos; law (V ∝ T), and Avogadro&apos;s law (V ∝ n) into a single equation that describes the state of any ideal gas. It assumes gas molecules have no volume and no intermolecular forces — a good approximation for real gases at low pressures or high temperatures.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                  <p className="text-[14px] text-orange-800 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    &ldquo;The universal gas constant R = 8.314 J/(mol·K) links the macroscopic pressure, volume, and temperature to the microscopic number of molecules in a mole (6.02 × 10²³ molecules — the molar volume of any ideal gas is 22.4 L at STP).&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="ideal-gas-law" category="Thermodynamics" />
      <Footer />
    </div>
  );
}
