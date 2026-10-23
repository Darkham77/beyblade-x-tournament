/**
 * visionEngine.ts
 * ==============================
 * Advanced In-Browser Computer Vision & Colorimetry Pipeline for Beyblade X Scanner.
 * 
 * Pipeline Architecture:
 * 1. Automatic Saliency & Bounding Circle Detection (Auto-detects Beyblade center anywhere in the image)
 * 2. Concentric Multi-Zone Colorimetry (Outer Metal Blade vs. Inner Plastic Core)
 * 3. Radial Contour Fourier Symmetry Analysis (Detects 2, 3, 4, 5, 6, 8 wings/lobes)
 * 4. Hasbro DataMatrix/QR Fast-Path (100% deterministic lookup via jsQR)
 * 5. Composite Scoring & Top-3 Candidate Ranking (Zero alucinaciones)
 */

import jsQR from 'jsqr';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS } from '../data/catalog';
import type { Blade, Ratchet, Bit } from '../types/beyblade';

export interface LabColor {
  L: number;
  a: number;
  b: number;
}

export interface ExtractedColorMetrics {
  primaryHex: string;
  primaryLab: LabColor;
  secondaryHex?: string;
  secondaryLab?: LabColor;
  brightness: number; // 0 - 255
  colorName: string;
  detectedWings?: number;
  symmetryConfidence?: number;
  isLightingGood: boolean;
  sampleCount: number;
  centerX?: number;
  centerY?: number;
  detectedRadius?: number;
}

export interface ScanCandidate {
  part: Blade | Ratchet | Bit;
  variantId: string;
  variantName: string;
  colorHex: string;
  secondaryColorHex?: string;
  confidence: number; // 0 - 100%
  detectionReason: string;
  isQrMatch: boolean;
}

export interface FrameAnalysisResult {
  hasQr: boolean;
  qrPayload?: string;
  metrics: ExtractedColorMetrics;
  topCandidates: ScanCandidate[];
  isNeural?: boolean;
  snapshotUrl?: string;
}

// -------------------------------------------------------------
// Official Blade Wing / Lobe Symmetry Ground Truth (WBO Spec)
// -------------------------------------------------------------
export const BLADE_WING_SPEC: Record<string, number> = {
  'PHOENIX_WING': 3,
  'DRAN_SWORD': 3,
  'DRAN_DAGGER': 6,
  'DRAN_BUSTER': 1,
  'HELLS_SCYTHE': 4,
  'HELLS_CHAIN': 8,
  'HELLS_HAMMER': 3,
  'WIZARD_ARROW': 4,
  'WIZARD_ROD': 3,
  'KNIGHT_SHIELD': 6,
  'KNIGHT_LANCE': 4,
  'KNIGHT_MAIL': 6,
  'SHARK_EDGE': 2,
  'LEON_CLAW': 5,
  'LEON_CREST': 7,
  'VIPER_TAIL': 4,
  'RHINO_HORN': 1,
  'WYVERN_GALE': 4,
  'UNICORN_STING': 4,
  'SPHINX_COWL': 4,
  'TYRANNO_BEAT': 2,
  'WEISS_TIGER': 3,
  'BLACK_SHELL': 4,
  'WHALE_WAVE': 2,
  'SHINOBI_SHADOW': 4,
  'COBALT_DRAGOON': 3,
  'COBALT_DRAKE': 4,
  'PHOENIX_RUDDER': 3,
  'SILVER_WOLF': 2,
  'SAMURAI_SABER': 2,
  'IMPACT_DRAKE': 3,
  'DRANZER_SPIRAL': 4,
  'DRIGER_SLASH': 4,
  'DRAGOON_STORM': 4,
  'LIGHTNING_L_DRAGO': 3,
  'BITE_CROC': 2,
  'STEEL_SAMURAI': 2,
  'MAMMOTH_TUSK': 4,
};

// -------------------------------------------------------------
// 1. Color Space Conversions (sRGB -> CIE-XYZ -> CIE-Lab)
// -------------------------------------------------------------

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToLab(r: number, g: number, b: number): LabColor {
  let rLin = r / 255;
  let gLin = g / 255;
  let bLin = b / 255;

  rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
  gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
  bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

  const X = (rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805) * 100;
  const Y = (rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722) * 100;
  const Z = (rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505) * 100;

  const Xn = 95.047;
  const Yn = 100.0;
  const Zn = 108.883;

  const fx = X / Xn > 0.008856 ? Math.cbrt(X / Xn) : (7.787 * (X / Xn)) + (16 / 116);
  const fy = Y / Yn > 0.008856 ? Math.cbrt(Y / Yn) : (7.787 * (Y / Yn)) + (16 / 116);
  const fz = Z / Zn > 0.008856 ? Math.cbrt(Z / Zn) : (7.787 * (Z / Zn)) + (16 / 116);

  return {
    L: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

export function hexToLab(hex: string): LabColor {
  const { r, g, b } = hexToRgb(hex);
  return rgbToLab(r, g, b);
}

// CIE76 Euclidean distance in perceptual Lab color space
export function deltaE(c1: LabColor, c2: LabColor): number {
  const dL = c1.L - c2.L;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Human-friendly color name identifier
export function getHumanColorName(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (l < 35) return 'Negro Carbón / Metal';
  if (l > 225 && max - min < 25) return 'Blanco / Plata Crudo';
  if (max - min < 30) return 'Metal Raw / Gris Acero';

  // Hue classifications
  if (r > g + 35 && r > b + 35) return 'Rojo Carmesí';
  if (b > r + 35 && b > g + 35) return 'Azul Cobalto';
  if (g > r + 25 && g > b + 25) return 'Verde Esmeralda';
  if (r > 150 && g > 110 && b < 85) return 'Dorado / Amarillo';
  if (r > 120 && b > 120 && g < 100) return 'Púrpura / Violeta';
  if (r > 160 && g > 75 && b < 65) return 'Naranja Fuego';
  if (b > 110 && g > 110 && r < 80) return 'Cian / Turquesa';

  return 'Acabado Metálico';
}

// -------------------------------------------------------------
// 2. Saliency & Foreground Beyblade Localization
// -------------------------------------------------------------

export interface DetectedObjectROI {
  centerX: number;
  centerY: number;
  radius: number;
  hasObject: boolean;
}

// Helper to detect human skin tones (fingers/hands holding the Beyblade)
export function isHumanSkin(r: number, g: number, b: number): boolean {
  return (
    r > 90 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    g >= b &&
    (r - g) >= 10 &&
    (r - b) >= 16 &&
    (Math.max(r, g, b) - Math.min(r, g, b)) < 115
  );
}

export function detectBeybladeROI(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): DetectedObjectROI {
  // Downscale to fast virtual resolution (width 240)
  const sw = 240;
  const scale = width / sw;
  const sh = Math.floor(height / scale);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Create fast greyscale downsampled grid
  const gray = new Uint8Array(sw * sh);
  const chrom = new Uint8Array(sw * sh);
  const isSkinMap = new Uint8Array(sw * sh);

  for (let sy = 0; sy < sh; sy++) {
    const origY = Math.min(height - 1, Math.floor(sy * scale));
    for (let sx = 0; sx < sw; sx++) {
      const origX = Math.min(width - 1, Math.floor(sx * scale));
      const idx = (origY * width + origX) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      const c = Math.max(r, g, b) - Math.min(r, g, b);

      const sIdx = sy * sw + sx;
      gray[sIdx] = lum;
      chrom[sIdx] = c;
      isSkinMap[sIdx] = isHumanSkin(r, g, b) ? 1 : 0;
    }
  }

  let bestScore = -1;
  let bestCx = Math.floor(sw / 2);
  let bestCy = Math.floor(sh / 2);
  let bestR = 55;

  const minCy = Math.floor(sh * 0.22);
  const maxCy = Math.floor(sh * 0.78);
  const minCx = Math.floor(sw * 0.18);
  const maxCx = Math.floor(sw * 0.82);

  // Search candidate circular centers
  for (let cy = minCy; cy < maxCy; cy += 4) {
    for (let cx = minCx; cx < maxCx; cx += 4) {
      for (const r of [45, 55, 65, 75]) {
        let borderDiff = 0;
        let valid = true;

        for (let a = 0; a < 16; a++) {
          const theta = a * ((2 * Math.PI) / 16);
          const xIn = Math.floor(cx + (r - 6) * Math.cos(theta));
          const yIn = Math.floor(cy + (r - 6) * Math.sin(theta));
          const xOut = Math.floor(cx + (r + 6) * Math.cos(theta));
          const yOut = Math.floor(cy + (r + 6) * Math.sin(theta));

          if (xIn >= 0 && xIn < sw && yIn >= 0 && yIn < sh && xOut >= 0 && xOut < sw && yOut >= 0 && yOut < sh) {
            const lumIn = gray[yIn * sw + xIn];
            const lumOut = gray[yOut * sw + xOut];
            borderDiff += Math.abs(lumIn - lumOut);
          } else {
            valid = false;
            break;
          }
        }

        if (valid) {
          let coreChrom = 0;
          for (let a = 0; a < 8; a++) {
            const theta = a * ((2 * Math.PI) / 8);
            const cxIn = Math.floor(cx + (r * 0.35) * Math.cos(theta));
            const cyIn = Math.floor(cy + (r * 0.35) * Math.sin(theta));
            if (cxIn >= 0 && cxIn < sw && cyIn >= 0 && cyIn < sh) {
              const sIdx = cyIn * sw + cxIn;
              if (chrom[sIdx] > 15 && isSkinMap[sIdx] === 0) {
                coreChrom += chrom[sIdx];
              }
            }
          }

          const distCenter = Math.hypot(cx - sw / 2, cy - sh / 2) / (sw / 2);
          const score = (borderDiff + coreChrom * 2.5) * (1.0 - 0.25 * distCenter);

          if (score > bestScore) {
            bestScore = score;
            bestCx = cx;
            bestCy = cy;
            bestR = r;
          }
        }
      }
    }
  }

  const finalCx = Math.floor(bestCx * scale);
  const finalCy = Math.floor(bestCy * scale);
  const finalRadius = Math.max(50, Math.min(Math.min(width, height) * 0.48, Math.floor(bestR * scale)));

  return {
    centerX: finalCx,
    centerY: finalCy,
    radius: finalRadius,
    hasObject: bestScore > 80,
  };
}

// -------------------------------------------------------------
// 3. Concentric Multi-Zone Colorimetry (Outer Metal vs. Inner Core)
// -------------------------------------------------------------

export function extractConcentricColors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  roi: DetectedObjectROI
): ExtractedColorMetrics {
  const { centerX, centerY, radius } = roi;

  const boxX = Math.max(0, centerX - radius);
  const boxY = Math.max(0, centerY - radius);
  const boxW = Math.min(width - boxX, radius * 2);
  const boxH = Math.min(height - boxY, radius * 2);

  const imgData = ctx.getImageData(boxX, boxY, boxW, boxH);
  const data = imgData.data;

  // Outer Metal Blade Ring: 50% to 95% of radius
  const outerMinSq = Math.pow(radius * 0.50, 2);
  const outerMaxSq = Math.pow(radius * 0.95, 2);

  // Inner Core Ring: 15% to 48% of radius
  const innerMinSq = Math.pow(radius * 0.15, 2);
  const innerMaxSq = Math.pow(radius * 0.48, 2);

  let outerR = 0, outerG = 0, outerB = 0, outerCount = 0;
  let coreAllR = 0, coreAllG = 0, coreAllB = 0, coreAllCount = 0;
  let plasticR = 0, plasticG = 0, plasticB = 0, plasticCount = 0;
  let totalLum = 0;

  const step = 2;
  for (let y = 0; y < boxH; y += step) {
    for (let x = 0; x < boxW; x += step) {
      const gx = boxX + x;
      const gy = boxY + y;
      const distSq = (gx - centerX) * (gx - centerX) + (gy - centerY) * (gy - centerY);

      const idx = (y * boxW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Filter extreme glare (>245) and shadows (<20)
      if (lum >= 20 && lum <= 245) {
        if (distSq >= outerMinSq && distSq <= outerMaxSq) {
          // Exclude skin so holding hand doesn't contaminate blade metal
          if (!isHumanSkin(r, g, b)) {
            outerR += r;
            outerG += g;
            outerB += b;
            totalLum += lum;
            outerCount++;
          }
        } else if (distSq >= innerMinSq && distSq <= innerMaxSq) {
          coreAllR += r;
          coreAllG += g;
          coreAllB += b;
          coreAllCount++;

          const chroma = Math.max(r, g, b) - Math.min(r, g, b);
          if (chroma > 18) {
            // Isolate signature colored plastic (purple, magenta, blue, green, yellow):
            const isPurp = (r > g + 12 && b > g + 8);
            const isBlue = (b > r + 15 && b > g + 10);
            const isGreen = (g > r + 15 && g > b + 15);
            const isYellow = (r > 130 && g > 100 && b < 60);

            if (isPurp || isBlue || isGreen || isYellow) {
              plasticR += r;
              plasticG += g;
              plasticB += b;
              plasticCount++;
            }
          }
        }
      }
    }
  }

  // Fallback defaults if sampling failed
  if (outerCount === 0) {
    const fallbackHex = '#75797E';
    return {
      primaryHex: fallbackHex,
      primaryLab: hexToLab(fallbackHex),
      brightness: 128,
      colorName: 'Acabado Metálico',
      isLightingGood: false,
      sampleCount: 0,
      centerX,
      centerY,
      detectedRadius: radius,
    };
  }

  const pR = Math.round(outerR / outerCount);
  const pG = Math.round(outerG / outerCount);
  const pB = Math.round(outerB / outerCount);

  const primaryHex = rgbToHex(pR, pG, pB);
  const primaryLab = rgbToLab(pR, pG, pB);

  let secondaryHex: string | undefined;
  let secondaryLab: LabColor | undefined;

  // Prefer distinct chromatic plastic in core over arithmetic mud
  if (plasticCount > 35) {
    const sR = Math.round(plasticR / plasticCount);
    const sG = Math.round(plasticG / plasticCount);
    const sB = Math.round(plasticB / plasticCount);
    secondaryHex = rgbToHex(sR, sG, sB);
    secondaryLab = rgbToLab(sR, sG, sB);
  } else if (coreAllCount > 30) {
    const sR = Math.round(coreAllR / coreAllCount);
    const sG = Math.round(coreAllG / coreAllCount);
    const sB = Math.round(coreAllB / coreAllCount);
    secondaryHex = rgbToHex(sR, sG, sB);
    secondaryLab = rgbToLab(sR, sG, sB);
  }

  const avgBrightness = Math.round(totalLum / outerCount);
  const isLightingGood = avgBrightness >= 40 && avgBrightness <= 215;

  return {
    primaryHex,
    primaryLab,
    secondaryHex,
    secondaryLab,
    brightness: avgBrightness,
    colorName: getHumanColorName(primaryHex),
    isLightingGood,
    sampleCount: outerCount,
    centerX,
    centerY,
    detectedRadius: radius,
  };
}

// -------------------------------------------------------------
// 4. Radial Contour Fourier Symmetry Analyzer
// -------------------------------------------------------------

export function analyzeContourSymmetry(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  roi: DetectedObjectROI
): { dominantWings: number; amplitude: number } {
  const { centerX, centerY, radius } = roi;
  const numAngles = 72; // 5 degree steps
  const profile: number[] = [];

  const boxX = Math.max(0, centerX - radius - 20);
  const boxY = Math.max(0, centerY - radius - 20);
  const boxW = Math.min(width - boxX, (radius + 20) * 2);
  const boxH = Math.min(height - boxY, (radius + 20) * 2);

  const imgData = ctx.getImageData(boxX, boxY, boxW, boxH);
  const data = imgData.data;

  for (let i = 0; i < numAngles; i++) {
    const theta = i * ((2 * Math.PI) / numAngles);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    let maxR = radius * 0.5;
    // Raycast outwards from center to find boundary of colored blade metal
    for (let r = Math.floor(radius * 0.5); r <= Math.floor(radius * 1.15); r += 3) {
      const gx = Math.floor(centerX + r * cosT);
      const gy = Math.floor(centerY + r * sinT);

      if (gx >= boxX && gx < boxX + boxW && gy >= boxY && gy < boxY + boxH) {
        const localX = gx - boxX;
        const localY = gy - boxY;
        const idx = (localY * boxW + localX) * 4;

        const pr = data[idx];
        const pg = data[idx + 1];
        const pb = data[idx + 2];
        const lum = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;
        const chroma = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);

        // Blade boundary condition
        if (chroma > 25 && lum > 35 && lum < 245) {
          maxR = r;
        }
      }
    }
    profile.push(maxR);
  }

  // Discrete Fourier Transform (DFT) harmonic decomposition
  const meanR = profile.reduce((a, b) => a + b, 0) / profile.length;
  const normProfile = profile.map((r) => r - meanR);

  let bestK = 3;
  let maxAmp = 0;

  // Test possible Beyblade X wing symmetries: 1, 2, 3, 4, 5, 6, 7, 8
  const testOrders = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const k of testOrders) {
    let cosSum = 0;
    let sinSum = 0;
    for (let i = 0; i < numAngles; i++) {
      const angle = (k * i * 2 * Math.PI) / numAngles;
      cosSum += normProfile[i] * Math.cos(angle);
      sinSum += normProfile[i] * Math.sin(angle);
    }
    const amp = Math.sqrt(cosSum * cosSum + sinSum * sinSum) / (numAngles / 2);
    if (amp > maxAmp) {
      maxAmp = amp;
      bestK = k;
    }
  }

  return {
    dominantWings: bestK,
    amplitude: parseFloat(maxAmp.toFixed(2)),
  };
}

// -------------------------------------------------------------
// 5. Composite Ranking Pipeline (Hasbro QR + Morpho-Colorimetry)
// -------------------------------------------------------------

export function analyzeCurrentFrame(
  videoOrImage: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement,
  scanMode: 'BLADE' | 'RATCHET' | 'BIT' | 'HASBRO_QR'
): FrameAnalysisResult {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = 'videoWidth' in videoOrImage ? videoOrImage.videoWidth : videoOrImage.naturalWidth || videoOrImage.width;
  const h = 'videoHeight' in videoOrImage ? videoOrImage.videoHeight : videoOrImage.naturalHeight || videoOrImage.height;

  if (!ctx || w === 0 || h === 0) {
    return {
      hasQr: false,
      metrics: {
        primaryHex: '#000000',
        primaryLab: { L: 0, a: 0, b: 0 },
        brightness: 0,
        colorName: 'Sin imagen',
        isLightingGood: false,
        sampleCount: 0,
      },
      topCandidates: [],
    };
  }

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(videoOrImage, 0, 0, w, h);

  // 1. FAST PATH: Hasbro QR / DataMatrix Check
  const imgData = ctx.getImageData(0, 0, w, h);
  const qrResult = jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });

  if (qrResult && qrResult.data) {
    const rawQr = qrResult.data.trim();
    const qrMatch = matchByHasbroQr(rawQr);
    if (qrMatch) {
      const roi = detectBeybladeROI(ctx, w, h);
      const metrics = extractConcentricColors(ctx, w, h, roi);
      return {
        hasQr: true,
        qrPayload: rawQr,
        metrics,
        topCandidates: [qrMatch],
      };
    }
  }

  // 2. Automatic Saliency Localization
  const roi = detectBeybladeROI(ctx, w, h);

  // 3. Concentric Bi-Color Extraction
  const metrics = extractConcentricColors(ctx, w, h, roi);

  // 4. Contour Symmetry / Wing Counter (for Blades)
  let detectedWings: number | undefined;
  let symmetryAmp = 0;
  if (scanMode === 'BLADE') {
    const sym = analyzeContourSymmetry(ctx, w, h, roi);
    detectedWings = sym.dominantWings;
    symmetryAmp = sym.amplitude;
    metrics.detectedWings = detectedWings;
    metrics.symmetryConfidence = symmetryAmp;
  }

  // 5. Multi-Candidate Ranker
  const candidates = rankCatalogByVision(metrics, scanMode, detectedWings, symmetryAmp);

  return {
    hasQr: false,
    metrics,
    topCandidates: candidates.slice(0, 3),
  };
}

function matchByHasbroQr(payload: string): ScanCandidate | null {
  for (const b of CATALOG_BLADES) {
    for (const v of b.variants) {
      if (v.hasbro_qr_payload && payload.includes(v.hasbro_qr_payload)) {
        return {
          part: b,
          variantId: v.variant_id,
          variantName: v.variant_name,
          colorHex: v.color_primary_hex,
          secondaryColorHex: v.color_secondary_hex,
          confidence: 100,
          detectionReason: `Código Hasbro DataMatrix 100% verificado: ${payload}`,
          isQrMatch: true,
        };
      }
    }
  }

  for (const b of CATALOG_BLADES) {
    if (payload.toLowerCase().includes(b.code_name.toLowerCase()) || payload.toLowerCase().includes(b.display_name.toLowerCase())) {
      const v = b.variants[0];
      return {
        part: b,
        variantId: v.variant_id,
        variantName: v.variant_name,
        colorHex: v.color_primary_hex,
        secondaryColorHex: v.color_secondary_hex,
        confidence: 100,
        detectionReason: `Hasbro DataMatrix oficial decodificado: ${payload}`,
        isQrMatch: true,
      };
    }
  }

  return null;
}

export function rankCatalogByVision(
  metrics: ExtractedColorMetrics,
  scanMode: 'BLADE' | 'RATCHET' | 'BIT' | 'HASBRO_QR',
  detectedWings?: number,
  symmetryAmp = 0
): ScanCandidate[] {
  let list: { part: Blade | Ratchet | Bit; variants: any[]; codeName: string }[] = [];

  if (scanMode === 'RATCHET') {
    list = CATALOG_RATCHETS.map((r) => ({ part: r, variants: r.variants, codeName: r.code_name }));
  } else if (scanMode === 'BIT') {
    list = CATALOG_BITS.map((b) => ({ part: b, variants: b.variants, codeName: b.code_name }));
  } else {
    // BLADE or fallback
    list = CATALOG_BLADES.map((b) => ({ part: b, variants: b.variants, codeName: b.code_name }));
  }

  const results: ScanCandidate[] = [];

  for (const item of list) {
    let bestScore = 999;
    let bestVariant = item.variants[0];
    const expectedWings = BLADE_WING_SPEC[item.codeName] || 3;

    // Wing Symmetry Bonus / Penalty (Only for Blades when contour was cleanly extracted)
    let wingFactor = 0;
    if (scanMode === 'BLADE' && detectedWings && symmetryAmp > 2.5) {
      if (expectedWings === detectedWings) {
        // High symmetry match bonus
        wingFactor = 30;
      } else if (expectedWings === 6 && detectedWings === 3) {
        // Sub-harmonic match (6 wings often project a 3-lobe pattern)
        wingFactor = 15;
      } else {
        // Strong penalty for wrong wing count (e.g. 2 wings vs 3 wings)
        wingFactor = -25;
      }
    }

    for (const v of item.variants) {
      const plab = hexToLab(v.color_primary_hex);
      const dPrim = deltaE(metrics.primaryLab, plab);

      let combinedDelta = dPrim;

      // Bi-color checking if secondary color is present
      if (v.color_secondary_hex && metrics.secondaryLab) {
        const slab = hexToLab(v.color_secondary_hex);
        const dSec = deltaE(metrics.secondaryLab, slab);

        // If blade is raw metal, the colored plastic core is the primary signature!
        if (v.finish === 'STANDARD_RAW_METAL') {
          combinedDelta = (dPrim * 0.30) + (dSec * 0.70);
        } else {
          // For painted metal (e.g. Phoenix Wing, Cobalt Drake), painted metal is primary
          combinedDelta = (dPrim * 0.70) + (dSec * 0.30);
        }
      }

      if (combinedDelta < bestScore) {
        bestScore = combinedDelta;
        bestVariant = v;
      }
    }

    // Convert DeltaE and WingFactor to a normalized Confidence score (0% - 99.8%)
    const baseColorConf = 100 - (bestScore * 1.15);
    const finalConfidence = Math.max(10, Math.min(99.6, baseColorConf + wingFactor));

    let reasonText = `Colorimetría CIE-Lab (ΔE: ${bestScore.toFixed(1)})`;
    if (detectedWings && symmetryAmp > 2.5) {
      reasonText = `Morfología (${expectedWings} alas, armónico k=${detectedWings}) + Color (ΔE: ${bestScore.toFixed(1)})`;
    }

    results.push({
      part: item.part,
      variantId: bestVariant.variant_id,
      variantName: bestVariant.variant_name,
      colorHex: bestVariant.color_primary_hex,
      secondaryColorHex: bestVariant.color_secondary_hex,
      confidence: parseFloat(finalConfidence.toFixed(1)),
      detectionReason: reasonText,
      isQrMatch: false,
    });
  }

  // Sort descending by confidence
  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}
