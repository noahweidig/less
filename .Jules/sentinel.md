# Sentinel's Journal

## 2025-02-15 - [Initial Setup]
**Vulnerability:** Missing security journal
**Learning:** Security knowledge must be persisted
**Prevention:** Created journal file

## 2025-02-15 - [CSP Enhancement]
**Vulnerability:** Weak Content Security Policy (CSP) allowed inline styles ('unsafe-inline'), increasing the risk of XSS if any injection vulnerability were to be found. Missing Referrer Policy could leak user browsing history.
**Learning:** Static sites often default to 'unsafe-inline' for convenience, but removing it is entirely possible with clean code that avoids inline `style` attributes.
**Prevention:** Hardened CSP by removing `'unsafe-inline'` from `style-src` and adding `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'`. Added `Referrer-Policy: strict-origin-when-cross-origin`.
