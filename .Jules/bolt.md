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

## 2026-03-04 - Disconnecting Single-Use IntersectionObservers
**Learning:** Calling `IntersectionObserver.unobserve(target)` removes the target from the observer's internal list of monitored elements, but it does not fully garbage collect the observer instance itself or stop the browser's internal polling/monitoring loop associated with that observer, leading to wasted memory and CPU cycles for observers that are only used once (like scroll-into-view animations).
**Action:** For single-use observers, keep track of the number of targets and call `observer.disconnect()` once all elements have been animated, or immediately call `.disconnect()` if there is only one target, to completely tear down the observer and free resources.

## 2024-05-28 - Redundant matchMedia Queries in Event Listeners
**Learning:** Calling `window.matchMedia('(prefers-color-scheme: dark)')` repeatedly inside an event handler (e.g., clicking a theme toggle) forces the browser to parse and evaluate the media query string on every interaction, which is unnecessary and wastes CPU cycles.
**Action:** Cache the `MediaQueryList` object returned by `window.matchMedia()` at the top level of the script, and simply read its `.matches` property inside event listeners or functions that run frequently.

## 2024-05-28 - DOM Access in High-Frequency Global Listeners
**Learning:** In global event listeners that fire rapidly (like `keydown` for typing or scrolling), performing DOM reads like `document.activeElement` on every event adds unnecessary CPU overhead, even if the result isn't used. While a single read is fast, doing it rapidly (e.g., holding an arrow key) compounds.
**Action:** Always place an early return (e.g., checking `e.key`) *before* any DOM access or complex logic in global event listeners.

## 2026-03-07 - GC Churn in High-Frequency Event Listeners
**Learning:** In high-frequency event listeners like `pointermove` or `mousemove`, creating a new anonymous function every time `requestAnimationFrame` is called leads to rapid memory allocation. Because these events can fire 60-120 times per second, this creates a constant stream of garbage that forces the Garbage Collector (GC) to work harder, potentially resulting in frame drops or micro-stutters.
**Action:** Extract anonymous functions passed to `requestAnimationFrame` (or other high-frequency callbacks) into named functions within the appropriate closure. This ensures the function is only allocated once per instance, reducing memory churn.

## 2026-03-09 - CSS Background Gradients Cause Layout Repaints
**Learning:** Transitioning a CSS `background` property (especially full-screen complex radial gradients) triggers expensive repaints on every frame during the animation, degrading performance.
**Action:** Use an opacity crossfade technique. Place the light gradient on a `body::before` pseudo-element and the dark gradient on a `body::after` pseudo-element. Transition the `opacity` property of both elements instead. This is hardware-accelerated and only requires compositing.

## 2026-03-09 - Overlapping NodeList Iterations and Redundant Queries
**Learning:** Performing `document.querySelectorAll` and iterating over specific nested elements (e.g., `.nav-dropdown-menu a`) immediately after already iterating over a broader cached NodeList (`.nav-links a`) that inherently includes those same nested elements wastes CPU cycles on redundant DOM queries and repeated O(n) loops.
**Action:** Always verify if a broader cached NodeList already captures the elements needed for a subsequent operation. If so, consolidate the logic into the single existing iteration, checking element characteristics (like `.closest('.nav-dropdown')`) within the same loop to prevent redundant DOM traversal and layout reads.

## 2026-03-09 - Layout Thrashing in Scroll Handlers
**Learning:** Interleaving DOM layout reads (`el.getBoundingClientRect().top`) and style writes (`el.style.maskImage`) within a single loop connected to a scroll event forces the browser to recalculate layout (Forced Synchronous Layout) on every element, on every scroll frame. This severely impacts scrolling performance.
**Action:** Strictly separate DOM reads and DOM writes into two distinct phases. Use two separate loops (or array methods): the first to cache all layout measurements, and the second to apply all style changes.
