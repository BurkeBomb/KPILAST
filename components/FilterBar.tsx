'use client';
import { Card } from './Card';

export type Filters = {
  dateFrom?: string;
  dateTo?: string;
  assignee?: string[];
  status?: string[];
  tariff?: string[];
  pmbOnly?: boolean;
};

export function FilterBar({ rows, filters, setFilters }:{ rows:any[]; filters:Filters; setFilters:(f:Filters)=>void }) {
  const assignees = Array.from(new Set(rows.map(r => String(r.assignee || '')).filter(Boolean))).sort();
  const statuses = Array.from(new Set(rows.map(r => String(r.status || '')).filter(Boolean))).sort();
  const tariffs = Array.from(new Set(rows.map(r => String(r.tariff || '')).filter(Boolean))).sort();

  return (
    <Card>
      <div className="font-medium mb-3">Filters</div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs text-white/60">Date From</label>
          <input type="date" value={filters.dateFrom || ''} onChange={(e)=> setFilters({ ...filters, dateFrom: e.target.value || undefined })}
            className="bg-white/5 border border-white/10 rounded-xl px-2 py-1 w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60">Date To</label>
          <input type="date" value={filters.dateTo || ''} onChange={(e)=> setFilters({ ...filters, dateTo: e.target.value || undefined })}
            className="bg-white/5 border border-white/10 rounded-xl px-2 py-1 w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60">PMB Only</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!filters.pmbOnly} onChange={(e)=> setFilters({ ...filters, pmbOnly: e.target.checked })} />
            <span className="text-sm">Show True PMB only</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 mt-3">
        <Multi label="Assignee" values={assignees} sel={filters.assignee || []} onChange={(v)=> setFilters({ ...filters, assignee: v.length ? v : undefined })} />
        <Multi label="Status" values={statuses} sel={filters.status || []} onChange={(v)=> setFilters({ ...filters, status: v.length ? v : undefined })} />
        <Multi label="Tariff" values={tariffs} sel={filters.tariff || []} onChange={(v)=> setFilters({ ...filters, tariff: v.length ? v : undefined })} />
      </div>
    </Card>
  );
}

function Multi({ label, values, sel, onChange }:{ label:string; values:string[]; sel:string[]; onChange:(v:string[])=>void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/60">{label}</label>
      <div className="bg-white/5 border border-white/10 rounded-xl px-2 py-1">
        <div className="flex flex-wrap gap-2">
          {values.map(v => {
            const checked = sel.includes(v);
            return (
              <button key={v} type="button"
                onClick={()=> onChange(checked ? sel.filter(x=>x!==v) : [...sel, v])}
                className={`px-2 py-1 rounded-lg text-xs border ${checked ? 'bg-purpleMetal/30 border-purple-400' : 'border-white/10 bg-white/0'}`}>
                {v}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
