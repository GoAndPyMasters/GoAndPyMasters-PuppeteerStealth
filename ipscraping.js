const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs'); // Built-in module to handle files

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = 'https://free-proxy-list.net/en/us-proxy.html';
  
  try {
    console.log("Navigating to site...");
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the specific proxy table to load
    await page.waitForSelector('#list tbody tr');

    const proxies = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#list tbody tr'));
      
      return rows
        .map(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length > 1) {
            const ip = cells[0].innerText.trim();
            const port = cells[1].innerText.trim();
            
            // Regex to verify it is a valid IP format
            const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
            return isIp ? `${ip}:${port}` : null;
          }
          return null;
        })
        .filter(item => item !== null);
    });

    // --- NEW: SAVE TO TXT FILE ---
    if (proxies.length > 0) {
      // Join the array into a single string with new lines
      const fileContent = proxies.join('\n');
      
      fs.writeFileSync('proxies.txt', fileContent);
      console.log(`Success! ${proxies.length} proxies saved to proxies.txt`);
    } else {
      console.log("No proxies found to save.");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();