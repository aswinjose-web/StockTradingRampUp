# Development checkpoint

Checkpoint: 10 October 2026, Asia/Kolkata. The working release is published and verified; resume future work from this repository and its recorded limitations.

## Completed release

React/TypeScript/Vite app: 36 original lessons across 12 levels, 18 editable labs, quizzes/progress/bookmarks, research and comparison, CSV/JSON OHLCV and simplified financial imports, local notes/watchlists, virtual long-only portfolio, optional onboarding, themes, backups and opt-in encrypted Analytics Tokens. Documentation and synthetic sample files are complete. Advanced boundaries are listed in limitations.md; they are not silently represented as finished.

Strict type checking, production build and all 27 unit tests pass. Deterministic dev browser round passed 15 tests; production-preview and actual GitHub Pages rounds each passed all 16, including six real BSE widget observations. All 30 checked live resources (index plus 29 reachable assets) returned 200 and matched production files. Desktop/mobile/light/dark and a separate in-app browser review completed. Genuine authenticated Upstox remains unverified without a user-owned token.

## Git and deployment

Original main: 7a868df16e15ad1579851dc10204666339ad1b92.
Implementation: ff583950a5175348e6fdf466a0810d92378ba0d7.
Validated published release: 38ad82b5a58b4945899c7ada84b9675cd603a957.
Pages success: https://github.com/aswinjose-web/StockTradingRampUp/actions/runs/38009058991.
Origin: https://github.com/aswinjose-web/StockTradingRampUp.git.
Website: https://aswinjose-web.github.io/StockTradingRampUp/.
Existing legacy Pages main:/docs retained. No new repository/domain and no force push. A subsequent documentation-only commit records this evidence; inspect git log for its identity. Working tree should be clean after recording.

GitHub rejected the original workflow-adding push: OAuth credential lacks workflow scope. The application successfully published after preserving the workflow at docs/ci/validate.yml as an inactive template. Additional validation CI has not run. Existing Pages deployment has run successfully. Future authorised account access with workflow permission can activate the template.

## Next work

No application development or release validation is pending for the current working release. See roadmap.md: user-owned Upstox token setup and real browser diagnostics, expanded financial adapters/import types, full dataset backup, proper historical backtesting and broader browser coverage. Read AGENTS.md, README.md, limitations.md and git status before future edits. Reuse existing repository/URL and four integration boundary. Never read browser-owned private credentials or datasets remotely.

## Local tools and evidence

Node: C:/Users/aswin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
Git: C:/Users/aswin/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe
gh: C:/Program Files/GitHub CLI/gh.exe

Windows Vite requires approved unsandboxed execution. Playwright browsers: workspace node_modules/.cache/playwright. TEST_URL selects deployed/preview origin; QA_OUTPUT selects evidence outside source. Evidence: C:/Users/aswin/.codex/visualizations/2026/10/09/01a122fc-caa1-7b61-aa15-e60f2e1a3540/published. See validation.md for details. Temporary server sessions may have been stopped at handoff; check ports before running new servers.

## Usage policy

User requests a reset only below 10% remaining and completion at risk; otherwise save progress if automatic reset is unavailable. Latest pre-publication check: 48% five-hour and 92% weekly remaining. No reset consumed. Progress is stored here regardless, for future continuation.
