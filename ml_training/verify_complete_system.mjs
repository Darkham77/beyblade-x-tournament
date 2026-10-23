import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BLADES_DIR = 'C:\\Users\\Ro\\Desktop\\blades';
const PARTS_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\blades';

const TEST_CASES = [
  { name: 'Dran Sword (Red Ver. Recolor)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.29 (1).jpeg'), expected: 'Dran Sword' },
  { name: 'Dran Sword (Blue Standard)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.28 (2).jpeg'), expected: 'Dran Sword' },
  { name: 'Phoenix Wing (Red Attack)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-21 at 21.33.48.jpeg'), expected: 'Phoenix Wing' },
  { name: 'Wizard Rod (Stamina Meta)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-21 at 21.34.07.jpeg'), expected: 'Wizard Rod' },
  { name: 'Mammoth Tusk (Hasbro Excl)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-21 at 21.36.38.jpeg'), expected: 'Mammoth Tusk' },
  { name: 'Unicorn Sting (Balance)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-21 at 21.37.12.jpeg'), expected: 'Unicorn Sting' },
  { name: 'Dranzer Spiral (X-Over)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.27.jpeg'), expected: 'Dranzer Spiral' },
  { name: 'Viper Tail (Stamina)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.28 (1).jpeg'), expected: 'Viper Tail' },
  { name: 'Dran Dagger (Six-Wing)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.29 (2).jpeg'), expected: 'Dran Dagger' },
  { name: 'Dran Buster (UX Smash)', file: path.join(BLADES_DIR, 'WhatsApp Image 2026-10-22 at 11.51.30.jpeg'), expected: 'Dran Buster' },
  { name: 'Bear Scratch (BX-37 New)', file: path.join(PARTS_DIR, 'bear_scratch.png'), expected: 'Bear Scratch' },
  { name: 'Dran Brave (CX-01 Modular)', file: path.join(PARTS_DIR, 'dran_brave.png'), expected: 'Dran Brave' },
];

async function run() {
  console.log('Launching Edge for Comprehensive End-to-End System Test...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 });

  console.log('Loading app at http://localhost:5173/ ...');
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

  await new Promise(r => setTimeout(r, 1200));

  let passed = 0;
  console.log('\n================== RUNNING END-TO-END INFERENCE TESTS ==================');
  
  for (const tc of TEST_CASES) {
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(tc.file);

    // Wait for neural inference & UI update
    await new Promise(r => setTimeout(r, 1500));

    const result = await page.evaluate(() => {
      const candidateName = document.querySelector('h3')?.innerText || 'Unknown';
      const confidenceText = document.querySelector('span.uppercase.tracking-wider')?.innerText || '';
      return { candidateName, confidenceText };
    });

    const isMatch = result.candidateName.toLowerCase().includes(tc.expected.toLowerCase());
    if (isMatch) passed++;
    const status = isMatch ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} | ${tc.name.padEnd(28)} | Got: ${result.candidateName.padEnd(16)} | Conf: ${result.confidenceText}`);
  }

  console.log(`\nFinal Test Suite Result: ${passed}/${TEST_CASES.length} (${((passed/TEST_CASES.length)*100).toFixed(1)}%) Passed!`);
  await browser.close();
}

run().catch(console.error);
