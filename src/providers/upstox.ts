import { z } from 'zod';
import { datasetSchema, normalizeCandles, type Dataset } from '../data/schema';
export type ProviderStatus = 'Not configured' | 'Token locked' | 'Invalid or expired credential' | 'Authorization failure' | 'CORS or network failure' | 'Rate limited' | 'Unsupported endpoint' | 'Missing stock data' | 'Connected and verified' | 'Invalid response';
export class ProviderError extends Error { constructor(public status: ProviderStatus) { super(status); } }
const cache = new Map<string, { at: number; value: unknown }>();
let lastRequest = 0, blockedUntil = 0;
export async function upstoxGet(path: string, token: string): Promise<unknown> {
  if (!token) throw new ProviderError('Not configured');
  if (!/^\/(market-quote\/quotes\?|historical-candle\/|fundamentals\/)/.test(path)) throw new ProviderError('Unsupported endpoint');
  if (Date.now() < blockedUntil) throw new ProviderError('Rate limited');
  const key = path, hit = cache.get(key); if (hit && Date.now() - hit.at < 60000) return hit.value;
  const wait = Math.max(0, 1000 - (Date.now() - lastRequest)); if (wait) await new Promise(resolve => setTimeout(resolve, wait)); lastRequest = Date.now();
  let response: Response;
  try { response = await fetch(`https://api.upstox.com/v2${path}`, { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000), credentials: 'omit', referrerPolicy: 'no-referrer' }); }
  catch { throw new ProviderError('CORS or network failure'); }
  if (response.status === 401) throw new ProviderError('Invalid or expired credential');
  if (response.status === 403) throw new ProviderError('Authorization failure');
  if (response.status === 429) { blockedUntil = Date.now() + 60000; throw new ProviderError('Rate limited'); }
  if (response.status === 404) throw new ProviderError('Unsupported endpoint');
  if (!response.ok) throw new ProviderError('Missing stock data');
  const payload = z.object({ status: z.literal('success'), data: z.unknown() }).safeParse(await response.json());
  if (!payload.success) throw new ProviderError('Invalid response');
  cache.set(key, { at: Date.now(), value: payload.data.data }); return payload.data.data;
}
export function clearProviderCache() { cache.clear(); }
export async function testConnectivity(token: string) {
  clearProviderCache();
  const data = await upstoxGet('/fundamentals/INE002A01018/profile', token);
  return z.object({ company_profile: z.string(), sector: z.string() }).parse(data);
}
export async function fetchHistory(token: string, symbol: string, isin: string, exchange: 'NSE' | 'BSE', from: string, to: string): Promise<Dataset> {
  const key = `${exchange}_EQ|${isin}`;
  const raw = await upstoxGet(`/historical-candle/${encodeURIComponent(key)}/day/${to}/${from}`, token);
  const parsed = z.object({ candles: z.array(z.tuple([z.string(), z.number(), z.number(), z.number(), z.number(), z.number()]).rest(z.unknown())) }).parse(raw);
  const candles = normalizeCandles(parsed.candles.map(c => ({ time: c[0].slice(0, 10), open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5] })));
  return datasetSchema.parse({ version: 1, id: `upstox-${symbol}-${Date.now()}`, name: `${symbol} · Upstox history`, kind: 'ohlcv', candles, fundamentals: [], provenance: { provider: 'Upstox', symbol, exchange, currency: 'INR', units: 'INR; shares', retrievedAt: new Date().toISOString(), originalTimestamp: candles.at(-1)!.time, adjusted: false, synthetic: false, description: 'Daily provider candles; corporate-action adjustment is not assumed.' } });
}
export const fundamentalEndpoints = { profile: 'profile', balanceSheet: 'balance-sheet', cashFlow: 'cash-flow', income: 'income-statement', ratios: 'key-ratios', shareholding: 'share-holdings', actions: 'corporate-actions', competitors: 'competitors' } as const;
