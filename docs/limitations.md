# Honest release boundaries

The release prioritises a usable, integrated credential-free learning/research environment. It does not claim every advanced item in the master brief is finished.

- 36 complete original lessons, three per level, each with a knowledge check and linked editable demonstration. No adaptive prerequisite system or multi-question assessment bank; level/path are preferences, not adaptive assignments.
- 18 experiments cover the requested16 plus drawdown and long-option expiry payoff. Presets are included where meaningful; not every tool has a multi-preset selector. No full historical strategy backtesting engine, Greeks pricing model or DCF valuation engine.
- OHLCV and simplified financial statements have mapped CSV/JSON imports with IndexedDB. Standalone shareholding, action, arbitrary ratio, journal CSV and portfolio CSV imports are future work. Workspace JSON can restore notes and trades.
- Fundamentals include revenue/profit tables, simplified EPS, margin, year-end equity return, debt ratio and simple FCF. Missing market cap, P/B, ROCE, dividends, shareholding, corporate actions and complete competitor datasets remain unavailable.
- Company roster is limited to eight reference selections. It is not complete instrument lookup. BSE/NSE identifiers share ISIN reference values but widget/provider symbol availability must be checked individually.
- Upstox profile connectivity and daily history adapter are implemented. Genuine authenticated browser CORS, account eligibility, endpoint permissions and data-display rights have not been established without a user-owned token. Extended fundamentals adapter inventory is not full integration. No raw token is needed for development.
- NSE symbols are restricted in TradingView external widgets (observed in-browser and confirmed by official FAQ/market listing). A clearly labelled BSE end-of-day widget fallback is used for the same company. The selected research exchange remains NSE; BSE chart data is not silently mixed into NSE calculations. Script/iframe availability alone does not establish valid market data. External delays/restrictions remain visible within TradingView. No scraping or hidden data calculations are attempted.
- Daily history only; no intraday aggregation/timeframe resampling. Indicator display range uses its own warm-up, while summary statistics use the full supplied series. Historical adjustment status is source-declared, not repaired automatically.
- Paper trading is long-only and uses historical or fictional scenarios, average-cost accounting, user-defined flat costs and adverse slippage. It excludes taxes, actual brokerage schedules, derivatives, shorting, margin, corporate actions and real orders. Session scenario marks default to cost basis after reload. Its accounting curve is explicitly not a mark-to-market backtest.
- LocalStorage/IndexedDB are browser-specific; no cloud sync or guaranteed recovery after browser data removal. Schema version1 rejects incompatible backups. Future releases need explicit migrations.
- Time-sensitive tax rates, settlement cycles and derivatives contract sizes are not hardcoded. Users must consult current official product/year guidance.
- Test browser coverage is Chromium. Cross-browser and real-device coverage remain future work. Fonts and widgets need external connectivity, but core functionality uses local fallbacks.

See validation.md for actual results and unverified checks. Missing data is never fabricated to satisfy a feature checklist.
