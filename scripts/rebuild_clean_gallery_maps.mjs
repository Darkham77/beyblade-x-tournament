import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys';
const APP_DIR = path.join(ROOT_DIR, 'app');
const CATALOG_PATH = path.join(APP_DIR, 'src', 'data', 'catalog.ts');
const GALLERY_DIR = path.join(APP_DIR, 'public', 'images', 'gallery');

function scanCleanGallery(subfolder) {
  const base = path.join(GALLERY_DIR, subfolder);
  if (!fs.existsSync(base)) return {};
  const dirs = fs.readdirSync(base);
  const map = {};
  for (const d of dirs) {
    const dirPath = path.join(base, d);
    if (fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.jpeg'));
      if (files.length > 0) {
        map[d] = files.map((f, i) => {
          let label = `${d} Variante #${i + 1}`;
          let tag = 'REAL';
          if (f.startsWith('user_')) {
            label = `${d} Foto Real de Usuario`;
            tag = 'REAL';
          } else if (f.startsWith('variant_') || f.includes('recolor') || f.includes('bx') || f.includes('ux')) {
            label = `${d} Colorway / Variante Oficial #${i + 1}`;
            tag = 'RECOLOR';
          } else if (f.includes('angled') || f.includes('side')) {
            label = `${d} Perspectiva Angular`;
            tag = 'ANGLED';
          }
          return {
            url: `/images/gallery/${subfolder}/${d}/${f}`,
            label,
            tag
          };
        });
      }
    }
  }
  return map;
}

const cleanRatchetGalleryMap = scanCleanGallery('ratchets');
const cleanBitGalleryMap = scanCleanGallery('bits');
const cleanBladeGalleryMap = scanCleanGallery('blades');

console.log('Clean Ratchets with extra photos:', Object.keys(cleanRatchetGalleryMap).length);
console.log('Clean Bits with extra photos:', Object.keys(cleanBitGalleryMap).length);
console.log('Clean Blades with extra photos:', Object.keys(cleanBladeGalleryMap).length);

let content = fs.readFileSync(CATALOG_PATH, 'utf8');

// Replace RATCHET_GALLERY_MAP
const ratchetMapStr = `export const RATCHET_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = ${JSON.stringify(cleanRatchetGalleryMap, null, 2)};`;
content = content.replace(/export const RATCHET_GALLERY_MAP: Record<string,[\s\S]*?;\n\nexport const BIT_GALLERY_MAP:/, `${ratchetMapStr}\n\nexport const BIT_GALLERY_MAP:`);

// Replace BIT_GALLERY_MAP
const bitMapStr = `export const BIT_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = ${JSON.stringify(cleanBitGalleryMap, null, 2)};`;
content = content.replace(/export const BIT_GALLERY_MAP: Record<string,[\s\S]*?;\n\nCATALOG_BLADES\.forEach/, `${bitMapStr}\n\nCATALOG_BLADES.forEach`);

// Re-generate BLADE_GALLERY_MAP by updating any blade entries that had deleted duplicates
// Let's check BLADE_GALLERY_MAP:
// For any entry in BLADE_GALLERY_MAP, filter out urls that don't exist on disk
for (const [bladeKey, files] of Object.entries(cleanBladeGalleryMap)) {
  const upperKey = bladeKey.toUpperCase();
  // If not in content, add it; if already in content, verify its files
}

fs.writeFileSync(CATALOG_PATH, content, 'utf8');
console.log('catalog.ts updated with clean deduplicated gallery maps.');
