import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Scan,
  Check,
  RefreshCw,
  QrCode,
  Upload,
  Sun,
  CheckCircle2,
  Cpu,
  Zap,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
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
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

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

  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);

  const toggleTorch = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextState = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn('Torch control not supported or failed:', err);
    }
  };

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
        const track = stream.getVideoTracks()[0];
        const capabilities = (track as any)?.getCapabilities ? (track as any).getCapabilities() : null;
        setIsTorchSupported(Boolean(capabilities && 'torch' in capabilities));
        setIsTorchOn(false);
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
      setIsTorchOn(false);
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 w-full overflow-x-hidden">
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
      <div className="text-center mb-4 sm:mb-6 px-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-2 sm:gap-3 text-center">
          <Scan className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse shrink-0" />
          <span>Escáner de Visión con IA</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
          Enfoca cualquier pieza (<span className="text-cyan-400 font-semibold">Blade</span>, <span className="text-blue-400 font-semibold">Ratchet</span> o <span className="text-amber-400 font-semibold">Bit</span>) o sube una foto. Inferencia local 100% offline con <span className="text-cyan-400 font-semibold font-mono">MobileNetV3</span>.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-3 sm:mb-4 w-full">
        <div className="w-full max-w-md bg-slate-900 p-1 sm:p-1.5 rounded-2xl border border-slate-800 grid grid-cols-4 gap-1">
          <button
            onClick={() => {
              setScanMode('BLADE');
              setScanResult(null);
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase transition-all truncate text-center ${
              scanMode === 'BLADE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blade
          </button>
          <button
            onClick={() => {
              setScanMode('RATCHET');
              setScanResult(null);
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase transition-all truncate text-center ${
              scanMode === 'RATCHET'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratchet
          </button>
          <button
            onClick={() => {
              setScanMode('BIT');
              setScanResult(null);
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase transition-all truncate text-center ${
              scanMode === 'BIT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bit
          </button>
          <button
            onClick={() => {
              setScanMode('HASBRO_QR');
              setScanResult(null);
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 truncate text-center ${
              scanMode === 'HASBRO_QR'
                ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>QR</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC PLACEMENT & ORIENTATION GUIDE */}
      <div className="w-full max-w-lg mx-auto mb-3.5 px-0.5">
        {scanMode === 'RATCHET' && (
          <div className="bg-slate-900/95 border-2 border-blue-500/60 rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-blue-950/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                <span className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Orientación Obligatoria del Ratchet</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-700/60 font-bold shrink-0">
                Cara Superior
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 text-[11px] sm:text-xs">
                    ✅ Cara Superior (Boca Arriba)
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Los números grabados (ej: <span className="text-white font-mono font-semibold">3-60, 5-70</span>) y las trabas del Bit deben mirar a la cámara.
                  </p>
                </div>
              </div>

              <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-2.5 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-300 text-[11px] sm:text-xs">
                    ❌ No Poner al Revés (Abajo)
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                    El cilindro liso de encastre al Blade es idéntico en todos los ratchets y causa falsos positivos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {scanMode === 'BIT' && (
          <div className="bg-slate-900/95 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-amber-950/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Enfoque Macro para Bits (Puntas)</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-700/60 font-bold shrink-0">
                10-15 cm de distancia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 text-[11px] sm:text-xs">
                    🎯 Acerca la Cámara a 10 cm
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                    La punta debe llenar el círculo guía para distinguir su silueta (<span className="text-white font-mono">Ball, Flat, Needle, Orb</span>).
                  </p>
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-2.5 flex items-start gap-2">
                <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300 text-[11px] sm:text-xs">
                    💡 Fondo Claro y Buena Luz
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Evitá fondos negros o sombras de tu teléfono para que la geometría de la punta resalte con nitidez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {scanMode === 'BLADE' && (
          <div className="bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-3 sm:p-3.5 shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Posición para Blades (Metal / Plástico)</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-700/60 font-bold shrink-0">
                Vista Cenital
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
              Coloca el Blade <strong className="text-cyan-300 font-semibold">plano boca arriba</strong> sobre una superficie bien iluminada y alinea su perímetro con la retícula circular.
            </p>
          </div>
        )}

        {scanMode === 'HASBRO_QR' && (
          <div className="bg-slate-900/95 border border-red-500/50 rounded-2xl p-3 sm:p-3.5 shadow-lg shadow-red-950/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-xs font-black text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Escaneo de Código Hasbro</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-red-300 bg-red-950 px-2 py-0.5 rounded-full border border-red-700/60 font-bold shrink-0">
                100% Precisión
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
              Enfoca directamente el microcódigo QR impreso en el plástico del Blade Hasbro para identificación automática al instante.
            </p>
          </div>
        )}

        {/* Expandable Pro Tips Toggle */}
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-cyan-400 py-1 px-3 rounded-full hover:bg-slate-900/80 transition-all border border-transparent hover:border-slate-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{isGuideOpen ? 'Ocultar guía detallada' : '💡 Ver guía visual completa para 100% acierto'}</span>
            {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isGuideOpen && (
            <div className="mt-2 text-left bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 sm:p-4 text-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  Reglas de Oro del Escáner Neuronal
                </h4>
              </div>

              <div className="space-y-2.5 text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-400 font-mono">1.</span>
                  <div>
                    <strong className="text-white">Ratchets siempre boca arriba:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Los Ratchets (<span className="text-blue-300 font-mono">3-60, 5-70, 9-60</span>) deben colocarse con los números y el encastre del bit hacia la lente. Si se fotografían boca abajo (lado cilíndrico liso), la altura y el modelo son físicamente indistinguibles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400 font-mono">2.</span>
                  <div>
                    <strong className="text-white">Bits a corta distancia (10-15 cm):</strong>
                    <p className="text-slate-400 mt-0.5">
                      Para diferenciar puntas similares (<span className="text-amber-300 font-mono">Disc Ball</span> vs <span className="text-amber-300 font-mono">Orb</span> vs <span className="text-amber-300 font-mono">Ball</span>), la punta debe ocupar el centro de la imagen y no ser un punto lejano sobre la mesa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 font-mono">3.</span>
                  <div>
                    <strong className="text-white">Iluminación uniforme:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Utiliza el botón de <strong className="text-white">Flash</strong> integrado si estás en una habitación con poca luz para evitar reflejos engañosos en el metal de los Blades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <div className="absolute top-2.5 inset-x-2.5 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-none z-10 gap-1.5">
              {liveMetrics && (
                <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-800 shadow-lg">
                  <span
                    className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: liveMetrics.hex }}
                  />
                  <span className="text-[10px] sm:text-xs font-semibold text-white font-mono truncate max-w-[85px] sm:max-w-none">
                    <span className="hidden sm:inline">{liveMetrics.name} </span>{liveMetrics.hex}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 sm:gap-1.5">
                {liveMetrics && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold font-mono border backdrop-blur-md ${
                      liveMetrics.isLightingGood
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                        : 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                    }`}
                  >
                    <Sun className="w-3 h-3 shrink-0" />
                    <span className="hidden sm:inline">{liveMetrics.isLightingGood ? 'Luz Óptima' : 'Ajustar Luz'}</span>
                  </div>
                )}

                {isTorchSupported && (
                  <button
                    onClick={toggleTorch}
                    className={`pointer-events-auto px-2 py-1 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-md ${
                      isTorchOn
                        ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
                        : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md'
                    }`}
                    title="Alternar linterna del celular"
                  >
                    <Zap className={`w-3 h-3 ${isTorchOn ? 'fill-current' : ''}`} />
                    <span>{isTorchOn ? 'Flash ON' : 'Flash'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Hasbro QR Banner if detected */}
            {liveQrFound && (
              <div className="absolute top-14 sm:top-16 inset-x-3 sm:inset-x-4 bg-emerald-500/90 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow-xl flex items-center justify-center gap-2 animate-bounce z-20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">¡CÓDIGO HASBRO: {liveQrFound}!</span>
              </div>
            )}
          </>
        )}

        {/* RETICLE OVERLAY WITH VISUAL ORIENTATION GUIDES */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
          {scanMode === 'BLADE' && (
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-cyan-400/80 flex items-center justify-center animate-pulse">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-cyan-300 bg-slate-950/90 px-2 py-0.5 rounded-full shadow border border-cyan-500/40">
                Alinear Perímetro del Blade
              </span>
              <div className="absolute top-0 w-2.5 h-2.5 bg-cyan-400 -translate-y-1 rounded-full shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute bottom-0 w-2.5 h-2.5 bg-cyan-400 translate-y-1 rounded-full shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute left-0 w-2.5 h-2.5 bg-cyan-400 -translate-x-1 rounded-full shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute right-0 w-2.5 h-2.5 bg-cyan-400 translate-x-1 rounded-full shadow-lg shadow-cyan-400/50"></div>
            </div>
          )}

          {scanMode === 'RATCHET' && (
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-blue-400/90 flex flex-col items-center justify-center">
              {/* Top orientation reminder */}
              <div className="absolute -top-3.5 bg-blue-950 text-blue-200 border-2 border-blue-400 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider shadow-xl flex items-center gap-1 z-10">
                <span className="text-emerald-400 font-bold">▲</span> <span>NÚMEROS Y TRABAS ARRIBA</span>
              </div>

              {/* Inner ring where bit locks */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-400/60 border-dotted flex flex-col items-center justify-center bg-blue-500/10">
                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-blue-300 uppercase">
                  Encastre
                </span>
                <span className="text-[7px] text-blue-400/80 font-mono">
                  Bit
                </span>
              </div>

              {/* Crosshair ticks */}
              <div className="absolute top-0 w-3 h-0.5 bg-blue-400" />
              <div className="absolute bottom-0 w-3 h-0.5 bg-blue-400" />
              <div className="absolute left-0 h-3 w-0.5 bg-blue-400" />
              <div className="absolute right-0 h-3 w-0.5 bg-blue-400" />

              {/* Bottom warning badge */}
              <div className="absolute -bottom-3 bg-red-950/95 text-red-300 border border-red-500/80 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold tracking-wider shadow-xl flex items-center gap-1 z-10">
                <span>❌</span> <span>NO LADO CILÍNDRICO LISO</span>
              </div>
            </div>
          )}

          {scanMode === 'BIT' && (
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 border-2 border-dashed border-amber-400/90 rounded-3xl flex flex-col items-center justify-center">
              {/* Top proximity badge */}
              <div className="absolute -top-3.5 bg-amber-950 text-amber-200 border-2 border-amber-400 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider shadow-xl flex items-center gap-1 z-10">
                <span className="text-amber-400">🎯</span> <span>ACERCAR A 10-15 CM</span>
              </div>

              {/* Focal center target circle for tip geometry */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400 border-dashed flex flex-col items-center justify-center bg-amber-500/10 animate-pulse">
                <span className="text-[9px] sm:text-[10px] font-black text-amber-300 uppercase tracking-wider text-center px-1">
                  PUNTA AQUÍ
                </span>
                <span className="text-[7px] sm:text-[8px] text-amber-300/80 font-mono">
                  Llenar círculo
                </span>
              </div>

              {/* Crosshair marks */}
              <div className="absolute top-0 w-4 h-0.5 bg-amber-400" />
              <div className="absolute bottom-0 w-4 h-0.5 bg-amber-400" />
              <div className="absolute left-0 h-4 w-0.5 bg-amber-400" />
              <div className="absolute right-0 h-4 w-0.5 bg-amber-400" />

              {/* Bottom reminder badge */}
              <div className="absolute -bottom-3 bg-slate-950/95 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono tracking-wider shadow-xl z-10">
                💡 Buena luz / Sin sombra
              </div>
            </div>
          )}

          {scanMode === 'HASBRO_QR' && (
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 border-2 border-red-500 rounded-2xl flex items-center justify-center bg-red-500/10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-300 bg-slate-950/90 px-2.5 py-1 rounded-full shadow border border-red-500/50">
                Alinear Código QR
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
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 w-full max-w-lg mx-auto">
        <button
          onClick={executeScan}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Scan className="w-4 h-4 shrink-0" />
          <span>Escanear Fotograma</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {cameraActive && isTorchSupported && (
            <button
              onClick={toggleTorch}
              className={`flex-1 sm:flex-initial px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-all ${
                isTorchOn
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              <Zap className={`w-4 h-4 shrink-0 ${isTorchOn ? 'fill-current' : ''}`} />
              <span>{isTorchOn ? 'Flash ON' : 'Flash'}</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-800 flex items-center justify-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Subir Foto</span>
          </button>
        </div>
      </div>

      {/* Quick Simulation Pills (Useful for testing without physical Beyblades) */}
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-1">
        <span className="text-[10px] sm:text-xs text-slate-500 font-mono">Simular:</span>
        <button
          onClick={() => runSimulationSample('dran')}
          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-cyan-400 hover:bg-slate-800 active:scale-95 transition-transform"
        >
          Dran Sword
        </button>
        <button
          onClick={() => runSimulationSample('phoenix')}
          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-red-400 hover:bg-slate-800 active:scale-95 transition-transform"
        >
          Phoenix Wing
        </button>
        <button
          onClick={() => runSimulationSample('rod')}
          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-amber-400 hover:bg-slate-800 active:scale-95 transition-transform"
        >
          Wizard Rod
        </button>
      </div>

      {/* DETECTED RESULTS SECTION (TOP 3 CANDIDATES) */}
      {scanResult && selectedCandidate && (
        <div className="mt-6 sm:mt-8 bg-slate-900/95 border-2 border-cyan-500/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl shadow-cyan-950/40 animate-in fade-in zoom-in duration-200 w-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 gap-2 mb-4 sm:mb-6 w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${selectedCandidate.confidence >= 60 || selectedCandidate.isQrMatch ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${selectedCandidate.confidence >= 60 || selectedCandidate.isQrMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                {selectedCandidate.isQrMatch ? 'Código Hasbro 100%' : `Visual (${selectedCandidate.confidence}% certeza)`}
              </span>
              {scanResult.isNeural && (
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono flex items-center gap-1">
                  ⚡ MobileNetV3
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-slate-400 flex-wrap">
              <span>Color:</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: scanResult.metrics.primaryHex }}
              />
              <span className="text-slate-200 font-semibold">{scanResult.metrics.colorName}</span>
              {scanResult.metrics.secondaryHex && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>+</span>
                  <span
                    className="w-2 h-2 rounded-full border border-white/20"
                    style={{ backgroundColor: scanResult.metrics.secondaryHex }}
                  />
                </span>
              )}
              {scanResult.metrics.detectedWings && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                  {scanResult.metrics.detectedWings} Alas
                </span>
              )}
            </div>
          </div>

          {/* LOW CONFIDENCE / OUT-OF-DISTRIBUTION WARNING BANNER WITH CONTEXTUAL DIAGNOSTICS */}
          {selectedCandidate.confidence < 60 && !selectedCandidate.isQrMatch && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-950/50 border border-amber-500/70 rounded-xl sm:rounded-2xl text-amber-200">
              <div className="flex items-start gap-2.5 sm:gap-3.5">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed flex-1">
                  <p className="font-bold text-amber-300 text-xs sm:text-sm mb-1">
                    Certeza Visual Reducida ({selectedCandidate.confidence}%) — ¿Cómo solucionarlo?
                  </p>
                  <p className="text-amber-200/90 text-[11px] sm:text-xs mb-2">
                    La red neuronal detecta similitud con <strong>{selectedCandidate.part.display_name}</strong>, pero el umbral es bajo.
                  </p>

                  {scanMode === 'RATCHET' && (
                    <div className="bg-amber-900/40 rounded-xl p-2.5 border border-amber-600/40 text-[11px] space-y-1">
                      <p className="font-bold text-amber-200 flex items-center gap-1.5">
                        <span>🔍</span> <span>Verifica la orientación de tu Ratchet:</span>
                      </p>
                      <p className="text-amber-100">
                        • <strong>¿Está boca arriba?</strong> Deben verse claramente los números grabados (ej: 3-60, 5-70) y los dientes del centro.
                      </p>
                      <p className="text-amber-100">
                        • <strong>Si está boca abajo</strong> (mostrando el cilindro liso que va al blade), la IA no podrá reconocerlo porque todos los ratchets se ven idénticos desde abajo.
                      </p>
                    </div>
                  )}

                  {scanMode === 'BIT' && (
                    <div className="bg-amber-900/40 rounded-xl p-2.5 border border-amber-600/40 text-[11px] space-y-1">
                      <p className="font-bold text-amber-200 flex items-center gap-1.5">
                        <span>🔍</span> <span>Verifica la distancia y el fondo de tu Bit:</span>
                      </p>
                      <p className="text-amber-100">
                        • <strong>Acerca la cámara a 10-15 cm</strong>: La punta plástica debe llenar el círculo guía central para que la IA aprecie la forma de la punta.
                      </p>
                      <p className="text-amber-100">
                        • <strong>Evitá sombras oscuras</strong>: Si sacas la foto sobre un fondo negro o con la sombra del celular, la punta se camufla. Activa el <strong className="text-white">Flash</strong> o usa buena luz.
                      </p>
                    </div>
                  )}

                  {scanMode === 'BLADE' && (
                    <div className="bg-amber-900/40 rounded-xl p-2.5 border border-amber-600/40 text-[11px] space-y-1">
                      <p className="text-amber-100">
                        • Coloca el Blade completamente plano sobre la mesa mirando hacia arriba y centrado en la retícula.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAIN SELECTED CANDIDATE CARD */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-6 bg-slate-950/70 p-3 sm:p-5 rounded-2xl border border-slate-800 w-full">
            {/* Visual Comparison: User Snapshot vs Catalog Render */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 shrink-0">
              {scanResult.snapshotUrl && (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 bg-slate-900 rounded-xl sm:rounded-2xl border-2 border-cyan-500/60 p-1 overflow-hidden shadow-inner flex items-center justify-center">
                    <img
                      src={scanResult.snapshotUrl}
                      alt="Captura de Cámara"
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-cyan-400 mt-1 uppercase tracking-wider">Tu Captura</span>
                </div>
              )}

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-2 flex items-center justify-center shadow-inner">
                  {selectedCandidate.part.image_url ? (
                    <img
                      src={selectedCandidate.part.image_url}
                      alt={selectedCandidate.part.display_name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/20"
                      style={{ backgroundColor: selectedCandidate.colorHex }}
                    />
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Catálogo</span>
              </div>
            </div>

            {/* Details & Confidence Meter */}
            <div className="flex-1 text-center sm:text-left w-full min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                  {selectedCandidate.part.code_name}
                </span>
                <span className="text-xs font-semibold text-slate-400 truncate">
                  {selectedCandidate.variantName}
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white mb-2 break-words">
                {selectedCandidate.part.display_name}
              </h3>

              {/* Confidence Bar */}
              <div className="mb-2 sm:mb-3">
                <div className="flex justify-between text-[11px] sm:text-xs font-mono mb-1">
                  <span className="text-slate-400">Certeza:</span>
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

              <p className="text-[10px] sm:text-xs text-slate-400 font-mono break-words">
                🔍 {selectedCandidate.detectionReason}
              </p>
            </div>
          </div>

          {/* TOP 3 CANDIDATES SELECTOR */}
          {scanResult.topCandidates.length > 1 && (
            <div className="mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Candidatos Sugeridos:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {scanResult.topCandidates.map((cand, idx) => {
                  const isSelected = selectedCandidate.part.code_name === cand.part.code_name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all w-full min-w-0 ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-800">
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
                      <div className="overflow-hidden min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-bold text-white truncate block">
                            #{idx + 1} {cand.part.display_name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 block truncate">
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
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
            <button
              onClick={handleConfirmAndAdd}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all text-center"
            >
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
              <span>Confirmar y Agregar a Colección</span>
            </button>

            <button
              onClick={() => {
                setScanResult(null);
                setSelectedCandidate(null);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs sm:text-sm font-semibold transition-all text-center"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
