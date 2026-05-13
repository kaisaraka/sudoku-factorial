"use client";

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020202] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:bg-zinc-800 transition-colors">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            NEURO<span className="text-zinc-600">DOKU</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10"
        >
          Sign In
        </Link>

      </div>
    </nav>
  );
}