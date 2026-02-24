from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 375, "height": 812})

        # Navigate to the page
        page.goto("http://localhost:8000")

        # Click the hamburger menu
        page.click(".nav-toggle")

        # Wait for the animation to complete (transition is 0.3s)
        time.sleep(1)

        # Take a screenshot
        screenshot_path = "/home/jules/verification/menu_screenshot.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
