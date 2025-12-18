// import puppeteer from 'puppeteer';

const puppeteer = require('puppeteer');
const URL = 'https://schnelltools.de/uber-uns'; // <-- Replace with your website

async function simulateVisit() {
  const browser = await puppeteer.launch({ 
    headless: true // Set to false to see the browser window
  });
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: 'networkidle2' }); // Wait for the page to load and network to settle
    console.log(`Page loaded: ${URL}`);

    // --- Simulate Human Interaction ---

    // 1. Scroll down the page
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

    // 2. Click an element (e.g., a link with a specific selector)
    // const elementToClick = await page.$('.my-link-class');
    // if (elementToClick) {
    //   await elementToClick.click();
    //   console.log('Clicked a link.');
    //   await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for new page to load
    // }

  } catch (error) {
    console.error('Visit failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the simulation
simulateVisit();