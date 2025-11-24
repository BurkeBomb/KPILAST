'use client';
import { clsx } from 'clsx';
export function MetricTile({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className={clsx("kpi")}>
      <div className="text-sm text-white/70">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sublabel && <div className="text-xs text-white/50 mt-1">{sublabel}</div>}
    </div>
  );
}
