import * as XLSX from 'xlsx';

export async function parseFile(file: File): Promise<{ headers: string[]; rows: any[] }> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const rows: any[] = [];
  let headers: string[] = [];
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const part = XLSX.utils.sheet_to_json(ws, { defval: null });
    if (part.length) {
      rows.push(...part);
      if (!headers.length) headers = Object.keys(part[0]);
    }
  }
  return { headers, rows };
}

export async function parsePMBMappingFile(file: File): Promise<string[]> {
  const buf = await file.arrayBuffer();
  const text = new TextDecoder().decode(buf);
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const head = lines[0].split(',').map(s=>s.trim().toLowerCase());
  const idx = head.indexOf('icd10_prefix');
  if (idx === -1) return [];
  const prefixes: string[] = [];
  for (let i=1;i<lines.length;i++) {
    const cols = lines[i].split(',');
    if (cols[idx]) prefixes.push(cols[idx].trim());
  }
  return prefixes;
}

export async function parseAliasesFile(file: File): Promise<Record<string,string>> {
  const buf = await file.arrayBuffer();
  const text = new TextDecoder().decode(buf);
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return {};
  const head = lines[0].split(',').map(s=>s.trim().toLowerCase());
  const a = head.indexOf('alias'); const s = head.indexOf('scheme');
  if (a === -1 || s === -1) return {};
  const out: Record<string,string> = {};
  for (let i=1;i<lines.length;i++){
    const cols = lines[i].split(',');
    out[String(cols[a]||'').toUpperCase()] = String(cols[s]||'').toUpperCase();
  }
  return out;
}
