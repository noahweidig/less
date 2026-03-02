import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 400, "height": 800}) # Mobile viewport

        # Setup console listener
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(str(err)))

        await page.goto("http://localhost:8000/")
        await page.wait_for_load_state('networkidle')

        # Test mobile menu toggle and click
        await page.click('.nav-toggle')
        await page.wait_for_selector('header.nav-open', state='attached')

        # Click a link inside the nav
        await page.click('.nav-links a[href="tools.html"]')

        # Give it a moment to animate out
        await asyncio.sleep(1)

        # Check if the menu closed (nav-open class removed)
        header_classes = await page.evaluate('document.querySelector("header").className')
        if 'nav-open' in header_classes:
            print("ERROR: Menu did not close after clicking a link.")
        else:
            print("SUCCESS: Menu closed properly on link click.")

        # Check active link state (we navigated to tools.html so check if it's active)
        await page.wait_for_load_state('networkidle')
        active_link = await page.evaluate('document.querySelector(".nav-links a.active").getAttribute("href")')
        if active_link == 'tools.html':
            print("SUCCESS: Active link correctly applied.")
        else:
            print(f"ERROR: Active link not correctly applied. Found: {active_link}")

        if errors:
            print("Console Errors found:")
            for err in errors:
                print(err)
        else:
            print("No console errors detected.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
