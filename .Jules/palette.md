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
