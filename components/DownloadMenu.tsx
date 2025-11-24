'use client';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip'; // imported for potential side-effects; not used directly in this component
// We intentionally avoid importing from `file-saver`.  Vercel's TypeScript build
// complained about missing type declarations for this package.  Instead,
// we'll reuse the `trigger` helper below to download the generated ZIP.
import { buildEvidenceZip } from '@/lib/evidence';
import { buildBulkNotesCSV, buildPMBOnlyCSV, buildAuditTrailCSV } from '@/lib/exports';

type Kpi = { label: string; value: string; sublabel?: string };

export function DownloadMenu({ fileNameBase, kpis, pmbKpis, allRows, filteredRows }:{ fileNameBase:string; kpis:Kpi[]; pmbKpis:Kpi[]; allRows:any[]; filteredRows:any[] }){
  const trigger = (data:any, name:string, type:string) => {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  };

  const kpiRows = [...kpis, ...pmbKpis].map(k => ({ label: k.label, value: k.value, sublabel: k.sublabel || '' }));

  const downloadCSV = () => {
    if (!kpiRows.length) return;
    const headers = Object.keys(kpiRows[0]);
    const csv = [headers.join(',')].concat(kpiRows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))).join('\n');
    trigger(csv, `${fileNameBase}-kpis.csv`, 'text/csv;charset=utf-8;');
  };

  const downloadXLSX = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(kpiRows);
    XLSX.utils.book_append_sheet(wb, ws, 'KPIs');
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    trigger(new Blob([out]), `${fileNameBase}-kpis.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const downloadJSON = () => trigger(JSON.stringify({ kpis, pmbKpis }, null, 2), `${fileNameBase}-snapshot.json`, 'application/json');

  const downloadPMBOnly = () => trigger(buildPMBOnlyCSV(filteredRows), `${fileNameBase}-pmb-only.csv`, 'text/csv;charset=utf-8;');
  const downloadNotes = () => trigger(buildBulkNotesCSV(filteredRows), `${fileNameBase}-call-notes.csv`, 'text/csv;charset=utf-8;');
  const downloadAudit = () => trigger(buildAuditTrailCSV(filteredRows), `${fileNameBase}-audit-trail.csv`, 'text/csv;charset=utf-8;');

  const buildEvidence = async () => {
    const zip = await buildEvidenceZip(filteredRows);
    const blob = await zip.generateAsync({ type:'blob' });
    // Use our generic trigger helper to download the ZIP. We specify
    // 'application/zip' as the MIME type for clarity. This avoids the
    // `file-saver` dependency while preserving the user experience.
    trigger(blob, `${fileNameBase}-evidence.zip`, 'application/zip');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center gap-2" onClick={downloadCSV}>
        <Download className="w-4 h-4" /> CSV
      </button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={downloadXLSX}>XLSX</button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={downloadJSON}>JSON</button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={()=> window.print()}>Print / PDF</button>

      <span className="mx-2 text-white/30">|</span>

      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={downloadPMBOnly}>PMB-only CSV</button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={downloadNotes}>Bulk Notes CSV</button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={downloadAudit}>Audit Trail CSV</button>
      <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={buildEvidence}>Evidence Pack ZIP</button>
    </div>
  );
}
