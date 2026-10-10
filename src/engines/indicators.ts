import type { Candle } from '../data/schema';
export type Value = number | null;
function period(p: number) { if (!Number.isInteger(p) || p < 1) throw new Error('Period must be a positive integer.'); }
export function sma(xs: number[], p: number): Value[] {
  period(p); let sum = 0;
  return xs.map((v, i) => { sum += v; if (i >= p) sum -= xs[i - p]; return i >= p - 1 ? sum / p : null; });
}
export function ema(xs: number[], p: number): Value[] {
  period(p); let prev = 0, sum = 0; const alpha = 2 / (p + 1);
  return xs.map((v, i) => { if (i < p) sum += v; if (i < p - 1) return null; prev = i === p - 1 ? sum / p : v * alpha + prev * (1 - alpha); return prev; });
}
export function rsi(xs: number[], p = 14): Value[] {
  period(p); const out: Value[] = Array(xs.length).fill(null); let g = 0, l = 0;
  for (let i = 1; i < xs.length; i++) {
    const change = xs[i] - xs[i - 1], gain = Math.max(change, 0), loss = Math.max(-change, 0);
    if (i <= p) { g += gain / p; l += loss / p; } else { g = (g * (p - 1) + gain) / p; l = (l * (p - 1) + loss) / p; }
    if (i >= p) out[i] = l === 0 ? (g === 0 ? 50 : 100) : 100 - 100 / (1 + g / l);
  }
  return out;
}
export function macd(xs: number[], fast = 12, slow = 26, signalPeriod = 9) {
  if (fast >= slow) throw new Error('Fast period must be less than slow period.');
  const f = ema(xs, fast), s = ema(xs, slow), line = xs.map((_, i) => f[i] !== null && s[i] !== null ? f[i]! - s[i]! : null);
  const start = line.findIndex(v => v !== null), signal: Value[] = Array(xs.length).fill(null);
  if (start >= 0) ema(line.slice(start) as number[], signalPeriod).forEach((v, i) => { signal[start + i] = v; });
  return { line, signal, histogram: line.map((v, i) => v !== null && signal[i] !== null ? v - signal[i]! : null) };
}
export function bollinger(xs: number[], p = 20, deviations = 2) {
  const middle = sma(xs, p), upper: Value[] = [], lower: Value[] = [];
  middle.forEach((m, i) => {
    if (m === null) { upper.push(null); lower.push(null); return; }
    const variance = xs.slice(i - p + 1, i + 1).reduce((sum, v) => sum + (v - m) ** 2, 0) / p;
    upper.push(m + deviations * Math.sqrt(variance)); lower.push(m - deviations * Math.sqrt(variance));
  }); return { middle, upper, lower };
}
export function atr(cs: Candle[], p = 14): Value[] {
  period(p); let prev = 0, sum = 0;
  return cs.map((c, i) => {
    const tr = i === 0 ? c.high - c.low : Math.max(c.high - c.low, Math.abs(c.high - cs[i - 1].close), Math.abs(c.low - cs[i - 1].close));
    if (i < p) sum += tr; if (i < p - 1) return null;
    prev = i === p - 1 ? sum / p : (prev * (p - 1) + tr) / p; return prev;
  });
}
export const returns = (xs: number[]) => xs.map((v, i) => i > 0 && xs[i - 1] > 0 ? (v / xs[i - 1] - 1) * 100 : null);
export const momentum = (xs: number[], p = 10) => xs.map((v, i) => i >= p ? v - xs[i - p] : null);
export function volatility(xs: number[], p = 20) {
  const rs = returns(xs), result: Value[] = Array(xs.length).fill(null);
  for (let i = p; i < xs.length; i++) {
    const sample = rs.slice(i - p + 1, i + 1) as number[], mean = sample.reduce((a, b) => a + b, 0) / p;
    result[i] = Math.sqrt(sample.reduce((a, b) => a + (b - mean) ** 2, 0) / (p - 1)) * Math.sqrt(252);
  } return result;
}
export function drawdowns(xs: number[]) { let peak = 0; return xs.map(v => { peak = Math.max(peak, v); return peak > 0 ? (v / peak - 1) * 100 : 0; }); }
