<div align="center">

# Less.

### *The art of having exactly enough.*

A beautifully crafted, static website exploring the philosophy and practice of **minimalism** across every dimension of modern life — your possessions, your screens, your finances, and your mind.

---

[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Sourced Stats](https://img.shields.io/badge/stats-sourced-brightgreen?style=flat-square)](src/data/citations.ts)
[![Accessible](https://img.shields.io/badge/accessibility-WCAG%202.1-blue?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

</div>

---

## The Premise

> *"The ability to simplify means to eliminate the unnecessary so that the necessary may speak."*
> — **Hans Hofmann**

Modern life was engineered to make you want more — more things, more screens, more noise. **Less.** makes the case that the antidote isn't deprivation; it's intention.

**Less.** is a static [Astro](https://astro.build) site that presents the philosophy, daily practices, tools, and community resources for living more intentionally across four dimensions: your **Life** (possessions and space), your **Tech** (screens and devices), your **Money** (spending and finances), and your **Mind** (attention and mental clarity).

Every statistic on the site is fact-checked and linked to its original source — see [`src/data/citations.ts`](src/data/citations.ts).

---

## Pages

| Page | Path | Description |
|---|---|---|
| **Home** | `/` | The core argument — sourced data across all four dimensions and the path forward |
| **Life** | `/life` | The cost of clutter and the case for owning less |
| **Life — Tools** | `/life/tools` | Curated objects and resources for a simpler home |
| **Life — Habits** | `/life/habits` | Daily practices and the structured declutter protocol |
| **Life — Community** | `/life/community` | Books, people, and movements in lifestyle minimalism |
| **Tech** | `/tech` | The cost of too much tech and what you stand to gain |
| **Tech — Tools** | `/tech/tools` | Dumbphones and focus apps for reducing digital noise |
| **Tech — Habits** | `/tech/habits` | Daily practices and the 30-day digital reset |
| **Tech — Community** | `/tech/community` | Books, online communities, and thinkers in digital minimalism |
| **Money** | `/money` | The cost of overspending and the case for financial minimalism |
| **Money — Tools** | `/money/tools` | Apps and frameworks for mindful spending |
| **Money — Habits** | `/money/habits` | Daily practices and the financial declutter |
| **Money — Community** | `/money/community` | Books and resources for financial simplicity |
| **Mind** | `/mind` | The cost of mental overload and the case for a quieter mind |
| **Mind — Tools** | `/mind/tools` | Apps and practices for mental clarity |
| **Mind — Habits** | `/mind/habits` | Daily practices and the mental declutter |
| **Mind — Community** | `/mind/community` | Books and communities for mental minimalism |

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

### Sourced Data
- **Every stat is fact-checked** — Numbers that couldn't be traced to a credible source were replaced with verifiable ones; every stat card and quote links to its original source
- **Central source of truth** — All figures and citations live in [`src/data/citations.ts`](src/data/citations.ts), shared across the homepage and every category overview page

### Performance & Reliability
- **`transitionend`-based cleanup** — Navigation animation lifecycle is synchronized with the actual CSS transition via the `transitionend` event, not a fragile `setTimeout`. This ensures precise timing regardless of system load. See [`PERFORMANCE_IMPACT.md`](PERFORMANCE_IMPACT.md) for the full write-up.
- **No client-side JS framework** — Astro ships static HTML/CSS with a single vanilla JS file for interactivity — no hydration, no runtime overhead
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
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── script.js            # All interactivity — no framework required
│   └── security.js          # Anti-clickjacking framebuster, loaded synchronously
├── src/
│   ├── components/
│   │   ├── Header.astro     # Logo, nav, theme toggle
│   │   ├── Footer.astro     # Footer + back-to-top button
│   │   ├── StatCard.astro   # A sourced statistic with its citation link
│   │   └── Quote.astro      # A sourced quote with its citation link
│   ├── data/
│   │   └── citations.ts     # Every stat and quote, with its verified source
│   ├── layouts/
│   │   └── Layout.astro     # Shared <head>, CSP, header/footer wrapper
│   ├── pages/
│   │   ├── index.astro      # Home — the problem and the philosophy
│   │   ├── life/            # index, tools, habits, community
│   │   ├── tech/            # index, tools, habits, community
│   │   ├── money/           # index, tools, habits, community
│   │   └── mind/            # index, tools, habits, community
│   └── styles/
│       └── global.css       # All styles — layout, themes, animations
├── astro.config.mjs
└── PERFORMANCE_IMPACT.md    # Write-up on the transitionend optimization
```

---

## Getting Started

```bash
git clone <repo-url>
cd less
npm install
npm run dev
```

Then visit `http://localhost:4321`.

To build the static site:

```bash
npm run build
npm run preview
```

---

## Philosophy

The site is built to embody the values it describes. Three principles guided every decision:

**1. Clutter is Costly**
Astro is used only to compile the site to static HTML — there's no client-side framework, no trackers, no ads, no external analytics. The only third-party resource loaded in the browser is a Google Fonts stylesheet — a deliberate, bounded choice.

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
