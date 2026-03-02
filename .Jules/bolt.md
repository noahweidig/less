# Bolt's Journal

## 2024-05-27 - DOM Thrashing in requestAnimationFrame Loops
**Learning:** In a codebase using vanilla JavaScript `requestAnimationFrame` for animating element values (like counting up statistics), calculating and reassigning the exact same integer value to `element.textContent` every frame causes unnecessary DOM writes and potential style recalculations. Since the total frames often exceed the value change (e.g. going 0-44 over 1500ms means the value stays the same for ~2 frames on a 60Hz display, and much longer for smaller target numbers), this results in significant wasted effort.
**Action:** Always cache the calculated integer in a `lastValue` variable outside the `requestAnimationFrame` loop, and wrap the `element.textContent` assignment in a conditional check (`if (newValue !== lastValue)`) to only write to the DOM when the actual value changes.

## 2024-05-27 - O(n) Event Listeners and Redundant DOM Queries
**Learning:** Attaching individual `click` event listeners to a list of elements (e.g., navigation links) inside a `forEach` loop uses unnecessary memory. Additionally, performing redundant DOM queries (like `querySelectorAll`) for the same elements in different feature blocks wastes CPU cycles.
**Action:** Always use event delegation by attaching a single event listener to a common parent element and checking `e.target` (or `e.target.closest`). Always cache the results of expensive DOM queries at the top level and reuse them throughout the script.
