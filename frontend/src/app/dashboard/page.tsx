"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Play, Trophy, TrendingUp, BrainCircuit, Activity, LogOut, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('neodoku_auth') !== 'true') router.push('/login');
    else setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('neodoku_auth');
    router.push('/');
  };

  if (isLoading) return <div className="min-h-screen bg-[#020202]"></div>;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 pt-24 pb-12 px-4 sm:px-6 font-sans relative overflow-hidden">
      {/* Глобальный фон: Сетка и виньетка */}
      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#020202_82%)] pointer-events-none" />

      <nav className="absolute top-0 w-full left-0 px-6 sm:px-8 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover:bg-white/[0.06] transition-colors">
            <BrainCircuit className="w-5 h-5 text-zinc-300" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">NEO<span className="text-zinc-600">DOKU</span></span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">System Online</span>
          </div>
          
          <button onClick={() => setShowProModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase transition-all shadow-[0_0_15px_-5px_rgba(255,255,255,0.2)]">
            <Crown className="w-3 h-3" />
            <span className="hidden sm:inline">Get Pro</span>
          </button>

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
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
            <Trophy className="w-5 h-5 text-zinc-300" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Global Elo</div>
              <div className="font-mono text-white text-lg leading-none">1,542</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-black/40 border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group transition-all hover:border-white/15 backdrop-blur-md">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-lg transition-transform group-hover:scale-105">
                  <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                </div>
                <h2 className="text-2xl font-medium text-white mb-2 tracking-tight">Daily Cognitive Challenge</h2>
                <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8 font-light">The daily global matrix is ready. Compete against the global average and optimize your logic pathways.</p>
              </div>
              <Link href="/playground?difficulty=medium" className="inline-flex w-max items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-bold tracking-widest uppercase transition-transform active:scale-95 shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)]">
                Start Daily Match
              </Link>
            </div>
          </div>

          <div className="bg-black/40 border border-white/[0.08] rounded-[2rem] p-8 flex flex-col justify-between backdrop-blur-md">
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
            <Link href="/playground?difficulty=easy" className="bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide transition-colors">Easy</div>
              <p className="text-xs text-zinc-500 font-light">Warm up your logic circuits.</p>
            </Link>
            <Link href="/playground?difficulty=medium" className="bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide transition-colors">Medium</div>
              <p className="text-xs text-zinc-500 font-light">Standard competitive matrix.</p>
            </Link>
            <Link href="/playground?difficulty=hard" className="bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/[0.06] p-6 rounded-2xl flex flex-col items-start gap-1 transition-all group">
              <div className="text-white font-medium text-base tracking-wide transition-colors">Hardcore</div>
              <p className="text-xs text-zinc-500 font-light">Absolute focus required.</p>
            </Link>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showProModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0a0a0a] border border-white/20 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)]">
              <Crown className="w-12 h-12 text-white mx-auto mb-4 relative z-10" />
              <h3 className="text-2xl font-medium mb-2 text-white relative z-10 tracking-tight">Upgrade to PRO</h3>
              <p className="text-sm text-zinc-400 mb-8 font-light relative z-10">
                Unlock full AI Coach logic explanations, advanced cognitive metrics, and global city leaderboards. <b>$4.99/mo</b>.
              </p>
              <button onClick={() => setShowProModal(false)} className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95 relative z-10">
                Initiate Upgrade
              </button>
              <button onClick={() => setShowProModal(false)} className="w-full mt-4 text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold transition-colors relative z-10">
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}