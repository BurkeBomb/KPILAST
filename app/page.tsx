'use client';
import { useMemo, useState } from 'react';
import { UploadArea } from '@/components/UploadArea';
import { ColumnMapper, CanonicalKey } from '@/components/ColumnMapper';
import { FilterBar, Filters } from '@/components/FilterBar';
import { KpiBoard } from '@/components/KpiBoard';
import { DownloadMenu } from '@/components/DownloadMenu';
import { CoverageMeter } from '@/components/CoverageMeter';
import { ReasonIntel } from '@/components/ReasonIntel';
import { WorkloadBoard } from '@/components/WorkloadBoard';
import { SchemeSplit } from '@/components/SchemeSplit';
import { HighValueWatch } from '@/components/HighValueWatch';
import { ControlBar } from '@/components/ControlBar';
import { PMBExplorer } from '@/components/PMBExplorer';
import { autoMapColumns, applyMapping } from '@/lib/mapping';
import { parseFile } from '@/lib/parsers';
import { Row, truePMB } from '@/lib/pmb';
import { computeAllKpis } from '@/lib/kpis';
import { withPOPIA } from '@/lib/popia';

export default function Page() {
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<CanonicalKey, string>>({} as any);
  const [filters, setFilters] = useState<Filters>({});
  const [fileName, setFileName] = useState<string>('');
  const [pmbPrefixes, setPmbPrefixes] = useState<string[]>(['C','I','G','E']);
  const [aliases, setAliases] = useState<Record<string,string>>({});
  const [popiaSafe, setPopiaSafe] = useState<boolean>(false);
  const [role, setRole] = useState<'admin'|'manager'|'agent'>('manager');

  const onFile = async (file: File) => {
    const { headers, rows } = await parseFile(file);
    setFileName(file.name);
    setRawHeaders(headers);
    setRawRows(rows);
    const m = autoMapColumns(headers);
    setMapping(m);
  };

  const mappedRows: Row[] = useMemo(() => {
    if (!rawRows.length || !Object.keys(mapping).length) return [];
    const rows = applyMapping(rawRows, mapping);
    return popiaSafe ? withPOPIA(rows) : rows;
  }, [rawRows, mapping, popiaSafe]);

  const filteredRows = useMemo(() => {
    if (!mappedRows.length) return [];
    const flagged = mappedRows.map(r => ({ ...r, __truePMB: truePMB(r, pmbPrefixes) }));
    const f = filters;
    return flagged.filter(r => {
      let ok = true;
      if (f.status?.length) ok = ok && f.status.includes(String(r.status || ''));
      if (f.assignee?.length) ok = ok && f.assignee.includes(String(r.assignee || ''));
      if (f.tariff?.length) ok = ok && f.tariff.includes(String(r.tariff || ''));
      if (f.dateFrom) ok = ok && new Date(String(r.service_date)) >= new Date(f.dateFrom);
      if (f.dateTo) ok = ok && new Date(String(r.service_date)) <= new Date(f.dateTo);
      if (f.pmbOnly) ok = ok && (r.__truePMB === true);
      return ok;
    });
  }, [mappedRows, filters, pmbPrefixes]);

  const { kpis, pmbKpis } = useMemo(() => computeAllKpis(mappedRows, filteredRows, pmbPrefixes), [mappedRows, filteredRows, pmbPrefixes]);

  return (
    <div className="space-y-6">
      <ControlBar role={role} setRole={setRole} popiaSafe={popiaSafe} setPopiaSafe={setPopiaSafe} />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">ERA KPI Dashboard — Pro</h1>
        <DownloadMenu
          fileNameBase={fileName ? fileName.replace(/\.[^/.]+$/, '') : 'era-kpis'}
          kpis={kpis}
          pmbKpis={pmbKpis}
          allRows={mappedRows}
          filteredRows={filteredRows}
        />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <UploadArea onFile={onFile} onLoadPMB={(p)=>setPmbPrefixes(p)} onLoadAliases={(a)=>setAliases(a)} />
        <ColumnMapper headers={rawHeaders} mapping={mapping} setMapping={setMapping} />
      </div>

      <FilterBar rows={mappedRows} filters={filters} setFilters={setFilters} />
      <KpiBoard kpis={kpis} pmbKpis={pmbKpis} />
      <CoverageMeter rows={mappedRows} />

      <div className="grid md:grid-cols-2 gap-4">
        <ReasonIntel rows={filteredRows} />
        <WorkloadBoard rows={filteredRows} />
      </div>

      <SchemeSplit rows={filteredRows} aliases={aliases} />
      <HighValueWatch rows={filteredRows} />
      <PMBExplorer rows={filteredRows} />
    </div>
  );
}
