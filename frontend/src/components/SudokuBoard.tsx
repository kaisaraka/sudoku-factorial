"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SudokuBoardProps {
  initialBoard: number[][]; 
  currentBoard: number[][]; 
  onChange: (r: number, c: number, val: string) => void;
  isLoading: boolean;
  errors: { r: number, c: number }[]; 
}

export default function SudokuBoard({ initialBoard, currentBoard, onChange, isLoading, errors }: SudokuBoardProps) {
  const [selected, setSelected] = useState<[number, number] | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected || isLoading) return;
      const [r, c] = selected;

      if (initialBoard[r][c] !== 0) {
        if (e.key === 'ArrowUp' && r > 0) setSelected([r - 1, c]);
        else if (e.key === 'ArrowDown' && r < 8) setSelected([r + 1, c]);
        else if (e.key === 'ArrowLeft' && c > 0) setSelected([r, c - 1]);
        else if (e.key === 'ArrowRight' && c < 8) setSelected([r, c + 1]);
        return;
      }

      if (e.key >= '1' && e.key <= '9') onChange(r, c, e.key);
      else if (e.key === 'Backspace' || e.key === 'Delete') onChange(r, c, '');
      else if (e.key === 'ArrowUp' && r > 0) setSelected([r - 1, c]);
      else if (e.key === 'ArrowDown' && r < 8) setSelected([r + 1, c]);
      else if (e.key === 'ArrowLeft' && c > 0) setSelected([r, c - 1]);
      else if (e.key === 'ArrowRight' && c < 8) setSelected([r, c + 1]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, initialBoard, onChange, isLoading]);

  if (isLoading || !initialBoard.length) {
    return (
      <div className="w-full aspect-square bg-[#050505] border border-white/5 rounded-[2rem] flex items-center justify-center backdrop-blur-xl shadow-2xl">
        <div className="w-8 h-8 border-[3px] border-white/10 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-[#050505] p-2 sm:p-3 rounded-[2rem] border border-white/5 shadow-2xl mx-auto flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full h-full flex flex-col bg-white/[0.02] rounded-2xl overflow-hidden border border-white/10 relative z-10 shadow-inner">
        {currentBoard.map((row, r) => (
          <div key={r} className="flex-1 flex w-full">
            {row.map((val, c) => {
              const isInitial = initialBoard[r][c] !== 0;
              const isError = errors.some(e => e.r === r && e.c === c);
              
              let isSelected = false; let isHighlighted = false; let isSameNumber = false;

              if (selected) {
                const [sr, sc] = selected;
                isSelected = r === sr && c === sc;
                isHighlighted = r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3));
                isSameNumber = val !== 0 && currentBoard[sr][sc] === val && !isSelected;
              }

              let cellBg = "bg-transparent hover:bg-white/[0.03]"; 
              let textColor = isInitial ? "text-zinc-500" : "text-white";
              let textWeight = isInitial ? "font-normal" : "font-semibold";
              
              if (isError) { cellBg = "bg-rose-500/20"; textColor = "text-rose-400"; textWeight = "font-bold"; }
              else if (isSelected) { cellBg = "bg-white/10"; textColor = "text-white"; textWeight = "font-bold"; }
              else if (isSameNumber) { cellBg = "bg-indigo-500/20"; textColor = "text-indigo-300"; textWeight = "font-bold"; }
              else if (isHighlighted) { cellBg = "bg-white/[0.03]"; }

              const borderR = (c === 2 || c === 5) ? "border-r-[2px] border-r-black/80" : "border-r border-r-white/5";
              const borderB = (r === 2 || r === 5) ? "border-b-[2px] border-b-black/80" : "border-b border-b-white/5";
              const finalBorderR = c === 8 ? "" : borderR; const finalBorderB = r === 8 ? "" : borderB;

              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => setSelected([r, c])}
                  className={`flex-1 h-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl transition-colors cursor-pointer select-none ${cellBg} ${textColor} ${textWeight} ${finalBorderR} ${finalBorderB}`}
                >
                  <AnimatePresence mode="popLayout">
                    {val !== 0 && (
                      <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                        {val}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}