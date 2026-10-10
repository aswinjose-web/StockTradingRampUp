# Release validation — 10 October 2026

## Environment and identity

Original repository/Pages source inspected: main at7a868df, legacy main:/docs, unchanged StockTradingRampUp URL. React/strict TypeScript/Vite output retains `/StockTradingRampUp/`. Unit tests run on Node24; browser verification uses Chromium via Playwright plus an in-app browser review. Local dev at127.0.0.1:5173; production-preview at127.0.0.1:4173. Desktop1440×1000 and mobile390×844 tested. The standalone Browser skill is absent; the available in-app browser was used for manual inspection, while the user-requested Playwright suite provides reproducible automation.

## Calculation, storage and security evidence

Strict TypeScript passed. Production build passed. All27 Vitest tests passed. Independent fixtures check compounding, month-end SIP, real returns, CAGR, positive-denominator ratios, position sizing, drawdown and option expiry P/L. Indicators verify known SMA/EMA/RSI/MACD/Bollinger/ATR values, warm-up and no future-bar effects. Imports validate mapping, date sorting, duplicate rejection, empty values and inconsistent candles. Portfolio tests verify fees, average-cost basis, overselling and insufficient cash. Vault tests verify roundtrip, random salt/IV, wrong passphrases and tampered ciphertext. Versioned personal schemas and quiz scoring are checked. Provider tests are explicitly fixtures, not live authentication.

## Browser interaction evidence

The full production suite includes16 browser tests: onboarding/preferences, knowledge-check/completion/bookmark refresh, all36 lesson pages, all18 lab routes, order fills and calculator changes, CSV import/IndexedDB reopen, malformed JSON rejection, journal save/edit, paper accounting, credential persistence/unlock/removal, desktop/mobile navigation and dark mode, financial import/comparison/source honesty/chart controls, JSON import/workspace backup boundaries, blocked-widget fallbacks, mobile overflow on all routes and actual external widget observations. Runtime checks reject unhandled page errors, framework overlays and the application error boundary.

The deterministic dev round passed15/15 with the separate external observation test disabled by design. The final production-preview round passed16/16, including six actual BSE widget observations. Published-origin results are recorded below after deployment.

## Widget validation and corrections

An initial iframe/canvas presence check was insufficient: actual in-app browser inspection showed NSE:RELIANCE's external widget says the symbol is only available on TradingView. The official FAQ and Asia-Pacific market list confirm the restriction and BSE end-of-day availability. The app now explicitly labels BSE visualisation fallback while preserving the NSE research selection; values are not used by our own calculations.

Six-company BSE observations (RELIANCE, TCS, INFY, HDFCBANK, ICICIBANK, ITC) show rendered charts without the observed unsupported-symbol state. Screenshot review confirms actual plotted bars, not just an iframe. A duplicate empty mount and autosize-height problem were fixed. Rapid navigation also exposed an asynchronous official embedding-script error. Direct use of its observed official cross-origin iframe URL isolates provider JavaScript and removes that lifecycle race. Blocked external-frame testing proves the no-credential educational fallback stays usable. Widget market observations are not live API data verification or rights to redistribute observations.

## Visual review ledger

Image Gen reference path is documented in design-system.md. It was viewed alongside actual Playwright screenshots using image inspection. Native-sized comparison is approximately1440×1000 versus1505×1045 concept; mobile390×844 additionally inspected.

| Comparison point | Result / repair |
| --- | --- |
| Layout | Sidebar, workspace bar, mint lesson banner, progress strip, chart/research columns and provider strip preserved |
| Typography | Serif greeting and lesson emphasis with sans UI; small dashboard text enlarged for readability |
| Palette | White surfaces, cool near-white workspace, navy text, forest green and pale mint retained; no media overlays |
| Container/spacing | Thin borders, modest radii, restrained panel system; mobile forms and tables remain usable |
| Icons | Lucide outline family retained; responsive button cascade fixed so mobile buttons hide on desktop |
| Real state | Inputs change chart/calculator outputs; quiz/bookmark/note/import/trade changes persist as documented |
| Responsive | Drawer closes after navigation; mobile route document widths fit390px; light/dark both checked |

Above-fold copy differences are intentional: current-time greeting, explicit hypothetical returns, company reference labels instead of implied prices, optional setup invitation, and truthful provider states. Company logos are replaced with neutral initials. These preserve the chosen visual hierarchy while meeting source honesty. No unresolved material layout defects are recorded after repairs; this is a faithful implementation of the visual direction with the documented functional differences, not pixel-identical generated text.

## Unverified boundaries

No user-owned token was available. Genuine authenticated Upstox browser CORS, token eligibility, entitlement, quote/fundamentals coverage and personal display rights remain unverified. Only read-only profile/history UI is implemented; advanced endpoint normalisation is roadmap work. Chromium is tested; other engines/devices are not. Historical adjustment status is source-declared. Full derivative/backtesting/tax engines and additional import schemas are documented limitations.

## Release and deployment

Implementation commit: `ff583950a5175348e6fdf466a0810d92378ba0d7`. Published release commit: `38ad82b5a58b4945899c7ada84b9675cd603a957` (preserves the optional validation workflow as a template). The existing [Pages run 38009058991](https://github.com/aswinjose-web/StockTradingRampUp/actions/runs/38009058991) completed successfully for that exact release commit. Pages remains main:/docs at [the original URL](https://aswinjose-web.github.io/StockTradingRampUp/).

The full published-origin Chromium suite passed **16/16** in approximately1.4 minutes. This repeats all listed browser flows in clean browser contexts against GitHub Pages, including deep hash routes, refresh and back/forward, credential-free learning, imports and persisted progress. Six external BSE widgets rendered without the observed unsupported-symbol state at2026-10-10T00:27:54Z–00:28:31Z. No user-owned credential was used.

Independent HTTP/byte verification checked the published index and29 recursively referenced application assets: all30 requests returned200 and matched the locally tested production output (HTML line endings normalised; asset SHA-256 exact). Entry bundle: `assets/index-euktyelO.js`, SHA-256 `7522e04502368d863156668dc9ae58bcfbe32ec8d527af055d6f0779fa104f3a`. The in-app browser separately displayed the published dashboard and was left open on it. Desktop1440×1000 and mobile390×844 screenshots were reviewed; material visual results match the ledger above.

Local evidence directory: `C:/Users/aswin/.codex/visualizations/2026/10/09/01a122fc-caa1-7b61-aa15-e60f2e1a3540/published`. Files include dashboard-desktop.png, dashboard-mobile-dark.png, research-educational.png, six widget screenshots, widget-diagnostics.json and asset-verification.json. Evidence is kept outside the source repository.

Additional validation CI was **not activated or run**. GitHub rejected the first push because the connected OAuth credential lacks workflow scope. The ready-to-enable template is saved at docs/ci/validate.yml; moving it to .github/workflows requires an authorised credential with that permission. Local and live tests above are the validation evidence. The existing Pages workflow ran successfully, and deployment was verified independently of push acceptance.
