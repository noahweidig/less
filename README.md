<div align="center">

# Less.

### *The art of having exactly enough.*

A beautifully crafted, static website exploring the philosophy and practice of **minimalism** across every dimension of modern life — your possessions, your screens, your finances, and your mind.

---

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square)](package.json)
[![Accessible](https://img.shields.io/badge/accessibility-WCAG%202.1-blue?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

</div>

---

## The Premise

> *"The ability to simplify means to eliminate the unnecessary so that the necessary may speak."*
> — **Hans Hofmann**

Modern life was engineered to make you want more — more things, more screens, more noise. **Less.** makes the case that the antidote isn't deprivation; it's intention.

**Less.** is a static, zero-dependency website that presents the philosophy, daily practices, tools, and community resources for living more intentionally across four dimensions: your **Life** (possessions and space), your **Tech** (screens and devices), your **Money** (spending and finances), and your **Mind** (attention and mental clarity).

---

## Pages

| Page | Path | Description |
|---|---|---|
| **Home** | `index.html` | The core argument — data across all four dimensions and the path forward |
| **Life** | `life.html` | The cost of clutter and the case for owning less |
| **Life — Tools** | `life-tools.html` | Curated objects and resources for a simpler home |
| **Life — Habits** | `life-habits.html` | Daily practices and the structured declutter protocol |
| **Life — Community** | `life-community.html` | Books, people, and movements in lifestyle minimalism |
| **Tech** | `tech.html` | The cost of too much tech and what you stand to gain |
| **Tech — Tools** | `tech-tools.html` | Dumbphones and focus apps for reducing digital noise |
| **Tech — Habits** | `tech-habits.html` | Daily practices and the 30-day digital reset |
| **Tech — Community** | `tech-community.html` | Books, online communities, and thinkers in digital minimalism |
| **Money** | `money.html` | The cost of overspending and the case for financial minimalism |
| **Money — Tools** | `money-tools.html` | Apps and frameworks for mindful spending |
| **Money — Habits** | `money-habits.html` | Daily practices and the financial declutter |
| **Money — Community** | `money-community.html` | Books and resources for financial simplicity |
| **Mind** | `mind.html` | The cost of mental overload and the case for a quieter mind |
| **Mind — Tools** | `mind-tools.html` | Apps and practices for mental clarity |
| **Mind — Habits** | `mind-habits.html` | Daily practices and the mental declutter |
| **Mind — Community** | `mind-community.html` | Books and communities for mental minimalism |

---

## Features

### Design
- **Dual theme** — Light and dark mode with a single toggle, persisted across sessions via `localStorage`
- **Responsive layout** — Mobile-first design with a dropdown navigation for category sections and a hamburger menu for small screens
- **Subtle motion** — Scroll-triggered animations and interactive card tilt effects that respect `prefers-reduced-motion`
- **Typography** — Playfair Display for headings, Montserrat for body — a pairing built for calm, intentional reading

### Interactivity
- **Animated counters** — Statistics count up into view as the user scrolls, driven by `IntersectionObserver`
- **Animated donut charts** — CSS-driven SVG charts illustrating key statistics on the Home and category overview pages
- **Interactive step checklists** — Declutter protocol steps across the habits pages can be marked complete, with state saved to `localStorage`
- **Back-to-top button** — Appears on scroll and smoothly returns the user to the top of the page

### Performance & Reliability
- **`transitionend`-based cleanup** — Navigation animation lifecycle is synchronized with the actual CSS transition via the `transitionend` event, not a fragile `setTimeout`. This ensures precise timing regardless of system load. See [`PERFORMANCE_IMPACT.md`](PERFORMANCE_IMPACT.md) for the full write-up.
- **No JavaScript frameworks** — Vanilla JS with no build step and no bundler required
- **Deferred script loading** — `script.js` uses `defer` to avoid blocking page render
- **Content Security Policy** — A strict CSP meta tag is set on every page, limiting asset sources to `'self'` and trusted font providers
- **Anti-clickjacking** — `security.js` is loaded synchronously on every page to immediately detect and block malicious iframe embedding before any content renders

### Accessibility
- **Skip-to-content link** — Allows keyboard users to bypass repeated navigation
- **Semantic HTML** — Proper use of `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<blockquote>`, and `<cite>`
- **ARIA attributes** — Navigation toggle uses `aria-expanded`, `aria-controls`, and `aria-label`; the donut chart has a descriptive `aria-label` for screen readers
- **Focus management** — Page sections targeted by in-page links receive `tabindex="-1"` so focus is moved correctly

---

## Project Structure

```
less/
├── index.html              # Home — the problem and the philosophy
├── life.html               # Life — possessions and physical space
├── life-tools.html         # Life Tools
├── life-habits.html        # Life Habits
├── life-community.html     # Life Community
├── tech.html               # Tech — screens and devices
├── tech-tools.html         # Tech Tools
├── tech-habits.html        # Tech Habits
├── tech-community.html     # Tech Community
├── money.html              # Money — spending and finances
├── money-tools.html        # Money Tools
├── money-habits.html       # Money Habits
├── money-community.html    # Money Community
├── mind.html               # Mind — attention and mental clarity
├── mind-tools.html         # Mind Tools
├── mind-habits.html        # Mind Habits
├── mind-community.html     # Mind Community
├── style.css               # All styles — layout, themes, animations
├── script.js               # All interactivity — no framework required
├── security.js             # Anti-clickjacking framebuster, loaded synchronously
├── favicon.svg             # SVG favicon
└── PERFORMANCE_IMPACT.md   # Write-up on the transitionend optimization
```

---

## Getting Started

No build tools. No package manager. No setup.

```bash
git clone <repo-url>
cd less
# Open in your browser
open index.html
```

Or serve it locally for a more accurate environment:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`.

---

## Philosophy

The site is built to embody the values it describes. Three principles guided every decision:

**1. Clutter is Costly**
No npm installs. No bundlers. No trackers. No ads. No external analytics. The only third-party resource is a Google Fonts stylesheet — a deliberate, bounded choice.

**2. Optimization is Important**
Every interactive feature is built on browser-native APIs: `IntersectionObserver`, `transitionend`, `localStorage`, `requestAnimationFrame`. The result is a site that loads instantly and runs smoothly on any device.

**3. Intentionality is Satisfying**
Every element earns its place. If something didn't serve the reader's understanding or experience, it was left out.

---

## Recommended Reading

The ideas on this site draw from a body of work worth exploring:

- **[Digital Minimalism](https://calnewport.com/writing/#digital-minimalism)** — Cal Newport
- **[Deep Work](https://calnewport.com/writing/#deep-work)** — Cal Newport
- **[The Shallows](https://www.nicholascarr.com/?page_id=16)** — Nicholas Carr
- **[The Life-Changing Magic of Tidying Up](https://konmari.com/marie-kondo-books/)** — Marie Kondō
- **[Your Money or Your Life](https://www.penguinrandomhouse.com/books/313258/your-money-or-your-life-by-vicki-robin/)** — Vicki Robin

---

<div align="center">

*Built with intention.*

&copy; 2026 Less.

</div>
