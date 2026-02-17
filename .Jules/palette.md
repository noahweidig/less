# Palette's Journal

## 2025-05-23 - Skip to Content Link
**Learning:** Even well-structured semantic HTML sites often miss the "Skip to Content" link, which is critical for keyboard users to bypass repetitive navigation.
**Action:** Always verify the existence of a skip link as the first item in the body, even if `<main>` is used correctly.

## 2025-05-24 - External Link Context
**Learning:** External links (`target="_blank"`) without context can disorient screen reader users. Adding visually hidden text is a robust way to provide this context without cluttering the visual design.
**Action:** Always check `target="_blank"` links for accessibility context (aria-label or hidden text).
