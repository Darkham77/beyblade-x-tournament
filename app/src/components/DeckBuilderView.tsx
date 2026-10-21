import React, { useState } from 'react';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS } from '../data/catalog';
import type { BeyCombo, TournamentDeck } from '../types/beyblade';
import { ShieldCheck, AlertTriangle, ArrowRight, Sparkles, Scale } from 'lucide-react';

interface DeckBuilderViewProps {
  onGoToExport: (deck: TournamentDeck) => void;
}

export const DeckBuilderView: React.FC<DeckBuilderViewProps> = ({ onGoToExport }) => {
  // Initial default deck setup (Meta combos)
  const [combos, setCombos] = useState<[BeyCombo, BeyCombo, BeyCombo]>([
    {
      slot: 1,
      custom_label: 'Primer Atacante',
      blade: CATALOG_BLADES[4], // Dran Buster
      bladeVariant: CATALOG_BLADES[4].variants[0],
      ratchet: CATALOG_RATCHETS[0], // 1-60
      ratchetVariant: CATALOG_RATCHETS[0].variants[0],
      bit: CATALOG_BITS[0], // Flat
      bitVariant: CATALOG_BITS[0].variants[0],
      calculatedWeight: 46.2,
      compositeStats: { attack: 95, defense: 15, stamina: 15, dash: 92, burst_resistance: 80 },
    },
    {
      slot: 2,
      custom_label: 'Resistencia Pura',
      blade: CATALOG_BLADES[3], // Wizard Rod
      bladeVariant: CATALOG_BLADES[3].variants[0],
      ratchet: CATALOG_RATCHETS[3], // 9-60
      ratchetVariant: CATALOG_RATCHETS[3].variants[0],
      bit: CATALOG_BITS[1], // Ball
      bitVariant: CATALOG_BITS[1].variants[0],
      calculatedWeight: 43.8,
      compositeStats: { attack: 25, defense: 65, stamina: 96, dash: 30, burst_resistance: 65 },
    },
    {
      slot: 3,
      custom_label: 'Tanque Ofensivo',
      blade: CATALOG_BLADES[2], // Phoenix Wing
      bladeVariant: CATALOG_BLADES[2].variants[0],
      ratchet: CATALOG_RATCHETS[2], // 5-60
      ratchetVariant: CATALOG_RATCHETS[2].variants[0],
      bit: CATALOG_BITS[2], // Gear Flat
      bitVariant: CATALOG_BITS[2].variants[0],
      calculatedWeight: 47.1,
      compositeStats: { attack: 90, defense: 50, stamina: 35, dash: 95, burst_resistance: 80 },
    },
  ]);

  // Handle part updates
  const updateSlotPart = (
    slotIndex: number,
    partType: 'blade' | 'ratchet' | 'bit',
    codeName: string
  ) => {
    setCombos((prev) => {
      const next = [...prev] as [BeyCombo, BeyCombo, BeyCombo];
      const current = { ...next[slotIndex] };

      if (partType === 'blade') {
        const found = CATALOG_BLADES.find((b) => b.code_name === codeName)!;
        current.blade = found;
        current.bladeVariant = found.variants[0];
      } else if (partType === 'ratchet') {
        const found = CATALOG_RATCHETS.find((r) => r.code_name === codeName)!;
        current.ratchet = found;
        current.ratchetVariant = found.variants[0];
      } else if (partType === 'bit') {
        const found = CATALOG_BITS.find((bit) => bit.code_name === codeName)!;
        current.bit = found;
        current.bitVariant = found.variants[0];
      }

      // Recalculate estimated weight
      const weight = Number(
        (
          (current.blade.weight_min_grams + current.blade.weight_max_grams) / 2 +
          (current.ratchet.weight_min_grams + current.ratchet.weight_max_grams) / 2 +
          (current.bit.weight_min_grams + current.bit.weight_max_grams) / 2
        ).toFixed(2)
      );
      current.calculatedWeight = weight;

      // Recalculate composite stats
      current.compositeStats = {
        attack: Math.round((current.blade.stats.attack * 0.7) + (current.bit.stats.attack * 0.3)),
        defense: Math.round((current.blade.stats.defense * 0.8) + (current.ratchet.stats.aerodynamics * 0.2)),
        stamina: Math.round((current.blade.stats.stamina * 0.6) + (current.bit.stats.stamina * 0.4)),
        dash: Math.round((current.blade.stats.dash * 0.4) + (current.bit.stats.dash * 0.6)),
        burst_resistance: Math.round((current.ratchet.stats.burst_resistance * 0.5) + (current.blade.stats.burst_resistance * 0.5)),
      };

      next[slotIndex] = current;
      return next;
    });
  };

  // Rule verification: 3on3 format cannot have duplicate parts
  const bladeDuplicates = combos.map((c) => c.blade.code_name);
  const ratchetDuplicates = combos.map((c) => c.ratchet.code_name);
  const bitDuplicates = combos.map((c) => c.bit.code_name);

  const hasDuplicateBlade = new Set(bladeDuplicates).size !== 3;
  const hasDuplicateRatchet = new Set(ratchetDuplicates).size !== 3;
  const hasDuplicateBit = new Set(bitDuplicates).size !== 3;

  const isLegal = !hasDuplicateBlade && !hasDuplicateRatchet && !hasDuplicateBit;

  const deckObject: TournamentDeck = {
    deck_name: 'Mazo Competitivo 3on3',
    combos: combos,
    is_wbo_legal: isLegal,
    legal_reason: isLegal
      ? 'Mazo verificado: 3 Beys sin piezas repetidas.'
      : 'Ilegal: Existen piezas duplicadas en las combinaciones.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Constructor de Mazos 3on3</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Formato WBO Oficial
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Arma tu equipo de 3 Beys. El sistema suma pesos exactos y verifica la legalidad del reglamento.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onGoToExport(deckObject)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <span>Exportar a Gestor de Torneo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Legality Status Bar */}
      <div
        className={`p-4 rounded-2xl border mb-8 flex items-center justify-between ${
          isLegal
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            : 'bg-red-950/50 border-red-800/80 text-red-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isLegal ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
          <div>
            <h4 className="text-sm font-bold">
              {isLegal ? 'Mazo Legal para Torneos Oficiales' : 'Mazo No Válido (Violación de Regla 3on3)'}
            </h4>
            <p className="text-xs opacity-80">
              {isLegal
                ? 'Todas las Blades, Ratchets y Bits son únicos entre sí. Puedes jugar con esta alineación.'
                : 'La regla de 3 Beys prohíbe repetir cualquier parte (Blade, Ratchet o Bit) entre los 3 trompos.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-xs font-mono uppercase font-bold px-3 py-1 rounded-full bg-slate-950/60 border border-current">
            {isLegal ? '✓ Legal' : '✗ Revisar'}
          </span>
        </div>
      </div>

      {/* 3 SLOTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {combos.map((combo, idx) => (
          <div
            key={combo.slot}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative flex flex-col justify-between"
          >
            <div>
              {/* Slot Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Slot #{combo.slot}</span>
                  <h3 className="text-lg font-black text-white">{combo.custom_label}</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{combo.calculatedWeight}g</span>
                </div>
              </div>

              {/* Combo Summary Tag */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-center">
                <span className="text-xs text-slate-400 font-mono">Nombre de la Combinación:</span>
                <p className="text-base font-extrabold text-cyan-300 mt-0.5">
                  {combo.blade.display_name} {combo.ratchet.display_name} {combo.bit.code_name}
                </p>
              </div>

              {/* Visual Disassembled Parts Preview */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 mb-6 shadow-inner">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-slate-900 rounded-xl p-1.5 border border-cyan-500/30 flex items-center justify-center">
                    {combo.blade.image_url ? (
                      <img src={combo.blade.image_url} alt={combo.blade.display_name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                    ) : (
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: combo.bladeVariant.color_primary_hex }} />
                    )}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold mt-1">Blade</span>
                </div>

                <span className="text-slate-600 font-black text-sm">+</span>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl p-1.5 border border-blue-500/30 flex items-center justify-center">
                    {combo.ratchet.image_url ? (
                      <img src={combo.ratchet.image_url} alt={combo.ratchet.display_name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                    ) : (
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: combo.ratchetVariant.color_primary_hex }} />
                    )}
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono font-bold mt-1">Ratchet</span>
                </div>

                <span className="text-slate-600 font-black text-sm">+</span>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl p-1.5 border border-amber-500/30 flex items-center justify-center">
                    {combo.bit.image_url ? (
                      <img src={combo.bit.image_url} alt={combo.bit.display_name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                    ) : (
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: combo.bitVariant.color_primary_hex }} />
                    )}
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold mt-1">Bit</span>
                </div>
              </div>

              {/* Part Selectors */}
              <div className="space-y-4 mb-6">
                {/* 1. BLADE */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                    <span>Blade (Capa)</span>
                    <span className="text-[11px] text-cyan-400 font-normal">{combo.blade.system} Line</span>
                  </label>
                  <select
                    value={combo.blade.code_name}
                    onChange={(e) => updateSlotPart(idx, 'blade', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                  >
                    {CATALOG_BLADES.map((b) => (
                      <option key={b.code_name} value={b.code_name}>
                        {b.display_name} ({b.system})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. RATCHET */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                    <span>Ratchet (Disco)</span>
                    <span className="text-[11px] text-blue-400 font-normal">{combo.ratchet.height_mm / 10}mm altura</span>
                  </label>
                  <select
                    value={combo.ratchet.code_name}
                    onChange={(e) => updateSlotPart(idx, 'ratchet', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                  >
                    {CATALOG_RATCHETS.map((r) => (
                      <option key={r.code_name} value={r.code_name}>
                        {r.display_name} ({r.sides} salientes)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. BIT */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                    <span>Bit (Punta)</span>
                    <span className="text-[11px] text-amber-400 font-normal">{combo.bit.category}</span>
                  </label>
                  <select
                    value={combo.bit.code_name}
                    onChange={(e) => updateSlotPart(idx, 'bit', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                  >
                    {CATALOG_BITS.map((bit) => (
                      <option key={bit.code_name} value={bit.code_name}>
                        {bit.display_name} ({bit.code_name}) - {bit.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Composite Stats Radar / Bars */}
            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center justify-between">
                <span>Rendimiento Estimado</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Ataque</span>
                  <span className="font-bold text-red-400">{combo.compositeStats.attack}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${combo.compositeStats.attack}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Resistencia</span>
                  <span className="font-bold text-emerald-400">{combo.compositeStats.stamina}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${combo.compositeStats.stamina}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Xtreme Dash</span>
                  <span className="font-bold text-cyan-400">{combo.compositeStats.dash}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${combo.compositeStats.dash}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
