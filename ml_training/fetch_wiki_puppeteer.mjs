import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('Navigating to BearScratch wiki...');
  await page.goto('https://beyblade.fandom.com/wiki/BearScratch_5-60F', { waitUntil: 'domcontentloaded', timeout: 20000 });

  const imgSrc = await page.evaluate(() => {
    const img = document.querySelector('.pi-image-thumbnail') || document.querySelector('a.image img');
    return img ? img.src : null;
  });

  console.log('Found image source:', imgSrc);

  if (imgSrc) {
    const cleanUrl = imgSrc.split('/revision')[0];
    const viewSource = await page.goto(cleanUrl);
    const buffer = await viewSource.buffer();
    const outPath = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\blades\\bear_scratch.png';
    fs.writeFileSync(outPath, buffer);
    console.log('Saved image successfully to', outPath, 'bytes:', buffer.length);
  }

  await browser.close();
}

test().catch(console.error);
