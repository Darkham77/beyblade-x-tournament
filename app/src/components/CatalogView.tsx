import React, { useState, useRef } from 'react';
import { CATALOG_BLADES, CATALOG_RATCHETS, CATALOG_BITS, CATALOG_PRODUCTS } from '../data/catalog';
import { Search, Plus, Check, Info, Camera, CheckCircle2, Sparkles, Box } from 'lucide-react';

interface CatalogViewProps {
  onAddToInventory: (partName: string, variantId: string) => void;
  inventory: string[];
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onAddToInventory, inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BLADES' | 'RATCHETS' | 'BITS' | 'PRODUCTS'>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<'ALL' | 'TAKARA_TOMY' | 'HASBRO'>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<{ type: 'BLADE' | 'RATCHET' | 'BIT' | 'PRODUCT'; data: any } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({});
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (type: 'BLADE' | 'RATCHET' | 'BIT' | 'PRODUCT', data: any) => {
    const initialImg = type === 'PRODUCT' ? data.box_image_url : data.image_url;
    setSelectedModalImage(initialImg || null);
    setActiveModalItem({ type, data });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, itemKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedPhotos((prev) => ({
          ...prev,
          [itemKey]: [...(prev[itemKey] || []), dataUrl],
        }));
        setSelectedModalImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const getIncludedParts = (skuCode: string) => {
    const parts: { name: string; type: string; color: string }[] = [];
    CATALOG_BLADES.forEach((b) => {
      b.variants.forEach((v) => {
        if (v.included_in_products?.includes(skuCode)) {
          parts.push({ name: `${b.display_name} (${v.variant_name})`, type: 'Blade', color: v.color_primary_hex });
        }
      });
    });
    CATALOG_RATCHETS.forEach((r) => {
      r.variants.forEach((v) => {
        if (v.included_in_products?.includes(skuCode)) {
          parts.push({ name: `${r.display_name} (${v.variant_name})`, type: 'Ratchet', color: v.color_primary_hex });
        }
      });
    });
    CATALOG_BITS.forEach((bit) => {
      bit.variants.forEach((v) => {
        if (v.included_in_products?.includes(skuCode)) {
          parts.push({ name: `${bit.display_name} (${v.variant_name})`, type: 'Bit', color: v.color_primary_hex });
        }
      });
    });
    return parts;
  };

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
                        onClick={() => openModal('BLADE', blade)}
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
                        onClick={() => openModal('RATCHET', ratchet)}
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
                        onClick={() => openModal('BIT', bit)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.sku_code}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-black tracking-wide bg-red-950/80 text-red-400 border border-red-900/50">
                        {p.sku_code}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{p.brand === 'TAKARA_TOMY' ? 'Takara Tomy' : 'Hasbro'}</span>
                    </div>

                    {/* Official Product Box Image */}
                    <div className="w-full h-44 mb-4 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-center p-3 overflow-hidden group-hover:border-red-500/40 transition-colors">
                      {p.box_image_url ? (
                        <img
                          src={p.box_image_url}
                          alt={p.official_title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center text-slate-600 text-xs font-mono">
                          📦 Empaque Oficial {p.sku_code}
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {p.official_title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-mono space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Lanzamiento:</span>
                      <span className="text-slate-300">{p.release_date}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Código de barras:</span>
                      <span className="text-slate-300">{p.barcode_jan_upc}</span>
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                      <button
                        onClick={() => openModal('PRODUCT', p)}
                        className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors font-sans"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detalles del Set</span>
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {getIncludedParts(p.sku_code).length} piezas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* DETAIL MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setActiveModalItem(null);
                setSelectedModalImage(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>

            {/* PRODUCT MODAL */}
            {activeModalItem.type === 'PRODUCT' ? (() => {
              const includedParts = getIncludedParts(activeModalItem.data.sku_code);
              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded text-xs font-black bg-red-950 text-red-400 border border-red-900/50">
                      {activeModalItem.data.sku_code}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {activeModalItem.data.brand === 'TAKARA_TOMY' ? 'Takara Tomy Japón' : 'Hasbro Internacional'}
                    </span>
                  </div>

                  <div className="w-full h-56 mx-auto mb-4 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center shadow-inner overflow-hidden">
                    {activeModalItem.data.box_image_url ? (
                      <img
                        src={activeModalItem.data.box_image_url}
                        alt={activeModalItem.data.official_title}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                      />
                    ) : (
                      <div className="text-center text-slate-500 font-mono text-sm">
                        📦 Sin empaque registrado
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">{activeModalItem.data.official_title}</h3>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[11px] text-slate-500 block uppercase font-mono">Fecha de Salida</span>
                      <span className="text-sm font-semibold text-slate-200">{activeModalItem.data.release_date}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[11px] text-slate-500 block uppercase font-mono">Código de Barras</span>
                      <span className="text-sm font-mono text-cyan-400">{activeModalItem.data.barcode_jan_upc}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 mb-6">
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-red-400" />
                      <span>Contenido del Set ({includedParts.length} piezas identificadas)</span>
                    </h4>
                    <div className="space-y-2">
                      {includedParts.length > 0 ? (
                        includedParts.map((part, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: part.color }} />
                              <span className="font-semibold text-slate-200">{part.name}</span>
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {part.type}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">Piezas registradas en catálogo relacional oficial.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })() : (
              /* PART MODAL (BLADE / RATCHET / BIT) */
              <div>
                {/* Main Selected Image */}
                <div className="relative w-full h-48 mx-auto mb-3 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center shadow-inner group">
                  {selectedModalImage || activeModalItem.data.image_url ? (
                    <img
                      src={selectedModalImage || activeModalItem.data.image_url}
                      alt={activeModalItem.data.display_name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full border border-white/20"
                      style={{ backgroundColor: activeModalItem.data.variants?.[0]?.color_primary_hex }}
                    />
                  )}

                  {/* AI Vision Reticle Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>IA Reference Target</span>
                  </div>
                </div>

                {/* Multi-Image Gallery Strip */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Galería de Referencia y Dataset IA
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      {1 + (uploadedPhotos[activeModalItem.data.code_name]?.length || 0)} ángulo(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {/* Official Studio Thumbnail */}
                    {activeModalItem.data.image_url && (
                      <button
                        onClick={() => setSelectedModalImage(activeModalItem.data.image_url)}
                        className={`w-14 h-14 rounded-xl border p-1 bg-slate-950 shrink-0 flex items-center justify-center transition-all ${
                          selectedModalImage === activeModalItem.data.image_url
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        title="Foto Oficial de Estudio (Cenital)"
                      >
                        <img
                          src={activeModalItem.data.image_url}
                          alt="Estudio"
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>
                    )}

                    {/* User-contributed real / in-the-wild photos */}
                    {(uploadedPhotos[activeModalItem.data.code_name] || []).map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedModalImage(imgUrl)}
                        className={`relative w-14 h-14 rounded-xl border p-1 bg-slate-950 shrink-0 flex items-center justify-center transition-all ${
                          selectedModalImage === imgUrl
                            ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        title={`Foto Casera #${i + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Foto casera ${i + 1}`}
                          className="max-h-full max-w-full object-cover rounded-lg"
                        />
                        <span className="absolute bottom-0 right-0 text-[8px] bg-emerald-950 text-emerald-300 px-1 rounded-tl font-bold">
                          Real
                        </span>
                      </button>
                    ))}

                    {/* Add Photo Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-14 h-14 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 bg-slate-950/60 shrink-0 flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-semibold"
                      title="Aportar foto casera de tu pieza"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Añadir</span>
                    </button>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, activeModalItem.data.code_name)}
                  />
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-white mb-0.5">{activeModalItem.data.display_name}</h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    ID Molde: {activeModalItem.data.code_name} • Rango de Peso: {activeModalItem.data.weight_min_grams}g - {activeModalItem.data.weight_max_grams}g
                  </p>
                </div>

                {/* AI Computer Vision Status Card */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Calibración Scanner Visión Artificial
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Dataset 100% Calibrado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Este molde cuenta con vector de contorno morfológico verificado y rangos de masa WBO para evitar falsos positivos bajo cualquier iluminación.
                  </p>
                  {(uploadedPhotos[activeModalItem.data.code_name]?.length || 0) > 0 && (
                    <div className="pt-1.5 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        ¡{uploadedPhotos[activeModalItem.data.code_name].length} foto(s) casera(s) registrada(s) para robustez en condiciones reales!
                      </span>
                    </div>
                  )}
                </div>

                {/* Colorways & Sets */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">
                    Variantes de Color & Sets Donde Aparece
                  </h4>
                  <div className="space-y-2">
                    {activeModalItem.data.variants?.map((v: any) => (
                      <div key={v.variant_id} className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: v.color_primary_hex }}
                          />
                          <span className="font-medium">{v.variant_name}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {v.included_in_products?.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setActiveModalItem(null);
                setSelectedModalImage(null);
              }}
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
