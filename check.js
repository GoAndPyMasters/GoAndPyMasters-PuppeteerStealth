// your-script.js

// 1. Import necessary libraries
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// 2. Add the stealth plugin to Puppeteer
puppeteer.use(StealthPlugin());

// 3. Define your automation function
async function runStealthBrowser() {
  // Launch the browser instance
  const browser = await puppeteer.launch({
    headless: true // or false for visible
  });

  const page = await browser.newPage();

  // The stealth modifications are now active for this page
  await page.goto('https://bot.sannysoft.com/', { waitUntil: 'networkidle0' });

  // Optional: Take a screenshot to verify stealth checks
  await page.screenshot({ path: 'stealth_check.png' });

  await browser.close();
}

runStealthBrowser();