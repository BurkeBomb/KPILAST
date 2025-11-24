'use client';
import { Card } from './Card';
const HOT = ['3058','3130','1949','1952','0255'];
export function HighValueWatch({ rows }:{ rows:any[] }){
  const lines = rows.filter(r=> HOT.includes(String(r.tariff||'')));
  const claimed = lines.reduce((a,r)=> a + (Number(r.claimed)||0), 0);
  const paid = lines.reduce((a,r)=> a + ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0)), 0);
  const shortfall = claimed - paid;
  return (
    <Card>
      <div className="font-medium mb-2">High-Value Tariff Watch</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi"><div className="text-sm text-white/70">Lines</div><div className="text-2xl">{lines.length}</div></div>
        <div className="kpi"><div className="text-sm text-white/70">Claimed</div><div className="text-2xl">R {claimed.toFixed(2)}</div></div>
        <div className="kpi"><div className="text-sm text-white/70">Paid</div><div className="text-2xl">R {paid.toFixed(2)}</div></div>
        <div className="kpi"><div className="text-sm text-white/70">Shortfall</div><div className="text-2xl">R {shortfall.toFixed(2)}</div></div>
      </div>
    </Card>
  );
}
