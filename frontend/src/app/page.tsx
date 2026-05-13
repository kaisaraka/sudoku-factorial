"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Grid3X3, BrainCircuit } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const PALETTE = [
  { r: '0,200,255' }, { r: '160,80,240' }, { r: '30,190,120' },
  { r: '240,70,100' }, { r: '255,150,40' }, { r: '80,140,255' }, { r: '250,200,0' },
];

interface Block {
  bx: number; by: number; size: number; c: typeof PALETTE[0]; num: number | '';
  a1: number; a2: number; b1: number; b2: number;
  f1: number; f2: number; phase: number; rotSpeed: number; startRot: number;
}

function poissonDisk(W: number, H: number, minDist: number, maxCount: number) {
  const cellSize = minDist / Math.SQRT2;
  const cols = Math.ceil(W / cellSize);
  const rows = Math.ceil(H / cellSize);
  const grid = new Array<{ x: number; y: number } | null>(cols * rows).fill(null);
  const active: { x: number; y: number }[] = [];
  const result: { x: number; y: number }[] = [];

  function cellIdx(x: number, y: number) { return Math.floor(y / cellSize) * cols + Math.floor(x / cellSize); }
  function isValid(x: number, y: number) {
    if (x < 0 || x >= W || y < 0 || y >= H) return false;
    const ci = Math.floor(x / cellSize), ri = Math.floor(y / cellSize);
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const nc = ci + dc, nr = ri + dr;
        if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
        const p = grid[nr * cols + nc];
        if (p && Math.hypot(p.x - x, p.y - y) < minDist) return false;
      }
    }
    return true;
  }

  const sx = W / 2, sy = H / 2;
  grid[cellIdx(sx, sy)] = { x: sx, y: sy };
  active.push({ x: sx, y: sy }); result.push({ x: sx, y: sy });

  while (active.length > 0 && result.length < maxCount) {
    const ri = Math.floor(Math.random() * active.length);
    const base = active[ri];
    let found = false;
    for (let k = 0; k < 25; k++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = minDist * (1 + Math.random());
      const nx = base.x + Math.cos(angle) * dist, ny = base.y + Math.sin(angle) * dist;
      if (isValid(nx, ny)) {
        grid[cellIdx(nx, ny)] = { x: nx, y: ny };
        active.push({ x: nx, y: ny }); result.push({ x: nx, y: ny });
        found = true; break;
      }
    }
    if (!found) active.splice(ri, 1);
  }
  return result;
}

const DENSITY = 50000;

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const rafRef    = useRef<number>(0);
  const router    = useRouter();

  const handleStart = () => {
    if (localStorage.getItem('neodoku_auth') === 'true') router.push('/dashboard');
    else router.push('/login');
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    function initBlocks(W: number, H: number) {
      const count   = Math.round((W * H) / DENSITY);
      const minDist = Math.sqrt((W * H) / count) * 0.85;
      const pts     = poissonDisk(W, H, minDist, count);

      blocksRef.current = pts.map((p, i) => ({
        bx: p.x, by: p.y, size: 28 + Math.random() * 16,
        c: PALETTE[i % PALETTE.length],
        num: Math.random() > 0.3 ? (Math.floor(Math.random() * 9) + 1) as number : '',
        a1: (Math.random() - 0.5) * 44, a2: (Math.random() - 0.5) * 22,
        b1: (Math.random() - 0.5) * 44, b2: (Math.random() - 0.5) * 22,
        f1: 0.20 + Math.random() * 0.30, f2: 0.48 + Math.random() * 0.52,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.22, startRot: Math.random() * 360,
      }));
    }

    function draw(t: number) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const ts = t / 1000;

      for (const b of blocksRef.current) {
        const dx = b.a1 * Math.sin(b.f1 * ts + b.phase) + b.a2 * Math.cos(b.f2 * ts + b.phase * 1.3);
        const dy = b.b1 * Math.cos(b.f1 * ts + b.phase + 1) + b.b2 * Math.sin(b.f2 * ts + b.phase * 0.7);
        const rot = (b.startRot + b.rotSpeed * ts * 50) * (Math.PI / 180);
        
        ctx.save();
        ctx.translate(b.bx + dx, b.by + dy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.roundRect(-b.size / 2, -b.size / 2, b.size, b.size, 9);
        
        ctx.fillStyle = `rgba(${b.c.r}, .12)`; 
        ctx.fill();
        ctx.strokeStyle = `rgba(${b.c.r}, .6)`; 
        ctx.lineWidth = 1.2; 
        ctx.stroke();

        if (b.num !== '') {
          ctx.fillStyle = `rgba(${b.c.r}, 1)`; 
          ctx.font = `400 ${b.size * 0.42}px system-ui`; 
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(b.num), 0, 0);
        }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      initBlocks(canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden font-sans">
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover:bg-white/[0.06] transition-colors">
            <BrainCircuit className="w-5 h-5 text-zinc-300" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">NEO<span className="text-zinc-600">DOKU</span></span>
        </Link>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-bold text-[10px] tracking-widest uppercase transition-all border border-white/[0.08] backdrop-blur-md">
          Sign In
        </Link>
      </nav>

      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#020202_82%)] pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl pointer-events-none mt-10">
        <motion.div initial={{ opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, ease: 'easeOut' }} className="flex flex-col items-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-600 text-[9px] font-semibold tracking-[0.25em] uppercase mb-8 backdrop-blur-md">
            <Grid3X3 className="w-3 h-3 text-zinc-500" />
            <span>Absolute Logic Engine</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-[6rem] leading-none tracking-[-0.03em] mb-5 flex items-center justify-center drop-shadow-2xl">
            <span className="font-extralight text-white">NEO</span>
            <span className="font-xablack text-transparent bg-clip-text bg-gradient-to-br from-zinc-500 to-zinc-700">DOKU</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-500 max-w-md font-light mb-12 leading-relaxed tracking-wide drop-shadow-md">
            Train your cognitive pathways. Real-time validation.<br className="hidden sm:block" /> No second chances.
          </p>
          <div className="pointer-events-auto">
            <button onClick={handleStart} className="px-12 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all duration-200 active:scale-95 flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <Play className="w-4 h-4 fill-black" /> LET'S GO
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}