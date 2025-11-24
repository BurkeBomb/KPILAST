import JSZip from 'jszip';

function csv(rows:any[]):string{
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(',')].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))).join('\n');
}

export async function buildEvidenceZip(rows:any[]){
  const zip = new JSZip();
  const byAcc: Record<string, any[]> = {};
  rows.forEach(r => {
    const key = String(r.accno || 'UNKNOWN');
    (byAcc[key] ||= []).push(r);
  });
  for (const [acc, lines] of Object.entries(byAcc)){
    const folder = zip.folder(acc)!;
    const summary = {
      account: acc,
      lines: lines.length,
      totals: {
        claimed: lines.reduce((a,r)=> a + (Number(r.claimed)||0), 0),
        paid: lines.reduce((a,r)=> a + ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0)), 0),
        shortfall: lines.reduce((a,r)=> a + ((Number(r.claimed)||0) - ((Number(r.paid_scheme)||0)+(Number(r.paid_member)||0))), 0)
      }
    };
    folder.file('summary.json', JSON.stringify(summary, null, 2));
    folder.file('lines.csv', csv(lines));
    const letter = `PMB/Appeal: Please settle the attached True PMB lines for account ${acc}. Evidence enclosed.\n`;
    folder.file('appeal_template.txt', letter);
  }
  return zip;
}
