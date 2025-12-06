import React, { useState, useEffect, useRef } from 'react';

// --- Simulator 1: Projectile Motion ---
const ProjectileSimulator: React.FC = () => {
  const [velocity, setVelocity] = useState(50);
  const [angle, setAngle] = useState(45);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const draw = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics constants scaling
    const g = 9.8;
    const v0 = velocity;
    const theta = (angle * Math.PI) / 180;
    const scale = 4; // pixels per meter

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Calculate position
    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;

    // Convert to canvas coords
    const canvasX = 50 + x * scale;
    const canvasY = canvas.height - 20 - (y * scale) - 10; // -10 for radius

    // Draw Path (Trajectory)
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(50, canvas.height - 30);
    for (let time = 0; time <= t; time += 0.1) {
       const px = v0 * Math.cos(theta) * time;
       const py = v0 * Math.sin(theta) * time - 0.5 * g * time * time;
       ctx.lineTo(50 + px * scale, canvas.height - 30 - py * scale);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Ball
    if (y >= 0) {
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      return true; // Keep animating
    } else {
        // Hit ground
        const finalX = 50 + x * scale;
        ctx.beginPath();
        ctx.arc(finalX, canvas.height - 30, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        return false; // Stop
    }
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 100; // Slow down time for visual
    
    const keepGoing = draw(elapsed);
    if (keepGoing) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  };

  const startSimulation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    startTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  };

  const resetSimulation = () => {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0,0, canvas.width, canvas.height);
          draw(0);
      }
  };

  useEffect(() => {
    resetSimulation();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [velocity, angle]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Projectile Motion</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <canvas ref={canvasRef} width={500} height={300} className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600"></canvas>
        </div>
        <div className="w-full md:w-64 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Velocity (m/s): {velocity}</label>
            <input 
              type="range" min="10" max="100" value={velocity} 
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Angle (degrees): {angle}</label>
            <input 
              type="range" min="10" max="80" value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={startSimulation} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors">
              Launch
            </button>
            <button onClick={resetSimulation} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Simulator 2: Ohm's Law ---
const OhmsLawSimulator: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(100);
  
  const current = (voltage / resistance).toFixed(3); // Amps
  const currentMA = (Number(current) * 1000).toFixed(1); // mA

  const glowOpacity = Math.min(Number(current) * 5, 1);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Ohm's Law (V = IR)</h3>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-64 h-48 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 p-4 flex items-center justify-center">
             <div className="w-48 h-32 border-4 border-slate-400 dark:border-slate-500 relative rounded">
                <div className="absolute top-1/2 -left-2 w-4 h-8 bg-slate-800 dark:bg-slate-200 -mt-4 flex flex-col justify-between items-center py-1">
                   <span className="text-[8px] font-bold text-white dark:text-black">+</span>
                   <span className="text-[8px] font-bold text-white dark:text-black">-</span>
                </div>
                <div className="absolute top-1/2 -right-3 w-6 h-12 bg-amber-700 -mt-6 flex items-center justify-center border-2 border-slate-600">
                   <span className="text-xs text-white font-bold">R</span>
                </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                      style={{ opacity: 0.2 + glowOpacity * 0.8, boxShadow: `0 0 ${glowOpacity * 40}px rgba(250, 204, 21, 1)` }}>
                 </div>
             </div>
             <div className="absolute bottom-2 right-4 font-mono text-sm text-slate-500">
                I = {currentMA} mA
             </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div>
             <div className="flex justify-between mb-2">
                <label className="font-medium">Voltage (V)</label>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{voltage} V</span>
             </div>
             <input 
                type="range" min="0" max="24" step="0.5" value={voltage} 
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-2 bg-indigo-200 dark:bg-indigo-900 rounded-lg appearance-none cursor-pointer"
              />
          </div>
          <div>
             <div className="flex justify-between mb-2">
                <label className="font-medium">Resistance (Ω)</label>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{resistance} Ω</span>
             </div>
             <input 
                type="range" min="10" max="1000" step="10" value={resistance} 
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-2 bg-emerald-200 dark:bg-emerald-900 rounded-lg appearance-none cursor-pointer"
              />
          </div>
           <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
              <p className="text-center font-mono text-lg">
                Current (I) = <span className="text-indigo-600">{voltage}V</span> / <span className="text-emerald-600">{resistance}Ω</span> = <span className="font-bold">{current} A</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Simulator 3: Light Reflection ---
const ReflectionSimulator: React.FC = () => {
  const [angle, setAngle] = useState(45);

  const radians = (angle * Math.PI) / 180;
  const cx = 200;
  const cy = 250;
  const rayLength = 150;

  const sx = cx - Math.sin(radians) * rayLength;
  const sy = cy - Math.cos(radians) * rayLength;
  const rx = cx + Math.sin(radians) * rayLength;
  const ry = cy - Math.cos(radians) * rayLength;

  return (
     <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Law of Reflection</h3>
      <div className="flex flex-col md:flex-row gap-6 items-center">
         <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 p-2">
            <svg width="400" height="300" viewBox="0 0 400 300">
               <rect x="50" y="250" width="300" height="10" fill="#94a3b8" />
               <rect x="50" y="260" width="300" height="20" fill="url(#hatch)" />
               <defs>
                 <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                   <line x1="0" y1="0" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="2" />
                 </pattern>
               </defs>
               <line x1={cx} y1="50" x2={cx} y2="250" stroke="#94a3b8" strokeDasharray="5,5" />
               <line x1={sx} y1={sy} x2={cx} y2={250} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
               <line x1={cx} y1={250} x2={rx} y2={ry} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
               <path d={`M ${cx} 200 A 50 50 0 0 0 ${cx - Math.sin(radians)*50} ${250 - Math.cos(radians)*50}`} fill="none" stroke="#ef4444" />
               <text x={cx - 30} y="190" fill="#ef4444" fontSize="12">i = {angle}°</text>
               <path d={`M ${cx} 200 A 50 50 0 0 1 ${cx + Math.sin(radians)*50} ${250 - Math.cos(radians)*50}`} fill="none" stroke="#3b82f6" />
               <text x={cx + 10} y="190" fill="#3b82f6" fontSize="12">r = {angle}°</text>
               <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                  </marker>
               </defs>
            </svg>
         </div>
         <div className="w-full md:w-64">
            <label className="block text-sm font-medium mb-2">Incidence Angle: {angle}°</label>
            <input 
              type="range" min="0" max="85" value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-4"
            />
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800">
               <p className="text-sm">The angle of incidence (<span className="text-red-500 font-bold">i</span>) is always equal to the angle of reflection (<span className="text-blue-500 font-bold">r</span>).</p>
            </div>
         </div>
      </div>
     </div>
  );
};

// --- Simulator 4: Simple Pendulum ---
const PendulumSimulator: React.FC = () => {
  const [length, setLength] = useState(1.5); // meters
  const [gravity, setGravity] = useState(9.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Calculates period T = 2*pi*sqrt(L/g)
  const period = (2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pivotX = canvas.width / 2;
    const pivotY = 20;
    const pixelsPerMeter = 100;
    
    // Simple Harmonic Motion approximation for animation: theta = A * cos(w*t)
    // w = sqrt(g/L)
    const omega = Math.sqrt(gravity / length);
    const maxAngle = Math.PI / 6; // 30 degrees initial amplitude
    
    // Update time
    timeRef.current += 0.016; // Approx 60fps
    const currentAngle = maxAngle * Math.cos(omega * timeRef.current);

    const bobX = pivotX + length * pixelsPerMeter * Math.sin(currentAngle);
    const bobY = pivotY + length * pixelsPerMeter * Math.cos(currentAngle);

    // Draw Support
    ctx.beginPath();
    ctx.moveTo(pivotX - 20, pivotY);
    ctx.lineTo(pivotX + 20, pivotY);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw String
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1'; // Indigo
    ctx.fill();
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 2;
    ctx.stroke();

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [length, gravity]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Simple Pendulum</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600">
           <canvas ref={canvasRef} width={400} height={300} className="w-full h-full rounded-lg" />
        </div>
        <div className="w-full md:w-64 space-y-6">
           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-medium">Length (L)</label>
                 <span className="font-mono text-indigo-600 dark:text-indigo-400">{length} m</span>
              </div>
              <input 
                 type="range" min="0.5" max="2.5" step="0.1" value={length} 
                 onChange={(e) => setLength(Number(e.target.value))}
                 className="w-full h-2 bg-indigo-200 dark:bg-indigo-900 rounded-lg appearance-none cursor-pointer"
               />
           </div>
           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-medium">Gravity (g)</label>
                 <span className="font-mono text-emerald-600 dark:text-emerald-400">{gravity} m/s²</span>
              </div>
              <input 
                 type="range" min="1.6" max="24.8" step="0.1" value={gravity} 
                 onChange={(e) => setGravity(Number(e.target.value))}
                 className="w-full h-2 bg-emerald-200 dark:bg-emerald-900 rounded-lg appearance-none cursor-pointer"
               />
               <p className="text-xs text-slate-500 mt-1">1.6 (Moon) - 9.8 (Earth) - 24.8 (Jupiter)</p>
           </div>
           <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-500">Period (T)</p>
              <p className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-100">{period} s</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Simulator 5: Wave Interference ---
const WaveSimulator: React.FC = () => {
  const [phase, setPhase] = useState(0); // 0 to 2*PI
  const [amplitude, setAmplitude] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = canvas.width;
    const h = canvas.height;
    const mid = h / 2;
    
    timeRef.current += 0.05;

    // Helper to draw wave
    const drawWave = (color: string, fn: (x: number) => number, lineWidth = 2) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        for (let x = 0; x < w; x++) {
            // Map x to reasonable frequency
            const val = fn(x * 0.05 - timeRef.current);
            ctx.lineTo(x, mid + val * 40); // 40 is scaling factor
        }
        ctx.stroke();
    };

    // Wave 1: Fixed
    drawWave('rgba(239, 68, 68, 0.4)', (t) => Math.sin(t));

    // Wave 2: Shifted by Phase
    drawWave('rgba(59, 130, 246, 0.4)', (t) => amplitude * Math.sin(t + phase));

    // Resultant Wave: Sum
    drawWave('#8b5cf6', (t) => Math.sin(t) + amplitude * Math.sin(t + phase), 3);

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [phase, amplitude]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Wave Interference</h3>
      <div className="flex flex-col gap-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
             <canvas ref={canvasRef} width={600} height={200} className="w-full h-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="text-sm font-medium">Wave 1 (Fixed)</span>
              
              <span className="w-3 h-3 rounded-full bg-blue-400 ml-4"></span>
              <span className="text-sm font-medium">Wave 2 (Adjustable)</span>

              <span className="w-3 h-3 rounded-full bg-violet-600 ml-4"></span>
              <span className="text-sm font-medium">Resultant</span>
           </div>

           <div className="space-y-4">
              <div>
                 <div className="flex justify-between mb-2">
                    <label className="font-medium text-sm">Phase Shift (φ)</label>
                    <span className="font-mono text-xs text-slate-500">{(phase / Math.PI).toFixed(2)}π</span>
                 </div>
                 <input 
                    type="range" min="0" max={2 * Math.PI} step="0.1" value={phase} 
                    onChange={(e) => setPhase(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 dark:bg-indigo-900 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0 (Constructive)</span>
                      <span>π (Destructive)</span>
                      <span>2π (Constructive)</span>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Simulator 6: Convex Lens ---
const LensSimulator: React.FC = () => {
    const [objDist, setObjDist] = useState(150);
    const focalLength = 100;
    
    // Lens formula: 1/f = 1/do + 1/di  => di = (f * do) / (do - f)
    // Magnification: m = -di/do
    
    const imgDist = (focalLength * objDist) / (objDist - focalLength);
    const isVirtual = objDist < focalLength;
    const magnification = -imgDist / objDist;
    const imgHeight = 60 * magnification; // Object height is fixed at 60

    // Coordinates
    const centerY = 150;
    const lensX = 250;
    
    // Scale for SVG visualization (0.5 scale factor to fit)
    const s = 0.8;
    
    const oX = lensX - objDist * s;
    const iX = lensX + imgDist * s;
    const fLeft = lensX - focalLength * s;
    const fRight = lensX + focalLength * s;

    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Convex Lens Optics</h3>
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden p-2 relative">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full h-full">
                    {/* Principal Axis */}
                    <line x1="0" y1={centerY} x2="500" y2={centerY} stroke="#cbd5e1" strokeWidth="1" />
                    
                    {/* Lens */}
                    <ellipse cx={lensX} cy={centerY} rx="10" ry="120" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />
                    <line x1={lensX} y1="30" x2={lensX} y2="270" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="5,5" />

                    {/* Focal Points */}
                    <circle cx={fLeft} cy={centerY} r="3" fill="#ef4444" />
                    <text x={fLeft - 5} y={centerY + 20} fontSize="10" fill="#ef4444">F</text>
                    <circle cx={fRight} cy={centerY} r="3" fill="#ef4444" />
                    <text x={fRight - 5} y={centerY + 20} fontSize="10" fill="#ef4444">F</text>

                    {/* Object (Arrow Up) */}
                    <line x1={oX} y1={centerY} x2={oX} y2={centerY - 60} stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreen)" />
                    
                    {/* Image */}
                    {Math.abs(imgDist) < 1000 ? (
                        <line 
                            x1={iX} y1={centerY} x2={iX} y2={centerY + imgHeight} 
                            stroke="#8b5cf6" strokeWidth="4" opacity={isVirtual ? 0.5 : 1} strokeDasharray={isVirtual ? "5,5" : ""}
                            markerEnd="url(#arrowPurple)" 
                        />
                    ) : null}

                    {/* Ray 1: Parallel then through F */}
                    <path d={`M ${oX} ${centerY - 60} L ${lensX} ${centerY - 60} L ${Math.max(iX, 500)} ${centerY + (isVirtual ? -60 + (60+imgHeight) : imgHeight)}`} stroke="#f59e0b" strokeWidth="1" fill="none" />
                    
                    {/* Ray 2: Through Center */}
                    <line x1={oX} y1={centerY - 60} x2={isVirtual ? oX + (lensX-oX)*5 : iX} y2={isVirtual ? (centerY-60) + 60*5 : centerY + imgHeight} stroke="#f59e0b" strokeWidth="1" opacity="0.6" />

                    <defs>
                        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" />
                        </marker>
                        <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L6,3 z" fill="#8b5cf6" />
                        </marker>
                    </defs>
                </svg>
                {/* Virtual Image trace back lines could be added for polish, but omitting for brevity in simple SVG */}
            </div>

            <div className="w-full md:w-64 space-y-6">
                <div>
                   <label className="block text-sm font-medium mb-2">Object Distance</label>
                   <input 
                      type="range" min="50" max="250" value={objDist} 
                      onChange={(e) => setObjDist(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                   />
                </div>
                
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-900 rounded">
                      <span>Focal Length (f):</span>
                      <span className="font-mono">100</span>
                   </div>
                   <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-900 rounded">
                      <span>Object Dist (u):</span>
                      <span className="font-mono">{objDist}</span>
                   </div>
                   <div className="flex justify-between p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-800">
                      <span>Image Dist (v):</span>
                      <span className="font-mono font-bold">{imgDist.toFixed(1)}</span>
                   </div>
                   <div className="text-center pt-2">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${isVirtual ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                           {isVirtual ? "Virtual & Upright" : "Real & Inverted"}
                       </span>
                   </div>
                </div>
            </div>
        </div>
      </div>
    );
};


const Simulators: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Interactive Experiments</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Physics is best learned by doing. Adjust variables and observe the laws of nature in real-time with these simulators.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <ProjectileSimulator />
        <OhmsLawSimulator />
        <ReflectionSimulator />
        <PendulumSimulator />
        <WaveSimulator />
        <LensSimulator />
      </div>
    </div>
  );
};

export default Simulators;