# Aswin's Market Lab

**Learn · Experiment · Analyze · Invest**

A personal, static Indian stock market learning and research workspace. It replaces the original bootstrap landing page while preserving this repository and its existing GitHub Pages infrastructure.

- Website: https://aswinjose-web.github.io/StockTradingRampUp/
- Repository: https://github.com/aswinjose-web/StockTradingRampUp

## This release

36 original lessons across 12 levels, knowledge checks, bookmarks, locally saved progress, 18 editable experiments, fictional teaching charts, imported historical/financial analysis, dataset comparisons, an evidence-based research journal, watchlists and a virtual long-only portfolio. Session-only and opt-in encrypted Analytics Tokens are supported. No mandatory account, backend, subscription or real broker execution.

Exactly four integration solutions: Upstox Analytics API (optional), TradingView Widgets (external visualisation), TradingView Lightweight Charts (renderer) and CSV/JSON imports (local data). Synthetic prices belong to fictional DemoCo, never to the selected listed company. See [limitations](docs/limitations.md) for intentionally incomplete advanced provider features.

## Run locally

Use Node 24 LTS and npm 10 or newer.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Development URL: http://127.0.0.1:5173/StockTradingRampUp/. Vite builds to `docs/`. Hash routing supports refresh and back/forward at the repository base path. Keep production output committed: GitHub Pages still publishes `main:/docs` using the existing Pages build workflow. The separate validation workflow does not change Pages configuration.

## Data and privacy

Lightweight preferences live in LocalStorage; datasets live in IndexedDB. Workspace exports exclude credentials and datasets. Private imports never enter GitHub or our own server. TradingView and optional Upstox requests contact their providers. Google Fonts is an optional presentation request; local fallbacks keep the app usable if unavailable.

Never paste credentials into chat or commit them. Enter an Analytics Token only in Settings in your own browser. Actual authenticated Upstox CORS and endpoint entitlement remain unverified until a user-owned token is tested on the deployed origin. A mocked response is not verification.

## Documentation

[Architecture](docs/architecture.md) · [Configuration](docs/configuration.md) · [Future setup assistant](docs/setup-assistant.md) · [Imports](docs/data-import.md) · [Market data](docs/market-data.md) · [Upstox](docs/upstox-setup.md) · [TradingView](docs/tradingview-setup.md) · [Privacy](docs/privacy-security.md) · [Curriculum](docs/curriculum.md) · [Deployment](docs/deployment.md) · [Roadmap](docs/roadmap.md)

Educational research and simulation only. All model outputs depend on assumptions; uncertain returns are not guaranteed.
