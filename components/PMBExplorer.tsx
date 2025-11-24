'use client';
import { Card } from './Card';
import { explainPMB } from '@/lib/reasons';

export function PMBExplorer({ rows }:{ rows:any[] }){
  const pmb = rows.filter(r=> r.__truePMB);
  return (
    <Card>
      <div className="font-medium mb-2">PMB Explorer (why flagged)</div>
      <div className="space-y-2 max-h-[320px] overflow-auto pr-2">
        {pmb.slice(0,200).map((r,i)=>{
          const reasons = explainPMB(r);
          return (
            <div key={i} className="text-sm border-b border-white/5 pb-1">
              <div className="flex flex-wrap gap-2">
                {reasons.map((rr,j)=> <span key={j} className="badge">{rr}</span>)}
              </div>
              <div className="text-xs text-white/50 mt-1">{r.accno} • {r.patient_surname}, {r.patient_names} • {r.tariff} • {r.service_date}</div>
            </div>
          );
        })}
        {!pmb.length && <div className="text-sm text-white/60">No True PMB rows (with current filters).</div>}
      </div>
    </Card>
  );
}
