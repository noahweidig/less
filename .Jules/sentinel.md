# Sentinel's Journal

## 2025-02-15 - [Initial Setup]
**Vulnerability:** Missing security journal
**Learning:** Security knowledge must be persisted
**Prevention:** Created journal file

## 2025-02-15 - [CSP Enhancement]
**Vulnerability:** Weak Content Security Policy (CSP) allowed inline styles ('unsafe-inline'), increasing the risk of XSS if any injection vulnerability were to be found. Missing Referrer Policy could leak user browsing history.
**Learning:** Static sites often default to 'unsafe-inline' for convenience, but removing it is entirely possible with clean code that avoids inline `style` attributes.
**Prevention:** Hardened CSP by removing `'unsafe-inline'` from `style-src` and adding `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'`. Added `Referrer-Policy: strict-origin-when-cross-origin`.

## 2026-02-27 - [Trusted Types Integration]
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) risk from potentially unsafe assignments to sink properties (like innerHTML) in the future.
**Learning:** Enforcing Trusted Types using Content Security Policy is a robust defense-in-depth mechanism to prevent DOM XSS vulnerabilities at the browser level.
**Prevention:** Added `require-trusted-types-for 'script'` to the Content-Security-Policy header in all HTML files.

## 2026-02-27 - [Enforce HTTPS via CSP]
**Vulnerability:** Mixed content vulnerabilities, where HTTP resources are loaded over an HTTPS connection.
**Learning:** Adding `upgrade-insecure-requests;` to the Content Security Policy instructs the browser to automatically upgrade any HTTP requests to HTTPS, providing a simple way to mitigate mixed content vulnerabilities without breaking functionality.
**Prevention:** Included `upgrade-insecure-requests;` in the `Content-Security-Policy` header on all HTML pages.
