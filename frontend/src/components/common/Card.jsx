export default function Card({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-slate-900/40 shadow-xl backdrop-blur-xl transition-all hover:border-white/10 ${className}`}>
      {title ? (
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h2>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          </div>
        </div>
      ) : null}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
