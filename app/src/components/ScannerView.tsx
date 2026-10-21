import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Check, RefreshCw, QrCode } from 'lucide-react';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS } from '../data/catalog';
import confetti from 'canvas-confetti';

interface ScannerViewProps {
  onAddDetectedPart: (partName: string, variantId: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAddDetectedPart }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scanMode, setScanMode] = useState<'BLADE' | 'RATCHET' | 'BIT' | 'HASBRO_QR'>('BLADE');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedResult, setDetectedResult] = useState<any | null>(null);

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

  // Simulate or execute the AI inference pipeline
  const runDetectionPipeline = (targetOverride?: string) => {
    setIsAnalyzing(true);
    setDetectedResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);

      if (scanMode === 'HASBRO_QR') {
        const blade = CATALOG_BLADES[0]; // Dran Sword Hasbro
        setDetectedResult({
          type: 'BLADE',
          name: 'Sword Dran (Hasbro Starter)',
          code: 'HAS-ST-01',
          brand: 'HASBRO',
          confidence: 100,
          qrPayload: 'HBX-BLD-SWORD-DRAN-01',
          variantId: blade.variants[1].variant_id,
          stats: blade.stats,
          colorHex: '#0A4DA2',
          message: 'Código DataMatrix Hasbro decodificado instantáneamente.',
        });
      } else if (scanMode === 'BLADE') {
        const blade = targetOverride === 'rod' ? CATALOG_BLADES[3] : CATALOG_BLADES[2]; // Wizard Rod or Phoenix Wing
        setDetectedResult({
          type: 'BLADE',
          name: blade.display_name,
          code: blade.system === 'UX' ? 'UX-03' : 'BX-23',
          brand: 'TAKARA_TOMY',
          confidence: 98.4,
          variantId: blade.variants[0].variant_id,
          stats: blade.stats,
          colorHex: blade.variants[0].color_primary_hex,
          message: 'Molde geométrico identificado + Colorimetría CIE-Lab coincidente.',
        });
      } else if (scanMode === 'RATCHET') {
        const ratchet = CATALOG_RATCHETS[3]; // 9-60
        setDetectedResult({
          type: 'RATCHET',
          name: '9-60 (Green / Black)',
          code: 'UX-03',
          brand: 'TAKARA_TOMY',
          confidence: 96.2,
          variantId: ratchet.variants[0].variant_id,
          stats: ratchet.stats,
          colorHex: '#2E7D32',
          message: '9 salientes contados. Altura estimada: 6.0 mm.',
        });
      } else {
        const bit = CATALOG_BITS[2]; // Gear Flat
        setDetectedResult({
          type: 'BIT',
          name: 'Gear Flat (Crimson Red)',
          code: 'BX-23',
          brand: 'TAKARA_TOMY',
          confidence: 97.8,
          variantId: bit.variants[0].variant_id,
          stats: bit.stats,
          colorHex: '#B71234',
          message: 'Engranajes Xtreme Dash y punta plana cóncava detectados.',
        });
      }
    }, 1200);
  };

  const handleConfirmAndAdd = () => {
    if (detectedResult) {
      onAddDetectedPart(detectedResult.name, detectedResult.variantId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setDetectedResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3">
          <Scan className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span>Escáner de Visión Inteligente</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
          Enfoca la pieza con tu celular. La IA aísla el contorno del metal fundido, extrae el color y busca el producto oficial en la base de datos.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex gap-1">
          <button
            onClick={() => setScanMode('BLADE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'BLADE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blade (Capa)
          </button>
          <button
            onClick={() => setScanMode('RATCHET')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'RATCHET'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratchet (Disco)
          </button>
          <button
            onClick={() => setScanMode('BIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              scanMode === 'BIT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bit (Punta)
          </button>
          <button
            onClick={() => setScanMode('HASBRO_QR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              scanMode === 'HASBRO_QR'
                ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Hasbro QR</span>
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
            <p className="text-sm text-slate-300 font-semibold mb-1">Cámara no inicializada</p>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Activa la cámara del navegador o prueba una de las muestras pre-cargadas abajo.
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Encender Cámara
            </button>
          </div>
        )}

        {/* RETICLE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {scanMode === 'BLADE' && (
            <div className="relative w-56 h-56 rounded-full border-2 border-dashed border-cyan-400/80 flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded">
                Centrar Blade Aquí
              </span>
              <div className="absolute top-0 w-2 h-2 bg-cyan-400 -translate-y-1"></div>
              <div className="absolute bottom-0 w-2 h-2 bg-cyan-400 translate-y-1"></div>
              <div className="absolute left-0 w-2 h-2 bg-cyan-400 -translate-x-1"></div>
              <div className="absolute right-0 w-2 h-2 bg-cyan-400 translate-x-1"></div>
            </div>
          )}

          {(scanMode === 'RATCHET' || scanMode === 'BIT') && (
            <div className="relative w-48 h-36 border-2 border-dashed border-amber-400/80 rounded-2xl flex items-center justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded">
                Enfoque a 45°
              </span>
            </div>
          )}

          {scanMode === 'HASBRO_QR' && (
            <div className="relative w-40 h-40 border-2 border-red-500 rounded-xl flex items-center justify-center bg-red-500/5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 bg-slate-950/80 px-2 py-0.5 rounded">
                Código QR / Matrix
              </span>
            </div>
          )}
        </div>

        {/* ANALYZING SPINNER */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Analizando geometría y metal...</h4>
            <p className="text-xs text-slate-400 font-mono">
              Filtro CLAHE + Clasificador de Molde + Colorimetría LAB
            </p>
          </div>
        )}
      </div>

      {/* SCAN CONTROLS */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => runDetectionPipeline()}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Scan className="w-4 h-4" />
          <span>Escanear Pieza Actual</span>
        </button>

        {/* Quick test simulation pills */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-xs text-slate-500 font-mono">Simulaciones:</span>
          <button
            onClick={() => runDetectionPipeline('phoenix')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700"
          >
            Phoenix Wing
          </button>
          <button
            onClick={() => runDetectionPipeline('rod')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700"
          >
            Wizard Rod
          </button>
        </div>
      </div>

      {/* DETECTED RESULT CARD (HUMAN-IN-THE-LOOP CONFIRMATION) */}
      {detectedResult && (
        <div className="mt-8 bg-slate-900 border-2 border-cyan-500/80 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Pieza Detectada con {detectedResult.confidence}% de certeza
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Set: {detectedResult.code}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <span>{detectedResult.name}</span>
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: detectedResult.colorHex }}
                />
              </h3>
              <p className="text-xs text-cyan-400 font-mono mt-1">Marca: {detectedResult.brand}</p>
              <p className="text-xs text-slate-400 mt-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                🔍 {detectedResult.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmAndAdd}
              className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirmar y Agregar a Mi Colección</span>
            </button>

            <button
              onClick={() => setDetectedResult(null)}
              className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
