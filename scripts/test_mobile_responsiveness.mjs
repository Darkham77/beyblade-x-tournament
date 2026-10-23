import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT_DIR = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/scratch/mobile_screenshots';
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'iPhone_5_320x568', width: 320, height: 568 },
  { name: 'Galaxy_S8_360x640', width: 360, height: 640 },
  { name: 'iPhone_SE_375x667', width: 375, height: 667 },
  { name: 'iPhone_14_390x844', width: 390, height: 844 },
  { name: 'Pixel_7_412x915', width: 412, height: 915 },
];

async function run() {
  console.log('Launching Edge for mobile responsiveness audit...');
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n==================================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`==================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(500);

    // Switch to Scanner tab (select the visible tab button)
    const scannerTab = page.locator('button:has-text("Escáner"):visible, button:has-text("Escáner IA"):visible').first();
    await scannerTab.click();
    await page.waitForTimeout(600);

    // Check overflow on initial scanner view
    const initialOverflow = await page.evaluate(() => {
      const winW = window.innerWidth;
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const overflowingElements = [];

      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1) {
          overflowingElements.push({
            tag: el.tagName,
            class: (el.className || '').toString().slice(0, 50),
            text: (el.textContent || '').trim().slice(0, 25),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });

      return {
        winW,
        docW,
        bodyW,
        hasOverflow: docW > winW || bodyW > winW,
        overflowingCount: overflowingElements.length,
        samples: overflowingElements.slice(0, 3)
      };
    });

    console.log(`  [Initial View] Window: ${initialOverflow.winW}px | Document: ${initialOverflow.docW}px | Overflow: ${initialOverflow.hasOverflow ? '❌ YES' : '✅ NO'}`);
    if (initialOverflow.hasOverflow) {
      console.log('  ⚠️ Overflowing samples:', JSON.stringify(initialOverflow.samples, null, 2));
    }

    const initialScreenshotPath = path.join(OUT_DIR, `${vp.name}_01_initial.png`);
    await page.screenshot({ path: initialScreenshotPath });

    // Scroll so simulation buttons are clearly visible above the bottom navigation bar
    const simDran = page.locator('button:has-text("Dran Sword"):visible').first();
    if (await simDran.count() > 0) {
      await simDran.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -100));
      await page.waitForTimeout(200);
      await simDran.click();
      await page.waitForTimeout(700); // wait for simulated scan
    }

    // Check overflow with Results Card open
    const resultsOverflow = await page.evaluate(() => {
      const winW = window.innerWidth;
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const overflowingElements = [];

      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1) {
          overflowingElements.push({
            tag: el.tagName,
            class: (el.className || '').toString().slice(0, 50),
            text: (el.textContent || '').trim().slice(0, 25),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });

      return {
        winW,
        docW,
        bodyW,
        hasOverflow: docW > winW || bodyW > winW,
        overflowingCount: overflowingElements.length,
        samples: overflowingElements.slice(0, 3)
      };
    });

    console.log(`  [Results View] Window: ${resultsOverflow.winW}px | Document: ${resultsOverflow.docW}px | Overflow: ${resultsOverflow.hasOverflow ? '❌ YES' : '✅ NO'}`);
    if (resultsOverflow.hasOverflow) {
      console.log('  ⚠️ Overflowing samples:', JSON.stringify(resultsOverflow.samples, null, 2));
    }

    const resultsScreenshotPath = path.join(OUT_DIR, `${vp.name}_02_results.png`);
    await page.screenshot({ path: resultsScreenshotPath, fullPage: true });

    report.push({
      viewport: vp.name,
      screen_width: vp.width,
      initial_doc_w: initialOverflow.docW,
      initial_overflow: initialOverflow.hasOverflow ? 'FAIL ❌' : 'PASS ✅',
      results_doc_w: resultsOverflow.docW,
      results_overflow: resultsOverflow.hasOverflow ? 'FAIL ❌' : 'PASS ✅'
    });

    await context.close();
  }

  await browser.close();

  console.log('\n=============================================================================');
  console.log('             PLAYWRIGHT MOBILE RESPONSIVENESS AUDIT RESULTS                  ');
  console.log('=============================================================================');
  console.table(report);

  const anyFail = report.some(r => r.initial_overflow.includes('FAIL') || r.results_overflow.includes('FAIL'));
  if (anyFail) {
    console.error('\n❌ AUDIT FAILED: One or more viewports had horizontal overflow.');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL VIEWPORTS PASSED! Zero horizontal overflow across all tested mobile screens.');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
