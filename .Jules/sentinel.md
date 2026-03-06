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

## 2026-03-01 - [Untrusted Data Boundary]
**Vulnerability:** Potential DOM state corruption or unexpected behavior caused by tampering with `localStorage`.
**Learning:** `localStorage` is an untrusted data source and values read from it should be strictly validated before being used to manipulate the DOM.
**Prevention:** Added strict validation to `localStorage.getItem('theme')` to ensure it only accepts expected values (`'light'` or `'dark'`). Invalid values trigger a warning and are removed.

## 2026-03-02 - [Anti-Clickjacking Framebuster]
**Vulnerability:** The site was susceptible to clickjacking (UI redressing) because it lacked HTTP headers like `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` to restrict embedding in iframes.
**Learning:** For static sites where server-level header configuration might not be possible, a JavaScript framebuster provides a critical layer of defense-in-depth against clickjacking.
**Prevention:** Added a JavaScript framebuster to `script.js` that attempts to redirect the top window to the current URL. Crucially, if this navigation is blocked (e.g., by a sandboxed iframe), it falls back securely by hiding the page content (`document.documentElement.style.display = 'none'`).

## 2026-03-03 - [LocalStorage Error Handling]
**Vulnerability:** Unhandled `SecurityError` exceptions when attempting to access `localStorage` in strict privacy environments (e.g., third-party cookies blocked, incognito mode) could crash script execution and leak stack traces to the console.
**Learning:** Web Storage APIs (like `localStorage` and `sessionStorage`) are not guaranteed to be accessible. They must be treated as protected boundaries that can fail, rather than assumed features.
**Prevention:** Always wrap `localStorage` access methods (`getItem`, `setItem`, `removeItem`) in `try...catch` blocks or utilize a safe wrapper utility to ensure the application fails securely without crashing or leaking sensitive error information.

## 2026-03-05 - [Framebuster Race Condition]
**Vulnerability:** A timing-based clickjacking vulnerability existed because the anti-clickjacking framebuster attempted to redirect (`window.top.location.replace()`) *before* hiding the page content (`display = 'none'`). This left a brief window where the iframe content was fully visible and interactive while the redirect network request was pending.
**Learning:** Defenses that rely on asynchronous actions (like network navigation) must fail-safe immediately before initiating the action.
**Prevention:** Ensure the application state is rendered inert or invisible immediately upon detecting a threat, prior to taking mitigative actions that may have a delay.
