with open('C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/src/utils/visionEngine.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update BLADE_WING_SPEC
text = text.replace("'MAMMOTH_TUSK': 2,", "'MAMMOTH_TUSK': 4,")

# 2. Add isHumanSkin helper and new detectBeybladeROI
skin_helper = """// Helper to detect human skin tones (fingers/hands holding the Beyblade)
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
"""

idx_start = text.find('export function detectBeybladeROI')
idx_end = text.find('export function extractConcentricColors')

new_roi_func = """export function detectBeybladeROI(
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
"""

text = text[:idx_start] + skin_helper + '\n' + new_roi_func + '\n// -------------------------------------------------------------\n// 3. Concentric Multi-Zone Colorimetry (Outer Metal vs. Inner Core)\n// -------------------------------------------------------------\n\n' + text[idx_end:]

# 3. Update extractConcentricColors to filter skin on metal ring and cluster plastic on core
old_extract_start = text.find('export function extractConcentricColors(')
old_extract_end = text.find('export function analyzeContourSymmetry(')

new_extract_func = """export function extractConcentricColors(
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
"""

text = text[:old_extract_start] + new_extract_func + '\n// -------------------------------------------------------------\n// 4. Radial Contour Fourier Symmetry Analyzer\n// -------------------------------------------------------------\n\n' + text[old_extract_end:]

# 4. Update rankCatalogByVision to handle finish-based delta weighting
old_rank_start = text.find('export function rankCatalogByVision(')
new_rank_func = """export function rankCatalogByVision(
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
"""

text = text[:old_rank_start] + new_rank_func

with open('C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/src/utils/visionEngine.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('visionEngine.ts successfully updated!')
