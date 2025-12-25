const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = 'https://ipscore.io/';
// const TARGET_URL = 'https://www.effectivegatecpm.com/j66m2x63d?key=ab70c564100a1e98821bcc01f456facf'; 

const WAIT_TIME_MS = 60000; // 1 minute

async function run() {
  // 1. Read IPs from file
  let proxies = [];
  try {
    const data = fs.readFileSync('goodip1.txt', 'utf8');
    // Split by new line and remove empty lines or whitespace
    proxies = data.split(/\r?\n/).filter(line => line.trim() !== '');
  } catch (err) {
    console.error('Error reading goodip1.txt. Make sure the file exists.');
    return;
  }

  console.log(`Found ${proxies.length} proxies in file.`);

  // 2. Loop through each proxy
  for (const [index, proxy] of proxies.entries()) {
    console.log(`\n[${index + 1}/${proxies.length}] Testing Proxy: ${proxy}`);

    const browser = await puppeteer.launch({
      headless: false, // Set to true if you want to hide the browser
      args: [
        `--proxy-server=http://${proxy}`, // Configure the proxy
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080'
      ],
    });

    const page = await browser.newPage();

    // Mask automation to ensure ipscore.io doesn't block you immediately
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // 3. Navigate to ipscore
      console.log('   Opening ipscore.io...');
      await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      
      console.log('   Page loaded. Waiting for 1 minute...');
      
      // 4. Wait for 1 minute
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

    } catch (error) {
      console.error(`   X Failed to load with proxy ${proxy}:`, error.message);
    } finally {
      // 5. Close browser and move to next
      console.log('   Closing browser...');
      await browser.close();
    }
  }

  console.log('\nAll proxies processed.');
}

run();