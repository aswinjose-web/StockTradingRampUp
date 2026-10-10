import type { Candle, Dataset } from './schema';
// Deterministic, invented path. Never company price history.
export function syntheticCandles(seed = 1): Candle[] {
  let prev = 100 + seed * 10; const cs: Candle[] = [];
  for (let i = 0; i < 300; i++) {
    const date = new Date(Date.UTC(2024, 0, 1 + i));
    if ([0, 6].includes(date.getUTCDay())) continue;
    const open = prev, close = Math.max(10, open + Math.sin(i * .51 + seed) * 2.4 + Math.cos(i * .13) * 1.2 + .12);
    cs.push({ time: date.toISOString().slice(0, 10), open, high: Math.max(open, close) + 1.8, low: Math.min(open, close) - 1.5, close, volume: 100000 + Math.round(Math.abs(Math.sin(i)) * 80000) }); prev = close;
  } return cs;
}
export const teachingDataset: Dataset = {
  version: 1, id: 'synthetic-teaching', name: 'DemoCo · synthetic teaching series', kind: 'ohlcv',
  provenance: { provider: 'Bundled educational generator', symbol: 'DEMOCO', exchange: 'NSE', currency: 'INR', units: 'INR; shares', retrievedAt: '2026-10-10T00:00:00.000Z', originalTimestamp: '2024-10-25', adjusted: false, synthetic: true, description: 'Invented prices and statements for a fictional business. Not historical NSE data.' },
  candles: syntheticCandles(),
  fundamentals: [
    { period: 'FY2023 consolidated', revenue: 10000000, netProfit: 1000000, equity: 5000000, debt: 2000000, operatingCashFlow: 1200000, capex: 400000, shares: 100000 },
    { period: 'FY2024 consolidated', revenue: 12000000, netProfit: 1500000, equity: 6000000, debt: 1800000, operatingCashFlow: 1600000, capex: 500000, shares: 100000 },
  ],
};
export const companies = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Diversified', isin: 'INE002A01018' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT services', isin: 'INE467B01029' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT services', isin: 'INE009A01021' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', isin: 'INE040A01034' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', isin: 'INE090A01021' },
  { symbol: 'ITC', name: 'ITC', sector: 'Consumer', isin: 'INE154A01025' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer', isin: 'INE030A01027' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Engineering', isin: 'INE018A01030' },
];
