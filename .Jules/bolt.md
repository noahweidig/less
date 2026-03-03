# Bolt's Journal

## 2024-05-27 - DOM Thrashing in requestAnimationFrame Loops
**Learning:** In a codebase using vanilla JavaScript `requestAnimationFrame` for animating element values (like counting up statistics), calculating and reassigning the exact same integer value to `element.textContent` every frame causes unnecessary DOM writes and potential style recalculations. Since the total frames often exceed the value change (e.g. going 0-44 over 1500ms means the value stays the same for ~2 frames on a 60Hz display, and much longer for smaller target numbers), this results in significant wasted effort.
**Action:** Always cache the calculated integer in a `lastValue` variable outside the `requestAnimationFrame` loop, and wrap the `element.textContent` assignment in a conditional check (`if (newValue !== lastValue)`) to only write to the DOM when the actual value changes.

## 2024-05-27 - O(n) Event Listeners and Redundant DOM Queries
**Learning:** Attaching individual `click` event listeners to a list of elements (e.g., navigation links) inside a `forEach` loop uses unnecessary memory. Additionally, performing redundant DOM queries (like `querySelectorAll`) for the same elements in different feature blocks wastes CPU cycles.
**Action:** Always use event delegation by attaching a single event listener to a common parent element and checking `e.target` (or `e.target.closest`). Always cache the results of expensive DOM queries at the top level and reuse them throughout the script.

## 2024-05-27 - Static `will-change` Causes Permanent VRAM Allocation
**Learning:** Using `will-change: transform` in a static CSS class (e.g. `.card`) forces the browser to pre-allocate memory (often on the GPU/VRAM) to create a compositing layer for that element immediately and permanently, even when it's not being interacted with. If many elements have this class, it leads to significant VRAM bloat and can actually degrade rendering performance. Furthermore, removing `will-change` synchronously in JavaScript on a pointer exit event drops the hardware-accelerated layer *during* the exit CSS transition, causing visual stuttering.
**Action:** Remove `will-change` from static CSS. Add it dynamically via JavaScript on `pointerenter` (before the animation starts), and critically, only remove it after the animation concludes by listening to the `transitionend` event (checking `e.propertyName === 'transform'` and ensuring the element is no longer hovered) to guarantee smooth enter and exit transitions without wasting memory.

## 2024-05-27 - Layout Thrashing in Card Animations
**Learning:** In the `pointerenter` handler for card 3D animations, setting `card.style.willChange` (writing to the DOM) immediately before calling `card.getBoundingClientRect()` (reading layout) forces the browser to synchronously recalculate the entire page layout, causing a significant performance bottleneck known as Layout Thrashing or Forced Synchronous Layout.
**Action:** Always read layout properties (like `getBoundingClientRect()`, `offsetWidth`, etc.) *before* applying any style changes (DOM writes) in the same frame or event handler.
