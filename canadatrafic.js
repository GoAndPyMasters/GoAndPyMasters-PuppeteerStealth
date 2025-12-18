const puppeteer = require('puppeteer');

// 🛑 FIX: Removed 'socks5://'. Just use the IP:PORT for HTTP proxies.
const PROXY = '173.249.210.102:80'; 

const URL = 'https://schnelltools.de/uber-uns'; 
// const URL = 'https://www.effectivegatecpm.com/j66m2x63d?key=ab70c564100a1e98821bcc01f456facf'; 

async function run() {
  console.log(`--- Attempting visit via HTTP Proxy: ${PROXY} ---`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--proxy-server=${PROXY}`, // Puppeteer defaults to HTTP if no prefix is given
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });

  try {
    const page = await browser.newPage();
    // Increase timeout to 60 seconds
    page.setDefaultNavigationTimeout(60000); 

    console.log(`Navigating to target: ${URL}...`);
    
    // Using 'domcontentloaded' is faster and less likely to timeout on proxies
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    
    console.log('🎉 Success! Page Title:', await page.title());
    
    // Interact slightly
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 2000));

  } catch (error) {
    console.error('❌ Visit failed:', error.message);
  } finally {
    await browser.close();
  }
}

run();