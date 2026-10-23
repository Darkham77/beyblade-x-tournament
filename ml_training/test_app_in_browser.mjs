import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching Headless Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Download the React DevTools') && !text.includes('[vite]')) {
      console.log('  [BROWSER CONSOLE]', msg.type(), text);
    }
  });
  page.on('pageerror', err => console.error('  [PAGE ERROR]', err));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // Click Escáner IA tab
  console.log('Clicking Escáner IA tab...');
  const tabs = await page.$$('nav button');
  for (const t of tabs) {
    const txt = await t.evaluate(el => el.innerText);
    if (txt.includes('Escáner')) {
      await t.click();
      console.log('Clicked:', txt);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  const bladesDir = 'C:\\Users\\Ro\\Desktop\\blades';
  const testFiles = [
    ['WhatsApp Image 2026-10-22 at 11.51.27.jpeg', 'DRANZER_SPIRAL'],
    ['WhatsApp Image 2026-10-22 at 11.51.28 (1).jpeg', 'VIPER_TAIL'],
    ['WhatsApp Image 2026-10-22 at 11.51.28 (2).jpeg', 'DRAN_SWORD'],
    ['WhatsApp Image 2026-10-22 at 11.51.28.jpeg', 'UNICORN_STING'],
    ['WhatsApp Image 2026-10-22 at 11.51.29 (1).jpeg', 'HELLS_CHAIN'],
    ['WhatsApp Image 2026-10-22 at 11.51.29 (2).jpeg', 'DRAN_DAGGER'],
    ['WhatsApp Image 2026-10-22 at 11.51.29.jpeg', 'PHOENIX_WING'],
    ['WhatsApp Image 2026-10-22 at 11.51.30.jpeg', 'DRAN_BUSTER'],
  ];

  for (const [fname, expected] of testFiles) {
    const filePath = path.join(bladesDir, fname);
    console.log(`\n========================================`);
    console.log(`Testing: ${fname} (Expected: ${expected})`);
    
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      console.error('File input not found on scanner tab!');
      break;
    }

    await fileInput.uploadFile(filePath);
    await new Promise(r => setTimeout(r, 2500)); // wait for neural inference

    const result = await page.evaluate(() => {
      // Find candidate cards or headers
      const partName = document.querySelector('h3')?.innerText || 'No h3';
      const reason = document.querySelector('.text-slate-400.text-xs')?.innerText || '';
      const confidence = document.querySelector('.text-emerald-400')?.innerText || '';
      const badge = document.querySelector('.bg-cyan-950')?.innerText || '';
      const allH4 = Array.from(document.querySelectorAll('h4')).map(h => h.innerText);
      return { partName, reason, confidence, badge, allH4 };
    });

    console.log(`PREDICTION in UI:`, result.partName, '| Conf:', result.confidence, '| Badge:', result.badge);
  }

  await browser.close();
  console.log('\nAll tests finished.');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
