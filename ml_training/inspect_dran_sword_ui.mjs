import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  page.on('console', msg => console.log('  [CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('  [PAGE ERROR]', err));

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

  const bladesDir = 'C:\\Users\\Ro\\Desktop\\blades';
  const dranSwordFile = path.join(bladesDir, 'WhatsApp Image 2026-10-22 at 11.51.28 (2).jpeg');

  console.log('Testing upload of Dran Sword file:', dranSwordFile);
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(dranSwordFile);

  await new Promise(r => setTimeout(r, 3000));

  const detailedResult = await page.evaluate(() => {
    const candidateName = document.querySelector('h3')?.innerText;
    const codeName = document.querySelector('.bg-cyan-950')?.innerText;
    const confidenceText = document.querySelector('.text-emerald-400')?.innerText;
    const otherCandidates = Array.from(document.querySelectorAll('h4')).map(h => h.innerText);
    return { candidateName, codeName, confidenceText, otherCandidates };
  });

  console.log('Detailed UI Result for Dran Sword:', JSON.stringify(detailedResult, null, 2));

  await browser.close();
}

run().catch(console.error);
