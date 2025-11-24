'use client';
import { Card } from './Card';
import { classifyReasons } from '@/lib/reasons';

export function ReasonIntel({ rows }:{ rows:any[] }){
  const intel = classifyReasons(rows);
  return (
    <Card>
      <div className="font-medium mb-2">Reason Code Intelligence</div>
      <div className="text-sm text-white/70 mb-2">Plain-English buckets, counts, first actions.</div>
      <div className="space-y-2">
        {intel.map((b,i)=>(
          <div key={i} className="flex items-center justify-between border-b border-white/5 pb-1">
            <div>
              <div className="font-medium">{b.bucket}</div>
              <div className="text-xs text-white/60">{b.tip}</div>
            </div>
            <div className="text-lg">{b.count}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
