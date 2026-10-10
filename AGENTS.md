# Aswin's Market Lab — maintainer instructions

This is Aswin's personal Indian stock market learning/research app. Branding is Aswin's Market Lab; repository stays `aswinjose-web/StockTradingRampUp`; URL stays https://aswinjose-web.github.io/StockTradingRampUp/.

## Inspect before editing

Read README and docs/limitations.md. Inspect git status, origin, branches, recent commits and Pages settings. Preserve unrelated files and user changes. Never force-push or rewrite history. Reuse the existing `main:/docs` Pages source unless the user explicitly changes the deployment strategy.

## Architecture

React/strict TypeScript/Vite. `src/App.tsx` composes the shell and lazy routes. HashRouter is essential for static Pages refresh. `vite.config.ts` base is `/StockTradingRampUp/`, output `docs`, `emptyOutDir:false` to preserve unrelated documentation. `public` contains synthetic templates. CSS variables drive system/light/dark themes. Route feature code is under `src/pages`; reusable visuals under `src/components`.

- Defaults: `src/config/defaults.ts`, schema version 1.
- User preference schema/context: `src/state/store.tsx`.
- Curriculum and quizzes: `src/content/curriculum.ts` (36 lessons, three per level).
- Pure calculations: `src/engines/finance.ts`, `indicators.ts`, `portfolio.ts`.
- Runtime market schemas and imports: `src/data/schema.ts`, `importer.ts`.
- IndexedDB datasets: `src/data/database.ts` and `useDatasets.ts`.
- Deterministic fictional prices/roster: `src/data/synthetic.ts`.
- Read-only provider adapter: `src/providers/upstox.ts`.
- AES-GCM credential vault: `src/security/vault.ts`.

## Four integration boundary

Only Upstox Analytics API, TradingView Widgets, TradingView Lightweight Charts and CSV/JSON imports are approved. Do not add another market-data service. Widget internals must never be scraped. Lightweight Charts is not a provider. All fabricated scenarios must be labelled synthetic and belong to DemoCo, not real company histories. Missing observations stay unavailable. Units, periods, identifiers, source and retrieval/observation dates must remain visible. Do not combine incompatible sectors or quarterly/annual EPS silently.

Upstox profile and historical candles are implemented; extended fundamentals UI/schema normalisation is not. Check the current official docs before extending endpoints. Browser connectivity needs actual authenticated testing from the GitHub Pages origin. HTTP 401 cannot reliably separate invalid from expired; a browser fetch TypeError cannot prove CORS specifically. Never call mocked responses live verification. Requests must be GET-only with caching/backoff, no proxy, no real order endpoints.

## Credentials and private information

The user signs in to Upstox, creates a read-only Analytics Token and enters it in their own browser. Never request tokens in chat, commit them, log them, send them in URLs, export them or access private browser storage remotely. Session mode is memory-only. Persistent mode saves only AES-GCM ciphertext with random salt/IV and PBKDF2 parameters. Passphrase is not saved. Credentials are locked after reload. Clearing/replacing credentials clears provider caches. GitHub Actions and later Codex sessions have no access to user browser tokens or private datasets. Do not store OTPs, passwords, OAuth client secrets or trading credentials.

## Curriculum and calculations

Write original, beginner-readable teaching. Every lesson includes meaning, purpose, analogy, worked example, formula/process, interactive lab, practical exercise, mistakes, research connection, knowledge check and reference. Date and verify changing rules. Tax rates are deliberately not hardcoded. Keep indicators causal: SMA/EMA warm-up, Wilder RSI/ATR, EMA-seeded MACD and population Bollinger standard deviations are explicit conventions. Keep unit and edge-case tests meaningful. Default charts include SMA20/50/200, RSI14, MACD12/26/9 and Bollinger20/2 when enough history exists.

## Validation and deployment

Run `npm run typecheck`, `npm test`, `npm run build`. Install Chromium and run `npm run test:e2e` against the dev server. Production verification must also use a built preview and actual deployed URL. Inspect screenshots desktop/mobile/light/dark; exercise route refresh/back/forward, imports and quiz persistence. `QA_OUTPUT` chooses evidence output outside committed source; `TEST_URL` selects local preview or published origin. No real token is used in automated tests.

The user has authorised implementation and deployment in this task. Build, inspect the diff and commit source plus `docs` output before pushing through existing infrastructure. CI validates but does not deploy; Pages uses its existing workflow. Check the Pages workflow conclusion for the exact commit and inspect the live HTML, assets and hash routes. Never claim success based only on push acceptance. Attach a created PR if one is used.

For future tasks, follow that session's publishing authorisation. Use `codex/` for new branches. Do not delete docs or all build assets recursively: preserve unrelated output and retain previous hashed chunks for clients using a cached index. See deployment.md for asset-retention policy.

## Future manual setup versus automation

Codex can edit repository defaults, lesson content, schemas, adapters and deployment artefacts. The user handles token generation/entry/unlock, private file selection and any required account authorisation. The setup assistant playbook documents common requests. Update limitations and verification records when capabilities change. The repository must remain understandable without this chat history.

## Checkpointing

If account usage remaining drops below 10% and completion is at risk, save `docs/progress-checkpoint.md` with actual edits, test status, Git state, running preview and concrete next steps. The user will reset and ask to resume. Do not imply an automatic reset was performed; the currently available usage tool is read-only.
