import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Check, RefreshCw, QrCode, Upload, Sun, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import {
  analyzeCurrentFrame,
  rankCatalogByVision,
  type FrameAnalysisResult,
  type ScanCandidate,
  type ExtractedColorMetrics,
} from '../utils/visionEngine';
import { analyzeWithNeuralVision } from '../utils/neuralVisionEngine';
import confetti from 'canvas-confetti';

interface ScannerViewProps {
  onAddDetectedPart: (partName: string, variantId: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAddDetectedPart }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scanMode, setScanMode] = useState<'BLADE' | 'RATCHET' | 'BIT' | 'HASBRO_QR'>('BLADE');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Live real-time analysis HUD metrics
  const [liveMetrics, setLiveMetrics] = useState<{
    hex: string;
    name: string;
    isLightingGood: boolean;
    brightness: number;
  } | null>(null);
  const [liveQrFound, setLiveQrFound] = useState<string | null>(null);

  // Final scan results
  const [scanResult, setScanResult] = useState<FrameAnalysisResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ScanCandidate | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Real-time Live Camera HUD Loop (Runs every 180ms when camera is active)
  useEffect(() => {
    if (!cameraActive) {
      setLiveMetrics(null);
      setLiveQrFound(null);
      return;
    }

    let isMounted = true;
    const intervalId = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) return;
      try {
        const res = analyzeCurrentFrame(videoRef.current, canvasRef.current, scanMode);
        if (isMounted) {
          setLiveMetrics({
            hex: res.metrics.primaryHex,
            name: res.metrics.colorName,
            isLightingGood: res.metrics.isLightingGood,
            brightness: res.metrics.brightness,
          });
          if (res.hasQr && res.qrPayload) {
            setLiveQrFound(res.qrPayload);
          } else {
            setLiveQrFound(null);
          }
        }
      } catch (err) {
        // Ignore temporary frame sampling errors
      }
    }, 180);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [cameraActive, scanMode]);

  // Execute snapshot analysis
  const executeScan = async () => {
    if (!videoRef.current || !canvasRef.current) {
      // If camera is inactive, simulate with default sample
      runSimulationSample();
      return;
    }

    setIsAnalyzing(true);
    try {
      if (scanMode === 'BLADE' || scanMode === 'RATCHET' || scanMode === 'BIT') {
        const res = await analyzeWithNeuralVision(videoRef.current, scanMode);
        setScanResult(res);
        setSelectedCandidate(res.topCandidates[0] || null);
      } else {
        const res = analyzeCurrentFrame(videoRef.current, canvasRef.current, scanMode);
        setScanResult(res);
        setSelectedCandidate(res.topCandidates[0] || null);
      }
    } catch (err) {
      console.warn('Neural inference error, falling back to heuristic:', err);
      const fallback = analyzeCurrentFrame(videoRef.current, canvasRef.current, scanMode);
      setScanResult(fallback);
      setSelectedCandidate(fallback.topCandidates[0] || null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload an image file from smartphone gallery or disk
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        setIsAnalyzing(true);
        try {
          if (scanMode === 'BLADE' || scanMode === 'RATCHET' || scanMode === 'BIT') {
            const res = await analyzeWithNeuralVision(img, scanMode);
            setScanResult(res);
            setSelectedCandidate(res.topCandidates[0] || null);
          } else if (canvasRef.current) {
            const res = analyzeCurrentFrame(img, canvasRef.current, scanMode);
            setScanResult(res);
            setSelectedCandidate(res.topCandidates[0] || null);
          }
        } catch (err) {
          console.warn('Neural inference error on upload, falling back to heuristic:', err);
          if (canvasRef.current) {
            const fallback = analyzeCurrentFrame(img, canvasRef.current, scanMode);
            setScanResult(fallback);
            setSelectedCandidate(fallback.topCandidates[0] || null);
          }
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Fallback simulator for quick demo buttons
  const runSimulationSample = (bladeOverride?: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let targetLab = { L: 45, a: 15, b: -45 }; // Blue (Dran Sword)
      let secLab: { L: number; a: number; b: number } | undefined = undefined;
      let wings = 3;
      let primaryHex = '#0A4DA2';
      let secHex: string | undefined = undefined;
      let colorName = 'Azul Cobalto';

      if (bladeOverride === 'phoenix') {
        targetLab = { L: 42, a: 55, b: 35 }; // Red (Phoenix Wing)
        secLab = { L: 72, a: 5, b: 65 }; // Yellow core
        wings = 3;
        primaryHex = '#B71234';
        secHex = '#EAB308';
        colorName = 'Rojo Carmesí / Dorado';
      } else if (bladeOverride === 'rod') {
        targetLab = { L: 75, a: 5, b: 65 }; // Gold/Yellow (Wizard Rod)
        wings = 3;
        primaryHex = '#EAB308';
        colorName = 'Dorado / Amarillo';
      }

      const metrics: ExtractedColorMetrics = {
        primaryHex,
        primaryLab: targetLab,
        secondaryHex: secHex,
        secondaryLab: secLab,
        brightness: 120,
        colorName,
        isLightingGood: true,
        sampleCount: 1500,
        detectedWings: wings,
        symmetryConfidence: 8.5,
      };

      const candidates = rankCatalogByVision(metrics, scanMode, wings, 8.5);
      const res: FrameAnalysisResult = {
        hasQr: scanMode === 'HASBRO_QR',
        qrPayload: scanMode === 'HASBRO_QR' ? 'HBX-BLD-SWORD-DRAN-01' : undefined,
        metrics,
        topCandidates: candidates.slice(0, 3),
      };

      setScanResult(res);
      setSelectedCandidate(res.topCandidates[0] || null);
      setIsAnalyzing(false);
    }, 400);
  };

  // Confirm and add to user inventory
  const handleConfirmAndAdd = () => {
    if (selectedCandidate) {
      onAddDetectedPart(selectedCandidate.part.display_name, selectedCandidate.variantId);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
      setScanResult(null);
      setSelectedCandidate(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hidden off-screen canvas for frame analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden photo file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3">
          <Scan className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span>Escáner de Visión con IA Neuronal</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
          Enfoca cualquier pieza (<span className="text-cyan-400 font-semibold">Blade</span>, <span className="text-blue-400 font-semibold">Ratchet</span> o <span className="text-amber-400 font-semibold">Bit</span>) o sube una foto. Redes neuronales <span className="text-cyan-400 font-semibold font-mono">MobileNetV3</span> especializadas e independientes para cada tipo de pieza (invariantes a color de plástico, rotación 360° y reflejos). Inferencia local 100% offline.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-1">
          <button
            onClick={() => {
              setScanMode('BLADE');
              setScanResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'BLADE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blade (Capa)
          </button>
          <button
            onClick={() => {
              setScanMode('RATCHET');
              setScanResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'RATCHET'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratchet (Disco)
          </button>
          <button
            onClick={() => {
              setScanMode('BIT');
              setScanResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'BIT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bit (Punta)
          </button>
          <button
            onClick={() => {
              setScanMode('HASBRO_QR');
              setScanResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              scanMode === 'HASBRO_QR'
                ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Hasbro QR (100%)</span>
          </button>
        </div>
      </div>

      {/* VIEWFINDER SCREEN */}
      <div className="relative aspect-[4/3] max-w-lg mx-auto bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Real Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />

        {/* If Camera is Inactive */}
        {!cameraActive && (
          <div className="text-center p-6 z-10">
            <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-semibold mb-1">Cámara lista para conectar</p>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Enciende la cámara en vivo de tu dispositivo o sube una foto de tu pieza física.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={startCamera}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Encender Cámara</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* LIVE HUD OVERLAYS (When Camera is Active) */}
        {cameraActive && (
          <>
            {/* Top HUD: Real-time Live Color & Lighting Chip */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
              {liveMetrics && (
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-lg">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: liveMetrics.hex }}
                  />
                  <span className="text-xs font-semibold text-white font-mono">
                    {liveMetrics.name} ({liveMetrics.hex})
                  </span>
                </div>
              )}

              {liveMetrics && (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono border backdrop-blur-md ${
                    liveMetrics.isLightingGood
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                  }`}
                >
                  {liveMetrics.isLightingGood ? (
                    <>
                      <Sun className="w-3 h-3 text-emerald-400" />
                      <span>Luz Óptima</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Ajustar Iluminación</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Live Hasbro QR Banner if detected */}
            {liveQrFound && (
              <div className="absolute top-16 inset-x-4 bg-emerald-500/90 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow-xl flex items-center justify-center gap-2 animate-bounce z-20">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡CÓDIGO HASBRO DETECTADO: {liveQrFound}!</span>
              </div>
            )}
          </>
        )}

        {/* RETICLE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {scanMode === 'BLADE' && (
            <div className="relative w-56 h-56 rounded-full border-2 border-dashed border-cyan-400/80 flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 bg-slate-950/90 px-2 py-0.5 rounded shadow">
                Centrar Blade Aquí
              </span>
              <div className="absolute top-0 w-2.5 h-2.5 bg-cyan-400 -translate-y-1 rounded-full shadow"></div>
              <div className="absolute bottom-0 w-2.5 h-2.5 bg-cyan-400 translate-y-1 rounded-full shadow"></div>
              <div className="absolute left-0 w-2.5 h-2.5 bg-cyan-400 -translate-x-1 rounded-full shadow"></div>
              <div className="absolute right-0 w-2.5 h-2.5 bg-cyan-400 translate-x-1 rounded-full shadow"></div>
            </div>
          )}

          {scanMode === 'RATCHET' && (
            <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-amber-400/80 flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-slate-950/90 px-2.5 py-1 rounded shadow text-center max-w-[170px]">
                Apoyá el Ratchet Plano (Vista Superior)
              </span>
            </div>
          )}

          {scanMode === 'BIT' && (
            <div className="relative w-44 h-44 border-2 border-dashed border-purple-400/80 rounded-2xl flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300 bg-slate-950/90 px-2.5 py-1 rounded shadow text-center max-w-[160px]">
                Apoyá el Bit sobre la Mesa
              </span>
            </div>
          )}

          {scanMode === 'HASBRO_QR' && (
            <div className="relative w-44 h-44 border-2 border-red-500 rounded-2xl flex items-center justify-center bg-red-500/10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 bg-slate-950/90 px-2 py-0.5 rounded shadow">
                Código QR / DataMatrix
              </span>
            </div>
          )}
        </div>

        {/* ANALYZING SPINNER */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
            <h4 className="text-base font-bold text-white mb-1 flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inferencia Neuronal MobileNetV3...</span>
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Procesamiento de Tensores ONNX On-Device (0 ms Latencia de Servidor)
            </p>
          </div>
        )}
      </div>

      {/* SCAN CONTROLS */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={executeScan}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Scan className="w-4 h-4" />
          <span>Escanear Fotograma Actual</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 flex items-center justify-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4 text-slate-400" />
          <span>Cargar Foto desde Dispositivo</span>
        </button>
      </div>

      {/* Quick Simulation Pills (Useful for testing without physical Beyblades) */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 font-mono">Pruebas Rápidas:</span>
        <button
          onClick={() => runSimulationSample('dran')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-cyan-400 hover:bg-slate-800"
        >
          Dran Sword (Azul)
        </button>
        <button
          onClick={() => runSimulationSample('phoenix')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-red-400 hover:bg-slate-800"
        >
          Phoenix Wing (Rojo)
        </button>
        <button
          onClick={() => runSimulationSample('rod')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-amber-400 hover:bg-slate-800"
        >
          Wizard Rod (Dorado)
        </button>
      </div>

      {/* DETECTED RESULTS SECTION (TOP 3 CANDIDATES) */}
      {scanResult && selectedCandidate && (
        <div className="mt-8 bg-slate-900/95 border-2 border-cyan-500/80 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-3 h-3 rounded-full animate-pulse ${selectedCandidate.confidence >= 60 || selectedCandidate.isQrMatch ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`text-xs font-bold uppercase tracking-wider ${selectedCandidate.confidence >= 60 || selectedCandidate.isQrMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                {selectedCandidate.isQrMatch ? 'Código Hasbro 100% Verificado' : `Reconocimiento Visual (${selectedCandidate.confidence}% de certeza)`}
              </span>
              {scanResult.isNeural && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono flex items-center gap-1">
                  ⚡ Red Neuronal (MobileNetV3)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap">
              <span>Color detectado:</span>
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: scanResult.metrics.primaryHex }}
              />
              <span className="text-slate-200 font-semibold">{scanResult.metrics.colorName}</span>
              {scanResult.metrics.secondaryHex && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>+ Núcleo:</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: scanResult.metrics.secondaryHex }}
                  />
                </span>
              )}
              {scanResult.metrics.detectedWings && (
                <span className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                  {scanResult.metrics.detectedWings} Alas (Simetría k={scanResult.metrics.detectedWings})
                </span>
              )}
            </div>
          </div>

          {/* LOW CONFIDENCE / OUT-OF-DISTRIBUTION WARNING BANNER */}
          {selectedCandidate.confidence < 60 && !selectedCandidate.isQrMatch && (
            <div className="mb-6 p-4 bg-amber-950/40 border border-amber-500/60 rounded-2xl flex items-start gap-3.5 text-amber-200">
              <span className="text-xl shrink-0">⚠️</span>
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-amber-300 text-sm mb-0.5">
                  Certeza Visual Reducida ({selectedCandidate.confidence}%)
                </p>
                <p className="text-amber-200/90">
                  La red neuronal encontró afinidad morfológica con <strong>{selectedCandidate.part.display_name}</strong>, pero el umbral de certeza es inferior al 60%. Esto suele ocurrir si la pieza es una edición de color no habitual, una personalización, o un modelo nuevo aún no catalogado. Revisa también los candidatos alternativos abajo.
                </p>
              </div>
            </div>
          )}

          {/* MAIN SELECTED CANDIDATE CARD */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
            {/* Visual Comparison: User Snapshot vs Catalog Render */}
            <div className="flex items-center gap-3 shrink-0">
              {scanResult.snapshotUrl && (
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 bg-slate-900 rounded-2xl border-2 border-cyan-500/60 p-1 overflow-hidden shadow-inner flex items-center justify-center">
                    <img
                      src={scanResult.snapshotUrl}
                      alt="Captura de Cámara"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 mt-1 uppercase tracking-wider">Tu Captura</span>
                </div>
              )}

              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-slate-900 rounded-2xl border border-slate-800 p-2 flex items-center justify-center shadow-inner">
                  {selectedCandidate.part.image_url ? (
                    <img
                      src={selectedCandidate.part.image_url}
                      alt={selectedCandidate.part.display_name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full border border-white/20"
                      style={{ backgroundColor: selectedCandidate.colorHex }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Catálogo</span>
              </div>
            </div>

            {/* Details & Confidence Meter */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                  {selectedCandidate.part.code_name}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedCandidate.variantName}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                {selectedCandidate.part.display_name}
              </h3>

              {/* Confidence Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Índice de Certeza:</span>
                  <span
                    className={`font-bold ${
                      selectedCandidate.confidence >= 90
                        ? 'text-emerald-400'
                        : selectedCandidate.confidence >= 75
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {selectedCandidate.confidence}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedCandidate.confidence >= 90
                        ? 'bg-emerald-500'
                        : selectedCandidate.confidence >= 75
                        ? 'bg-cyan-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${selectedCandidate.confidence}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                🔍 {selectedCandidate.detectionReason}
              </p>
            </div>
          </div>

          {/* TOP 3 CANDIDATES SELECTOR */}
          {scanResult.topCandidates.length > 1 && (
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Candidatos Sugeridos por el Motor de Visión:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {scanResult.topCandidates.map((cand, idx) => {
                  const isSelected = selectedCandidate.part.code_name === cand.part.code_name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="w-10 h-10 bg-slate-900 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-800">
                        {cand.part.image_url ? (
                          <img
                            src={cand.part.image_url}
                            alt={cand.part.display_name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: cand.colorHex }}
                          />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-white truncate">
                            #{idx + 1} {cand.part.display_name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {cand.confidence}% certeza
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleConfirmAndAdd}
              className="w-full flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirmar y Agregar a Mi Colección</span>
            </button>

            <button
              onClick={() => {
                setScanResult(null);
                setSelectedCandidate(null);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
