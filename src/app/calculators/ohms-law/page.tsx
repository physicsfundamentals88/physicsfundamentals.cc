"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

// Ohm's Law Calculator combinations:
// V & I -> R = V/I, P = V*I
// V & R -> I = V/R, P = V^2/R
// V & P -> I = P/V, R = V^2/P
// I & R -> V = I*R, P = I^2*R
// I & P -> V = P/I, R = P/I^2
// R & P -> V = sqrt(P*R), I = sqrt(P/R)

export default function OhmsLawCalculator() {
  const [knowns, setKnowns] = useState<"VI" | "VR" | "VP" | "IR" | "IP" | "RP">("VI");
  
  const [voltage, setVoltage] = useState("12");
  const [current, setCurrent] = useState("2");
  const [resistance, setResistance] = useState("");
  const [power, setPower] = useState("");

  const [result, setResult] = useState<{
    V: string;
    I: string;
    R: string;
    P: string;
    steps: string[];
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [knowns, voltage, current, resistance, power]);

  const calculate = () => {
    let V = parseFloat(voltage);
    let I = parseFloat(current);
    let R = parseFloat(resistance);
    let P = parseFloat(power);

    let finalV = 0, finalI = 0, finalR = 0, finalP = 0;
    let steps: string[] = [];

    try {
      switch (knowns) {
        case "VI":
          if (isNaN(V) || isNaN(I)) throw new Error();
          finalV = V;
          finalI = I;
          finalR = V / I;
          finalP = V * I;
          steps = [
            `Given: Voltage (V) = ${V} V, Current (I) = ${I} A`,
            `Resistance = V / I = ${V} / ${I} = ${finalR.toFixed(2)} Ω`,
            `Power = V · I = ${V} · ${I} = ${finalP.toFixed(2)} W`
          ];
          break;
        case "VR":
          if (isNaN(V) || isNaN(R)) throw new Error();
          finalV = V;
          finalR = R;
          finalI = V / R;
          finalP = (V * V) / R;
          steps = [
            `Given: Voltage (V) = ${V} V, Resistance (R) = ${R} Ω`,
            `Current = V / R = ${V} / ${R} = ${finalI.toFixed(2)} A`,
            `Power = V² / R = ${V}² / ${R} = ${finalP.toFixed(2)} W`
          ];
          break;
        case "VP":
          if (isNaN(V) || isNaN(P)) throw new Error();
          finalV = V;
          finalP = P;
          finalI = P / V;
          finalR = (V * V) / P;
          steps = [
            `Given: Voltage (V) = ${V} V, Power (P) = ${P} W`,
            `Current = P / V = ${P} / ${V} = ${finalI.toFixed(2)} A`,
            `Resistance = V² / P = ${V}² / ${P} = ${finalR.toFixed(2)} Ω`
          ];
          break;
        case "IR":
          if (isNaN(I) || isNaN(R)) throw new Error();
          finalI = I;
          finalR = R;
          finalV = I * R;
          finalP = (I * I) * R;
          steps = [
            `Given: Current (I) = ${I} A, Resistance (R) = ${R} Ω`,
            `Voltage = I · R = ${I} · ${R} = ${finalV.toFixed(2)} V`,
            `Power = I² · R = ${I}² · ${R} = ${finalP.toFixed(2)} W`
          ];
          break;
        case "IP":
          if (isNaN(I) || isNaN(P)) throw new Error();
          finalI = I;
          finalP = P;
          finalV = P / I;
          finalR = P / (I * I);
          steps = [
            `Given: Current (I) = ${I} A, Power (P) = ${P} W`,
            `Voltage = P / I = ${P} / ${I} = ${finalV.toFixed(2)} V`,
            `Resistance = P / I² = ${P} / ${I}² = ${finalR.toFixed(2)} Ω`
          ];
          break;
        case "RP":
          if (isNaN(R) || isNaN(P)) throw new Error();
          finalR = R;
          finalP = P;
          finalV = Math.sqrt(P * R);
          finalI = Math.sqrt(P / R);
          steps = [
            `Given: Resistance (R) = ${R} Ω, Power (P) = ${P} W`,
            `Voltage = √(P · R) = √(${P} · ${R}) = ${finalV.toFixed(2)} V`,
            `Current = √(P / R) = √(${P} / ${R}) = ${finalI.toFixed(2)} A`
          ];
          break;
      }
      
      if (!isFinite(finalV) || !isFinite(finalI) || !isFinite(finalR) || !isFinite(finalP)) {
        throw new Error();
      }

      setResult({
        V: finalV.toFixed(2),
        I: finalI.toFixed(2),
        R: finalR.toFixed(2),
        P: finalP.toFixed(2),
        steps
      });
    } catch (e) {
      setResult(null);
    }
  };

  const getLabel = (type: "V"|"I"|"R"|"P") => {
    switch (type) {
      case "V": return "Voltage (V)";
      case "I": return "Current (A)";
      case "R": return "Resistance (Ω)";
      case "P": return "Power (W)";
    }
  };

  const getInputValue = (type: "V"|"I"|"R"|"P") => {
    switch (type) {
      case "V": return voltage;
      case "I": return current;
      case "R": return resistance;
      case "P": return power;
    }
  };

  const setInputValue = (type: "V"|"I"|"R"|"P", val: string) => {
    switch (type) {
      case "V": setVoltage(val); break;
      case "I": setCurrent(val); break;
      case "R": setResistance(val); break;
      case "P": setPower(val); break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-orange-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">Electromagnetism</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>
            Ohm's Law Calculator
          </h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Enter any two of voltage (V), current (I), resistance (R) or power (P) — the calculator instantly solves for all four. Includes live circuit diagram and auto-scaling units.
          </p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
            
            {/* ── Inputs Panel ── */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>I know...</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-8">
                {["VI", "VR", "VP", "IR", "IP", "RP"].map((type: any) => (
                  <button
                    key={type}
                    onClick={() => {
                      setKnowns(type);
                      setVoltage(""); setCurrent(""); setResistance(""); setPower("");
                    }}
                    className={`py-2 text-[12px] font-bold rounded-lg transition-all border ${knowns === type ? "bg-orange-500 border-orange-500 text-white" : "border-slate-200 text-slate-500 hover:border-orange-200 hover:text-orange-500"}`}
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {type.split("").join(" & ")}
                  </button>
                ))}
              </div>

              <div className="space-y-6 mb-8">
                {knowns.split("").map((k) => (
                  <div key={k}>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{getLabel(k as any)}</label>
                    <input 
                      type="number" 
                      value={getInputValue(k as any)} 
                      onChange={(e) => setInputValue(k as any, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-orange-500 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Quick Examples</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setKnowns("VI"); setVoltage("3"); setCurrent("0.02"); }} className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-orange-100 hover:text-orange-600 rounded-md transition-colors">LED (3V, 20mA)</button>
                  <button onClick={() => { setKnowns("VI"); setVoltage("12"); setCurrent("5"); }} className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-orange-100 hover:text-orange-600 rounded-md transition-colors">Car Headlight (12V, 5A)</button>
                  <button onClick={() => { setKnowns("VP"); setVoltage("120"); setPower("60"); }} className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-orange-100 hover:text-orange-600 rounded-md transition-colors">Lightbulb (120V, 60W)</button>
                </div>
              </div>

            </div>

            {/* ── Results Panel ── */}
            <div className="space-y-6">
              
              {/* Circuit Diagram SVG */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm flex flex-col justify-center items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-full mb-6 text-left" style={{ fontFamily: "var(--font-dm-sans)" }}>Circuit Diagram</p>
                <div className="w-full max-w-[400px] aspect-video relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" stroke="#2563eb" strokeWidth="4">
                    {/* Wire loops */}
                    <path d="M 50 150 L 350 150 L 350 50 L 50 50" />
                    {/* Battery on left */}
                    <rect x="35" y="80" width="30" height="40" fill="white" stroke="none" />
                    <line x1="30" y1="90" x2="70" y2="90" stroke="#f59e0b" strokeWidth="4" />
                    <line x1="40" y1="110" x2="60" y2="110" stroke="#f59e0b" strokeWidth="6" />
                    <text x="15" y="85" fill="#f59e0b" fontSize="16" fontWeight="bold" stroke="none">+</text>
                    <text x="15" y="115" fill="#f59e0b" fontSize="16" fontWeight="bold" stroke="none">-</text>
                    
                    {/* Resistor on right */}
                    <rect x="335" y="80" width="30" height="40" fill="white" stroke="none" />
                    <path d="M 350 80 L 340 85 L 360 95 L 340 105 L 360 115 L 350 120" stroke="#f59e0b" strokeWidth="4" />

                    {/* Labels */}
                    <text x="50" y="70" fill="#3b82f6" fontSize="12" fontWeight="bold" stroke="none" textAnchor="middle">{result ? `${result.V} V` : "V"}</text>
                    <text x="200" y="40" fill="#10b981" fontSize="12" fontWeight="bold" stroke="none" textAnchor="middle">{result ? `${result.I} A` : "I"} →</text>
                    <text x="320" y="100" fill="#f59e0b" fontSize="12" fontWeight="bold" stroke="none" textAnchor="end">{result ? `${result.R} Ω` : "R"}</text>
                  </svg>
                </div>
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-6 text-center">
                  <p className="text-[12px] font-bold text-blue-600 mb-2">Voltage</p>
                  <p className="text-[24px] font-bold text-slate-800 leading-none">{result ? result.V : "-"}</p>
                  <p className="text-[11px] font-bold text-blue-400 mt-1">V</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-6 text-center">
                  <p className="text-[12px] font-bold text-emerald-600 mb-2">Current</p>
                  <p className="text-[24px] font-bold text-slate-800 leading-none">{result ? result.I : "-"}</p>
                  <p className="text-[11px] font-bold text-emerald-400 mt-1">A</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-[20px] p-6 text-center">
                  <p className="text-[12px] font-bold text-orange-600 mb-2">Resistance</p>
                  <p className="text-[24px] font-bold text-slate-800 leading-none">{result ? result.R : "-"}</p>
                  <p className="text-[11px] font-bold text-orange-400 mt-1">Ω</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-[20px] p-6 text-center">
                  <p className="text-[12px] font-bold text-purple-600 mb-2">Power</p>
                  <p className="text-[24px] font-bold text-slate-800 leading-none">{result ? result.P : "-"}</p>
                  <p className="text-[11px] font-bold text-purple-400 mt-1">W</p>
                </div>
              </div>

              {/* Step by Step */}
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3>
                  <div className="font-mono text-[13px] leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-xl p-6 whitespace-pre-wrap shadow-sm">
                    {result.steps.join('\n')}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is Ohm's Law?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. Introducing the constant of proportionality, the resistance, one arrives at the usual mathematical equation: V = I · R.
                </p>
                <div className="bg-slate-50 border-l-4 border-orange-400 p-4 rounded-r-lg mt-6">
                  <p className="text-[14px] text-slate-700 italic" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    "Combined with Joule's law (Power P = V · I), you get the Ohm's Law wheel containing 12 distinct formulas, allowing you to solve for any property as long as you know two others."
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="ohms-law" category="Electromagnetism" />
      <Footer />
    </div>
  );
}
