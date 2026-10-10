# Configuration

Central defaults are in `src/config/defaults.ts`. Brand, tagline, INR, NSE/BSE, Asia/Kolkata, beginner/comprehensive preference, initial lesson and ₹1,00,000 virtual capital are versioned. Do not rename the repository or change the Pages base when changing branding.

User overrides live in `src/state/store.tsx` and are validated with Zod. Settings edits profile, objective, path and theme. The initial wizard is optional. Learning paths are saved preferences; this release keeps the full 12-level curriculum accessible and does not implement adaptive prerequisite gating.

System preference follows browser light/dark changes. Widgets start enabled. Charts start daily with SMA20/50/200, EMA20, RSI14, MACD12/26/9 and Bollinger20/2. SMA/EMA period persists; range, volume and indicator visibility are per-view session choices. Unsupported/insufficient values remain unavailable.

Reset appearance restores system theme, selected period20 and widgets. Full removal clears datasets, encrypted credentials, progress and notes only after an in-app explicit confirmation. Workspace backups are parsed and ledger-checked, then replacement is confirmed. They exclude market imports and credentials. Virtual capital can change only with an empty trade ledger to preserve accounting consistency.
