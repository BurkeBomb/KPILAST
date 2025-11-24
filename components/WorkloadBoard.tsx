'use client';
import { Card } from './Card';

export function WorkloadBoard({ rows }:{ rows:any[] }){
  const owners = Array.from(new Set(rows.map(r=> String(r.assignee||'')).filter(Boolean)));
  const today = new Date();
  function daysUntil(d?:string|null){
    if(!d) return null;
    const dd=new Date(d); if(isNaN(dd.getTime())) return null;
    return Math.ceil((dd.getTime()-today.getTime())/86400000);
  }
  return (
    <Card>
      <div className="font-medium mb-2">Owner SLA & Workload</div>
      <div className="grid md:grid-cols-2 gap-3">
        {owners.map(o=>{
          const mine = rows.filter(r=> String(r.assignee||'')===o);
          const due = mine.filter(r=>{ const n=daysUntil(r.next_check); return typeof n==='number' && n<=0; }).length;
          const pmb = mine.filter(r=> r.__truePMB).length;
          const median = (arr:number[])=>{ const a=arr.filter(Number.isFinite).sort((a,b)=>a-b); if(!a.length) return 0; const m=Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2; };
          const medDays = median(mine.map(r=>{ const n=daysUntil(r.next_check); return (typeof n==='number')?n:undefined as any; }));
          return (
            <div key={o} className="kpi">
              <div className="text-sm text-white/70">{o}</div>
              <div className="mt-1 text-sm grid grid-cols-2 gap-2">
                <div><div className="text-xs text-white/60">Open lines</div><div className="text-lg">{mine.length}</div></div>
                <div><div className="text-xs text-white/60">PMB lines</div><div className="text-lg">{pmb}</div></div>
                <div><div className="text-xs text-white/60">Due/Overdue</div><div className="text-lg">{due}</div></div>
                <div><div className="text-xs text-white/60">Median days to next</div><div className="text-lg">{medDays}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
