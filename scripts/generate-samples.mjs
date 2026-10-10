import { mkdirSync, writeFileSync } from 'node:fs';
const dir = new URL('../public/samples/', import.meta.url);
mkdirSync(dir, { recursive: true });
let prev = 110; const candles = [];
for (let i = 0; i < 300; i++) {
  const date = new Date(Date.UTC(2024, 0, 1 + i)); if ([0, 6].includes(date.getUTCDay())) continue;
  const open = prev, close = Math.max(10, open + Math.sin(i * .51 + 1) * 2.4 + Math.cos(i * .13) * 1.2 + .12);
  candles.push({ time: date.toISOString().slice(0, 10), open: +open.toFixed(4), high: +(Math.max(open, close) + 1.8).toFixed(4), low: +(Math.min(open, close) - 1.5).toFixed(4), close: +close.toFixed(4), volume: 100000 + Math.round(Math.abs(Math.sin(i)) * 80000) }); prev = close;
}
writeFileSync(new URL('synthetic-ohlcv.json', dir), JSON.stringify(candles, null, 2));
writeFileSync(new URL('synthetic-ohlcv.csv', dir), 'time,open,high,low,close,volume\n' + candles.map(c => Object.values(c).join(',')).join('\n') + '\n');
writeFileSync(new URL('synthetic-fundamentals.csv', dir), 'period,revenue,netProfit,equity,debt,operatingCashFlow,capex,shares\nFY2023 annual consolidated,10000000,1000000,5000000,2000000,1200000,400000,100000\nFY2024 annual consolidated,12000000,1500000,6000000,1800000,1600000,500000,100000\n');
writeFileSync(new URL('README.txt', dir), 'ALL SAMPLE DATA IS SYNTHETIC. DEMOCO IS FICTIONAL.\nPrices are invented, not NSE price history. Currency INR; no lakh/crore scaling. Volume and shares are counts.\nSelect synthetic in the import wizard. Fields are documented in docs/data-import.md.\n');
console.log(`Generated ${candles.length} fictional daily OHLCV rows and financial examples.`);
