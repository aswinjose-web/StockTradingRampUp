# Architecture

The browser is the application host. Vite compiles React/TypeScript into the existing `docs` publishing folder. There is no backend, authentication service, database subscription or server process at runtime.

`App` owns navigation, optional onboarding and an error boundary. Route code and charts are lazy-loaded. Financial functions, educational content, provider I/O, credentials and persistence are independent modules. CSS variables provide coherent responsive light/dark views. Plain React rendering escapes imported and note text; no raw HTML/Markdown execution is used.

## Storage

`market-lab:personal` LocalStorage stores version-1 typed preferences, progress, quiz scores, watchlist, notes, checklist and virtual ledger. Invalid records fall back to defaults. There is no pre-app schema to migrate; future schema changes must add explicit migration/validation and preserve useful old records. `market-lab:vault` stores only opt-in encrypted credentials. Token and passphrase are never included in personal exports.

IndexedDB `aswin-market-datasets`, version 1, stores datasets under the `datasets` object store. Dataset imports are validated before saving and again when reading. Financial datasets and price datasets have separate kinds and visible provenance. Compatible identifiers may link supplied financials to an imported price series; users must check timing and accounting conventions. Private datasets never become repository files automatically.

## Integrations

Widgets are external chart visualisation; no programmatic access to their observations is attempted. Lightweight Charts renders our data and supplies no prices. Upstox requests originate in the user browser and are read-only; no mandatory proxy exists. Imports are the robust fallback when API or widgets are unavailable. Core lessons/calculators function without any external data request.

## Maintainability

Feature modules contain page-specific forms; primitives share controls and notices. Pure math modules are unit-tested. Stateful workflows have browser tests. Static `HashRouter` navigation keeps deep links on the same HTML resource and preserves back/forward. A source-to-output CI check is prepared in docs/ci/validate.yml, awaiting workflow permission to activate. See limitations.md before assuming all requested advanced features are present.
