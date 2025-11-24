import { Row } from './pmb';

function hash(s:string){
  const base = btoa(unescape(encodeURIComponent(s)));
  return base.slice(0,6) + '…' + base.slice(-4);
}

export function withPOPIA(rows: Row[]): Row[] {
  return rows.map(r => ({
    ...r,
    membership_no: r.membership_no ? hash(String(r.membership_no)) : r.membership_no,
    patient_surname: r.patient_surname ? (String(r.patient_surname).slice(0,1) + '***') : r.patient_surname,
    patient_names: r.patient_names ? (String(r.patient_names).slice(0,1) + '***') : r.patient_names,
  }));
}
