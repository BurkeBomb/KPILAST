'use client';
import { Card } from './Card';
import { useMemo } from 'react';

export type CanonicalKey =
  | 'accno' | 'membership_no' | 'patient_surname' | 'patient_names'
  | 'service_date' | 'tariff' | 'claimed' | 'paid_scheme' | 'paid_member'
  | 'status' | 'shortfall' | 'era_reason' | 'assignee' | 'next_check'
  | 'icd10' | 'pmb_flag' | 'auth_no' | 'dsp_used' | 'emergency_flag'
  | 'place_of_service' | 'benefit_type' | 'reason_code' | 'practice_no'
  | 'provider_name' | 'appeal_flag' | 'scheme' | 'scheme_name' | 'option';

const FIELDS: { key: CanonicalKey; label: string; required?: boolean }[] = [
  { key: 'accno', label: 'Account No', required: true },
  { key: 'membership_no', label: 'Membership No' },
  { key: 'patient_surname', label: 'Patient Surname' },
  { key: 'patient_names', label: 'Patient Names' },
  { key: 'service_date', label: 'Service Date', required: true },
  { key: 'tariff', label: 'Tariff', required: true },
  { key: 'claimed', label: 'Claimed', required: true },
  { key: 'paid_scheme', label: 'Paid (Scheme)' },
  { key: 'paid_member', label: 'Paid (Member)' },
  { key: 'status', label: 'Status' },
  { key: 'shortfall', label: 'Shortfall (optional)' },
  { key: 'era_reason', label: 'ERA Reason/Comment' },
  { key: 'assignee', label: 'Assignee/Owner' },
  { key: 'next_check', label: 'Next Check (YYYY-MM-DD)' },
  { key: 'icd10', label: 'ICD-10' },
  { key: 'pmb_flag', label: 'PMB Flag (Y/N)' },
  { key: 'auth_no', label: 'Auth Number' },
  { key: 'dsp_used', label: 'DSP Used (Y/N)' },
  { key: 'emergency_flag', label: 'Emergency (Y/N)' },
  { key: 'place_of_service', label: 'Place of Service' },
  { key: 'benefit_type', label: 'Benefit Type' },
  { key: 'reason_code', label: 'Reason Code' },
  { key: 'practice_no', label: 'Practice Number' },
  { key: 'provider_name', label: 'Provider Name' },
  { key: 'appeal_flag', label: 'Appeal Flag' },
  { key: 'scheme', label: 'Scheme' },
  { key: 'scheme_name', label: 'Scheme Name' },
  { key: 'option', label: 'Option' },
];

export function ColumnMapper({ headers, mapping, setMapping }:{ headers:string[]; mapping: Record<CanonicalKey,string>; setMapping: (m: any)=>void }){
  const opts = useMemo(()=> ['(none)', ...headers], [headers]);
  function set(key: CanonicalKey, col: string){
    const next = { ...mapping, [key]: (col === '(none)') ? undefined : col };
    setMapping(next);
  }
  return (
    <Card>
      <div className="font-medium mb-2">Column Mapping</div>
      {!headers?.length ? (
        <div className="text-sm text-white/60">Upload a file to map columns.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {FIELDS.map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs text-white/60">{f.label}{f.required ? ' *' : ''}</label>
              <select
                value={mapping?.[f.key] || '(none)'}
                onChange={(e)=> set(f.key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
      <div className="text-xs text-white/50 mt-2">Tip: Claimed, Tariff, Service Date, and Account No give the best KPIs.</div>
    </Card>
  );
}
