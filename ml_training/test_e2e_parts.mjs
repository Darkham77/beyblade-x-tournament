import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const TEST_CASES = [
  {
    mode: 'BLADE',
    buttonText: 'Blade (Capa)',
    filePath: 'C:\\Users\\Ro\\Desktop\\blades\\WhatsApp Image 2026-10-22 at 11.51.29 (1).jpeg',
    expectedPart: 'Dran Sword'
  },
  {
    mode: 'RATCHET',
    buttonText: 'Ratchet (Disco)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\ratchets\\ratchet_3-60.png',
    expectedPart: '3-60'
  },
  {
    mode: 'RATCHET',
    buttonText: 'Ratchet (Disco)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\ratchets\\ratchet_5-60.png',
    expectedPart: '5-60'
  },
  {
    mode: 'BIT',
    buttonText: 'Bit (Punta)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\bits\\bit_flat.png',
    expectedPart: 'Flat'
  },
  {
    mode: 'BIT',
    buttonText: 'Bit (Punta)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\bits\\bit_ball.png',
    expectedPart: 'Ball'
  },
  {
    mode: 'BIT',
    buttonText: 'Bit (Punta)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\bits\\bit_needle.png',
    expectedPart: 'Needle'
  },
  {
    mode: 'BIT',
    buttonText: 'Bit (Punta)',
    filePath: 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\bits\\bit_taper.png',
    expectedPart: 'Taper'
  }
];

async function run() {
  console.log('🚀 Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[ORT]') || text.includes('Error') || text.includes('Neural')) {
      console.log(`[Browser Console] ${text}`);
    }
  });

  console.log('🌐 Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Scanner tab
  console.log('📷 Switching to Escáner IA tab...');
  const navButtons = await page.$$('nav button');
  for (const btn of navButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Escáner IA')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  let allPassed = true;

  for (const tc of TEST_CASES) {
    console.log(`\n========================================`);
    console.log(`🧪 Testing Mode: [${tc.mode}] with file: ${path.basename(tc.filePath)}`);
    console.log(`========================================`);

    // Always toggle to guarantee scanResult is cleared
    const otherBtnText = tc.mode === 'BLADE' ? 'Ratchet (Disco)' : 'Blade (Capa)';
    let buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes(otherBtnText)) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 300));

    // Now click the target mode button
    buttons = await page.$$('button');
    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes(tc.buttonText)) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      console.error(`❌ Could not find button with text: ${tc.buttonText}`);
      allPassed = false;
      continue;
    }
    await new Promise(r => setTimeout(r, 500));

    // Upload file
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      console.error(`❌ Could not find file input element`);
      allPassed = false;
      continue;
    }

    await fileInput.uploadFile(tc.filePath);

    // Wait for analysis to complete (up to 15s for ONNX WASM initialization)
    console.log('⏳ Waiting for neural inference result...');
    let detectedPart = null;
    let confidence = null;
    let isNeural = false;

    const startTime = Date.now();
    while (Date.now() - startTime < 15000) {
      const card = await page.$('.animate-in');
      if (card) {
        const textContent = await page.evaluate(el => el.textContent, card);
        if (textContent) {
          const h3 = await page.$('.animate-in h3');
          if (h3) {
            detectedPart = await page.evaluate(el => el.textContent, h3);
          }
          isNeural = textContent.includes('Red Neuronal') || textContent.includes('MobileNetV3');
          const confMatch = textContent.match(/(\d+(\.\d+)?)%\s*(de certeza)?/);
          if (confMatch) {
            confidence = confMatch[1];
          }
          break;
        }
      }
      await new Promise(r => setTimeout(r, 400));
    }

    if (!detectedPart) {
      console.error(`❌ Inference timeout or no result card rendered!`);
      allPassed = false;
    } else {
      const match = detectedPart.toLowerCase().includes(tc.expectedPart.toLowerCase());
      console.log(`🎯 Detected Part: "${detectedPart}"`);
      console.log(`📊 Confidence: ${confidence}%`);
      console.log(`🧠 Neural Engine Used: ${isNeural ? 'YES (MobileNetV3)' : 'NO'}`);
      console.log(`Result: ${match ? '✅ MATCH' : '⚠️ MISMATCH'}`);
      if (!match) allPassed = false;
    }
  }

  await browser.close();
  console.log(`\n========================================`);
  console.log(`🏁 Overall Test Result: ${allPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
  console.log(`========================================\n`);
  process.exit(allPassed ? 0 : 1);
}

run().catch(err => {
  console.error('Fatal error during E2E test:', err);
  process.exit(1);
});
