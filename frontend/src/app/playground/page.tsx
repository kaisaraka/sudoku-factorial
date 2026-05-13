"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SudokuBoard from '@/components/SudokuBoard';
import { BrainCircuit, Timer, AlertTriangle, RefreshCw, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function GameEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get('difficulty') || 'medium'; 

  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [currentBoard, setCurrentBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState<{r: number, c: number}[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  
  const [coachMessage, setCoachMessage] = useState(`Protocol [${difficulty.toUpperCase()}] loaded. Awaiting connection...`);

  useEffect(() => {
    if (localStorage.getItem('neodoku_auth') !== 'true') router.push('/login');
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !gameOver && !isVictory) interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, gameOver, isVictory]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadFallbackPuzzle = (level: string) => {
    // Надежный фоллбек, если backend недоступен на Vercel
    const fallbackPuzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    const fallbackSolution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    setInitialBoard(fallbackPuzzle);
    setCurrentBoard(JSON.parse(JSON.stringify(fallbackPuzzle)));
    setSolution(fallbackSolution);
    setCoachMessage(`Server offline. Running Local Protocol [${level.toUpperCase()}]. 3 attempts remaining.`);
    setIsActive(true);
  };

  const fetchNewGame = async (level: string) => {
    setLoading(true); setIsActive(false); setGameOver(false); setIsVictory(false); setMistakes(0); setErrors([]); setTime(0);
    try {
      const res = await fetch(`http://localhost:8000/api/sudoku/generate?difficulty=${level}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInitialBoard(data.puzzle);
      setCurrentBoard(JSON.parse(JSON.stringify(data.puzzle)));
      setSolution(data.solution);
      setCoachMessage(`Protocol [${level.toUpperCase()}] active. 3 attempts remaining.`);
      setIsActive(true);
    } catch (error) {
      loadFallbackPuzzle(level);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNewGame(difficulty); }, [difficulty]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (gameOver || isVictory) return;

    const num = value === '' ? 0 : parseInt(value, 10);
    const newBoard = [...currentBoard];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = num;

    if (num === 0) {
      setCurrentBoard(newBoard);
      setErrors(errors.filter(e => !(e.r === row && e.c === col)));
      return;
    }

    if (num !== solution[row][col]) {
      const currentMistakes = mistakes + 1;
      setMistakes(currentMistakes);
      setCurrentBoard(newBoard);
      setErrors([...errors, {r: row, c: col}]);

      if (currentMistakes >= 3) {
        setGameOver(true); setIsActive(false);
        setCoachMessage("Critical error threshold reached. Connection terminated.");
      } else {
        setCoachMessage(`Anomaly detected. ${3 - currentMistakes} attempts remaining.`);
      }
    } else {
      setCurrentBoard(newBoard);
      setErrors(errors.filter(e => !(e.r === row && e.c === col)));
      setCoachMessage("Input accepted. Logic holds.");
      
      if (newBoard.every((r, i) => r.every((c, j) => c === solution[i][j]))) {
        setIsVictory(true); setIsActive(false);
        setCoachMessage("Matrix solved. Neural pathways optimized.");
      }
    }
  };

  const handleHint = () => {
    if (gameOver || isVictory || loading) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) {
          setCoachMessage(`AI Logic Hint: Row ${r + 1}, Column ${c + 1} requires value [${solution[r][c]}].`);
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 font-sans relative overflow-x-hidden">
      {/* Глобальный фон: Сетка и виньетка */}
      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#020202_82%)] pointer-events-none" />

      <div className="w-full max-w-5xl flex justify-between items-center mb-10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Abort Protocol
        </Link>
        <div className="text-xl font-black text-white tracking-tighter opacity-80">NEO<span className="text-zinc-600">DOKU</span></div>
      </div>

      <AnimatePresence>
        {(gameOver || isVictory) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className={`bg-[#050505] border ${isVictory ? 'border-emerald-500/30' : 'border-rose-500/30'} p-10 sm:p-12 rounded-[2rem] text-center max-w-md w-full relative overflow-hidden`}>
              <div className="relative z-10">
                {isVictory ? <BrainCircuit className="w-16 h-16 text-emerald-400 mx-auto mb-6" /> : <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-6" />}
                <h2 className="text-3xl font-medium text-white mb-2 tracking-tight">{isVictory ? 'Matrix Cleared' : 'Connection Terminated'}</h2>
                <p className="text-zinc-400 mb-8 font-light text-sm">{isVictory ? `Completion time: ${formatTime(time)}. Elo updated.` : 'Logic cascade failure. 3 critical errors made.'}</p>
                <button onClick={() => fetchNewGame(difficulty)} className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs uppercase tracking-widest transition-transform active:scale-95">Reboot Sequence</button>
                <Link href="/dashboard" className="block mt-4 text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold transition-colors">Return to Base</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full flex flex-col items-center relative z-10">
        <div className="w-full max-w-[500px] flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-zinc-300 bg-black/40 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
            <Timer className={`w-4 h-4 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`} />
            <span className="font-mono text-lg leading-none">{formatTime(time)}</span>
          </div>
          <button onClick={() => fetchNewGame(difficulty)} className="p-3.5 bg-black/40 hover:bg-white/[0.08] text-zinc-300 rounded-2xl border border-white/5 transition-all shadow-lg active:scale-95">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-white' : ''}`} />
          </button>
          <div className="flex items-center gap-3 text-zinc-300 bg-black/40 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
            <AlertTriangle className={`w-4 h-4 ${mistakes > 0 ? 'text-rose-400' : 'text-zinc-500'}`} />
            <span className={`font-mono text-lg leading-none ${mistakes > 0 ? 'text-rose-400' : 'text-white'}`}>{mistakes}/3</span>
          </div>
        </div>

        <div className="w-full max-w-[500px] mx-auto mb-8 relative z-10">
          <SudokuBoard initialBoard={initialBoard} currentBoard={currentBoard} onChange={handleCellChange} isLoading={loading} errors={errors} />
        </div>

        <div className={`w-full max-w-[500px] bg-black/40 backdrop-blur-xl border ${mistakes >= 2 ? 'border-rose-500/30' : 'border-white/10'} rounded-3xl p-6 sm:p-8 transition-colors shadow-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 text-zinc-400">
              <Terminal className="w-4 h-4 text-zinc-400" /> AI Logic Assistant
            </h2>
            <button onClick={handleHint} disabled={gameOver || isVictory || loading} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-30 border border-white/5 active:scale-95">
              Request Hint
            </button>
          </div>
          <p className="text-zinc-300 text-sm font-light leading-relaxed">{coachMessage}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Initializing Matrix...</div>}>
      <GameEngine />
    </Suspense>
  );
}