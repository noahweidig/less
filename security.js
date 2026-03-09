// --- Security: Anti-Clickjacking Framebuster ---
// Prevent the site from being maliciously embedded in an iframe.
if (window.self !== window.top) {
    // 🛡️ Sentinel: Immediately hide document to prevent timing-based clickjacking
    // during the top-level navigation request.
    document.documentElement.style.display = 'none';
    try {
        window.top.location.replace(window.location.href);
    } catch (e) {
        // If the browser blocks the navigation (e.g. sandbox attribute on iframe)
        // log the attempt. Document is already hidden.
        console.error('Security Warning: Clickjacking attempt detected and blocked.');
    }
}
