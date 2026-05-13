"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Play, Trophy, TrendingUp, BrainCircuit, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('neodoku_auth') !== 'true') router.push('/login');
    else setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('neodoku_auth');
    router.push('/');
  };

  if (isLoading) return <div className="min-h-screen bg-[#050505]"></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 pt-24 pb-12 px-4 sm:px-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-indigo-500/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <nav className="absolute top-0 w-full left-0 px-6 sm:px-8 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-zinc-400" />
          <span className="text-lg font-medium text-white tracking-tight">Neo<span className="text-zinc-500">Doku</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">System Online</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase transition-all">
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-5xl mx-auto relative z-10 mt-6 sm:mt-12">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-2">Welcome back, Operator.</h1>
            <p className="text-zinc-500 font-light text-sm">Your cognitive metrics have been synchronized.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
            <Trophy className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Global Elo</div>
              <div className="font-mono text-white text-lg leading-none">1,542</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group transition-all hover:border-white/15">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-lg transition-transform group-hover:scale-105">
                  <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                </div>
                <h2 className="text-2xl font-medium text-white mb-2 tracking-tight">Ranked Integration</h2>
                <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8 font-light">Enter the standard 9x9 matrix. Compete against the global average and optimize your logic pathways.</p>
              </div>
              <Link href="/playground?difficulty=medium" className="inline-flex w-max items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-95 shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)]">
                Start Match
              </Link>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2rem] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-zinc-400" /> Performance
              </h3>
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <div className="text-zinc-500 text-xs mb-2 font-medium">Win Rate</div>
                  <div className="text-3xl text-white font-mono tracking-tight">94.2<span className="text-xl text-zinc-500">%</span></div>
                </div>
                <div className="border-b border-white/5 pb-4">
                  <div className="text-zinc-500 text-xs mb-2 font-medium">Matrices Solved</div>
                  <div className="text-3xl text-white font-mono tracking-tight">128</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-4 flex items-center gap-2 px-2">
            <Activity className="w-3 h-3" /> Manual Protocol Selection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/playground?difficulty=easy" className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide group-hover:text-emerald-400 transition-colors">Easy</div>
              <p className="text-xs text-zinc-500 font-light">Warm up your logic circuits.</p>
            </Link>
            <Link href="/playground?difficulty=medium" className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide group-hover:text-amber-400 transition-colors">Medium</div>
              <p className="text-xs text-zinc-500 font-light">Standard competitive matrix.</p>
            </Link>
            <Link href="/playground?difficulty=hard" className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide group-hover:text-rose-400 transition-colors">Hardcore</div>
              <p className="text-xs text-zinc-500 font-light">Absolute focus required.</p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}