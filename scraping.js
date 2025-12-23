const puppeteer = require('puppeteer');
const URL = 'https://en.wikipedia.org/wiki/Tando_Soomro';

async function simulateVisit(){

    const browser = await puppeteer.launch({

        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(URL)
    const data = await page.evaluate(() => {
        const title = document.querySelector('#firstHeading').innerText;
        const allParagraphs = Array.from(document.querySelectorAll('#mw-content-text p'));
        const firstRealParagraph = allParagraphs.find(p => p.innerText.trim().length > 0);
        return {
            title : title,
            summary: firstRealParagraph ? firstRealParagraph.innerText : "Paragraph not found"
        };
    });
    console.log(data.title);
    console.log(data.summary);
    await browser.close();
}

simulateVisit();