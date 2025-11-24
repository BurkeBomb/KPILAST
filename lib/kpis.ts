import { toZAR, toPct } from './format';
import { Row, truePMB, pmbUnderpay, pmbDspViolation } from './pmb';
import type { Kpi } from '@/components/KpiBoard';

function sum(rows: Row[], f: (r:Row)=>number) { return rows.reduce((a,r)=> a + (f(r) || 0), 0); }
function count(rows: Row[], p: (r:Row)=>boolean) { return rows.filter(p).length; }
function distinct<T>(arr: T[]) { return Array.from(new Set(arr)); }
function median(nums:number[]) {
  const a = nums.filter(n=>isFinite(n)).sort((x,y)=>x-y);
  if (!a.length) return 0;
  const m = Math.floor(a.length/2);
  return a.length % 2 ? a[m] : (a[m-1] + a[m]) / 2;
}

export function computeAllKpis(allRows: Row[], filteredRows: Row[], pmbPrefixes: string[]) {
  const rows = filteredRows.map(r => ({ ...r, __truePMB: truePMB(r, pmbPrefixes) }));

  const claimed = sum(rows, r => r.claimed);
  const paidScheme = sum(rows, r => r.paid_scheme);
  const paidMember = sum(rows, r => r.paid_member);
  const shortfall = claimed - paidScheme - paidMember;
  const recovery = claimed ? ((paidScheme + paidMember)/claimed)*100 : 0;

  const kpis: Kpi[] = [
    { label: 'Total Claimed', value: toZAR(claimed) },
    { label: 'Paid by Scheme', value: toZAR(paidScheme) },
    { label: 'Member Paid', value: toZAR(paidMember) },
    { label: 'Total Shortfall', value: toZAR(shortfall), sublabel: `Recovery ${toPct(recovery)}` },
    { label: 'Lines Count', value: String(rows.length) },
    { label: 'Accounts Count', value: String(distinct(rows.map(r=> r.accno)).filter(Boolean).length) },
    { label: 'Part-paid Lines', value: String(count(rows, r => String(r.status||'').toLowerCase().includes('part'))) },
    { label: 'Unmatched Lines', value: String(count(rows, r => String(r.status||'').toLowerCase().includes('unmatched'))) },
    { label: 'Avg Shortfall / Line', value: toZAR(rows.length ? shortfall / rows.length : 0) },
    { label: 'Median Shortfall', value: toZAR(median(rows.map(r=> r.shortfall))) },
    { label: '0151 Lines', value: String(count(rows, r => String(r.tariff||'') === '0151')) },
    { label: 'High-Value Lines', value: String(count(rows, r => ['3058','3130','1949','1952','0255'].includes(String(r.tariff||'')))) },
    { label: '“Scheme Rate” Lines', value: String(count(rows, r => /scheme rate/i.test(String(r.era_reason || '')))) },
    { label: 'Next Checks Due', value: String(count(rows, r => {
      const d = r.next_check ? new Date(r.next_check) : null;
      return !!(d && d <= new Date());
    })) },
  ];

  const pmbRows = rows.filter(r => r.__truePMB);
  const pmbClaimed = sum(pmbRows, r => r.claimed);
  const pmbPaid = sum(pmbRows, r => r.paid_scheme + r.paid_member);
  const pmbShortfall = pmbClaimed - pmbPaid;
  const pmbRecovery = pmbClaimed ? (pmbPaid / pmbClaimed) * 100 : 0;

  const pmbKpis: Kpi[] = [
    { label: 'True PMB Accounts', value: String(distinct(pmbRows.map(r => r.accno)).filter(Boolean).length) },
    { label: 'PMB Lines', value: String(pmbRows.length) },
    { label: 'PMB Paid', value: toZAR(pmbPaid) },
    { label: 'PMB Shortfall', value: toZAR(pmbShortfall), sublabel: `PMB Recovery ${toPct(pmbRecovery)}` },
    { label: 'PMB Underpay Lines', value: String(count(rows, r => pmbUnderpay(r, pmbPrefixes))) },
    { label: 'DSP Non-Compliance (PMB)', value: String(count(rows, r => pmbDspViolation(r, pmbPrefixes))) },
  ];

  return { kpis, pmbKpis };
}
