# Existing GitHub Pages deployment

Repository: https://github.com/aswinjose-web/StockTradingRampUp

Published URL: https://aswinjose-web.github.io/StockTradingRampUp/

Initial inspection on 10 October 2026 confirmed `build_type: legacy`, source branch `main`, path `/docs`, HTTPS enforced and existing `pages-build-deployment` workflow. Main contained bootstrap commit `7a868df`. These settings are preserved. No new repository, domain or Pages action deployment mode is introduced.

## Publish

1. Inspect git status and remote changes.
2. Install lockfile dependencies, typecheck and run unit/browser tests.
3. Build with Vite. Base must stay `/StockTradingRampUp/`; output is `docs`.
4. Inspect the source and generated diff. Commit source plus generated output and samples.
5. Push through the configured connection, without force.
6. Check the existing Pages workflow conclusion for the exact pushed commit.
7. Inspect real deployed HTML, request its referenced assets, exercise hash routes, refresh, back/forward and the credential-free default.

The separate `Validate Market Lab` workflow checks code/tests/source-to-output consistency; it does not replace the Pages workflow. CI failing does not automatically prevent the legacy Pages deployment, so local passing checks are mandatory before push.

## Routing and assets

Deep routes are `/#/academy/...`, `/#/research` and similar. Their fragment never creates a missing server path. Browser back/forward works through HashRouter. All assets and samples use Vite's repository base, not `/`. Plain deep links without the hash are not supported.

`emptyOutDir:false` preserves Markdown and unrelated material in `docs`. Retain previous hashed build chunks during normal releases so already-open clients with a cached old index can still load lazy modules. Do not recursively delete the publish folder. Future asset pruning should identify only old generated chunks, keep recent generations and verify no deployed/cached index references them.

See validation.md for release-specific build/test/deployment observations. Never describe a deployment as verified based only on a successful push.
