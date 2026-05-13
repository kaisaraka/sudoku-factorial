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

// Те самые цвета "Тетриса" с лендинга для когнитивной ассоциации
const SYN_COLORS: Record<number, string> = {
  1: 'text-[rgb(0,200,255)] drop-shadow-[0_0_8px_rgba(0,200,255,0.4)]',
  2: 'text-[rgb(160,80,240)] drop-shadow-[0_0_8px_rgba(160,80,240,0.4)]',
  3: 'text-[rgb(30,190,120)] drop-shadow-[0_0_8px_rgba(30,190,120,0.4)]',
  4: 'text-[rgb(240,70,100)] drop-shadow-[0_0_8px_rgba(240,70,100,0.4)]',
  5: 'text-[rgb(255,150,40)] drop-shadow-[0_0_8px_rgba(255,150,40,0.4)]',
  6: 'text-[rgb(80,140,255)] drop-shadow-[0_0_8px_rgba(80,140,255,0.4)]',
  7: 'text-[rgb(250,200,0)] drop-shadow-[0_0_8px_rgba(250,200,0,0.4)]',
  8: 'text-[rgb(255,100,200)] drop-shadow-[0_0_8px_rgba(255,100,200,0.4)]',
  9: 'text-[rgb(100,255,100)] drop-shadow-[0_0_8px_rgba(100,255,100,0.4)]'
};

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
      <div className="w-full aspect-square bg-[#020202] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
        <div className="w-8 h-8 border-[3px] border-white/10 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-[#020202] p-2 sm:p-3 rounded-[2rem] border border-white/10 shadow-2xl mx-auto flex flex-col relative overflow-hidden">
      {/* УБРАЛИ ФИОЛЕТОВОЕ ПЯТНО */}
      
      <div className="w-full h-full flex flex-col bg-white/[0.01] rounded-2xl overflow-hidden border border-white/10 relative z-10 shadow-inner">
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
              
              // ПРИМЕНЯЕМ НЕОНОВЫЕ ЦВЕТА
              let textColor = val !== 0 ? SYN_COLORS[val] : "text-transparent";
              if (isInitial) textColor += " opacity-50"; // Изначальные цифры тусклее
              
              let textWeight = isInitial ? "font-normal" : "font-bold";
              
              if (isError) { cellBg = "bg-rose-500/20"; textColor = "text-rose-400"; textWeight = "font-black"; }
              else if (isSelected) { cellBg = "bg-white/10"; }
              else if (isSameNumber) { cellBg = "bg-white/[0.05]"; }
              else if (isHighlighted) { cellBg = "bg-white/[0.02]"; }

              const borderR = (c === 2 || c === 5) ? "border-r-[2px] border-r-white/20" : "border-r border-r-white/5";
              const borderB = (r === 2 || r === 5) ? "border-b-[2px] border-b-white/20" : "border-b border-b-white/5";
              const finalBorderR = c === 8 ? "" : borderR; const finalBorderB = r === 8 ? "" : borderB;

              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => setSelected([r, c])}
                  className={`flex-1 h-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl transition-colors cursor-pointer select-none ${cellBg} ${finalBorderR} ${finalBorderB}`}
                >
                  <AnimatePresence mode="popLayout">
                    {val !== 0 && (
                      <motion.span 
                        className={`${textColor} ${textWeight}`}
                        initial={{ opacity: 0, scale: 0.5 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.5 }} 
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
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