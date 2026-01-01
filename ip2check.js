const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// 1. Initialize Stealth
puppeteer.use(StealthPlugin());

async function checkProxy(proxy) {
  // Use a unique user data dir for each launch to avoid session conflicts
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--proxy-server=http://${proxy}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ]
  });

  try {
    // FIX: Wait for the browser to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    const page = await browser.newPage();
    
    // Set a realistic timeout for proxy testing
    page.setDefaultNavigationTimeout(25000); 

    console.log(`Testing Proxy: ${proxy}...`);
    
    // Attempt to visit the target website
    const response = await page.goto('https://weddleunlimited.net', {
      waitUntil: 'networkidle2' // 'networkidle2' is safer for verifying full loads
    });

    // Check if the page loaded successfully (Status 200)
    if (response && response.status() === 200) {
      console.log(`✅ Success: ${proxy}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Failed: ${proxy} (${error.message})`);
  } finally {
    // Ensure the browser is closed even if an error occurs
    await browser.close();
  }
  return false;
}

(async () => {
  const inputFile = 'usproxy1.txt';
  const outputFile = 'goodipus3.txt';

  if (!fs.existsSync(inputFile)) {
    console.log(`Error: ${inputFile} not found!`);
    return;
  }

  const allProxies = fs.readFileSync(inputFile, 'utf-8')
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log(`Loaded ${allProxies.length} proxies for testing.`);
  
  // Clear the output file at the start of the session
  fs.writeFileSync(outputFile, '');

  let workingCount = 0;

  // Loop through and test them one by one
  for (const proxy of allProxies) {
    try {
        const isWorking = await checkProxy(proxy);
        if (isWorking) {
          workingCount++;
          fs.appendFileSync(outputFile, proxy + '\n');
        }
    } catch (loopError) {
        console.log(`Unexpected error during loop: ${loopError.message}`);
    }
  }

  console.log(`\n--- Testing Complete ---`);
  console.log(`Total Working Proxies Found: ${workingCount}`);
  console.log(`Results saved to: ${outputFile}`);
})();