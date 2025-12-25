const puppeteer = require('puppeteer');
const URL = 'https://schnelltools.de/uber-uns';
const PROXY = '139.177.229.200:8080';

async function simulateVisit() {
  const browser = await puppeteer.launch({
    headless: true, // Run without opening browser
    args: [
      `--proxy-server=http://${PROXY}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // These flags help mimic a real screen
      '--window-size=1920,1080', 
    ],
  });

  const page = await browser.newPage();

  // 1. SET A REAL USER AGENT (Crucial)
  // This tells Google you are a standard Windows Desktop user, not a bot
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // 2. HIDE THE AUTOMATION FLAG
  // This removes the "navigator.webdriver" property that screams "I am a bot"
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Set a realistic viewport size
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'networkidle2' });
    console.log(`Page loaded.`);

    // --- 3. IMPORTANT: COOKIE CONSENT (.de domain) ---
    // Since your site is .de, you likely have a Cookie Banner.
    // Google Analytics will NOT fire until you accept cookies.
    // You must find the selector for your "Accept" button and click it.
    // Uncomment the lines below and replace 'BUTTON_SELECTOR' with your actual button ID or Class.

    /*
    try {
        const acceptButton = await page.waitForSelector('button#accept-cookies', { timeout: 5000 });
        if (acceptButton) {
            await acceptButton.click();
            console.log('Clicked Cookie Consent');
            await new Promise(r => setTimeout(r, 2000)); // Wait for GA to initialize
        }
    } catch (e) {
        console.log('No cookie banner found or timed out');
    }
    */

    // --- Simulate Human Interaction ---

    // Scroll down slowly
    await page.evaluate(() => window.scrollBy(0, 500));
    console.log('Scrolled down');
    
    // Wait long enough for the analytics "page_view" event to be sent
    await new Promise(resolve => setTimeout(resolve, 10000)); 

  } catch (error) {
    console.error('Visit failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

// Run the simulation
simulateVisit();