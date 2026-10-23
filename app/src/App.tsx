import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { DeckBuilderView } from './components/DeckBuilderView';
import { ScannerView } from './components/ScannerView';
import { TournamentExportModal } from './components/TournamentExportModal';
import type { TournamentDeck } from './types/beyblade';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'scanner' | 'export'>('catalog');
  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('beyblade_user_inventory');
    return saved ? JSON.parse(saved) : ['var_b_pw_red', 'var_r_960_green', 'var_bit_ball_yellow'];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportDeck, setExportDeck] = useState<TournamentDeck | null>(null);

  useEffect(() => {
    localStorage.setItem('beyblade_user_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToInventory = (partName: string, variantId: string) => {
    if (inventory.includes(variantId)) {
      setInventory((prev) => prev.filter((id) => id !== variantId));
      showToast(`Quitado de tu colección: ${partName}`);
    } else {
      setInventory((prev) => [...prev, variantId]);
      showToast(`¡Agregado a tu colección! ${partName}`);
    }
  };

  const handleGoToExport = (deck: TournamentDeck) => {
    setExportDeck(deck);
    setActiveTab('export');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-slate-900 border border-cyan-500/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[90vw]">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} inventoryCount={inventory.length} />

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-16 w-full max-w-full overflow-x-hidden">
        {activeTab === 'catalog' && (
          <CatalogView onAddToInventory={handleAddToInventory} inventory={inventory} />
        )}

        {activeTab === 'builder' && (
          <DeckBuilderView onGoToExport={handleGoToExport} />
        )}

        {activeTab === 'scanner' && (
          <ScannerView
            onAddDetectedPart={(name, variantId) => {
              handleAddToInventory(name, variantId);
              showToast(`¡Escáner confirmó: ${name} agregado a tu inventario!`);
            }}
          />
        )}

        {activeTab === 'export' && (
          <TournamentExportModal
            deck={
              exportDeck || {
                deck_name: 'Mazo 3on3 Competitivo',
                combos: [null as any, null as any, null as any],
                is_wbo_legal: true,
              }
            }
            onClose={() => setActiveTab('builder')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        <p>Scanner de Beys • Beyblade X Competitive Tool & Computer Vision Architecture</p>
      </footer>
    </div>
  );
};

export default App;
