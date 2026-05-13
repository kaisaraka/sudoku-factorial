export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Operator Profile</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-indigo-600/20 rounded-full border-2 border-indigo-500 flex items-center justify-center text-3xl font-bold text-indigo-400">
            KA
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Kaisar Amangeldiyev</h2>
            <p className="text-slate-400">Location: Shymkent | Clan: NIS Taraz</p>
            <p className="text-indigo-400 text-sm mt-2 italic">"Everything is easy when you are crazy and confident."</p>
          </div>
        </div>
      </div>
    </div>
  );
}