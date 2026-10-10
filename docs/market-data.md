# Four approved solutions

| Solution | Current role | Data boundary |
| --- | --- | --- |
| Upstox Analytics API | Optional browser profile diagnostics and six-month daily history | User-owned read-only token; CORS/entitlement must succeed in browser |
| TradingView Widgets | Advanced stock chart, default enabled | External visual only; not a calculation input |
| TradingView Lightweight Charts | Candles, volume, SMA/EMA/Bollinger, RSI/MACD panes | Renderer only; uses fictional/imported/permitted provider candles |
| CSV/JSON import | Local OHLCV and simplified financial statement datasets | User supplies data, units, scope and provenance |

There are no other market-data API integrations. NSE, BSE, SEBI, NISM, company reports and Varsity are research references, not automated feeds.

Never substitute synthetic data for a missing real-company observation. DemoCo is fictional. Company roster names/symbols/ISINs are reference selections; live prices, market caps and statements are not asserted from those identifiers. Widgets can have delays, unsupported symbols, exchange restrictions or blockers. Their iframe content is not harvested.

Historical freshness is displayed with latest record and retrieval/import timestamp. Historical is never called live. Reporting scope and units must match before comparisons. Adjustments are source-declared; this release does not automatically apply splits/dividends. Indicator windows require warm-up and input validation.

Source review: 10 October 2026. Upstox official token documentation states free, read-only, one-year, one token per account; market-data/fundamentals categories do not require a static IP. This server/laptop statement is not a browser CORS guarantee. Provider terms and data redistribution permissions need user/provider review before any sharing beyond this personal browser workspace. No claim of public redistribution rights is made.
