# Bolt's Journal

## 2024-05-27 - DOM Thrashing in requestAnimationFrame Loops
**Learning:** In a codebase using vanilla JavaScript `requestAnimationFrame` for animating element values (like counting up statistics), calculating and reassigning the exact same integer value to `element.textContent` every frame causes unnecessary DOM writes and potential style recalculations. Since the total frames often exceed the value change (e.g. going 0-44 over 1500ms means the value stays the same for ~2 frames on a 60Hz display, and much longer for smaller target numbers), this results in significant wasted effort.
**Action:** Always cache the calculated integer in a `lastValue` variable outside the `requestAnimationFrame` loop, and wrap the `element.textContent` assignment in a conditional check (`if (newValue !== lastValue)`) to only write to the DOM when the actual value changes.
