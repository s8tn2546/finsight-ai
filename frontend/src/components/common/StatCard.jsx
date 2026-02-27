import Card from './Card.jsx'

export default function StatCard({ label, value, subvalue, accent = false }) {
  return (
    <Card className="group relative overflow-hidden">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</div>
      <div className={`text-2xl font-black tracking-tighter ${accent ? 'text-primary' : 'text-white'}`}>{value}</div>
      {subvalue ? (
        <div className="mt-2 flex items-center gap-1.5">
          <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${accent ? 'bg-primary/10 text-primary' : 'bg-white/5 text-slate-500'}`}>
            {subvalue}
          </div>
        </div>
      ) : null}
    </Card>
  )
}
