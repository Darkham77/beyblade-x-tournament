/**
 * neuralVisionEngine.ts
 * =====================
 * On-Device Deep Learning Inference Engine for Beyblade X Scanner.
 * 
 * Multi-Part Architecture:
 * - BLADE: MobileNetV3 Fine-Tuned on Beyblade X (57 official classes: BX, UX, CX, X-Over, Hasbro)
 * - RATCHET: MobileNetV3 Fine-Tuned on Ratchets (30 classes: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 protrusions)
 * - BIT: MobileNetV3 Fine-Tuned on Bits (33 classes: Flat, Ball, Needle, Taper, Point, Accel, etc.)
 * 
 * Training:
 * - Continuous 360-degree rotation, specular flash glare, finger occlusion, chromatic color-shift invariance
 * - Runtime: onnxruntime-web via WebAssembly / WebGL (100% offline, zero server latency)
 * - Input: 224x224 RGB ImageNet normalized tensor
 * - Output: Softmax posterior distribution across all official releases
 */

import * as ort from 'onnxruntime-web';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS } from '../data/catalog';
import type { Blade, Ratchet, Bit } from '../types/beyblade';
import type { ScanCandidate, FrameAnalysisResult } from './visionEngine';
import jsQR from 'jsqr';

// Configure ONNX Runtime to load local WASM binaries
try {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = '/onnx/';
} catch (e) {
  console.warn('ORT WASM path init:', e);
}

export type ScanModeKey = 'BLADE' | 'RATCHET' | 'BIT';

interface SessionData {
  sessionPromise: Promise<ort.InferenceSession> | null;
  classesPromise: Promise<string[]> | null;
  modelUrl: string;
  classesUrl: string;
}

const SESSIONS: Record<ScanModeKey, SessionData> = {
  BLADE: {
    sessionPromise: null,
    classesPromise: null,
    modelUrl: '/models/beyblade_mobilenet_v3.onnx?v=v5_all_57_classes',
    classesUrl: '/models/beyblade_classes.json?v=v5_all_57_classes',
  },
  RATCHET: {
    sessionPromise: null,
    classesPromise: null,
    modelUrl: '/models/ratchet_mobilenet_v3.onnx?v=v4_wood_final',
    classesUrl: '/models/ratchet_classes.json?v=v4_wood_final',
  },
  BIT: {
    sessionPromise: null,
    classesPromise: null,
    modelUrl: '/models/bit_mobilenet_v3.onnx?v=v5_wood_final',
    classesUrl: '/models/bit_classes.json?v=v5_wood_final',
  },
};

export async function getInferenceSessionForMode(mode: ScanModeKey): Promise<ort.InferenceSession> {
  const cfg = SESSIONS[mode];
  if (!cfg.sessionPromise) {
    cfg.sessionPromise = (async () => {
      try {
        const session = await ort.InferenceSession.create(cfg.modelUrl, {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all',
        });
        console.log(`[ORT] ${mode} ONNX Session initialized successfully with WASM engine`);
        return session;
      } catch (err) {
        console.error(`[ORT] Failed to create ${mode} session with wasm:`, err);
        cfg.sessionPromise = null;
        throw err;
      }
    })();
  }
  return cfg.sessionPromise;
}

export async function getClassNamesForMode(mode: ScanModeKey): Promise<string[]> {
  const cfg = SESSIONS[mode];
  if (!cfg.classesPromise) {
    cfg.classesPromise = (async () => {
      try {
        const res = await fetch(cfg.classesUrl);
        const data = await res.json();
        console.log(`[ORT] Loaded ${data.length} ${mode} classes`);
        return data as string[];
      } catch (e) {
        console.error(`Failed to fetch ${mode} class names:`, e);
        if (mode === 'RATCHET') return CATALOG_RATCHETS.map((r) => r.code_name);
        if (mode === 'BIT') return CATALOG_BITS.map((b) => b.code_name);
        return CATALOG_BLADES.map((b) => b.code_name);
      }
    })();
  }
  return cfg.classesPromise;
}

// Backward compatibility helper
export async function getInferenceSession(): Promise<ort.InferenceSession> {
  return getInferenceSessionForMode('BLADE');
}

export async function getClassNames(): Promise<string[]> {
  return getClassNamesForMode('BLADE');
}

function getSourceDimensions(source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): { width: number; height: number } {
  if ('videoWidth' in source && typeof source.videoWidth === 'number') {
    return { width: source.videoWidth, height: source.videoHeight };
  }
  if ('naturalWidth' in source && typeof source.naturalWidth === 'number') {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

/**
 * Preprocesses input visual stream to 224x224 RGB Float32 tensor normalized to ImageNet statistics.
 */
function preprocessToTensor(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  targetSize = 224
): { tensor: ort.Tensor; sampleHex: string; cropDataUrl: string } {
  const offscreen = document.createElement('canvas');
  offscreen.width = targetSize;
  offscreen.height = targetSize;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const { width: sw, height: sh } = getSourceDimensions(source);
  const isVideo = 'videoWidth' in source && typeof source.videoWidth === 'number';

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, targetSize, targetSize);

  if (isVideo) {
    // Intelligent adaptive crop for live video stream:
    // If the input is already a focused square photo (ratio ~1:1), don't discard outer edges (use 0.95)
    // If it's a full camera stream or rectangular phone photo, zoom into the central reticle (use 0.60)
    const aspect = sw / sh;
    const isAlreadyFocused = aspect >= 0.82 && aspect <= 1.22;
    const cropRatio = isAlreadyFocused ? 0.95 : 0.60;

    const minDim = Math.min(sw, sh);
    const cropSize = Math.max(120, Math.floor(minDim * cropRatio));
    const sx = Math.floor((sw - cropSize) / 2);
    const sy = Math.floor((sh - cropSize) / 2);

    ctx.drawImage(source, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);
  } else {
    // For uploaded static photos:
    // If the image is non-square (like vertical or landscape phone captures),
    // focus on the central region where the user centered the piece (simulating the reticle focus).
    const aspect = sw / sh;
    if (aspect < 0.85 || aspect > 1.15) {
      // Rectangular capture: crop the central 70% of the shortest dimension
      const minDim = Math.min(sw, sw > sh ? sh : sw);
      const cropSize = Math.max(160, Math.floor(minDim * 0.70));
      const sx = Math.floor((sw - cropSize) / 2);
      const sy = Math.floor((sh - cropSize) / 2);
      ctx.drawImage(source, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);
    } else {
      // Already roughly square: fit with minimal padding
      ctx.drawImage(source, 0, 0, sw, sh, 0, 0, targetSize, targetSize);
    }
  }

  // Adaptive Lighting / Contrast Normalization (Simulate flashlight under dim conditions)
  const initialData = ctx.getImageData(0, 0, targetSize, targetSize).data;
  let totalLuma = 0;
  for (let i = 0; i < initialData.length; i += 4) {
    totalLuma += 0.299 * initialData[i] + 0.587 * initialData[i + 1] + 0.114 * initialData[i + 2];
  }
  const avgLuma = totalLuma / (targetSize * targetSize);

  // If dim lighting detected (mean luma < 110), apply a dynamic contrast & brightness boost
  if (avgLuma < 110) {
    const boostContrast = Math.min(1.45, Math.max(1.15, 120 / Math.max(avgLuma, 35)));
    ctx.filter = `contrast(${boostContrast.toFixed(2)}) brightness(1.22)`;
    ctx.drawImage(offscreen, 0, 0);
    ctx.filter = 'none';
  }

  const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
  const { data } = imgData;

  const numPixels = targetSize * targetSize;
  const floatData = new Float32Array(3 * numPixels);

  // ImageNet normalization parameters
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];

  let centerR = 0, centerG = 0, centerB = 0, centerCount = 0;
  const mid = targetSize / 2;
  const rLimit = targetSize * 0.25;

  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 4] / 255.0;
    const g = data[i * 4 + 1] / 255.0;
    const b = data[i * 4 + 2] / 255.0;

    // R channel
    floatData[i] = (r - mean[0]) / std[0];
    // G channel
    floatData[numPixels + i] = (g - mean[1]) / std[1];
    // B channel
    floatData[2 * numPixels + i] = (b - mean[2]) / std[2];

    // Sample center color for HUD
    const px = i % targetSize;
    const py = Math.floor(i / targetSize);
    if (Math.hypot(px - mid, py - mid) < rLimit) {
      centerR += data[i * 4];
      centerG += data[i * 4 + 1];
      centerB += data[i * 4 + 2];
      centerCount++;
    }
  }

  const sampleHex = `#${Math.round(centerR / centerCount).toString(16).padStart(2, '0')}${Math.round(centerG / centerCount).toString(16).padStart(2, '0')}${Math.round(centerB / centerCount).toString(16).padStart(2, '0')}`.toUpperCase();

  const tensor = new ort.Tensor('float32', floatData, [1, 3, targetSize, targetSize]);
  const cropDataUrl = offscreen.toDataURL('image/jpeg', 0.85);
  return { tensor, sampleHex, cropDataUrl };
}

/**
 * Executes on-device neural inference for BLADE, RATCHET, or BIT and returns top-3 predicted candidates.
 */
export async function analyzeWithNeuralVision(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  scanMode: 'BLADE' | 'RATCHET' | 'BIT' | 'HASBRO_QR' = 'BLADE'
): Promise<FrameAnalysisResult> {
  const activeMode: ScanModeKey = scanMode === 'RATCHET' ? 'RATCHET' : scanMode === 'BIT' ? 'BIT' : 'BLADE';

  // 1. FAST PATH: Check for Hasbro QR / DataMatrix if in BLADE or QR mode
  const qrCanvas = document.createElement('canvas');
  const { width: sw, height: sh } = getSourceDimensions(source);
  qrCanvas.width = sw;
  qrCanvas.height = sh;
  const qrCtx = qrCanvas.getContext('2d', { willReadFrequently: true });
  let qrFound: string | null = null;

  if (qrCtx && (scanMode === 'BLADE' || scanMode === 'HASBRO_QR')) {
    qrCtx.drawImage(source, 0, 0, sw, sh);
    const imgData = qrCtx.getImageData(0, 0, sw, sh);
    const qrResult = jsQR(imgData.data, sw, sh, { inversionAttempts: 'attemptBoth' });
    if (qrResult && qrResult.data) {
      qrFound = qrResult.data.trim();
    }
  }

  // 2. Prepare Neural Network Preprocessing
  const { tensor, sampleHex, cropDataUrl } = preprocessToTensor(source);
  const session = await getInferenceSessionForMode(activeMode);
  const classNames = await getClassNamesForMode(activeMode);

  // 3. Run Inference
  const feeds: Record<string, ort.Tensor> = { input: tensor };
  const outputMap = await session.run(feeds);
  const outputTensor = outputMap[Object.keys(outputMap)[0]];
  const logits = outputTensor.data as Float32Array;

  // 4. Compute Softmax Probabilities
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }

  let sumExp = 0;
  const exps = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    exps[i] = Math.exp(logits[i] - maxLogit);
    sumExp += exps[i];
  }

  const probs = new Float32Array(logits.length);
  const rankedIndices: number[] = [];
  for (let i = 0; i < logits.length; i++) {
    probs[i] = exps[i] / sumExp;
    rankedIndices.push(i);
  }

  // Sort descending by probability
  rankedIndices.sort((a, b) => probs[b] - probs[a]);

  // 5. Map to Official Catalog Items
  const candidates: ScanCandidate[] = [];

  const bladeMap = new Map<string, Blade>();
  CATALOG_BLADES.forEach((b) => bladeMap.set(b.code_name, b));

  const ratchetMap = new Map<string, Ratchet>();
  CATALOG_RATCHETS.forEach((r) => ratchetMap.set(r.code_name, r));

  const bitMap = new Map<string, Bit>();
  CATALOG_BITS.forEach((b) => bitMap.set(b.code_name, b));

  for (let i = 0; i < Math.min(3, rankedIndices.length); i++) {
    const idx = rankedIndices[i];
    const codeName = classNames[idx];
    const prob = probs[idx];

    let part: Blade | Ratchet | Bit;
    if (activeMode === 'RATCHET') {
      part = ratchetMap.get(codeName) || CATALOG_RATCHETS[0];
    } else if (activeMode === 'BIT') {
      part = bitMap.get(codeName) || CATALOG_BITS[0];
    } else {
      part = bladeMap.get(codeName) || CATALOG_BLADES[0];
    }

    const variant = part.variants[0] || {
      variant_id: 'default',
      variant_name: part.display_name,
      color_primary_hex: '#75797E',
    };

    const confidencePct = parseFloat((prob * 100).toFixed(1));

    candidates.push({
      part,
      variantId: variant.variant_id,
      variantName: variant.variant_name,
      colorHex: variant.color_primary_hex,
      secondaryColorHex: variant.color_secondary_hex,
      confidence: confidencePct,
      detectionReason: `Red Neuronal MobileNetV3 (${activeMode}) - Probabilidad: ${confidencePct}%`,
      isQrMatch: false,
    });
  }

  // If Hasbro QR code was detected, prioritize it as #1 with 100%
  if (qrFound && activeMode === 'BLADE') {
    for (const b of CATALOG_BLADES) {
      for (const v of b.variants) {
        if (v.hasbro_qr_payload && qrFound.includes(v.hasbro_qr_payload)) {
          const qrCandidate: ScanCandidate = {
            part: b,
            variantId: v.variant_id,
            variantName: v.variant_name,
            colorHex: v.color_primary_hex,
            secondaryColorHex: v.color_secondary_hex,
            confidence: 100,
            detectionReason: `Código Hasbro DataMatrix Verificado: ${qrFound}`,
            isQrMatch: true,
          };
          candidates.unshift(qrCandidate);
          break;
        }
      }
    }
  }

  return {
    hasQr: Boolean(qrFound),
    qrPayload: qrFound || undefined,
    metrics: {
      primaryHex: sampleHex,
      primaryLab: { L: 50, a: 0, b: 0 },
      brightness: 128,
      colorName: activeMode === 'RATCHET' ? 'Ratchet Neuronal' : activeMode === 'BIT' ? 'Bit Neuronal' : 'Blade Neuronal',
      isLightingGood: true,
      sampleCount: 224 * 224,
    },
    topCandidates: candidates.slice(0, 3),
    isNeural: true,
    snapshotUrl: cropDataUrl,
  };
}
