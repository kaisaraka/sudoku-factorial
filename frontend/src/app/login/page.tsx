"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, ArrowRight, Fingerprint, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('neodoku_auth', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <nav className="absolute top-0 w-full left-0 px-6 sm:px-8 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-zinc-400" />
          <span className="text-lg font-medium text-white tracking-tight">Neo<span className="text-zinc-500">Doku</span></span>
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
              <Fingerprint className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <h2 className="text-2xl font-light text-white text-center mb-2 tracking-tight">{isLogin ? 'Operator Authentication' : 'Initialize Operator'}</h2>
          <p className="text-zinc-500 text-center text-sm mb-8 font-light tracking-wide">{isLogin ? 'Enter your credentials to access the logic engine.' : 'Register to save your cognitive metrics.'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="Operator Callsign (Username)" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input type="email" placeholder="Secure Email" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input type="password" placeholder="Encryption Key (Password)" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
            </div>

            <button type="submit" className="w-full py-4 mt-6 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group active:scale-95">
              {isLogin ? 'Acknowledge' : 'Establish Link'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] text-zinc-500 hover:text-white transition-colors tracking-widest uppercase font-bold">
              {isLogin ? "No access? Request Protocol" : "Already registered? Authenticate"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}