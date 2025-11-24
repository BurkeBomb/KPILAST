'use client';
import { MetricTile } from './MetricTile';
export type Kpi = { label: string; value: string; sublabel?: string };
export function KpiBoard({ kpis, pmbKpis }:{ kpis: Kpi[]; pmbKpis: Kpi[] }) {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-sm mb-2 text-white/70">General KPIs</div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {kpis.map((k, i) => <MetricTile key={i} {...k} />)}
        </div>
      </section>
      <section>
        <div className="text-sm mb-2 text-white/70">PMB KPIs</div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pmbKpis.map((k, i) => <MetricTile key={i} {...k} />)}
        </div>
      </section>
    </div>
  );
}
