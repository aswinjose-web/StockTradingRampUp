export const defaults = {
  schemaVersion: 1, name: "Aswin's Market Lab", tagline: 'Learn · Experiment · Analyze · Invest',
  currency: 'INR', exchange: 'NSE', secondaryExchange: 'BSE', timezone: 'Asia/Kolkata',
  theme: 'system' as const, level: 'Beginner', path: 'Comprehensive', lesson: 'introduction-to-investing',
  capital: 100000, timeframe: 'Daily', indicators: { sma: [20, 50, 200], rsi: 14, macd: [12, 26, 9], bollinger: [20, 2] },
  integrations: { tradingview: true, lightweight: true, imports: true, upstox: false },
};
