"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RelatedCalculators from "@components/RelatedCalculators";

const SOUND_SPEED = 343; // m/s in air at 20°C

type SolveFor = "fObs" | "fSrc" | "vObs" | "vSrc";

export default function DopplerEffectCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("fObs");
  const [fSrc, setFSrc] = useState("440");
  const [vObs, setVObs] = useState("0");
  const [vSrc, setVSrc] = useState("30");
  const [fObs, setFObs] = useState("");
  const [medium, setMedium] = useState("Air (343 m/s)");
  const [vSound, setVSound] = useState("343");
  const [obsApproaching, setObsApproaching] = useState(true);
  const [srcApproaching, setSrcApproaching] = useState(true);
  const [result, setResult] = useState<{ value: string; unit: string; shift: string; steps: string[] } | null>(null);

  const MEDIA = [
    { name: "Air (343 m/s)", v: 343 },
    { name: "Water (1480 m/s)", v: 1480 },
    { name: "Steel (5960 m/s)", v: 5960 },
    { name: "Custom", v: null },
  ];

  useEffect(() => { calculate(); }, [solveFor, fSrc, vObs, vSrc, fObs, vSound, obsApproaching, srcApproaching]);

  const calculate = () => {
    const vW = parseFloat(vSound);
    const fs = parseFloat(fSrc);
    const vo = parseFloat(vObs) * (obsApproaching ? 1 : -1);
    const vs = parseFloat(vSrc) * (srcApproaching ? 1 : -1);
    const fo = parseFloat(fObs);

    if (isNaN(vW) || vW <= 0) { setResult(null); return; }

    let value = 0; let unit = "Hz"; let steps: string[] = []; let shift = "";

    if (solveFor === "fObs" && !isNaN(fs) && !isNaN(fo) === false && !isNaN(parseFloat(vObs)) && !isNaN(parseFloat(vSrc))) {
      value = fs * ((vW + vo) / (vW - vs));
      const delta = value - fs;
      shift = delta > 0 ? `+${delta.toFixed(1)} Hz blueshift` : `${delta.toFixed(1)} Hz redshift`;
      steps = [
        `f_obs = f_src × (v+v_obs)/(v−v_src)`,
        `f_obs = ${fs} × (${vW}${vo >= 0 ? "+" : ""}${vo})/(${vW}${vs >= 0 ? "−" : "+"}${Math.abs(vs)})`,
        `f_obs = ${fs} × ${(vW + vo).toFixed(1)}/${(vW - vs).toFixed(1)}`,
        `f_obs = ${value.toFixed(2)} Hz`,
      ];
    } else if (solveFor === "fSrc" && !isNaN(fo) && !isNaN(parseFloat(vObs)) && !isNaN(parseFloat(vSrc))) {
      value = fo * ((vW - vs) / (vW + vo));
      shift = `Source frequency: ${value.toFixed(2)} Hz`;
      steps = [
        `f_src = f_obs × (v−v_src)/(v+v_obs)`,
        `f_src = ${fo} × (${vW}${vs >= 0 ? "−" : "+"}${Math.abs(vs)})/(${vW}${vo >= 0 ? "+" : ""}${vo})`,
        `f_src = ${fo} × ${(vW - vs).toFixed(1)}/${(vW + vo).toFixed(1)}`,
        `f_src = ${value.toFixed(2)} Hz`,
      ];
    } else if (solveFor === "vObs" && !isNaN(fo) && !isNaN(fs) && !isNaN(parseFloat(vSrc)) && fs !== 0) {
      value = Math.abs((fo / fs) * (vW - vs) - vW);
      unit = "m/s";
      shift = `Observer velocity: ${value.toFixed(2)} m/s`;
      steps = [
        `v_obs = (f_obs/f_src × (v−v_src)) − v`,
        `v_obs = (${fo}/${fs} × (${vW}−${vs})) − ${vW}`,
        `v_obs = ${((fo / fs) * (vW - vs)).toFixed(3)} − ${vW}`,
        `|v_obs| = ${value.toFixed(2)} m/s`,
      ];
    } else if (solveFor === "vSrc" && !isNaN(fo) && !isNaN(fs) && !isNaN(parseFloat(vObs)) && fo !== 0) {
      value = Math.abs(vW - (fs / fo) * (vW + vo));
      unit = "m/s";
      shift = `Source velocity: ${value.toFixed(2)} m/s`;
      steps = [
        `v_src = v − (f_src/f_obs × (v+v_obs))`,
        `v_src = ${vW} − (${fs}/${fo} × (${vW}+${vo}))`,
        `v_src = ${vW} − ${((fs / fo) * (vW + vo)).toFixed(3)}`,
        `|v_src| = ${value.toFixed(2)} m/s`,
      ];
    } else { setResult(null); return; }

    setResult({ value: value.toFixed(2), unit, shift, steps });
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all";
  const opts: { key: SolveFor; label: string }[] = [
    { key: "fObs", label: "Observed f" }, { key: "fSrc", label: "Source f" },
    { key: "vObs", label: "Obs. speed" }, { key: "vSrc", label: "Src. speed" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <div className="pt-[110px] pb-8 bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
            <Link href="/calculators" className="text-slate-400 hover:text-teal-500 transition-colors">Calculators</Link>
            <span className="text-slate-300">/</span>
            <span className="text-teal-500 bg-teal-50 px-2 py-0.5 rounded-md">Waves &amp; Optics</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-instrument-serif)", fontWeight: 400 }}>Doppler Effect Calculator</h1>
          <p className="text-[16px] text-slate-500 max-w-[600px] leading-[1.6]" style={{ fontFamily: "var(--font-dm-sans)" }}>Find the observed frequency when a source or observer moves. Works for sound in air, water, or steel. Detects blueshift and redshift automatically.</p>
        </div>
      </div>

      <section className="py-12 flex-1">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm sticky top-[100px] space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Solve for</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
                  {opts.map(o => <button key={o.key} onClick={() => setSolveFor(o.key)} className={`py-2 text-[12px] font-bold rounded-lg transition-all ${solveFor === o.key ? "bg-teal-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{o.label}</button>)}
                </div>
                <div className="mt-4 bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
                  <span className="text-[14px] font-bold text-teal-700">f_obs = f_src × (v+v_obs)/(v−v_src)</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Medium (wave speed)</label>
                <select value={medium} onChange={e => { setMedium(e.target.value); const m = MEDIA.find(x => x.name === e.target.value); if (m?.v) setVSound(String(m.v)); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 outline-none focus:border-teal-400 transition-all cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {MEDIA.map(m => <option key={m.name}>{m.name}</option>)}
                </select>
                {medium === "Custom" && <input type="number" value={vSound} onChange={e => setVSound(e.target.value)} className={`${inputCls} mt-2`} placeholder="Wave speed (m/s)" style={{ fontFamily: "var(--font-dm-sans)" }} />}
              </div>

              <div className="space-y-4">
                {solveFor !== "fSrc" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Source frequency (Hz)</label><input type="number" value={fSrc} onChange={e => setFSrc(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "fObs" && <div><label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Observed frequency (Hz)</label><input type="number" value={fObs} onChange={e => setFObs(e.target.value)} className={inputCls} placeholder="Known observed freq." style={{ fontFamily: "var(--font-dm-sans)" }} /></div>}
                {solveFor !== "vObs" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Observer speed (m/s)</label>
                    <input type="number" value={vObs} onChange={e => setVObs(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} />
                    <div className="flex gap-2 mt-2">
                      {[true, false].map(v => <button key={String(v)} onClick={() => setObsApproaching(v)} className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${obsApproaching === v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{v ? "→ Approaching" : "← Receding"}</button>)}
                    </div>
                  </div>
                )}
                {solveFor !== "vSrc" && (
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Source speed (m/s)</label>
                    <input type="number" value={vSrc} onChange={e => setVSrc(e.target.value)} className={inputCls} style={{ fontFamily: "var(--font-dm-sans)" }} />
                    <div className="flex gap-2 mt-2">
                      {[true, false].map(v => <button key={String(v)} onClick={() => setSrcApproaching(v)} className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${srcApproaching === v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{v ? "→ Approaching" : "← Receding"}</button>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-teal-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ background: "linear-gradient(180deg,#f0fdfa 0%,#ffffff 100%)" }}>
                {result ? (
                  <>
                    <span className="text-[12px] font-bold tracking-[0.2em] text-teal-500 uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>{opts.find(o => o.key === solveFor)?.label}</span>
                    <span className="text-[64px] font-bold text-slate-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.value}</span>
                    <span className="text-[18px] font-bold text-teal-600 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.unit}</span>
                    <p className="text-[13px] text-slate-500 mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{result.shift}</p>
                  </>
                ) : <div className="text-slate-400 text-center"><p className="font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Enter values to see result</p></div>}
              </div>
              {result && (
                <div className="bg-slate-50 rounded-[24px] border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6"><div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div><h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "var(--font-dm-sans)" }}>Step-by-step solution</h3></div>
                  <div className="space-y-3 font-mono text-[13px]">
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Formula</p><p className="text-slate-700">{result.steps[0]}</p></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Substitution</p><p className="text-slate-700">{result.steps[1]}</p><p className="text-slate-500 mt-1">{result.steps[2]}</p></div>
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4"><p className="text-[10px] uppercase font-bold tracking-widest text-teal-400 mb-1" style={{ fontFamily: "var(--font-dm-sans)" }}>Result</p><p className="text-teal-700 font-bold text-[15px]">{result.steps[3]}</p></div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>What is the Doppler Effect?</h3>
                <p className="text-[15px] leading-[1.7] text-slate-600" style={{ fontFamily: "var(--font-dm-sans)" }}>The Doppler effect is the change in observed frequency of a wave when the source or observer is moving. Approaching sources appear higher-pitched (blueshift), receding sources appear lower-pitched (redshift). It explains ambulance siren pitch changes and is used in radar speed guns, weather forecasting, and astronomical redshift measurements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug="doppler-effect" category="Waves & Optics" />
      <Footer />
    </div>
  );
}
