import { Row, isEmergency, isHospitalOrER, isPmbByFlag, isPmbByIcd10 } from './pmb';

const buckets = [
  { bucket: 'Paid at Scheme Rate', rx: /scheme rate|paid at your scheme/i, tip: 'Check contract rate; if PMB, request full settlement.' },
  { bucket: 'Benefit Exhausted / Savings', rx: /benefit.*exhaust|savings/i, tip: 'If PMB, benefits may not limit payment.' },
  { bucket: 'Tariff Not Covered', rx: /not covered|excluded|non-?formulary/i, tip: 'If clinical need under PMB, request exception.' },
  { bucket: 'Auth / Pre-authorisation', rx: /auth|authori[sz]ation/i, tip: 'Provide auth ref or show ER/hospital presentation.' },
  { bucket: 'Incorrect Coding', rx: /incorrect|invalid code|icd-?10/i, tip: 'Fix ICD-10 / tariff where applicable.' },
  { bucket: 'Network (DSP) Penalty', rx: /dsp|network penalty/i, tip: 'If ER/hospital or DSP used, penalties unlawful for PMB.' },
];

export function classifyReasons(rows: Row[]){
  const counts = buckets.map(b => ({ bucket: b.bucket, tip: b.tip, count: 0 }));
  for (const r of rows) {
    const text = [r.era_reason, r.reason_code].map(s=> String(s||'')).join(' ').toLowerCase();
    for (let i=0;i<buckets.length;i++){
      if (buckets[i].rx.test(text)) counts[i].count++;
    }
  }
  return counts.filter(c=> c.count>0).sort((a,b)=> b.count - a.count);
}

export function explainPMB(r: Row): string[] {
  const out: string[] = [];
  if (isPmbByFlag(r)) out.push('PMB flag');
  // Not calling prefixes here (unknown), keep generic chip outputs handled elsewhere if needed.
  if (isEmergency(r)) out.push('Emergency');
  if (isHospitalOrER(r)) out.push('Hospital/ER');
  if (String(r.dsp_used||'').match(/y|yes|true|1/i)) out.push('DSP used');
  if (String(r.icd10||'')) out.push(`ICD-10 ${String(r.icd10)}`);
  return out.length ? out : ['PMB basis unclear — add ICD-10/DSP/Auth'];
}
