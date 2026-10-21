import React from 'react';
import { Layers, Disc, Camera, QrCode, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'builder' | 'scanner' | 'export';
  setActiveTab: (tab: 'catalog' | 'builder' | 'scanner' | 'export') => void;
  inventoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, inventoryCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-red-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Disc className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-red-500 bg-clip-text text-transparent">
                BEYBLADE X
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                Scanner & Deck
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
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
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-300" />
              <span className="font-semibold">Escáner IA</span>
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
              <span className="hidden sm:inline">Exportar Torneo</span>
            </button>
          </nav>

          {/* User Collection Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-300">Colección:</span>
            <span className="text-xs font-bold text-cyan-400">{inventoryCount} piezas</span>
          </div>
        </div>
      </div>
    </header>
  );
};
