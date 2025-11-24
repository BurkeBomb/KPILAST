'use client';
import { Upload } from 'lucide-react';
import { parsePMBMappingFile, parseAliasesFile } from '@/lib/parsers';

export function UploadArea({ onFile, onLoadPMB, onLoadAliases }:{ onFile: (f: File)=>void; onLoadPMB: (prefixes: string[])=>void; onLoadAliases:(m:Record<string,string>)=>void }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5 text-purpleMetal" />
        <div className="font-medium">Upload ERA Excel/CSV</div>
      </div>
      <input type="file" accept=".xlsx,.csv" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onFile(f); }}
        className="file:mr-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:px-4 file:py-2 file:text-white/80 file:hover:bg-white/10" />
      <div className="text-xs text-white/60">
        Optional: <code>pmb_icd10.csv</code> (column <code>icd10_prefix</code>) and <code>scheme_alias.csv</code> (columns <code>alias,scheme</code>).
      </div>
      <input type="file" accept=".csv" onChange={async (e)=>{ const f=e.target.files?.[0]; if (!f) return; const p=await parsePMBMappingFile(f); onLoadPMB(p); }}
        className="file:mr-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:px-4 file:py-2 file:text-white/80 file:hover:bg-white/10" />
      <input type="file" accept=".csv" onChange={async (e)=>{ const f=e.target.files?.[0]; if (!f) return; const a=await parseAliasesFile(f); onLoadAliases(a); }}
        className="file:mr-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:px-4 file:py-2 file:text-white/80 file:hover:bg-white/10" />
    </div>
  );
}
