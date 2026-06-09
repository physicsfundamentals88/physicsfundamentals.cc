"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const stateRef = useRef({ t: 0, x: 0, y: 0 });

  const g = 9.81;
  const scale = 5; // pixels per meter

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Physics logic
      if (isPlaying) {
        const rad = (angle * Math.PI) / 180;
        const vx0 = velocity * Math.cos(rad);
        const vy0 = velocity * Math.sin(rad);
        
        stateRef.current.t += 0.05;
        const t = stateRef.current.t;
        
        stateRef.current.x = vx0 * t;
        stateRef.current.y = vy0 * t - 0.5 * g * Math.pow(t, 2);

        if (stateRef.current.y >= 0) {
          trailRef.current.push({ x: stateRef.current.x, y: stateRef.current.y });
        } else {
          setIsPlaying(false);
        }
      }

      // Draw Trail
      ctx.beginPath();
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 3;
      trailRef.current.forEach((p, i) => {
        const px = 50 + p.x * scale;
        const py = canvas.height - 50 - p.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Projectile
      const px = 50 + stateRef.current.x * scale;
      const py = canvas.height - 50 - stateRef.current.y * scale;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#60a5fa";

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, angle, velocity]);

  const handleFire = () => {
    stateRef.current = { t: 0, x: 0, y: 0 };
    trailRef.current = [];
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    stateRef.current = { t: 0, x: 0, y: 0 };
    trailRef.current = [];
  };

  return (
    <div className="bg-[#111827] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
        <h4 className="text-white font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Projectile Preview</h4>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleFire}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <Play className="w-4 h-4 fill-current" />
            Fire
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full bg-[#0a0f1e] cursor-crosshair"
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-8 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex-1 min-w-[150px]">
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Angle: {angle}°</label>
            </div>
            <input 
              type="range" min="0" max="90" value={angle} 
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Velocity: {velocity} m/s</label>
            </div>
            <input 
              type="range" min="10" max="100" value={velocity} 
              onChange={(e) => setVelocity(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex gap-6 border-l border-white/10 pl-8">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Max Height</div>
              <div className="text-white font-mono text-sm">
                {((Math.pow(velocity * Math.sin(angle * Math.PI / 180), 2)) / (2 * g)).toFixed(1)}m
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Range</div>
              <div className="text-white font-mono text-sm">
                {((Math.pow(velocity, 2) * Math.sin(2 * angle * Math.PI / 180)) / g).toFixed(1)}m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
