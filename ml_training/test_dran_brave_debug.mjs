import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PARTS_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\blades';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // Navigate to scanner tab
  const tabs = await page.$$('nav button');
  for (const t of tabs) {
    const txt = await t.evaluate(el => el.innerText);
    if (txt.includes('Escáner')) {
      await t.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  const testFile = path.join(PARTS_DIR, 'dran_brave.png');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(testFile);

  await new Promise(r => setTimeout(r, 2000));

  const details = await page.evaluate(() => {
    // Look at candidate card
    const card = document.querySelector('.bg-slate-900\\/95');
    return card ? card.innerText : 'NO CARD';
  });

  console.log('CARD TEXT:\n', details);

  await browser.close();
}

test().catch(console.error);
