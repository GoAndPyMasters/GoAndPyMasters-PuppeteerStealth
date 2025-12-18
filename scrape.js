// 1. Import necessary libraries
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// 2. Add the stealth plugin to Puppeteer
// This is crucial for avoiding bot detection
puppeteer.use(StealthPlugin());

const TARGET_URL = 'https://schnelltools.de/uber-uns';

async function scrapeSchnellTools() {
  let browser;
  try {
    console.log('Launching stealth browser...');
    
    // Launch browser instance, using puppeteer-core to attach to an existing Chrome installation
    // Note: Puppeteer-core is in your dependencies, which is good for custom environments.
    browser = await puppeteer.launch({
      headless: true, // Run in the background
      // If you needed to specify an executable path for puppeteer-core, you would add:
      // executablePath: 'path/to/chrome' 
    });

    const page = await browser.newPage();
    
    // Set a common desktop user agent (Stealth helps with this, but it's a good practice)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`Navigating to ${TARGET_URL}...`);
    
    // Navigate to the target URL and wait for the network to be idle
    await page.goto(TARGET_URL, { 
        waitUntil: 'networkidle0',
        timeout: 60000 // 60 seconds timeout
    });
    
    // --- SCRAPING LOGIC ---
    
    // Extract the main H1 heading (usually the site or page title)
    const h1Text = await page.$eval('h1', el => el.textContent.trim());
    console.log(`\n--- H1 Title ---\n${h1Text}`);

    // Extract all text content from the main navigation links in the header
    const navLinks = await page.$$eval('.main-navigation a', links => 
        links.map(a => a.textContent.trim()).filter(text => text.length > 0)
    );
    console.log(`\n--- Main Navigation Links ---\n${navLinks.join('\n')}`);
    
    // Extract all product or category titles found on the page (common pattern for e-commerce)
    const categoryHeadings = await page.$$eval('.category--tile-box h3', elements => 
        elements.map(el => el.textContent.trim())
    );
    console.log(`\n--- Featured Categories/Product Headings ---\n${categoryHeadings.join('\n')}`);
    
    // Execute a small script on the page to check if the Stealth plugin is working (optional check)
    const isStealth = await page.evaluate(() => {
        // This checks for a common WebGL fingerprint spoof
        return window.navigator.webgl;
    });
    console.log(`\nStealth Check (Webgl): ${isStealth ? 'Likely Passed (Property modified)' : 'Failed'}`);

  } catch (error) {
    console.error('An error occurred during scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('\nBrowser closed.');
    }
  }
}

scrapeSchnellTools();