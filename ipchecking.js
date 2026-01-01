const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

async function checkProxy(proxy) {
  // We must launch a new browser for each proxy to ensure it is applied
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=http://${proxy}`] // Apply proxy here
  });

  try {
    const page = await browser.newPage();
    // Set a short timeout so we don't wait forever on dead proxies
    await page.setDefaultNavigationTimeout(20000); 

    console.log(`Testing Proxy: ${proxy}...`);
    
    // Attempt to visit the target website
    const response = await page.goto('https://weddleunlimited.net/', {
      waitUntil: 'domcontentloaded'
    });

    // Check if the page loaded successfully (Status 200)
    if (response && response.status() === 200) {
      console.log(`✅ Success: ${proxy}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Failed: ${proxy} (${error.message})`);
  } finally {
    await browser.close();
  }
  return false;
}

(async () => {
  // 1. Load IPs from the file you created earlier
  if (!fs.existsSync('proxies101.txt')) {
    console.log("Error: proxies101.txt not found. Run the scraper first!");
    return;
  }

  const allProxies = fs.readFileSync('proxies101.txt', 'utf-8')
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log(`Loaded ${allProxies.length} proxies for testing.`);

  const workingProxies = [];

  // 2. Loop through and test them one by one
  for (const proxy of allProxies) {
    const isWorking = await checkProxy(proxy);
    if (isWorking) {
      workingProxies.push(proxy);
      // Append to file immediately so you don't lose data if the script stops
      fs.appendFileSync('goodipus4.txt', proxy + '\n');
    }
  }

  console.log(`--- Testing Complete ---`);
  console.log(`Found ${workingProxies.length} working proxies.`);
  console.log(`Good IPs saved to goodip.txt`);
})();