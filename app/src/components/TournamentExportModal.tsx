import React, { useState } from 'react';
import type { TournamentDeck } from '../types/beyblade';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, FileCode, ArrowLeft } from 'lucide-react';

interface TournamentExportModalProps {
  deck: TournamentDeck;
  onClose: () => void;
}

export const TournamentExportModal: React.FC<TournamentExportModalProps> = ({ deck, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'QR' | 'JSON'>('QR');

  // Generate standardized JSON payload matching docs/04_TOURNAMENT_INTEGRATION_API.md
  const exportPayload = {
    $schema: 'https://beyblade-x-app.org/schemas/deck-export-v1.json',
    version: '1.0.0',
    export_timestamp: new Date().toISOString(),
    player: {
      app_user_id: 'usr_guest_8812',
      player_handle: 'Blader_Latam',
      verified_inventory: true,
    },
    deck_format: '3ON3_NO_REPEAT',
    deck_validation: {
      is_legal: deck.is_wbo_legal,
      unique_blades_verified: deck.is_wbo_legal,
    },
    beys: deck.combos
      .filter((c) => c !== null)
      .map((c) => ({
        slot: c!.slot,
        custom_label: c!.custom_label,
        blade: {
          master_code: c!.blade.code_name,
          name: c!.blade.display_name,
          system: c!.blade.system,
          variant_id: c!.bladeVariant.variant_id,
          brand: c!.bladeVariant.primary_brand,
          spin_direction: c!.blade.spin_direction,
          weight_grams: (c!.blade.weight_min_grams + c!.blade.weight_max_grams) / 2,
        },
        ratchet: {
          master_code: c!.ratchet.code_name,
          name: c!.ratchet.display_name,
          sides: c!.ratchet.sides,
          height_mm: c!.ratchet.height_mm,
          weight_grams: (c!.ratchet.weight_min_grams + c!.ratchet.weight_max_grams) / 2,
        },
        bit: {
          master_code: c!.bit.code_name,
          name: c!.bit.display_name,
          category: c!.bit.category,
          burst_resistance_tier: c!.bit.burst_resistance_tier,
          weight_grams: (c!.bit.weight_min_grams + c!.bit.weight_max_grams) / 2,
        },
        calculated_total_weight_grams: c!.calculatedWeight,
        composite_stats: c!.compositeStats,
      })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Deck Builder</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveFormat('QR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFormat === 'QR' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Código QR</span>
          </button>
          <button
            onClick={() => setActiveFormat('JSON')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFormat === 'JSON' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Payload JSON</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white">Exportación al Gestor de Torneos</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-lg mx-auto">
          Muestra este código al juez de la mesa de control o copia el JSON para enviarlo a la API de tu otro proyecto.
        </p>
      </div>

      {activeFormat === 'QR' ? (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
            <QRCodeSVG value={JSON.stringify(exportPayload)} size={240} level="M" includeMargin={false} />
          </div>

          <div className="space-y-1 mb-6">
            <h4 className="text-base font-bold text-white">Escanea para Registrar</h4>
            <p className="text-xs text-slate-400">
              Compatible con cualquier lector de torneos y jueces WBO.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Estado: {deck.is_wbo_legal ? '✅ Legal 3on3' : '❌ Ilegal'}</span>
            <span>3 Beys incluidos</span>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-mono text-slate-400">application/json</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
