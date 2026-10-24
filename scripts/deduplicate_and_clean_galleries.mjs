import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys';
const PUBLIC_DIR = path.join(ROOT_DIR, 'app', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const GALLERY_DIR = path.join(IMAGES_DIR, 'gallery');

function hash(filePath) {
  try {
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
  } catch (e) {
    return null;
  }
}

const BIT_NAME_TO_FILE = {
  'F': 'bit_flat.png', 'LF': 'bit_low_flat.png', 'GF': 'bit_gear_flat.png', 'A': 'bit_accel.png',
  'R': 'bit_rush.png', 'Q': 'bit_quake.png', 'C': 'bit_cyclone.png', 'L': 'bit_level.png',
  'LR': 'bit_low_rush.png', 'B': 'bit_ball.png', 'DB': 'bit_disc_ball.png', 'O': 'bit_orb.png',
  'G': 'bit_glide.png', 'FB': 'bit_free_ball.png', 'N': 'bit_needle.png', 'HN': 'bit_high_needle.png',
  'GN': 'bit_gear_needle.png', 'H': 'bit_hexa.png', 'MN': 'bit_metal_needle.png', 'BS': 'bit_bound_spike.png',
  'T': 'bit_taper.png', 'HT': 'bit_high_taper.png', 'P': 'bit_point.png', 'GP': 'bit_gear_point.png',
  'U': 'bit_unite.png', 'E': 'bit_elevate.png', 'TP': 'bit_trans_point.png', 'V': 'bit_vortex.png',
  'D': 'bit_dot.png', 'W': 'bit_wedge.png', 'WB': 'bit_wall_ball.png', 'LO': 'bit_low_orb.png',
  'RA': 'bit_rubber_accel.png'
};

const categories = [
  {
    name: 'blades',
    partsDir: path.join(IMAGES_DIR, 'parts', 'blades'),
    getBaseFile: (code) => path.join(IMAGES_DIR, 'parts', 'blades', `${code.toLowerCase()}.png`)
  },
  {
    name: 'ratchets',
    partsDir: path.join(IMAGES_DIR, 'parts', 'ratchets'),
    getBaseFile: (code) => path.join(IMAGES_DIR, 'parts', 'ratchets', `ratchet_${code.toLowerCase()}.png`)
  },
  {
    name: 'bits',
    partsDir: path.join(IMAGES_DIR, 'parts', 'bits'),
    getBaseFile: (code) => path.join(IMAGES_DIR, 'parts', 'bits', BIT_NAME_TO_FILE[code] || `bit_${code.toLowerCase()}.png`)
  }
];

let deletedCount = 0;
let keptCount = 0;

console.log('=== INICIANDO LIMPIEZA DE FOTOS DUPLICADAS Y CLONES ===');

for (const cat of categories) {
  const catGalleryDir = path.join(GALLERY_DIR, cat.name);
  if (!fs.existsSync(catGalleryDir)) continue;

  const partFolders = fs.readdirSync(catGalleryDir);
  for (const partCode of partFolders) {
    const partFolder = path.join(catGalleryDir, partCode);
    if (!fs.statSync(partFolder).isDirectory()) continue;

    const baseFilePath = cat.getBaseFile(partCode);
    const baseHash = fs.existsSync(baseFilePath) ? hash(baseFilePath) : null;

    const seenHashes = new Set();
    if (baseHash) {
      seenHashes.add(baseHash);
    }

    const files = fs.readdirSync(partFolder).sort();
    for (const file of files) {
      const filePath = path.join(partFolder, file);
      const h = hash(filePath);
      if (!h) continue;

      if (seenHashes.has(h)) {
        console.log(`[DELETE] ${cat.name}/${partCode}/${file} (Duplicado idéntico al render base u otra foto)`);
        fs.unlinkSync(filePath);
        deletedCount++;
      } else {
        seenHashes.add(h);
        keptCount++;
      }
    }
  }
}

console.log(`\nLimpieza completa: ${deletedCount} archivos duplicados eliminados. ${keptCount} fotos genuinas conservadas.`);
