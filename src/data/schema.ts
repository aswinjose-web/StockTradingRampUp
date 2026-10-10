import { z } from 'zod';
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s, 'Use a valid YYYY-MM-DD date');
export const candleSchema = z.object({
  time: date, open: z.number().finite().positive(), high: z.number().finite().positive(),
  low: z.number().finite().positive(), close: z.number().finite().positive(), volume: z.number().finite().nonnegative(),
}).refine(c => c.high >= Math.max(c.open, c.close, c.low) && c.low <= Math.min(c.open, c.close), 'OHLC high/low are inconsistent');
export type Candle = z.infer<typeof candleSchema>;
export const fundamentalSchema = z.object({
  period: z.string().min(4).max(80).refine(p => /FY\d{4}|annual|year|\bQ[1-4]\b|quarter/i.test(p) && /consolidated|standalone/i.test(p), 'Period must specify annual/FY or quarterly basis and consolidated/standalone scope'), revenue: z.number().finite().nonnegative(), netProfit: z.number().finite(),
  equity: z.number().finite(), debt: z.number().finite().nonnegative(), operatingCashFlow: z.number().finite(),
  capex: z.number().finite().nonnegative(), shares: z.number().finite().positive(),
});
export type Fundamental = z.infer<typeof fundamentalSchema>;
export const provenanceSchema = z.object({
  provider: z.string().min(1).max(200), symbol: z.string().regex(/^[A-Z0-9&.\-]{1,30}$/),
  exchange: z.enum(['NSE', 'BSE']), currency: z.literal('INR'), units: z.literal('INR; shares'),
  retrievedAt: z.string().datetime(), originalTimestamp: z.string().max(100),
  adjusted: z.boolean(), synthetic: z.boolean(), description: z.string().max(1000),
});
export const datasetSchema = z.object({
  version: z.literal(1), id: z.string().min(1).max(100), name: z.string().min(1).max(200),
  kind: z.enum(['ohlcv', 'fundamentals']), provenance: provenanceSchema,
  candles: z.array(candleSchema).max(50000), fundamentals: z.array(fundamentalSchema).max(500),
}).refine(d => d.kind === 'ohlcv' ? d.candles.length > 0 : d.fundamentals.length > 0, 'Dataset contains no records');
export type Dataset = z.infer<typeof datasetSchema>;
export function normalizeCandles(records: unknown[]): Candle[] {
  const cs = records.map(c => candleSchema.parse(c)).sort((a, b) => a.time.localeCompare(b.time));
  if (new Set(cs.map(c => c.time)).size !== cs.length) throw new Error('Duplicate dates: resolve duplicates before importing.');
  if (!cs.length) throw new Error('No candle records.'); return cs;
}
export const freshness = (d: Dataset) => d.provenance.synthetic ? 'Synthetic teaching data' : `Historical · ${d.provenance.originalTimestamp} · not a live quote`;
