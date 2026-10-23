import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PARTS_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\blades';

async function testDranBrave() {
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
  console.log('Testing upload of Dran Brave:', testFile);
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(testFile);

  await new Promise(r => setTimeout(r, 2500));

  const result = await page.evaluate(() => {
    const candidateName = document.querySelector('h3')?.innerText;
    const confidenceText = document.querySelector('span.uppercase.tracking-wider')?.innerText;
    const badge = document.querySelector('.bg-cyan-950')?.innerText;
    return { candidateName, confidenceText, badge };
  });

  console.log('Browser Result for Dran Brave:', JSON.stringify(result, null, 2));

  await browser.close();
}

testDranBrave().catch(console.error);
