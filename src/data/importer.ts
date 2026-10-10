import Papa from 'papaparse';
import { fundamentalSchema, normalizeCandles, datasetSchema, type Dataset } from './schema';
export const priceFields = ['time', 'open', 'high', 'low', 'close', 'volume'];
export const financialFields = ['period', 'revenue', 'netProfit', 'equity', 'debt', 'operatingCashFlow', 'capex', 'shares'];
export function parseFile(text: string, json: boolean): Record<string, unknown>[] {
  if (text.length > 10_000_000) throw new Error('Maximum file size is 10 MB.');
  if (json) { const parsed: unknown = JSON.parse(text); if (!Array.isArray(parsed) || parsed.some(x => !x || typeof x !== 'object' || Array.isArray(x))) throw new Error('JSON must be an array of records.'); return parsed; }
  const p = Papa.parse<Record<string, unknown>>(text.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: h => h.trim() });
  if (p.errors.length) throw new Error(p.errors[0].message); return p.data;
}
export function importRecords(rows: Record<string, unknown>[], mapping: Record<string, string>, meta: { name: string; symbol: string; exchange: 'NSE' | 'BSE'; kind: 'ohlcv' | 'fundamentals'; adjusted: boolean; synthetic: boolean; source: string }): Dataset {
  if (!rows.length || rows.length > 50000) throw new Error('Use 1–50,000 records.');
  const prefix = /^(NSE|BSE):/i.exec(meta.symbol.trim());
  if (prefix && prefix[1].toUpperCase() !== meta.exchange) throw new Error('Symbol prefix and selected exchange disagree. Select the matching exchange.');
  const fields = meta.kind === 'ohlcv' ? priceFields : financialFields;
  const converted = rows.map((row, i) => Object.fromEntries(fields.map(f => {
    const v = row[mapping[f]];
    if (v === undefined || v === null || String(v).trim() === '') throw new Error(`Row ${i + 1}: ${f} is missing.`);
    if (f === 'time' || f === 'period') return [f, String(v).trim()];
    const n = Number(String(v).replace(/,/g, '')); if (!Number.isFinite(n)) throw new Error(`Row ${i + 1}: ${f} must be numeric.`); return [f, n];
  })));
  const candles = meta.kind === 'ohlcv' ? normalizeCandles(converted) : [];
  const fundamentals = meta.kind === 'fundamentals' ? converted.map(r => fundamentalSchema.parse(r)) : [];
  if (new Set(fundamentals.map(f => f.period)).size !== fundamentals.length) throw new Error('Duplicate reporting periods.');
  return datasetSchema.parse({ version: 1, id: crypto.randomUUID(), name: meta.name, kind: meta.kind, candles, fundamentals,
    provenance: { provider: meta.source || 'User import · source unspecified', symbol: meta.symbol.trim().toUpperCase().replace(/^(NSE|BSE):/, ''), exchange: meta.exchange, currency: 'INR', units: 'INR; shares', retrievedAt: new Date().toISOString(), originalTimestamp: candles.at(-1)?.time ?? fundamentals.at(-1)?.period ?? 'Unknown', adjusted: meta.adjusted, synthetic: meta.synthetic, description: 'User-supplied data. Accuracy and adjustment methodology are user responsibilities.' } });
}
