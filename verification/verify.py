import os
from playwright.sync_api import sync_playwright

def verify_ux_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load local file
        cwd = os.getcwd()
        file_path = f"file://{cwd}/index.html"
        print(f"Loading {file_path}")
        page.goto(file_path)

        # Verify "See the Problem" link
        link = page.locator('.cta-button', has_text='See the Problem')

        # Check tag name
        tag_name = link.evaluate("element => element.tagName")
        print(f"Tag name: {tag_name}")
        assert tag_name == "A", f"Expected tag name A, got {tag_name}"

        # Check href
        href = link.get_attribute("href")
        print(f"Href: {href}")
        assert href == "#screen-time", f"Expected href #screen-time, got {href}"

        # Check visual style (text-decoration)
        text_decoration = link.evaluate("element => window.getComputedStyle(element).textDecorationLine")
        print(f"Text decoration: {text_decoration}")
        # Note: getComputedStyle might return 'none' or empty string depending on browser
        assert text_decoration == "none", f"Expected text-decoration none, got {text_decoration}"

        # Screenshot of the button
        link.screenshot(path="verification/button.png")
        print("Button screenshot saved.")

        # Verify Target Section tabindex
        section = page.locator('#screen-time')
        tabindex = section.get_attribute("tabindex")
        print(f"Section tabindex: {tabindex}")
        assert tabindex == "-1", f"Expected tabindex -1, got {tabindex}"

        # Verify Focus Outline (or lack thereof)
        # Focus the section
        section.focus()
        # Take screenshot of section header to see if there is outline
        section.screenshot(path="verification/section_focus.png")

        # Check outline style programmatically
        outline_style = section.evaluate("element => window.getComputedStyle(element).outlineStyle")
        print(f"Section outline style: {outline_style}")
        assert outline_style == "none", f"Expected outline style none, got {outline_style}"

        browser.close()

if __name__ == "__main__":
    verify_ux_changes()
