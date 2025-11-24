'use client';
import { Card } from './Card';

export function ControlBar({ role, setRole, popiaSafe, setPopiaSafe }:{ role:'admin'|'manager'|'agent'; setRole:(r:any)=>void; popiaSafe:boolean; setPopiaSafe:(b:boolean)=>void }){
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Theme</span>
          <select
            className="bg-white/5 border border-white/10 rounded-xl px-2 py-1"
            onChange={(e)=>{
              const t = e.target.value;
              document.querySelector('[data-theme]')?.setAttribute('data-theme', t);
              localStorage.setItem('theme', t);
            }}
            defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'ctrl') : 'ctrl'}>
            <option value="ctrl">CTRL Room</option>
            <option value="mediburgh">MediBurgh</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Role</span>
          <select className="bg-white/5 border border-white/10 rounded-xl px-2 py-1" value={role} onChange={(e)=> setRole(e.target.value as any)}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={popiaSafe} onChange={(e)=> setPopiaSafe(e.target.checked)} />
          POPIA Safe Mode
        </label>
      </div>
    </Card>
  );
}
