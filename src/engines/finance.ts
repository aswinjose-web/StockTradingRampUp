export const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
export const pct = (n: number | null) => n === null ? 'Unavailable' : `${n.toFixed(2)}%`;
export const ratio = (a: number, b: number) => b > 0 && Number.isFinite(a) && Number.isFinite(b) ? a / b : null;
export function compound(principal: number, annualPercent: number, years: number) {
  return principal * (1 + annualPercent / 100) ** years;
}
// Effective annual return converted to a monthly rate. Contributions at month end.
export function sip(monthly: number, annualPercent: number, years: number) {
  const r = (1 + annualPercent / 100) ** (1 / 12) - 1, n = Math.round(years * 12);
  return Math.abs(r) < 1e-12 ? monthly * n : monthly * ((1 + r) ** n - 1) / r;
}
export const realReturn = (nominal: number, inflation: number) => ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
export const cagr = (start: number, end: number, years: number) => start > 0 && end >= 0 && years > 0 ? ((end / start) ** (1 / years) - 1) * 100 : null;
export function positionSize(capital: number, riskPercent: number, entry: number, stop: number) {
  if (capital <= 0 || riskPercent <= 0 || riskPercent > 100 || entry <= 0 || stop < 0 || stop >= entry) return 0;
  return Math.min(Math.floor(capital * riskPercent / 100 / (entry - stop)), Math.floor(capital / entry));
}
export const callPayoff = (spot: number, strike: number, premium: number) => Math.max(spot - strike, 0) - premium;
export const putPayoff = (spot: number, strike: number, premium: number) => Math.max(strike - spot, 0) - premium;
export function maximumDrawdown(values: number[]) {
  let peak = 0, worst = 0;
  for (const v of values) { peak = Math.max(peak, v); if (peak > 0) worst = Math.min(worst, (v / peak - 1) * 100); }
  return worst;
}
