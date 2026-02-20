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
