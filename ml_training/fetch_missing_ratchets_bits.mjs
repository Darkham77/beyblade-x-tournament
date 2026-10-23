import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const RATCHET_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\ratchets';
const BIT_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\bits';

const RATCHETS_TO_FETCH = [
  { code: '6-60', search: 'Ratchet - 6-60' },
  { code: '0-80', search: 'Ratchet - 0-80' },
  { code: 's6-60', search: 'Ratchet - S6-60' },
  { code: '2-80', search: 'Ratchet - 2-80' },
  { code: '7-80', search: 'Ratchet - 7-80' },
  { code: '4-55', search: 'Ratchet - 4-55' },
  { code: '6-80', search: 'Ratchet - 6-80' },
  { code: '8-80', search: 'Ratchet - 8-80' },
  { code: '0-60', search: 'Ratchet - 0-60' },
  { code: '0-70', search: 'Ratchet - 0-70' },
];

const BITS_TO_FETCH = [
  { code: 'vortex', search: 'Bit - Vortex' },
  { code: 'trans_point', search: 'Bit - Trans Point' },
  { code: 'bound_spike', search: 'Bit - Bound Spike' },
  { code: 'upper', search: 'Bit - Upper' },
  { code: 'dot', search: 'Bit - Dot' },
  { code: 'wedge', search: 'Bit - Wedge' },
  { code: 'wall_ball', search: 'Bit - Wall Ball' },
  { code: 'low_orb', search: 'Bit - Low Orb' },
  { code: 'rubber_accel', search: 'Bit - Rubber Accel' },
  { code: 'low_rush', search: 'Bit - Low Rush' },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Fetch Ratchets
  for (const item of RATCHETS_TO_FETCH) {
    const filename = `ratchet_${item.code}.png`;
    const dest = path.join(RATCHET_DIR, filename);
    if (fs.existsSync(dest)) continue;

    console.log(`Searching Ratchet: ${item.search}...`);
    try {
      const searchUrl = `https://beyblade.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(item.search)}&format=json`;
      const searchRes = await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      const searchJson = await searchRes.json();
      const hits = searchJson?.query?.search || [];
      if (hits.length === 0) continue;

      const title = hits[0].title;
      console.log(`  Found: ${title}`);
      await page.goto(`https://beyblade.fandom.com/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const imgSrc = await page.evaluate(() => {
        const img = document.querySelector('.pi-image-thumbnail') || document.querySelector('a.image img');
        return img ? img.src : null;
      });

      if (imgSrc) {
        const clean = imgSrc.split('/revision')[0];
        const res = await page.goto(clean, { timeout: 12000 });
        const buf = await res.buffer();
        fs.writeFileSync(dest, buf);
        console.log(`  -> Saved Ratchet ${dest} (${buf.length} bytes)`);
      }
    } catch (e) {
      console.warn(`  Failed ${item.code}:`, e.message);
    }
  }

  // Fetch Bits
  for (const item of BITS_TO_FETCH) {
    const filename = `bit_${item.code}.png`;
    const dest = path.join(BIT_DIR, filename);
    if (fs.existsSync(dest)) continue;

    console.log(`Searching Bit: ${item.search}...`);
    try {
      const searchUrl = `https://beyblade.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(item.search)}&format=json`;
      const searchRes = await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      const searchJson = await searchRes.json();
      const hits = searchJson?.query?.search || [];
      if (hits.length === 0) continue;

      const title = hits[0].title;
      console.log(`  Found: ${title}`);
      await page.goto(`https://beyblade.fandom.com/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const imgSrc = await page.evaluate(() => {
        const img = document.querySelector('.pi-image-thumbnail') || document.querySelector('a.image img');
        return img ? img.src : null;
      });

      if (imgSrc) {
        const clean = imgSrc.split('/revision')[0];
        const res = await page.goto(clean, { timeout: 12000 });
        const buf = await res.buffer();
        fs.writeFileSync(dest, buf);
        console.log(`  -> Saved Bit ${dest} (${buf.length} bytes)`);
      }
    } catch (e) {
      console.warn(`  Failed ${item.code}:`, e.message);
    }
  }

  await browser.close();
  console.log('All missing Ratchets & Bits fetched!');
}

run().catch(console.error);
