
import React, { useState, useEffect, useRef } from 'react';
import { MenuCategory, MenuType, MenuItem, Language } from './types';
import { INITIAL_MENU_ITEMS } from './data';
import MenuCard from './components/MenuCard';
import SommelierModal from './components/SommelierModal';
import EditItemModal from './components/EditItemModal';
import ImportModal from './components/ImportModal';
import QRModal from './components/QRModal';

const FOOD_CATEGORIES = [MenuCategory.STARTERS, MenuCategory.MAINS, MenuCategory.DESSERTS];
const WINE_CATEGORIES = [MenuCategory.REDS, MenuCategory.ROSES, MenuCategory.WHITES, MenuCategory.SPARKLING];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MenuType>(MenuType.FOOD);
  const [language, setLanguage] = useState<Language>('es');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [sommelierQuery, setSommelierQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('quercus_v2_data');
    if (savedItems) {
      try { setItems(JSON.parse(savedItems)); } catch (e) { setItems(INITIAL_MENU_ITEMS); }
    } else {
      setItems(INITIAL_MENU_ITEMS);
    }
    const savedLogo = localStorage.getItem('quercus_logo');
    if (savedLogo) setLogoUrl(savedLogo);
  }, []);

  useEffect(() => {
    if (items.length > 0) localStorage.setItem('quercus_v2_data', JSON.stringify(items));
  }, [items]);

  const t = {
    es: { platos: "PLATOS", vinos: "VINOS", sommelier: "Sommelier", admin: "Admin" },
    en: { platos: "DISHES", vinos: "WINES", sommelier: "Sommelier", admin: "Admin" },
    fr: { platos: "PLATS", vinos: "VINS", sommelier: "Sommelier", admin: "Admin" }
  }[language];

  const handleEditSave = (updatedItem: MenuItem, originalId?: string) => {
    setItems(prev => {
      const idx = originalId ? prev.findIndex(i => i.id === originalId) : -1;
      return idx >= 0 ? prev.map((it, i) => i === idx ? updatedItem : it) : [...prev, updatedItem];
    });
    setEditingItem(null);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    handleEditSave({ ...item, available: !item.available }, item.id);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234") {
      setIsEditMode(true);
      setIsPinModalOpen(false);
      setPinInput('');
    } else {
      alert("PIN Incorrecto");
    }
  };

  const activeCategories = activeTab === MenuType.FOOD ? FOOD_CATEGORIES : WINE_CATEGORIES;

  return (
    <div className="flex flex-col h-screen bg-quercus-100 text-quercus-900 font-sans">
      <header className="flex-none bg-white shadow-md z-30 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {logoUrl ? <img src={logoUrl} alt="Quercus" className="h-14 w-auto object-contain" /> : <h1 className="font-serif text-3xl font-bold tracking-tighter">QUERCUS</h1>}
          </div>

          <nav className="flex bg-quercus-100 p-1.5 rounded-full shadow-inner border border-quercus-200">
            <button onClick={() => setActiveTab(MenuType.FOOD)} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === MenuType.FOOD ? 'bg-white shadow-md text-quercus-900' : 'text-quercus-400 hover:text-quercus-600'}`}>
              {t.platos}
            </button>
            <button onClick={() => setActiveTab(MenuType.WINE)} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === MenuType.WINE ? 'bg-white shadow-md text-quercus-900' : 'text-quercus-400 hover:text-quercus-600'}`}>
              {t.vinos}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex rounded-lg overflow-hidden border border-quercus-300">
              {(['es', 'en', 'fr'] as Language[]).map(l => (
                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${language === l ? 'bg-quercus-800 text-white' : 'bg-white text-quercus-400'}`}>{l}</button>
              ))}
            </div>
            <button onClick={() => isEditMode ? setIsEditMode(false) : setIsPinModalOpen(true)} className={`p-3 rounded-full transition-all ${isEditMode ? 'bg-quercus-800 text-white shadow-lg' : 'text-quercus-300 hover:text-quercus-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto space-y-16 pb-32">
          {isEditMode && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-quercus-800 flex flex-wrap gap-4 items-center justify-between animate-fadeIn">
              <div>
                <h3 className="font-bold text-xl">Panel Quercus Admin</h3>
                <p className="text-sm text-quercus-500">Gestión de stock y precios activa.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsImportModalOpen(true)} className="px-5 py-2.5 bg-quercus-100 text-quercus-800 rounded-xl font-bold text-sm hover:bg-quercus-200 transition-colors">Importar Menú</button>
                <button onClick={() => setIsQROpen(true)} className="px-5 py-2.5 bg-quercus-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-quercus-900">Código QR</button>
              </div>
            </div>
          )}

          {activeCategories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0 && !isEditMode) return null;
            return (
              <section key={cat} className="animate-fadeIn">
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-serif text-4xl text-quercus-800 italic font-medium">{cat}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-quercus-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {catItems.map(item => (
                    <MenuCard 
                      key={item.id} 
                      item={item} 
                      language={language} 
                      isEditMode={isEditMode} 
                      onEdit={() => setEditingItem(item)}
                      onToggleAvailability={handleToggleAvailability}
                      onPairingRequest={(name) => { setSommelierQuery(`¿Qué vino recomiendas para ${name}?`); setIsSommelierOpen(true); }}
                    />
                  ))}
                  {isEditMode && (
                    <button onClick={() => setEditingItem({ id: Date.now().toString(), name: '', description: '', price: 0, category: cat, type: activeTab, available: true })} className="h-[250px] border-4 border-dashed border-quercus-300 rounded-[2rem] flex flex-col items-center justify-center text-quercus-400 hover:bg-white hover:border-quercus-500 hover:text-quercus-700 transition-all group">
                      <span className="text-5xl mb-2 group-hover:scale-125 transition-transform">+</span>
                      <span className="font-serif text-xl italic">Añadir a {cat}</span>
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {!isEditMode && (
        <button onClick={() => setIsSommelierOpen(true)} className="fixed bottom-10 right-10 bg-quercus-900 text-white rounded-full p-6 shadow-2xl flex items-center gap-4 hover:scale-110 active:scale-95 transition-all border-4 border-white z-50 group">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
          </div>
          <div className="text-left leading-none">
            <p className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase mb-1">Sommelier AI</p>
            <p className="font-serif text-2xl italic font-bold">Quercus</p>
          </div>
        </button>
      )}

      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-quercus-900/80 backdrop-blur-md animate-fadeIn p-4">
          <form onSubmit={handlePinSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl space-y-8 w-full max-w-sm border-8 border-quercus-100">
            <div className="text-center">
              <h3 className="font-serif text-4xl font-bold text-quercus-900 mb-2 italic">Acceso Admin</h3>
              <p className="text-quercus-400 text-xs font-bold tracking-widest uppercase">Seguridad Quercus</p>
            </div>
            <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full text-center text-5xl tracking-[0.5em] p-6 bg-quercus-50 border-2 border-quercus-200 rounded-2xl outline-none focus:ring-4 focus:ring-quercus-300 transition-all font-mono" placeholder="••••" autoFocus />
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsPinModalOpen(false)} className="flex-1 py-4 text-quercus-400 font-bold hover:text-quercus-900 transition-colors">Cerrar</button>
              <button type="submit" className="flex-1 py-4 bg-quercus-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Entrar</button>
            </div>
          </form>
        </div>
      )}

      <SommelierModal isOpen={isSommelierOpen} onClose={() => setIsSommelierOpen(false)} menuItems={items} language={language} initialQuery={sommelierQuery} />
      <EditItemModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} item={editingItem} onSave={handleEditSave} onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={(newItems) => setItems(prev => [...prev, ...newItems])} />
      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} logoUrl={logoUrl} />
    </div>
  );
};
export default App;
