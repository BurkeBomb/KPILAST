function csvFromRows(rows:any[]):string{
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(',')].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))).join('\n');
}

export function buildPMBOnlyCSV(rows:any[]):string{
  const pmb = rows.filter(r=> r.__truePMB);
  const distinctAcc = Array.from(new Set(pmb.map(r=> r.accno)));
  const map: Record<string,{accno:string, lines:number, claimed:number, paid:number, shortfall:number}> = {};
  for(const r of pmb){
    const k = String(r.accno);
    (map[k] ||= { accno:k, lines:0, claimed:0, paid:0, shortfall:0 });
    map[k].lines += 1;
    map[k].claimed += Number(r.claimed)||0;
    map[k].paid += (Number(r.paid_scheme)||0)+(Number(r.paid_member)||0);
  }
  for(const k in map){ map[k].shortfall = map[k].claimed - map[k].paid; }
  const rowsOut = Object.values(map);
  return csvFromRows(rowsOut);
}

export function buildBulkNotesCSV(rows:any[]):string{
  const out = rows.map(r => ({
    accno: r.accno, member: r.membership_no, patient: `${r.patient_surname||''}, ${r.patient_names||''}`,
    scheme: r.scheme || r.scheme_name || '', dos: r.service_date, tariff: r.tariff,
    shortfall: (Number(r.claimed)||0) - ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0)),
    'Call notes': '', 'Scheme ref#': '', 'Next check (YYYY-MM-DD)': ''
  }));
  return csvFromRows(out);
}

export function buildAuditTrailCSV(rows:any[]):string{
  const withCalc = rows.map(r => ({
    ...r,
    _paid_total: ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0)),
    _shortfall_calc: (Number(r.claimed)||0) - ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0)),
    _pmb_true: r.__truePMB ? 'Y':'N'
  }));
  return csvFromRows(withCalc);
}
