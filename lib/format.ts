export function toZAR(n: number): string {
  const v = Number.isFinite(n as any) ? Number(n) : 0;
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  const fixed = abs.toFixed(2);
  const [intPart, frac] = fixed.split('.');
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}R ${intWithSep}.${frac}`; // deterministic (no locale)
}
export function toPct(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  const rounded = Math.round(v * 10) / 10;
  const s = rounded.toFixed(1);
  return `${s}%`; // deterministic (no locale)
}
export function parseCurrency(s: any): number {
  if (typeof s === 'number') return s;
  const str = String(s ?? '').replace(/[^0-9,.-]/g,'');
  // Accept both 1,234.56 and 1.234,56 styles
  const hasComma = str.includes(',');
  const hasDot = str.includes('.');
  let normalized = str;
  if (hasComma && hasDot) {
    // Assume dot is thousands and comma is decimal (e.g., 1.234,56)
    normalized = str.replace(/\./g,'').replace(/,/g,'.');
  } else if (hasComma && !hasDot) {
    // Assume comma is decimal (e.g., 1234,56)
    normalized = str.replace(/,/g,'.');
  } else {
    normalized = str;
  }
  const v = parseFloat(normalized);
  return isFinite(v) ? v : 0;
}
export function parseDate(s: any): string | null {
  if (!s && s !== 0) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0,10);
}
