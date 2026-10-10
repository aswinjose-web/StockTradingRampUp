import { describe, it, expect, beforeEach, vi } from 'vitest';
import { compound, sip, realReturn, cagr, ratio, positionSize, maximumDrawdown, callPayoff, putPayoff } from '../src/engines/finance';
import { sma, ema, rsi, macd, bollinger, atr, returns, volatility, momentum, drawdowns } from '../src/engines/indicators';
import { parseFile, importRecords } from '../src/data/importer';
import { normalizeCandles } from '../src/data/schema';
import { encryptToken, decryptToken } from '../src/security/vault';
import { portfolio, type Trade } from '../src/engines/portfolio';
import { personalSchema, freshPersonal, scoreQuiz } from '../src/state/store';
import { lessons, levels } from '../src/content/curriculum';
import { testConnectivity, upstoxGet, clearProviderCache } from '../src/providers/upstox';
const candle = { time: '2024-01-01', open: 100, high: 110, low: 95, close: 106, volume: 1000 };
describe('financial calculations and edge cases', () => {
  it('compounds on the growing base', () => { expect(compound(10000, 10, 2)).toBeCloseTo(12100); expect(compound(10000, 0, 10)).toBe(10000); });
  it('uses month-end SIP contributions and handles zero rate', () => { expect(sip(1000, 0, 1)).toBe(12000); expect(sip(1000, 12, 1)).toBeCloseTo(Array.from({ length: 12 }, (_, i) => 1000 * 1.12 ** (i / 12)).reduce((a, b) => a + b), 7); });
  it('computes real growth and CAGR', () => { expect(realReturn(8, 6)).toBeCloseTo(1.88679); expect(cagr(100, 121, 2)).toBeCloseTo(10); expect(cagr(0, 10, 2)).toBeNull(); });
  it('does not fabricate ratios with zero or negative denominators', () => { expect(ratio(150, 10)).toBe(15); expect(ratio(150, 0)).toBeNull(); expect(ratio(150, -10)).toBeNull(); });
  it('caps risk-based sizing by affordability and rejects inverted stop', () => { expect(positionSize(100000, 1, 100, 95)).toBe(200); expect(positionSize(1000, 100, 100, 99)).toBe(10); expect(positionSize(1000, 1, 100, 110)).toBe(0); });
  it('calculates drawdown and option expiry P/L', () => { expect(maximumDrawdown([100, 120, 60, 90])).toBe(-50); expect(callPayoff(115, 100, 8)).toBe(7); expect(putPayoff(85, 100, 8)).toBe(7); expect(callPayoff(90, 100, 8)).toBe(-8); });
});
describe('causal indicators with explicit warm-up', () => {
  it('SMA rolls without future information', () => { expect(sma([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]); expect(sma([1, 2, 3, 999], 3).slice(0, 3)).toEqual(sma([1, 2, 3], 3)); expect(() => sma([1], 0)).toThrow(); });
  it('EMA is SMA-seeded', () => { expect(ema([1, 2, 3, 4], 3)).toEqual([null, null, 2, 3]); expect(ema([1, 2], 3)).toEqual([null, null]); });
  it('RSI uses Wilder smoothing and handles flat, up and down histories', () => { expect(rsi(Array.from({ length: 20 }, () => 5), 14).at(-1)).toBe(50); expect(rsi(Array.from({ length: 20 }, (_, i) => i + 1), 14).at(-1)).toBe(100); expect(rsi(Array.from({ length: 20 }, (_, i) => 30 - i), 14).at(-1)).toBe(0); expect(rsi([1, 2], 14)).toEqual([null, null]); expect(rsi([10, 11, 10, 12], 2)[3]).toBeCloseTo(83.333333); });
  it('MACD seed and signal have known values on an arithmetic trend', () => { const x = Array.from({ length: 60 }, (_, i) => i + 1), m = macd(x); expect(m.line[24]).toBeNull(); expect(m.line[25]).toBeCloseTo(7); expect(m.signal[32]).toBeNull(); expect(m.signal[33]).toBeCloseTo(7); expect(m.histogram[33]).toBeCloseTo(0); });
  it('Bollinger Bands use population standard deviation', () => { const b = bollinger([1, 2, 3], 3, 2); expect(b.middle[2]).toBe(2); expect(b.upper[2]).toBeCloseTo(2 + 2 * Math.sqrt(2 / 3)); expect(b.lower[2]).toBeCloseTo(2 - 2 * Math.sqrt(2 / 3)); });
  it('ATR incorporates gaps and Wilder smoothing', () => { const cs = [{ ...candle, high: 110, low: 100, close: 105 }, { ...candle, time: '2024-01-02', open: 119, high: 120, low: 118, close: 119 }, { ...candle, time: '2024-01-03', open: 119, high: 123, low: 117, close: 122 }]; expect(atr(cs, 2)).toEqual([null, 12.5, 9.25]); });
  it('returns, momentum, drawdowns and annualisation conventions are explicit', () => { expect(returns([100, 110])[1]).toBeCloseTo(10); expect(momentum([1, 2, 3], 2)).toEqual([null, null, 2]); expect(drawdowns([100, 80, 120])).toEqual([0, expect.closeTo(-20), 0]); expect(volatility(Array(30).fill(100), 20).at(-1)).toBe(0); });
});
describe('import validation and normalisation', () => {
  it('reads CSV quoted values and JSON arrays', () => { expect(parseFile('time,open\n2024-01-01,"1,000"', false)[0].open).toBe('1,000'); expect(parseFile('[{"time":"2024-01-01"}]', true)).toHaveLength(1); expect(() => parseFile('{"x":1}', true)).toThrow(); });
  it('sorts, rejects duplicates and rejects malformed OHLC', () => { expect(normalizeCandles([{ ...candle, time: '2024-01-02' }, candle])[0].time).toBe('2024-01-01'); expect(() => normalizeCandles([candle, candle])).toThrow(/Duplicate/); expect(() => normalizeCandles([{ ...candle, high: 99 }])).toThrow(); expect(() => normalizeCandles([{ ...candle, time: '2024-02-30' }])).toThrow(); });
  it('maps source columns and preserves provenance', () => { const d = importRecords([{ date: candle.time, O: '100', H: '110', L: '95', C: '106', V: '1,000' }], { time: 'date', open: 'O', high: 'H', low: 'L', close: 'C', volume: 'V' }, { name: 'sample', symbol: 'nse:infy', exchange: 'NSE', kind: 'ohlcv', adjusted: false, synthetic: true, source: 'Test source' }); expect(d.candles[0].volume).toBe(1000); expect(d.provenance.symbol).toBe('INFY'); expect(d.provenance.synthetic).toBe(true); });
  it('does not silently treat an empty field as zero', () => { expect(() => importRecords([{ ...candle, volume: '' }], Object.fromEntries(Object.keys(candle).map(k => [k, k])), { name: 'bad', symbol: 'DEMO', exchange: 'NSE', kind: 'ohlcv', adjusted: false, synthetic: true, source: '' })).toThrow(/missing/); });
});
describe('encrypted local credentials', () => {
  it('round trips without plaintext and fails on wrong passphrase or altered ciphertext', async () => { const v = await encryptToken('fictional-token-for-testing', 'a long test passphrase'); expect(JSON.stringify(v)).not.toContain('fictional-token'); expect(await decryptToken(v, 'a long test passphrase')).toBe('fictional-token-for-testing'); await expect(decryptToken(v, 'wrong passphrase')).rejects.toThrow(/unlock/); const bytes = atob(v.ciphertext); const modified = btoa(String.fromCharCode(bytes.charCodeAt(0) ^ 1) + bytes.slice(1)); await expect(decryptToken({ ...v, ciphertext: modified }, 'a long test passphrase')).rejects.toThrow(); });
  it('uses new salt and IV for each encryption', async () => { const a = await encryptToken('t', 'a long test passphrase'), b = await encryptToken('t', 'a long test passphrase'); expect(a.iv).not.toBe(b.iv); expect(a.salt).not.toBe(b.salt); });
});
describe('portfolio accounting', () => {
  const t: Trade = { id: '1', date: '2024-01-01', symbol: 'DEMO', side: 'buy', quantity: 10, price: 100, costs: 10, note: '', source: 'synthetic' };
  it('includes buy fees in cost basis and sell fees in realised return', () => { const p = portfolio(2000, [t, { ...t, id: '2', side: 'sell', quantity: 5, price: 120, costs: 5 }]); expect(p.cash).toBe(1585); expect(p.realized).toBe(90); expect(p.holdings[0]).toEqual({ symbol: 'DEMO', quantity: 5, cost: 505 }); });
  it('rejects overselling and spending beyond cash', () => { expect(() => portfolio(500, [t])).toThrow(/cash/); expect(() => portfolio(2000, [{ ...t, side: 'sell' }])).toThrow(/sell/); });
});
describe('curriculum and saved schema', () => {
  it('has 12 levels, 36 distinct substantial lessons and usable checks', () => { expect(levels).toHaveLength(12); expect(lessons).toHaveLength(36); expect(new Set(lessons.map(l => l.id)).size).toBe(36); for (let level = 1; level <= 12; level++) expect(lessons.filter(l => l.level === level)).toHaveLength(3); lessons.forEach(l => { const teaching = [l.meaning, l.why, l.analogy, l.example, l.exercise, l.mistake, l.research, l.explanation].join(' '); expect(teaching.split(/\s+/).length, l.title).toBeGreaterThan(200); expect(l.options[l.answer]).toBeTruthy(); expect(l.exercise.length).toBeGreaterThan(50); }); });
  it('scores accurately and validates versioned personal data', () => { expect(scoreQuiz([0, 1], [0, 2])).toBe(50); expect(scoreQuiz([], [])).toBe(0); expect(personalSchema.parse(freshPersonal()).capital).toBe(100000); expect(personalSchema.safeParse({ ...freshPersonal(), version: 99 }).success).toBe(false); });
});
describe('read-only provider fixtures (not live verification)', () => {
  beforeEach(() => { clearProviderCache(); vi.restoreAllMocks(); });
  it('rejects absent credentials and trading endpoints', async () => { await expect(upstoxGet('/orders', 'fixture')).rejects.toMatchObject({ status: 'Unsupported endpoint' }); await expect(testConnectivity('')).rejects.toMatchObject({ status: 'Not configured' }); });
  it('validates profile responses instead of trusting a success string', async () => { vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ status: 'success', data: { company_profile: 'fixture business', sector: 'Test' } }), { status: 200 })); expect((await testConnectivity('fixture')).sector).toBe('Test'); });
  it('reports auth failure honestly', async () => { vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 401 })); await expect(testConnectivity('fixture')).rejects.toMatchObject({ status: 'Invalid or expired credential' }); });
  it('does not call a blocked browser request connected', async () => { vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch')); await expect(testConnectivity('fixture')).rejects.toMatchObject({ status: 'CORS or network failure' }); });
});
