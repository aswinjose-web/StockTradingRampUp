# Privacy and security

This static app has no mandatory account or backend. Preferences and notes are LocalStorage records; datasets are IndexedDB. Browser storage is local to an origin and browser profile, not a cloud backup. Clearing site data removes it. Exports are user-triggered local downloads, never automatic repository commits or uploads.

Session credentials live in React memory and clear on reload. Opt-in persistent credentials use AES-256-GCM, random 16-byte salt and 12-byte IV, PBKDF2-SHA256 at 310,000 iterations, and a user passphrase of at least 12 characters. Only ciphertext/salt/IV/version/iterations are stored. No passphrase or raw token enters LocalStorage, exports, URLs or logs. Unlocking occurs on demand. Wrong passphrases/tampered ciphertext fail authenticated decryption.

Browser encryption cannot fully protect an unlocked token from malicious same-origin scripts. TradingView provider code is isolated in a cross-origin iframe and is not loaded as JavaScript on this app's origin; choose whether to enable external visualisation. Strong, unique passphrases and a read-only token reduce impact but do not make a browser vault a hardware security boundary. Revoke a compromised token at Upstox.

Imports are size-limited, schema-validated and rendered as text through React. No executable HTML or user-defined code is imported. CSV export is not used for untrusted notes; JSON avoids spreadsheet formula execution. Unsupported/invalid records are not silently made valid. No unauthorised CORS proxies, embedded secrets, passwords, OTPs, trading PINs or broker execution exist.

TradingView receives its widget requests; optional Upstox receives explicitly triggered authenticated GETs; Google Fonts may receive font requests. Core education works when these services are unavailable. No analytics, advertising tracker or server upload endpoint is added.

Workspace backups exclude credentials and dataset content. Source code and public sample files contain only fictional data. Preserve this separation in future tasks. On GitHub Pages, response-header control is limited, so this release does not claim a restrictive server-managed CSP.
