import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\parts\\blades';
const GAL_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys\\app\\public\\images\\gallery\\blades';

const BLADES_TO_FETCH = [
  { code: 'CRIMSON_GARUDA', search: 'CrimsonGaruda 4-70TP' },
  { code: 'SHELTER_DRAKE', search: 'ShelterDrake 7-80GP' },
  { code: 'SHINOBI_KNIFE', search: 'ShinobiKnife 4-60LF' },
  { code: 'GHOST_CIRCLE', search: 'GhostCircle 0-80GB' },
  { code: 'AERO_PEGASUS', search: 'AeroPegasus 3-70A' },
  { code: 'OROCHI_CLUSTER', search: 'OrochiCluster 6-60LF' },
  { code: 'TALON_PTERA', search: 'Talon Ptera' },
  { code: 'ROAR_TYRANNO', search: 'Roar Tyranno' },
  { code: 'YELL_KONG', search: 'Yell Kong' },
  { code: 'DRACIEL_SHIELD', search: 'DracielShield' },
  { code: 'STORM_PEGASIS', search: 'StormPegasis' },
  { code: 'VICTORY_VALKYRIE', search: 'VictoryValkyrie' },
  { code: 'DRAN_BRAVE', search: 'DranBrave' },
  { code: 'WIZARD_ARC', search: 'WizardArc' },
  { code: 'PERSEUS_DARK', search: 'PerseusDark' },
  { code: 'HELLS_REAPER', search: 'HellsReaper' },
  { code: 'FOX_BRUSH', search: 'FoxBrush' },
  { code: 'CERBERUS_FLAME', search: 'CerberusFlame' },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (const item of BLADES_TO_FETCH) {
    const filename = `${item.code.toLowerCase()}.png`;
    const destPath = path.join(OUT_DIR, filename);
    const galFolder = path.join(GAL_DIR, item.code.toLowerCase());
    fs.mkdirSync(galFolder, { recursive: true });

    console.log(`\nSearching for ${item.code} (${item.search})...`);
    try {
      const searchUrl = `https://beyblade.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(item.search)}&format=json`;
      const searchRes = await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      const searchJson = await searchRes.json();
      
      const hits = searchJson?.query?.search || [];
      if (hits.length === 0) {
        console.warn(`No search results for ${item.code}`);
        continue;
      }

      const bestTitle = hits[0].title;
      console.log(`Found page: "${bestTitle}"`);

      const wikiPageUrl = `https://beyblade.fandom.com/wiki/${encodeURIComponent(bestTitle.replace(/ /g, '_'))}`;
      await page.goto(wikiPageUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

      const imgUrls = await page.evaluate(() => {
        const results = [];
        const imgs = document.querySelectorAll('.pi-image-thumbnail, a.image img, .wikia-gallery-item img');
        for (const img of imgs) {
          if (img.src && !img.src.includes('avatar') && !img.src.includes('logo')) {
            results.push(img.src);
          }
        }
        return results;
      });

      console.log(`Found ${imgUrls.length} image(s) on ${bestTitle}`);

      if (imgUrls.length > 0) {
        // Download main image
        const cleanMain = imgUrls[0].split('/revision')[0];
        const res = await page.goto(cleanMain, { timeout: 15000 });
        const buf = await res.buffer();
        fs.writeFileSync(destPath, buf);
        console.log(`  -> Saved MAIN image (${buf.length} bytes) to ${destPath}`);

        // Save up to 2 gallery images
        for (let g = 0; g < Math.min(3, imgUrls.length); g++) {
          try {
            const cleanG = imgUrls[g].split('/revision')[0];
            const gRes = await page.goto(cleanG, { timeout: 15000 });
            const gBuf = await gRes.buffer();
            const gPath = path.join(galFolder, `${item.code.toLowerCase()}_${g}.png`);
            fs.writeFileSync(gPath, gBuf);
          } catch (e) {
            // Ignore gallery download errors
          }
        }
      }
    } catch (err) {
      console.error(`Error processing ${item.code}:`, err.message);
    }
  }

  await browser.close();
  console.log('\nAll missing blade images processed!');
}

run().catch(console.error);
