import React from 'react';
import { Layers, Disc, Camera, QrCode, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'builder' | 'scanner' | 'export';
  setActiveTab: (tab: 'catalog' | 'builder' | 'scanner' | 'export') => void;
  inventoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, inventoryCount }) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('catalog')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-red-600 flex items-center justify-center shadow-md sm:shadow-lg shadow-cyan-500/20 shrink-0">
                <Disc className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin-slow" />
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-red-500 bg-clip-text text-transparent">
                  BEYBLADE X
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                  Scanner & Deck
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex space-x-2">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Catálogo</span>
              </button>

              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'builder'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Deck 3on3</span>
              </button>

              <button
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'scanner'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Camera className={`w-4 h-4 ${activeTab === 'scanner' ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>Escáner IA</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'export'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Exportar Torneo</span>
              </button>
            </nav>

            {/* Collection Badges */}
            <div className="flex items-center gap-2">
              {/* Mobile count chip */}
              <button
                onClick={() => setActiveTab('catalog')}
                className="flex md:hidden items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-cyan-400 active:scale-95 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{inventoryCount} piezas</span>
              </button>

              {/* Desktop Collection Badge */}
              <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-300">Colección:</span>
                <span className="text-xs font-bold text-cyan-400">{inventoryCount} piezas</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav aria-label="Navegación móvil" className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'catalog'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'builder'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Deck 3on3</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all relative ${
            activeTab === 'scanner'
              ? 'text-slate-950 font-black bg-cyan-400 shadow-lg shadow-cyan-400/40 -translate-y-1'
              : 'text-cyan-400 hover:text-white'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Escáner</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'export'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Exportar</span>
        </button>
      </nav>
    </>
  );
};
