'use client';
import { Card } from './Card';

export function CoverageMeter({ rows }:{ rows:any[] }){
  const total = rows.length || 1;
  const pct = (n:number)=> Math.round((n/total)*1000)/10;
  const withIcd = rows.filter(r=> !!r.icd10).length;
  const withDSP = rows.filter(r=> ['y','yes','true','1'].includes(String(r.dsp_used||'').toLowerCase())).length;
  const withER = rows.filter(r=> ['y','yes','true','1'].includes(String(r.emergency_flag||'').toLowerCase())).length;
  const withAuth = rows.filter(r=> !!r.auth_no).length;

  return (
    <Card>
      <div className="font-medium mb-2">PMB Data Coverage</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Meter label="ICD-10 present" value={`${pct(withIcd)}%`} />
        <Meter label="DSP flag present" value={`${pct(withDSP)}%`} />
        <Meter label="Emergency flag present" value={`${pct(withER)}%`} />
        <Meter label="Auth no. present" value={`${pct(withAuth)}%`} />
      </div>
    </Card>
  );
}

function Meter({ label, value }:{ label:string; value:string }){
  return <div className="kpi"><div className="text-sm text-white/70">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div>;
}
