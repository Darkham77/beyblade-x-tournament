import React, { useState } from 'react';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS, CATALOG_PRODUCTS } from '../data/catalog';
import { Search, Plus, Check, Info } from 'lucide-react';

interface CatalogViewProps {
  onAddToInventory: (partName: string, variantId: string) => void;
  inventory: string[];
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onAddToInventory, inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BLADES' | 'RATCHETS' | 'BITS' | 'PRODUCTS'>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<'ALL' | 'TAKARA_TOMY' | 'HASBRO'>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<{ type: 'BLADE' | 'RATCHET' | 'BIT' | 'PRODUCT'; data: any } | null>(null);

  // Filter logic
  const filteredBlades = CATALOG_BLADES.filter((b) => {
    const matchesSearch = b.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || b.variants.some((v) => v.primary_brand === selectedBrand);
    return matchesSearch && matchesBrand;
  });

  const filteredRatchets = CATALOG_RATCHETS.filter((r) => {
    const matchesSearch = r.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || r.variants.some((v) => v.primary_brand === selectedBrand);
    return matchesSearch && matchesBrand;
  });

  const filteredBits = CATALOG_BITS.filter((bit) => {
    const matchesSearch = bit.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bit.code_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bit.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || bit.variants.some((v) => v.primary_brand === selectedBrand);
    return matchesSearch && matchesBrand;
  });

  const filteredProducts = CATALOG_PRODUCTS.filter((p) => {
    const matchesSearch = p.official_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Catálogo Oficial Beyblade X</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-950/80 text-red-400 border border-red-800/60 uppercase">
              TT & Hasbro
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explora las piezas oficiales con fotos en alta definición, pesos exactos, estadísticas y sets de lanzamiento.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o set..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'BLADES', 'RATCHETS', 'BITS', 'PRODUCTS'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['ALL', 'TAKARA_TOMY', 'HASBRO'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedBrand === b
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b === 'ALL' ? 'Todas las Marcas' : b === 'TAKARA_TOMY' ? 'Takara Tomy' : 'Hasbro'}
            </button>
          ))}
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="space-y-12">
        {/* BLADES */}
        {(selectedCategory === 'ALL' || selectedCategory === 'BLADES') && filteredBlades.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Blades (Capa Superior de Metal)
              </h2>
              <span className="text-xs text-slate-400">{filteredBlades.length} modelos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBlades.map((blade) => {
                const primaryVariant = blade.variants[0];
                const isOwned = inventory.includes(primaryVariant.variant_id);

                return (
                  <div
                    key={blade.code_name}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-cyan-950/20 group relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-cyan-400 border border-cyan-900/40">
                          {blade.system} Line
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {blade.spin_direction === 'LEFT' ? '🔄 Izquierda' : 'Derecha'}
                        </span>
                      </div>

                      {/* Official Piece Image */}
                      <div className="w-full h-32 mb-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-center p-2.5 overflow-hidden group-hover:border-cyan-500/40 transition-colors">
                        {blade.image_url ? (
                          <img
                            src={blade.image_url}
                            alt={blade.display_name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full border border-white/20"
                            style={{ backgroundColor: primaryVariant.color_primary_hex }}
                          />
                        )}
                      </div>

                      {/* Title & Preview */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {blade.display_name}
                        </h3>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 mt-1"
                          style={{ backgroundColor: primaryVariant.color_primary_hex }}
                          title={`Colorway: ${primaryVariant.variant_name}`}
                        />
                      </div>

                      <p className="text-xs text-slate-400 font-mono mb-4">
                        Peso: {blade.weight_min_grams}g - {blade.weight_max_grams}g
                      </p>

                      {/* Stat Bars */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Ataque</span>
                          <span className="font-bold text-red-400">{blade.stats.attack}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: `${blade.stats.attack}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Resistencia</span>
                          <span className="font-bold text-emerald-400">{blade.stats.stamina}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${blade.stats.stamina}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalItem({ type: 'BLADE', data: blade })}
                        className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detalles</span>
                      </button>

                      <button
                        onClick={() => onAddToInventory(blade.display_name, primaryVariant.variant_id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isOwned
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white border border-slate-700'
                        }`}
                      >
                        {isOwned ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>En Colección</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tengo esta</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* RATCHETS */}
        {(selectedCategory === 'ALL' || selectedCategory === 'RATCHETS') && filteredRatchets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                Ratchets (Disco Intermedio)
              </h2>
              <span className="text-xs text-slate-400">{filteredRatchets.length} modelos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRatchets.map((ratchet) => {
                const primaryVariant = ratchet.variants[0];
                const isOwned = inventory.includes(primaryVariant.variant_id);

                return (
                  <div
                    key={ratchet.code_name}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-900/40">
                          {ratchet.sides} Salientes
                        </span>
                        <span className="text-xs font-mono text-slate-400">Altura: {ratchet.height_mm / 10} mm</span>
                      </div>

                      {/* Official Ratchet Image */}
                      <div className="w-full h-28 mb-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-center p-2.5 overflow-hidden group-hover:border-blue-500/40 transition-colors">
                        {ratchet.image_url ? (
                          <img
                            src={ratchet.image_url}
                            alt={ratchet.display_name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full border border-white/20"
                            style={{ backgroundColor: primaryVariant.color_primary_hex }}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          {ratchet.display_name}
                        </h3>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: primaryVariant.color_primary_hex }}
                        />
                      </div>

                      <p className="text-xs text-slate-400 font-mono mb-4">
                        Peso: {ratchet.weight_min_grams}g - {ratchet.weight_max_grams}g
                      </p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Burst Resistance</span>
                          <span className="font-bold text-amber-400">{ratchet.stats.burst_resistance}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${ratchet.stats.burst_resistance}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalItem({ type: 'RATCHET', data: ratchet })}
                        className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detalles</span>
                      </button>

                      <button
                        onClick={() => onAddToInventory(ratchet.display_name, primaryVariant.variant_id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isOwned
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700'
                        }`}
                      >
                        {isOwned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isOwned ? 'En Colección' : 'Tengo esta'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BITS */}
        {(selectedCategory === 'ALL' || selectedCategory === 'BITS') && filteredBits.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Bits (Puntas de Rendimiento & Engranaje)
              </h2>
              <span className="text-xs text-slate-400">{filteredBits.length} modelos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBits.map((bit) => {
                const primaryVariant = bit.variants[0];
                const isOwned = inventory.includes(primaryVariant.variant_id);

                return (
                  <div
                    key={bit.code_name}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-900/40">
                          {bit.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Burst: {bit.burst_resistance_tier}
                        </span>
                      </div>

                      {/* Official Bit Image */}
                      <div className="w-full h-24 mb-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden group-hover:border-amber-500/40 transition-colors">
                        {bit.image_url ? (
                          <img
                            src={bit.image_url}
                            alt={bit.display_name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full border border-white/20"
                            style={{ backgroundColor: primaryVariant.color_primary_hex }}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {bit.display_name} ({bit.code_name})
                        </h3>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: primaryVariant.color_primary_hex }}
                        />
                      </div>

                      <p className="text-xs text-slate-400 font-mono mb-4">
                        Peso: {bit.weight_min_grams}g - {bit.weight_max_grams}g
                      </p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Xtreme Dash</span>
                          <span className="font-bold text-cyan-400">{bit.stats.dash}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${bit.stats.dash}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalItem({ type: 'BIT', data: bit })}
                        className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detalles</span>
                      </button>

                      <button
                        onClick={() => onAddToInventory(bit.display_name, primaryVariant.variant_id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isOwned
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white border border-slate-700'
                        }`}
                      >
                        {isOwned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isOwned ? 'En Colección' : 'Tengo esta'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PRODUCTS / SETS */}
        {(selectedCategory === 'ALL' || selectedCategory === 'PRODUCTS') && filteredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Sets Oficiales y Empaques (Takara Tomy & Hasbro)
              </h2>
              <span className="text-xs text-slate-400">{filteredProducts.length} sets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.sku_code}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-black tracking-wide bg-red-950/80 text-red-400 border border-red-900/50">
                      {p.sku_code}
                    </span>
                    <span className="text-xs text-slate-400">{p.brand === 'TAKARA_TOMY' ? 'Takara Tomy' : 'Hasbro'}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{p.official_title}</h3>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <p>Fecha lanzamiento: {p.release_date}</p>
                    <p>Código barras (JAN/UPC): {p.barcode_jan_upc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* DETAIL MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Modal Image Header */}
            {activeModalItem.data.image_url && (
              <div className="w-32 h-32 mx-auto mb-4 bg-slate-950 rounded-2xl border border-slate-800 p-3 flex items-center justify-center shadow-inner">
                <img
                  src={activeModalItem.data.image_url}
                  alt={activeModalItem.data.display_name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
            )}

            <h3 className="text-2xl font-black text-white mb-1 text-center">{activeModalItem.data.display_name}</h3>
            <p className="text-xs text-cyan-400 font-mono mb-4 text-center">Código maestro: {activeModalItem.data.code_name}</p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Variantes de Color Registradas</h4>
                <div className="space-y-2">
                  {activeModalItem.data.variants?.map((v: any) => (
                    <div key={v.variant_id} className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: v.color_primary_hex }} />
                        <span>{v.variant_name}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Sets: {v.included_in_products?.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
