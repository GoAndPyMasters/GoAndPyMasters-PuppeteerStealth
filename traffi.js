// import puppeteer from 'puppeteer';

const puppeteer = require('puppeteer');
const URL = 'https://schnelltools.de/uber-uns'; // <-- Replace with your website

const PROXY = '139.177.229.200:8080';

// 206.188.208.134:8443

async function simulateVisit() {
  const browser = await puppeteer.launch({
  headless: true,
  args: [
    `--proxy-server=http://${PROXY}`,
    
  ],
});
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: 'networkidle2' }); // Wait for the page to load and network to settle
    console.log(`Page loaded: ${URL}`);

    // --- Simulate Human Interaction ---

    // 1. Scroll down the page
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(resolve => setTimeout(resolve, 9000)); // Wait for 2 seconds

  } catch (error) {
    console.error('Visit failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the simulation
simulateVisit();