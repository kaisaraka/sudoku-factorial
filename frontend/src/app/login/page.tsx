"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, ArrowRight, Fingerprint, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ... (константы PALETTE, DENSITY и функция poissonDisk остаются без изменений)

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ РЕАЛЬНОГО БЭКЕНДА ---
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const rafRef = useRef<number>(0);

  // --- ОБНОВЛЕННЫЙ ХЕНДЛЕР ОТПРАВКИ ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // ВСТАВЬ СЮДА СВОЮ ССЫЛКУ С RENDER
    const BASE_URL = "https://neodoku-api.onrender.com"; 
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? 
          { email: formData.email, password: formData.password } : 
          formData
        ),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('neodoku_auth', 'true');
        localStorage.setItem('operator_name', data.username || formData.username);
        router.push('/dashboard');
      } else {
        setError(data.detail || "Authentication Failed");
      }
    } catch (err) {
      setError("System failure. Logic Engine offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ... (эффект useEffect с canvas остается без изменений)

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#020202_82%)] pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      <nav className="absolute top-0 w-full left-0 px-6 sm:px-8 py-6 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover:bg-white/[0.06] transition-colors">
            <BrainCircuit className="w-5 h-5 text-zinc-300" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">NEO<span className="text-zinc-600">DOKU</span></span>
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md relative z-10">
        <div className="bg-black/60 border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
              <Fingerprint className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <h2 className="text-2xl font-light text-white text-center mb-2 tracking-tight">
            {isLogin ? 'Operator Authentication' : 'Initialize Operator'}
          </h2>

          {/* ВЫВОД ОШИБКИ */}
          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  name="username"
                  placeholder="Operator Callsign" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="email" 
                name="email"
                placeholder="Secure Email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="password" 
                name="password"
                placeholder="Encryption Key" 
                value={formData.password}
                onChange={handleChange}
                required 
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-6 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Acknowledge' : 'Establish Link'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[10px] text-zinc-500 hover:text-white transition-colors tracking-widest uppercase font-bold"
            >
              {isLogin ? "No access? Request Protocol" : "Already registered? Authenticate"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}