const puppeteer = require('puppeteer');

const URL = 'https://whatismyipaddress.com';

async  function simulateVisit() {
    const browser = await puppeteer.launch({
        headless: false,

    });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' }); // Wait for the page to load and network to settle
    console.log(`Page loaded: ${URL}`);

    await browser.close();
}

simulateVisit();
