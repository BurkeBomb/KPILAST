'use client';
import { Card } from './Card';

export function SchemeSplit({ rows, aliases }:{ rows:any[]; aliases:Record<string,string> }){
  function normScheme(name:string){
    const n = String(name||'').toUpperCase();
    return aliases[n] || n || 'UNKNOWN';
  }
  const buckets: Record<string, number> = {};
  rows.forEach(r=>{
    const s = normScheme(r.scheme || r.scheme_name || '');
    buckets[s] = (buckets[s]||0) + 1;
  });
  const entries = Object.entries(buckets).sort((a,b)=> b[1]-a[1]);
  return (
    <Card>
      <div className="font-medium mb-2">Scheme & Option Split</div>
      <div className="space-y-1">
        {entries.map(([s,c])=>(
          <div key={s} className="flex items-center justify-between border-b border-white/5 pb-1">
            <div>{s}</div><div className="text-lg">{c}</div>
          </div>
        ))}
        {!entries.length && <div className="text-sm text-white/60">No scheme/option columns mapped; upload alias CSV or include scheme fields.</div>}
      </div>
    </Card>
  );
}
