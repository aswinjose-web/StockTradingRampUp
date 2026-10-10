# Future Codex setup playbook

Begin with AGENTS.md, architecture, limitations and git state. Preserve the existing URL, base and Pages publishing folder. Repository changes can be automated; personal credentials and private file selection remain browser-side user responsibilities.

| Request | Steps |
| --- | --- |
| Set up default providers | Inspect defaults and Settings; enable widgets/imports/chart renderer; keep Upstox optional; validate without a token |
| Change the default stock | Edit roster/default selection consistently; verify exchange symbol and ISIN; do not invent prices |
| Configure Upstox | Read current official token docs; explain manual sign-in/generation/browser entry; never ask for token in chat |
| Test my connection | User runs Settings test on deployed origin; inspect sanitised status; endpoint-by-endpoint testing with user's browser interaction is required |
| Fix stock charts | Separate widget availability from local renderer/data issues; validate OHLC and dates; check console, theme, resize and teardown |
| Reset indicator defaults | Edit defaults and selected period restore behaviour; retain tests and document migration for saved overrides |
| Add a lesson | Add original complete Draft fields, a valid experiment, worked example, knowledge check and reference; verify count/inventory and UI |
| Troubleshoot imports | Reproduce with synthetic/nonprivate minimal data, inspect column mapping, units, duplicates and dates; never upload private datasets automatically |
| Check Pages | Read source settings and latest workflow run; inspect exact committed output, hash routing and deployed assets |

## Manual actions

The user signs into Upstox, generates/revokes tokens, enters/unlocks them in Settings, selects private files and handles account authorisation. Tokens in their browser are unavailable to GitHub Actions or future Codex sessions. A fixture does not configure or authenticate a real account.

## Diagnostics

Not configured → token unavailable; locked → encrypted vault exists but not unlocked; invalid/expired → HTTP401; denied → HTTP403; rate limited → HTTP429; unsupported → HTTP404; invalid response → schema did not match; CORS/network → indistinguishable fetch failure; verified → actual successful validated response for the tested endpoint. Widgets have per-view loading/script/embedding states and in-widget symbol messages. Lightweight Charts catches rendering failures and suppresses unavailable warm-up indicators. Imports validate before confirmation.

## Resume after a usage reset

Read docs/progress-checkpoint.md if present, inspect current files/commit and continue unfinished validations/deployment. Do not repeat completed implementation or claim previous unverified checks passed. The user requested a checkpoint if remaining usage drops below10% and automatic reset is unavailable.
