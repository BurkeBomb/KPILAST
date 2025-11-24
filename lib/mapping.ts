import { parseCurrency, parseDate } from './format';
import { CanonicalKey } from '@/components/ColumnMapper';
import { enrichPMB, Row } from './pmb';

const SYNONYMS: Record<CanonicalKey, string[]> = {
  accno: ['accno','account','acc no','account no','account number','acc no.'],
  membership_no: ['membership no','member number','member no','membership','member'],
  patient_surname: ['patient surname','surname','last name'],
  patient_names: ['patient name','patient names','name','first name','names'],
  service_date: ['service date','srv. date','dos','date of service','srv date','service'],
  tariff: ['tariff','code','procedure','cpt','icd-10 code','tariff code'],
  claimed: ['claimed','amount claimed','billed','total claimed'],
  paid_scheme: ['paid','paid scheme','scheme paid','paid by scheme','paid amount'],
  paid_member: ['member paid','mem paid','patient paid'],
  status: ['status','line status','state'],
  shortfall: ['shortfall','balance','difference','underpay'],
  era_reason: ['era reason','comment','reason','reason code','message'],
  assignee: ['assignee','owner','handler','agent'],
  next_check: ['next check','follow-up','follow up','due','due date'],
  icd10: ['icd10','icd-10','icd 10','diagnosis'],
  pmb_flag: ['pmb','pmb flag','pmb?'],
  auth_no: ['auth no','authorization','authorisation','auth number','auth'],
  dsp_used: ['dsp used','dsp','network used','network'],
  emergency_flag: ['emergency','er','casualty'],
  place_of_service: ['place of service','facility','location','pos'],
  benefit_type: ['benefit type','benefit'],
  reason_code: ['reason code','code'],
  practice_no: ['practice no','practice number','practice'],
  provider_name: ['provider','provider name'],
  appeal_flag: ['appeal','appeal flag'],
  
  // Additional keys to satisfy CanonicalKey definitions in KPIFINAL.
  // Without explicit entries, TypeScript will flag missing properties when constructing
  // a Record<CanonicalKey, string[]> for SYNONYMS. These synonyms cover typical
  // labels for scheme and plan information in medical billing datasets.
  option: [
    'option',
    'plan',
    'plan option',
    'option code',
    'medical plan'
  ],
  scheme: [
    'scheme',
    'medical scheme',
    'scheme code',
    'health fund',
    'fund'
  ],
  scheme_name: [
    'scheme name',
    'medical scheme name',
    'fund name',
    'health fund name',
    'medical fund name'
  ]
};

function norm(s: string) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
export type Mapping = Record<CanonicalKey, string>;

export function autoMapColumns(headers: string[]): Mapping {
  const m: Partial<Mapping> = {};
  for (const key of Object.keys(SYNONYMS) as CanonicalKey[]) {
    const syns = [key, ...(SYNONYMS[key]||[])].map(norm);
    const hit = headers.find(h => syns.includes(norm(h)));
    if (hit) (m as any)[key] = hit;
  }
  return m as Mapping;
}

export function applyMapping(rows: any[], mapping: Mapping): Row[] {
  const out: Row[] = rows.map(r => {
    const o:any = {};
    for (const key of Object.keys(mapping) as CanonicalKey[]) {
      const col = mapping[key];
      o[key] = r[col];
    }
    o.claimed = parseCurrency(o.claimed);
    o.paid_scheme = parseCurrency(o.paid_scheme);
    o.paid_member = parseCurrency(o.paid_member);
    o.shortfall = (typeof o.shortfall === 'number' && isFinite(o.shortfall)) ? o.shortfall : (o.claimed - o.paid_scheme - o.paid_member);
    o.service_date = parseDate(o.service_date);
    o.next_check = parseDate(o.next_check);
    o.tariff = String(o.tariff ?? '');
    return o as Row;
  });
  return enrichPMB(out);
}
