export type Row = {
  accno?: string;
  membership_no?: string;
  patient_surname?: string;
  patient_names?: string;
  service_date?: string | null;
  tariff?: string;
  claimed: number;
  paid_scheme: number;
  paid_member: number;
  status?: string;
  shortfall: number;
  era_reason?: string;
  assignee?: string;
  next_check?: string | null;
  scheme?: string;
  scheme_name?: string;
  option?: string;
  icd10?: string;
  pmb_flag?: string | boolean | number;
  auth_no?: string;
  dsp_used?: string | boolean | number;
  emergency_flag?: string | boolean | number;
  place_of_service?: string;
  benefit_type?: string;
  reason_code?: string;
  practice_no?: string;
  provider_name?: string;
  appeal_flag?: string | boolean | number;
  __truePMB?: boolean;
};

function toBool(v: any): boolean { if (v === true) return true; const s = String(v ?? '').trim().toLowerCase(); return ['y','yes','true','1'].includes(s); }
function matchIcd10Prefix(icd10: string, prefixes: string[]): boolean {
  const code = (icd10 || '').replace(/[^A-Za-z0-9]/g,'').toUpperCase();
  return prefixes.some(p => code.startsWith(String(p).toUpperCase()));
}

export function isPmbByFlag(row: Row) { return toBool(row.pmb_flag); }
export function isPmbByIcd10(row: Row, pmbPrefixes: string[]) { return !!row.icd10 && matchIcd10Prefix(row.icd10, pmbPrefixes); }
export function isHospitalOrER(row: Row) {
  const pos = (row.place_of_service || '').toLowerCase();
  return !!row.auth_no || ['hospital','er','casualty','a&e','icu','ward'].some(k => pos.includes(k));
}
export function isEmergency(row: Row) { return toBool(row.emergency_flag) || /emerg/i.test(row.era_reason || ''); }
export function dspUsed(row: Row) { return toBool(row.dsp_used); }
export function shortfall(row: Row) { return (row.claimed || 0) - (row.paid_scheme || 0) - (row.paid_member || 0); }

export function truePMB(row: Row, pmbPrefixes: string[]) {
  const base = isPmbByFlag(row) || isPmbByIcd10(row, pmbPrefixes) || /(\b)pmb(\b)/i.test(row.era_reason || '') || /(\b)pmb(\b)/i.test(row.reason_code || '');
  if (!base) return false;
  return dspUsed(row) || isEmergency(row) || isHospitalOrER(row);
}

export function pmbUnderpay(row: Row, pmbPrefixes: string[]) { return truePMB(row, pmbPrefixes) && shortfall(row) > 0; }
export function pmbDspViolation(row: Row, pmbPrefixes: string[]) { return (isPmbByFlag(row) || isPmbByIcd10(row, pmbPrefixes)) && !dspUsed(row) && !isEmergency(row); }

export function enrichPMB(rows: Row[]): Row[] { return rows.map(r => ({ ...r, __truePMB: false })); }
