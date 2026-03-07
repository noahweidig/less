# Palette's Journal

## 2025-05-23 - Skip to Content Link
**Learning:** Even well-structured semantic HTML sites often miss the "Skip to Content" link, which is critical for keyboard users to bypass repetitive navigation.
**Action:** Always verify the existence of a skip link as the first item in the body, even if `<main>` is used correctly.

## 2025-05-24 - External Link Context
**Learning:** External links (`target="_blank"`) without context can disorient screen reader users. Adding visually hidden text is a robust way to provide this context without cluttering the visual design.
**Action:** Always check `target="_blank"` links for accessibility context (aria-label or hidden text).

## 2025-05-25 - Active Navigation State
**Learning:** Users, especially those using screen readers, need to know their current location within the site hierarchy. Adding `aria-current="page"` provides this context programmatically, while visual cues help sighted users.
**Action:** Always verify that navigation menus indicate the current page using both visual styles and semantic attributes.

## 2025-05-26 - Dynamic Button Labels
**Learning:** Static labels for toggle buttons (like "Toggle dark mode") can be ambiguous about the current state or the action to be taken. Dynamic labels (e.g., "Switch to dark mode" / "Switch to light mode") clarify the action and state for screen reader users.
**Action:** Use JavaScript to update `aria-label` on toggle buttons to reflect the specific action based on the current state.

## 2025-05-27 - Semantic In-page Navigation
**Learning:** Using `<button>` with JS for in-page navigation breaks semantics and requires manual focus management. Native anchor links with `scroll-behavior: smooth` provide a robust, accessible, and progressive solution.
**Action:** Prefer `<a href='#id'>` over JS scroll buttons, and ensure targets have `tabindex='-1'`.

## 2025-05-28 - Keyboard Parity for Visual Effects
**Learning:** Interactive components often reserve rich visual feedback (like 3D tilts) for mouse users via `:hover`. Keyboard users deserve the same delight and confirmation of focus.
**Action:** Always pair `:hover` effects with `:focus-visible` on interactive elements to ensure feature parity across input methods.

## 2025-05-29 - Turning Content into Action
**Learning:** Transform passive reading (guides, steps) into active engagement by adding simple interactivity (checkboxes). This reinforces learning and provides a sense of progress without changing the core content.
**Action:** Look for numbered lists or steps that can be converted into interactive checklists to add value.

## 2025-05-30 - Invisible Focus Traps
**Learning:** Interactive elements hidden only via `opacity: 0` remain in the keyboard tab order. This creates invisible focus traps where keyboard users focus on an element they cannot see, causing confusion.
**Action:** Always pair `opacity: 0` with `visibility: hidden` (or `display: none`, or `pointer-events: none` AND `tabindex="-1"`) for elements that should not be interactive when visually hidden. Ensure smooth transitions by adding `visibility` to the CSS `transition` property.

## 2025-05-31 - Dynamic ARIA Labels and Focus Restoration
**Learning:** For components that change state (like a mobile menu toggle), static ARIA labels like "Open menu" become inaccurate when the menu is already open, confusing screen reader users. Additionally, closing a modal or menu with the Escape key without explicitly returning focus to the trigger can leave keyboard users lost.
**Action:** Always toggle `aria-label` along with `aria-expanded` state, and ensure `element.focus()` is called on the toggle button when a menu is closed via keyboard interaction.

## 2026-03-02 - Tactile Feedback and Focus Parity
**Learning:** Users lack physical confirmation of clicks on interactive components when `:active` states are missing. Furthermore, keyboard users don't get the same visual lift as mouse users if `:focus-visible` is not paired with `:hover`.
**Action:** Always add `:active` states to provide visual feedback for clicks and ensure keyboard users get the same visual state as mouse users by pairing `:hover` and `:focus-visible`.
## 2025-03-03 - Contextual Navigation Resets via Brand Logos
**Learning:** Even well-styled static brand logos (e.g., `<div class="logo">`) can create subtle friction because users instinctively expect the top-left logo to act as a contextual reset/link back to the homepage. Making the logo interactive satisfies this established mental model.
**Action:** Always wrap the site logo in an `<a>` tag pointing to the homepage, add an `aria-label="Home"`, and ensure styling (e.g., `text-decoration: none`) is preserved.

## 2026-03-04 - Focus Restoration on Scroll-to-Top Actions
**Learning:** Scrolling a page visually does not automatically move keyboard focus. A user tabbing to a "Back to Top" button at the end of the page and activating it will be visually scrolled to the top, but their keyboard focus remains trapped at the bottom. The next tab press will jump them unpredictably or leave them lost.
**Action:** Always programmatically restore focus to a logical element at the top of the document (like `document.getElementById('main-content').focus({ preventScroll: true })`) when executing a programmatic scroll-to-top action, ensuring it has `tabindex="-1"` if it's not a naturally focusable element.

## 2026-03-05 - Dismissible Transient UI via External Clicks
**Learning:** For transient UI elements like mobile menus or dropdowns, relying solely on an explicit "close" button creates friction. Users naturally expect clicking anywhere outside the element to dismiss it.
**Action:** Always implement a document-level click listener to close open transient UI elements when a click occurs outside their boundaries, ensuring ARIA attributes are updated accordingly.

## 2026-03-06 - Dynamic ARIA Context and Sibling Styling
**Learning:** Toggle buttons with static ARIA labels that describe both state and action (e.g. "Mark step 1 as complete") become confusing once activated because the label contradicts the `aria-pressed="true"` state. Furthermore, using CSS adjacent sibling combinators (`+`) to style related content based on the toggle's `aria-pressed` attribute provides robust, JavaScript-free visual feedback.
**Action:** Always dynamically update the verb in the `aria-label` (e.g., from "complete" to "incomplete") when a toggle button's state changes. Leverage `aria-pressed` in CSS to style adjacent semantic content, keeping the DOM structure clean.

## 2026-03-07 - Hidden context for SVGs in Icon-only buttons
**Learning:** Icon-only buttons correctly labeled with `aria-label` or `title` may still cause screen readers to read the child SVG element's contents (sometimes announcing the word 'image' or raw markup) if the SVG isn't explicitly hidden from the accessibility tree.
**Action:** Always add `aria-hidden="true"` to `<svg>` elements that are used purely decoratively within interactive controls like `<button>` or `<a>` to prevent redundant or confusing screen reader announcements.
