"use client";

import React, { useRef, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export default function OrbitalSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(500);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const stateRef = useRef({
    px: 150, py: 0,
    vx: 0, vy: 2.2,
    sx: 0, sy: 0 // star position
  });

  const G = 1;
  const starMass = 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Physics logic
      const dx = stateRef.current.sx - stateRef.current.px;
      const dy = stateRef.current.sy - stateRef.current.py;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      const force = (G * starMass * mass) / distSq;
      const ax = (force * dx) / (dist * mass);
      const ay = (force * dy) / (dist * mass);

      stateRef.current.vx += ax;
      stateRef.current.vy += ay;
      stateRef.current.px += stateRef.current.vx;
      stateRef.current.py += stateRef.current.vy;

      trailRef.current.push({ x: stateRef.current.px, y: stateRef.current.py });
      if (trailRef.current.length > 200) trailRef.current.shift();

      // Draw Star
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#fbbf24";

      // Draw Trail
      ctx.beginPath();
      ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
      ctx.lineWidth = 2;
      trailRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
        else ctx.lineTo(cx + p.x, cy + p.y);
      });
      ctx.stroke();

      // Draw Planet
      const px = cx + stateRef.current.px;
      const py = cy + stateRef.current.py;
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#60a5fa";

      // Draw Velocity Vector (Optional)
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + stateRef.current.vx * 15, py + stateRef.current.vy * 15);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mass]);

  const handleReset = () => {
    stateRef.current = { px: 150, py: 0, vx: 0, vy: 2.2, sx: 0, sy: 0 };
    trailRef.current = [];
  };

  return (
    <div className="bg-[#111827] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
        <h4 className="text-white font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Orbital Dynamics</h4>
        <button 
          onClick={handleReset}
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full bg-[#0a0f1e] cursor-move"
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Planet Mass: {mass}</label>
          </div>
          <input 
            type="range" min="100" max="2000" value={mass} 
            onChange={(e) => setMass(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="mt-4 text-[12px] text-slate-400 italic">Adjust mass to see impact on orbital stability (conservation of angular momentum).</p>
        </div>
      </div>
    </div>
  );
}
