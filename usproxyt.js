const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Add Stealth Plugin to bypass Cloudflare
puppeteer.use(StealthPlugin());

(async () => {
  console.log('--- STARTING 500-PAGE 4-DIGIT PORT SCRAPER ---');
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
    ]
  });

  const page = await browser.newPage();
  
  // Set realistic browser fingerprint
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  // Clear or create the file at start
  fs.writeFileSync('usproxy.txt', ''); 

  // --- LOOP UPDATED TO 500 ---
  for (let i = 1; i <= 500; i++) {
    const url = `https://www.freeproxy.world/?country=US&page=${i}`;
    console.log(`\n[Page ${i}/500] Fetching: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Selector based on your HTML structure
      await page.waitForSelector('.table-responsive table.table tbody tr', { timeout: 20000 });

      const proxies = await page.evaluate(() => {
        const rows = document.querySelectorAll('.table-responsive table.table tbody tr');
        const filteredList = [];
        
        rows.forEach(row => {
          // Column 1 = IP, Column 2 = Port
          const ip = row.querySelector('td:nth-child(1)')?.innerText.trim();
          const port = row.querySelector('td:nth-child(2)')?.innerText.trim();
          
          // Filter: Exactly 4 digits and numeric only
          if (ip && port && port.length === 4 && /^\d+$/.test(port)) {
            filteredList.push(`${ip}:${port}`);
          }
        });
        return filteredList;
      });

      if (proxies.length > 0) {
        fs.appendFileSync('usproxy.txt', proxies.join('\n') + '\n');
        console.log(`   + Success: Added ${proxies.length} proxies.`);
      } else {
        console.log('   ! Note: No 4-digit port proxies found on this page.');
      }

      // SAFER DELAY for high page counts (4-8 seconds)
      const waitTime = Math.floor(Math.random() * 4000) + 4000; 
      console.log(`   ...Sleeping for ${waitTime/1000}s...`);
      await new Promise(r => setTimeout(r, waitTime));

    } catch (error) {
      console.error(`   X Error on page ${i}: ${error.message}`);
      // If we hit a timeout/block, wait longer before trying next page
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  console.log('\n--- 500 PAGE TASK FINISHED ---');
  await browser.close();
})();