export default function Leaderboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Global Leaderboard</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 bg-slate-950/50 p-4 border-b border-slate-800 text-sm font-bold text-slate-400">
          <div>Rank</div>
          <div className="col-span-2">Operator</div>
          <div className="text-right">Elo Rating</div>
        </div>
        {[
          { rank: 1, name: "Kaisar Amangeldiyev", elo: 1500, highlight: true },
          { rank: 2, name: "Amirkhan", elo: 1480, highlight: false },
          { rank: 3, name: "Anonymous_Coder", elo: 1420, highlight: false },
        ].map((player) => (
          <div key={player.rank} className={`grid grid-cols-4 p-4 border-b border-slate-800/50 items-center ${player.highlight ? 'bg-indigo-600/10' : ''}`}>
            <div className={`font-bold ${player.highlight ? 'text-indigo-400' : 'text-slate-500'}`}>#{player.rank}</div>
            <div className="col-span-2 font-medium text-slate-200">{player.name}</div>
            <div className="text-right font-mono text-emerald-400">{player.elo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}