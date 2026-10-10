# Manual Analytics Token setup

Verified documentation review: **10 October 2026**. [Official Analytics Token](https://upstox.com/developer/api-documentation/analytics-token/) describes a free read-only credential valid for one year and limited to one active token per account. It supports GET requests in specified categories; market-data/fundamentals do not require a whitelisted static IP. Eligibility, account access, display/redistribution rights and browser support are not independently confirmed for your account.

1. Sign in directly at [Developer Apps](https://account.upstox.com/developer/apps).
2. Open Analytics, generate a token and record its expiry privately.
3. Open the deployed app's Settings & Integrations and paste it there.
4. Choose memory-only session or opt-in encrypted persistence with a private passphrase of at least 12 characters.
5. Test browser connectivity. The adapter calls `GET /v2/fundamentals/INE002A01018/profile` and validates `company_profile` and `sector`.
6. In Stock Research choose Upstox history and fetch daily candles. The adapter uses the documented v2 historical-candle day endpoint and validates every record.
7. Remove/replace the token in Settings; revoke through Upstox if required. Persistent credentials unlock on demand after reload.

Never provide the token to Codex, GitHub Actions, a public URL or a proxy. Codex cannot retrieve your browser credential in a future session. We do not request or place real broker orders.

## Browser diagnostics

Only an authenticated successful browser request from the deployed origin establishes that tested endpoint works there. Unit fixtures and Node/cURL are not evidence of CORS. Fetch failures cannot reliably distinguish CORS from DNS/offline/blocking; the app reports “CORS or network failure” and explains the uncertainty. 401 is “invalid or expired,” 403 authorization failure, 429 rate limited, 404 unsupported, invalid responses rejected. No false Connected state is inferred from the presence of a token.

The adapter caches per endpoint for 60 seconds, spaces requests by at least a second, and backs off at least a minute after 429. [Official limits](https://upstox.com/developer/api-documentation/rate-limiting/) list standard per-user limits; our manual request pattern is deliberately conservative. No background live polling is implemented.

## Current capability boundary

Profile test and historical UI are implemented. Official [fundamentals categories](https://upstox.com/developer/api-documentation/fundamentals/) include statements, ratios, shareholding, actions and competitors, but full UI normalisation for those schemas remains future work. The endpoint inventory is documentation, not proof of an implemented feature. Company roster supplies known ISINs; complete instrument catalogue/search and quote UI are not implemented.
