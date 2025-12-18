const puppeteer = require('puppeteer');
const URL = 'https://www.effectivegatecpm.com/j66m2x63d?key=ab70c564100a1e98821bcc01f456facf'; 
const SIMULTANEOUS_VISITS = 10; 

// A pool of realistic User Agents to rotate through
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/127.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', // Mobile
];

/**
 * Function to simulate a single person visiting the website.
 */
async function simulateVisit(visitId) {
  let browser;
  // Pick a random user agent from the pool
  const userAgent = USER_AGENTS[visitId % USER_AGENTS.length];

  try {
    console.log(`[Visit ${visitId}] Starting browser with UA: ${userAgent.substring(0, 30)}...`);
    
    // Launch browser with arguments to disable common bot flags (like WebDriver)
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--user-agent=${userAgent}`, // Set unique user agent here
        '--proxy-server=144.125.164.222:8080',
      ],
    });
    const page = await browser.newPage();
    
    // Set viewport dimensions to match the device (approximate)
    if (userAgent.includes('iPhone')) {
         await page.setViewport({ width: 375, height: 812, isMobile: true });
    } else {
         await page.setViewport({ width: 1366, height: 768 });
    }
    
    // --- Bypass common bot detection scripts (optional but helpful) ---
    // This is a known technique to evade simple headless browser detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      // Further steps to simulate a real user environment can be added here
    });

    console.log(`[Visit ${visitId}] Navigating to: ${URL}`);
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 }); 
    console.log(`[Visit ${visitId}] Page loaded successfully.`);

    // --- Simulate More Realistic Human Interaction ---
    
    // 1. Scroll and wait for a randomized, longer duration
    const scrollAmount = Math.floor(Math.random() * 800) + 400;
    await page.evaluate(amount => window.scrollBy(0, amount), scrollAmount);
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000)); // Wait for 2-7 seconds
    
    // 2. Click an element (Example: uncomment and adjust selector)
    // const elementToClick = await page.$('a[href="/contact"]');
    // if (elementToClick) {
    //   await elementToClick.click();
    //   console.log(`[Visit ${visitId}] Clicked a link.`);
    //   await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 4000) + 2000));
    // }

  } catch (error) {
    console.error(`[Visit ${visitId}] Visit failed:`, error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[Visit ${visitId}] Browser closed.`);
    }
  }
}

/**
 * Main function to initiate all concurrent visits.
 */
async function runConcurrentVisits() {
  console.log(`--- Starting ${SIMULTANEOUS_VISITS} concurrent, randomized visits ---`);
  
  const visitPromises = [];
  for (let i = 0; i < SIMULTANEOUS_VISITS; i++) { // Start loop at 0 for easier array indexing
    visitPromises.push(simulateVisit(i + 1));
  }
  
  await Promise.allSettled(visitPromises);
  
  console.log('--- All concurrent visits have completed. Check your Google Analytics Realtime report. ---');
}

// Run the concurrent simulation
runConcurrentVisits();