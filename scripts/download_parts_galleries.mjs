import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Ro/node_modules/puppeteer-core');
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function computeBufferHash(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT_DIR = 'C:\\Users\\Ro\\.gemini\\antigravity\\scratch\\scanner-de-beys';
const PUBLIC_DIR = path.join(ROOT_DIR, 'app', 'public');
const RATCHET_PARTS_DIR = path.join(PUBLIC_DIR, 'images', 'parts', 'ratchets');
const BIT_PARTS_DIR = path.join(PUBLIC_DIR, 'images', 'parts', 'bits');

const RATCHET_GALLERY_DIR = path.join(PUBLIC_DIR, 'images', 'gallery', 'ratchets');
const BIT_GALLERY_DIR = path.join(PUBLIC_DIR, 'images', 'gallery', 'bits');

const RATCHET_CLASSES = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'models', 'ratchet_classes.json'), 'utf-8'));
const BIT_CLASSES = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'models', 'bit_classes.json'), 'utf-8'));

const BIT_NAME_TO_CODE = {
  'flat': 'F',
  'low_flat': 'LF',
  'gear_flat': 'GF',
  'accel': 'A',
  'rush': 'R',
  'quake': 'Q',
  'cyclone': 'C',
  'level': 'L',
  'low_rush': 'LR',
  'rubber_accel': 'RA',
  'ball': 'B',
  'disc_ball': 'DB',
  'disk_ball': 'DB',
  'orb': 'O',
  'glide': 'G',
  'free_ball': 'FB',
  'low_orb': 'LO',
  'wall_ball': 'WB',
  'needle': 'N',
  'high_needle': 'HN',
  'gear_needle': 'GN',
  'hexa': 'H',
  'metal_needle': 'MN',
  'bound_spike': 'BS',
  'dot': 'D',
  'wedge': 'W',
  'taper': 'T',
  'high_taper': 'HT',
  'point': 'P',
  'gear_point': 'GP',
  'unite': 'U',
  'elevate': 'E',
  'trans_point': 'TP',
  'vortex': 'V'
};

const BIT_CODE_TO_WIKI = {
  'F': ['Bit - Flat'],
  'LF': ['Bit - Low Flat'],
  'GF': ['Bit - Gear Flat'],
  'A': ['Bit - Accel'],
  'R': ['Bit - Rush'],
  'Q': ['Bit - Quake'],
  'C': ['Bit - Cyclone'],
  'L': ['Bit - Level'],
  'LR': ['Bit - Low Rush'],
  'RA': ['Bit - Rubber Accel'],
  'B': ['Bit - Ball'],
  'DB': ['Bit - Disc Ball', 'Bit - Disk Ball'],
  'O': ['Bit - Orb'],
  'G': ['Bit - Glide'],
  'FB': ['Bit - Free Ball'],
  'LO': ['Bit - Low Orb'],
  'WB': ['Bit - Wall Ball'],
  'N': ['Bit - Needle'],
  'HN': ['Bit - High Needle'],
  'GN': ['Bit - Gear Needle'],
  'H': ['Bit - Hexa'],
  'MN': ['Bit - Metal Needle'],
  'BS': ['Bit - Bound Spike'],
  'D': ['Bit - Dot'],
  'W': ['Bit - Wedge'],
  'T': ['Bit - Taper'],
  'HT': ['Bit - High Taper'],
  'P': ['Bit - Point'],
  'GP': ['Bit - Gear Point'],
  'U': ['Bit - Unite'],
  'E': ['Bit - Elevate'],
  'TP': ['Bit - Trans Point'],
  'V': ['Bit - Vortex']
};

const BANNED_PATTERNS = [
  'icon', 'logo', 'symbol', 'flag', 'badge', 'banner', 'warning',
  'takara', 'hasbro', 'placeholder', 'dot_trans', 'arrow', 'line',
  'series', 'trailer', 'episode', 'anime', 'manga', 'poster', 'box'
];

function isImageAllowed(filename) {
  const lower = filename.toLowerCase();
  if (!lower.endsWith('.png') && !lower.endsWith('.jpg') && !lower.endsWith('.jpeg') && !lower.endsWith('.webp')) {
    return false;
  }
  for (const b of BANNED_PATTERNS) {
    if (lower.includes(b)) return false;
  }
  return true;
}

async function fetchWikiPageInfo(wikiTitle) {
  const url = `https://beyblade.fandom.com/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&redirects=1&prop=images|revisions&rvprop=content&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined) return [];

    const fileTitles = new Set();
    if (Array.isArray(page.images)) {
      for (const img of page.images) {
        if (img.title && isImageAllowed(img.title)) {
          fileTitles.add(img.title);
        }
      }
    }

    const content = page?.revisions?.[0]?.['*'] || '';
    const galleryMatches = content.match(/<gallery[\s\S]*?<\/gallery>/gi) || [];
    for (const gal of galleryMatches) {
      for (const line of gal.split('\n')) {
        const clean = line.trim().split('|')[0].trim();
        if (clean && isImageAllowed(clean)) {
          const formatted = clean.startsWith('File:') ? clean : `File:${clean}`;
          fileTitles.add(formatted);
        }
      }
    }

    const fileMatches = content.match(/\[\[(?:File|Image):([^\|\]]+)/gi) || [];
    for (const f of fileMatches) {
      const clean = f.replace(/^\[\[(File|Image):/i, '').trim();
      if (clean && isImageAllowed(clean)) {
        fileTitles.add(`File:${clean}`);
      }
    }

    return Array.from(fileTitles);
  } catch (err) {
    console.error(`Error querying wiki for ${wikiTitle}:`, err.message);
    return [];
  }
}

async function resolveDirectUrls(fileTitles) {
  if (fileTitles.length === 0) return [];
  const results = [];
  const chunkSize = 15;
  for (let i = 0; i < fileTitles.length; i += chunkSize) {
    const chunk = fileTitles.slice(i, i + chunkSize);
    const titlesParam = chunk.map(t => encodeURIComponent(t)).join('|');
    const url = `https://beyblade.fandom.com/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await res.json();
      const pages = data?.query?.pages || {};
      for (const p of Object.values(pages)) {
        if (p.imageinfo && p.imageinfo.length > 0) {
          const directUrl = p.imageinfo[0].url;
          results.push({ title: p.title, url: directUrl });
        }
      }
    } catch (e) {
      console.warn(`Error resolving image URLs:`, e.message);
    }
  }
  return results;
}

async function main() {
  console.log('====================================================');
  console.log('🚀 INICIANDO DESCARGA AUTOMATIZADA DE GALERÍAS REALES');
  console.log('====================================================');

  fs.mkdirSync(RATCHET_GALLERY_DIR, { recursive: true });
  fs.mkdirSync(BIT_GALLERY_DIR, { recursive: true });

  console.log('Iniciando navegador Edge con bypass Cloudflare...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Estableciendo sesión con Beyblade Wiki...');
  await page.goto('https://beyblade.fandom.com/wiki/Ratchet_-_3-60', { waitUntil: 'domcontentloaded' });
  console.log('Sesión activa.\n');

  let totalRatchetsImages = 0;
  let totalBitsImages = 0;

  // 1. RATCHETS
  console.log('--- 🛡️ PROCESANDO RATCHETS ---');
  for (const ratchetCode of RATCHET_CLASSES) {
    const targetDir = path.join(RATCHET_GALLERY_DIR, ratchetCode.toLowerCase());
    fs.mkdirSync(targetDir, { recursive: true });

    const seenHashes = new Set();
    const baseFiles = [
      `ratchet_${ratchetCode.toLowerCase()}.png`,
      `ratchet_${ratchetCode.toUpperCase()}.png`
    ];
    for (const bf of baseFiles) {
      const src = path.join(RATCHET_PARTS_DIR, bf);
      if (fs.existsSync(src)) {
        seenHashes.add(computeBufferHash(fs.readFileSync(src)));
        break;
      }
    }

    const wikiTitles = [`Ratchet - ${ratchetCode}`];
    if (ratchetCode.startsWith('S') || ratchetCode.startsWith('s')) {
      wikiTitles.push(`Ratchet - ${ratchetCode.substring(1)}`);
    }

    const allFileTitles = new Set();
    for (const wt of wikiTitles) {
      const files = await fetchWikiPageInfo(wt);
      files.forEach(f => allFileTitles.add(f));
    }

    const directList = await resolveDirectUrls(Array.from(allFileTitles));
    let downloadedCount = 0;
    let idx = 1;

    for (const item of directList) {
      const ext = path.extname(item.url.split('?')[0]) || '.png';
      const destFile = path.join(targetDir, `variant_${String(idx).padStart(2, '0')}${ext}`);
      
      try {
        const resp = await page.goto(item.url, { waitUntil: 'domcontentloaded' });
        if (resp && resp.status() === 200) {
          const buf = await resp.buffer();
          const bufHash = computeBufferHash(buf);
          if (buf.length > 5000 && !seenHashes.has(bufHash)) {
            seenHashes.add(bufHash);
            fs.writeFileSync(destFile, buf);
            downloadedCount++;
            idx++;
          }
        }
      } catch (err) {
        // Continuar con la siguiente
      }
    }

    const totalInDir = fs.readdirSync(targetDir).length;
    totalRatchetsImages += totalInDir;
    console.log(`[Ratchet ${ratchetCode.padEnd(5)}] Wiki encontró: ${directList.length.toString().padStart(2)} fotos | Total guardado: ${totalInDir}`);
  }

  // 2. BITS
  console.log('\n--- ⚡ PROCESANDO BITS ---');
  for (const bitCode of BIT_CLASSES) {
    const targetDir = path.join(BIT_GALLERY_DIR, bitCode);
    fs.mkdirSync(targetDir, { recursive: true });

    const seenHashes = new Set();
    let baseFileName = '';
    for (const [name, code] of Object.entries(BIT_NAME_TO_CODE)) {
      if (code === bitCode) {
        const candidate = `bit_${name}.png`;
        if (fs.existsSync(path.join(BIT_PARTS_DIR, candidate))) {
          baseFileName = candidate;
          break;
        }
      }
    }
    if (baseFileName) {
      seenHashes.add(computeBufferHash(fs.readFileSync(path.join(BIT_PARTS_DIR, baseFileName))));
    }

    const wikiTitles = BIT_CODE_TO_WIKI[bitCode] || [];
    const allFileTitles = new Set();
    for (const wt of wikiTitles) {
      const files = await fetchWikiPageInfo(wt);
      files.forEach(f => allFileTitles.add(f));
    }

    const directList = await resolveDirectUrls(Array.from(allFileTitles));
    let downloadedCount = 0;
    let idx = 1;

    for (const item of directList) {
      const ext = path.extname(item.url.split('?')[0]) || '.png';
      const destFile = path.join(targetDir, `variant_${String(idx).padStart(2, '0')}${ext}`);
      
      try {
        const resp = await page.goto(item.url, { waitUntil: 'domcontentloaded' });
        if (resp && resp.status() === 200) {
          const buf = await resp.buffer();
          const bufHash = computeBufferHash(buf);
          if (buf.length > 3000 && !seenHashes.has(bufHash)) {
            seenHashes.add(bufHash);
            fs.writeFileSync(destFile, buf);
            downloadedCount++;
            idx++;
          }
        }
      } catch (err) {
        // Continuar
      }
    }

    const totalInDir = fs.readdirSync(targetDir).length;
    totalBitsImages += totalInDir;
    console.log(`[Bit ${bitCode.padEnd(4)}] Wiki encontró: ${directList.length.toString().padStart(2)} fotos | Total guardado: ${totalInDir}`);
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('✅ DESCARGA Y ORGANIZACIÓN FINALIZADA CON ÉXITO');
  console.log(`📸 Total fotos de Ratchets: ${totalRatchetsImages}`);
  console.log(`📸 Total fotos de Bits:     ${totalBitsImages}`);
  console.log('====================================================');
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
