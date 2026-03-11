const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8080, async () => {
    console.log('Server running at http://localhost:8080/');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080/');

        // Wait for script to initialize
        await page.waitForTimeout(500);

        // Scroll to the tabs to make sure they are in view for the test
        const tabList = page.locator('.tab-nav');
        await tabList.scrollIntoViewIfNeeded();

        // Check initial state
        let clutterTab = await page.locator('#tab-clutter');
        let clutterTabindex = await clutterTab.getAttribute('tabindex');
        if (clutterTabindex !== '0') throw new Error(`Expected #tab-clutter tabindex to be 0, got ${clutterTabindex}`);

        let techTab = await page.locator('#tab-tech');
        let techTabindex = await techTab.getAttribute('tabindex');
        if (techTabindex !== '-1') throw new Error(`Expected #tab-tech tabindex to be -1, got ${techTabindex}`);

        console.log('✅ Initial state verified.');

        // Focus the active tab and use right arrow to navigate
        await clutterTab.focus();
        await page.keyboard.press('ArrowRight');

        // Wait a bit for JS to handle the event
        await page.waitForTimeout(100);

        // Check new state
        clutterTabindex = await clutterTab.getAttribute('tabindex');
        if (clutterTabindex !== '-1') throw new Error(`Expected #tab-clutter tabindex to be -1 after navigation, got ${clutterTabindex}`);

        techTabindex = await techTab.getAttribute('tabindex');
        if (techTabindex !== '0') throw new Error(`Expected #tab-tech tabindex to be 0 after navigation, got ${techTabindex}`);

        // Ensure focus actually moved
        const isFocused = await techTab.evaluate(node => document.activeElement === node);
        if (!isFocused) throw new Error('#tab-tech is not focused after ArrowRight');

        console.log('✅ Keyboard navigation verified.');

        // Test panel focusability
        const techPanel = page.locator('#panel-tech');
        const panelTabindex = await techPanel.getAttribute('tabindex');
        if (panelTabindex !== '0') throw new Error(`Expected #panel-tech tabindex to be 0, got ${panelTabindex}`);

        // Tab from the tab button into the panel
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const isPanelFocused = await techPanel.evaluate(node => document.activeElement === node);
        if (!isPanelFocused) throw new Error('#panel-tech is not focused after Tab');

        console.log('✅ Panel focusability verified.');
        console.log('🎉 All tests passed successfully.');

    } catch (e) {
        console.error('❌ Test failed:', e);
        process.exitCode = 1;
    } finally {
        await browser.close();
        server.close();
    }
});