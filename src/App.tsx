
import React, { useState, useEffect, useRef } from 'react';
import { MenuCategory, MenuType, MenuItem, Language } from './types';
import { INITIAL_MENU_ITEMS } from './data';
import MenuCard, { AllergenIcon } from './components/MenuCard.tsx';
import SommelierModal from './components/SommelierModal.tsx';
import EditItemModal from './components/EditItemModal.tsx';
import ImportModal from './components/ImportModal.tsx';
import QRModal from './components/QRModal.tsx';

const FOOD_CATEGORIES = [MenuCategory.STARTERS, MenuCategory.MAINS, MenuCategory.DESSERTS];
const WINE_CATEGORIES = [MenuCategory.REDS, MenuCategory.ROSES, MenuCategory.WHITES, MenuCategory.SPARKLING];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MenuType>(MenuType.FOOD);
  const [language, setLanguage] = useState<Language>('es');
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [sommelierQuery, setSommelierQuery] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    es: { menu: "CARTA", wines: "VINOS", sommelier: "Sommelier", sommelier_subtitle: "¿Dudas? Pregunta", edit_mode: "Modo Editor", add_new: "Añadir a", import_btn: "Importar", search_placeholder: "¿Qué vino va bien con", scan: "Escanear Carta" },
    en: { menu: "MENU", wines: "WINES", sommelier: "Sommelier", sommelier_subtitle: "Questions? Ask", edit_mode: "Editor Mode", add_new: "Add to", import_btn: "Import", search_placeholder: "Which wine pairs with", scan: "Scan Menu" },
    fr: { menu: "CARTE", wines: "VINS", sommelier: "Sommelier", sommelier_subtitle: "Questions? Demandez", edit_mode: "Mode Éditeur", add_new: "Ajouter à", import_btn: "Importer", search_placeholder: "Quel vin accompagne", scan: "Scanner Carte" }
  }[language];

  useEffect(() => {
    const savedItems = localStorage.getItem('quercus_menu_data');
    if (savedItems) { try { setItems(JSON.parse(savedItems)); } catch (e) { setItems(INITIAL_MENU_ITEMS); } } else { setItems(INITIAL_MENU_ITEMS); }
    const savedLogo = localStorage.getItem('quercus_logo_url');
    if (savedLogo) setLogoUrl(savedLogo);
  }, []);

  useEffect(() => { if (items.length > 0) localStorage.setItem('quercus_menu_data', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('quercus_logo_url', logoUrl); }, [logoUrl]);

  const handleEditSave = (updatedItem: MenuItem, originalId?: string) => {
    setItems(prev => {
      const existingIndex = originalId ? prev.findIndex(i => i.id === originalId) : -1;
      return existingIndex >= 0 ? prev.map((item, idx) => idx === existingIndex ? updatedItem : item) : [...prev, updatedItem];
    });
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => { setItems(prev => prev.filter(item => item.id !== id)); setEditingItem(null); };
  const handleImportItems = (newItems: MenuItem[]) => { setItems(prev => [...prev, ...newItems]); alert(`¡Éxito! Se han importado ${newItems.length} elementos nuevos.`); };
  const handleAddNew = (category: MenuCategory) => { setEditingItem({ id: Date.now().toString(), name: '', description: '', price: 0, category: category, type: activeTab, available: true, allergens: [], imageKeyword: activeTab === MenuType.FOOD ? 'food' : 'wine' }); };
  const toggleEditMode = () => { if (!isEditMode) { setIsPinModalOpen(true); setPinInput(''); } else { setIsEditMode(false); } };
  const handlePinSubmit = (e?: React.FormEvent) => { e?.preventDefault(); if (pinInput === "1234") { setIsEditMode(true); setIsPinModalOpen(false); } else { alert("PIN incorrecto (Prueba: 1234)"); setPinInput(''); } };
  const handleExportData = () => { const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `quercus_backup.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  const handleLoadBackupClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const parsed = JSON.parse(ev.target?.result as string); if (Array.isArray(parsed) && window.confirm("Se sobreescribirá la carta. ¿Continuar?")) { setItems(parsed); alert("Actualizado."); } } catch(err){ alert("Error archivo"); } if (fileInputRef.current) fileInputRef.current.value = ''; }; reader.readAsText(file); };
  const activeCategories = activeTab === MenuType.FOOD ? FOOD_CATEGORIES : WINE_CATEGORIES;
  const handleToggleAvailability = (item: MenuItem) => { handleEditSave({ ...item, available: !item.available }, item.id); };

  return (
    <div className="flex flex-col h-screen bg-quercus-100 text-quercus-900 selection:bg-quercus-300">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      <header className="flex-none bg-white shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto md:h-20 py-2 md:py-0 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-4">
             {logoUrl ? <img src={logoUrl} alt="Logo" className="h-12 md:h-16 w-auto object-contain" /> : <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-quercus-900">QUERCUS</h1>}
          </div>
          <div className="order-3 w-full md:w-auto md:order-none flex justify-center mt-2 md:mt-0">
            <div className="flex gap-2 bg-quercus-100 p-1.5 rounded-full shadow-inner w-full md:w-auto">
              <button onClick={() => setActiveTab(MenuType.FOOD)} className={`flex-1 md:flex-none px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${activeTab === MenuType.FOOD ? 'bg-white text-quercus-900 shadow-sm' : 'text-quercus-500 hover:text-quercus-700'}`}>{t.menu}</button>
              <button onClick={() => setActiveTab(MenuType.WINE)} className={`flex-1 md:flex-none px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${activeTab === MenuType.WINE ? 'bg-white text-quercus-900 shadow-sm' : 'text-quercus-500 hover:text-quercus-700'}`}>{t.wines}</button>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsQROpen(true)}
              className="p-2 md:p-3 rounded-full text-quercus-800 hover:bg-quercus-50 transition-all active:scale-95"
              title={t.scan}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m4-12h1m-1 4h1m-4 4h1m-4 4h1m1-4h1V7m1 1h1V4m1 1h1v3m-1 1h1v6m-4 1h1v1m1-1h1v1m-4-10V4m1 1h1V4m1 1h1V4M11 4v3m2-3v3m-4 1h1v1m1-1h1v1m-4-1h1v1m1-1h1v1m4 8h1v1m1-1h1v1m-4-1h1v1m1-1h1v1m-4-1h1v1m1-1h1v1m4-8h1v1m1-1h1v1m-4-1h1v1m1-1h1v1m-4-1h1v1m1-1h1v1" />
                <rect x="3" y="3" width="6" height="6" rx="1" strokeWidth="2" />
                <rect x="15" y="3" width="6" height="6" rx="1" strokeWidth="2" />
                <rect x="3" y="15" width="6" height="6" rx="1" strokeWidth="2" />
              </svg>
            </button>

            <div className="flex border border-quercus-300 rounded overflow-hidden shadow-sm">
              {(['es', 'en', 'fr'] as Language[]).map(lang => (<button key={lang} onClick={() => setLanguage(lang)} className={`px-2.5 py-1.5 md:px-3 text-xs md:text-sm font-bold uppercase transition-colors ${language === lang ? 'bg-quercus-800 text-white' : 'bg-white text-quercus-600 hover:bg-quercus-50'}`}>{lang}</button>))}
            </div>
            {isEditMode && <button onClick={() => setIsImportModalOpen(true)} className="p-3 rounded-full bg-quercus-50 text-quercus-600 hover:bg-quercus-200"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></button>}
            <button onClick={toggleEditMode} className={`p-3 rounded-full transition-all duration-300 ${isEditMode ? 'bg-quercus-800 text-white ring-2 ring-quercus-300 ring-offset-2' : 'text-quercus-400 hover:text-quercus-600 hover:bg-quercus-50'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-12 pb-32">
          {isEditMode && (
             <div className="bg-white border-l-4 border-quercus-500 p-6 rounded-r-lg mb-6 shadow-sm animate-fadeIn space-y-4">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-quercus-100 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-quercus-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
                  <div><p className="text-lg text-quercus-900 font-bold">{t.edit_mode}</p><p className="text-sm text-quercus-600 mt-1">Gestiona tu carta.</p></div>
               </div>
               <div className="ml-0 md:ml-14 bg-quercus-50 p-4 rounded-lg border border-quercus-200"><label className="block text-xs font-bold text-quercus-600 uppercase mb-2">URL del Logotipo</label><div className="flex gap-2"><input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="flex-1 border border-quercus-300 rounded px-3 py-2 text-sm"/>{logoUrl && (<button onClick={() => setLogoUrl('')} className="px-3 py-2 text-red-600 bg-white border border-red-200 rounded text-sm hover:bg-red-50">Quitar</button>)}</div></div>
               <div className="flex flex-wrap gap-3 ml-0 md:ml-14">
                  <button onClick={handleExportData} className="px-4 py-2 bg-quercus-100 text-quercus-800 text-sm font-bold rounded">Descargar Copia</button>
                  <button onClick={handleLoadBackupClick} className="px-4 py-2 bg-quercus-100 text-quercus-800 text-sm font-bold rounded">Cargar Copia</button>
                  <button onClick={() => setIsQROpen(true)} className="px-4 py-2 bg-quercus-800 text-white text-sm font-bold rounded">Código QR</button>
               </div>
             </div>
          )}

          {activeCategories.map(category => {
            const categoryItems = items.filter(item => item.category === category);
            if (categoryItems.length === 0 && !isEditMode) return null;
            return (
              <section key={category} className="animate-fadeIn">
                <div className="flex items-center gap-6 mb-8 md:mb-10"><h2 className="font-serif text-3xl md:text-4xl text-quercus-800 italic">{category}</h2><div className="h-px flex-1 bg-gradient-to-r from-quercus-300 to-transparent"></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                  {categoryItems.map(item => (<MenuCard key={item.id} item={item} isEditMode={isEditMode} onEdit={() => setEditingItem(item)} language={language} onToggleAvailability={handleToggleAvailability} onPairingRequest={(itemName) => { setSommelierQuery(`${t.search_placeholder} ${itemName}?`); setIsSommelierOpen(true); }} />))}
                  {isEditMode && (<button onClick={() => handleAddNew(category)} className="min-h-[250px] border-2 border-dashed border-quercus-300 rounded-xl flex flex-col items-center justify-center text-quercus-400 hover:text-quercus-600 hover:bg-quercus-50 transition-all"><span className="font-serif text-xl font-medium">{t.add_new} {category}</span></button>)}
                </div>
              </section>
            );
          })}
          {activeTab === MenuType.FOOD && (<div className="mt-16 pt-8 border-t border-quercus-200"><h3 className="font-serif text-xl text-quercus-800 mb-6 text-center italic">Info Alérgenos</h3><div className="flex flex-wrap justify-center gap-6 md:gap-8">{['Gluten', 'Lácteos', 'Huevo', 'Pescado', 'Moluscos', 'Crustáceos', 'Frutos secos'].map(a => (<div key={a} className="flex items-center gap-3"><AllergenIcon name={a} /><span className="text-sm text-quercus-600 font-light">{a}</span></div>))}</div></div>)}
        </div>
      </main>

      {!isEditMode && (<button onClick={() => { setSommelierQuery(''); setIsSommelierOpen(true); }} className="fixed bottom-8 right-8 z-40 bg-quercus-800 hover:bg-quercus-700 text-white rounded-full p-4 md:p-5 shadow-2xl transition-transform hover:scale-105 flex items-center gap-4 pr-8 border-4 border-quercus-100"><div className="bg-white/20 p-2.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div><div className="text-left"><p className="text-xs md:text-sm font-light text-quercus-200 uppercase tracking-wider">{t.sommelier_subtitle}</p><p className="font-serif font-bold text-xl md:text-2xl leading-none tracking-wide">{t.sommelier}</p></div></button>)}
      {isPinModalOpen && (<div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"><div className="bg-white p-8 rounded-xl shadow-2xl w-full max-sm:w-[90%]"><h3 className="text-xl font-bold text-center mb-4 text-quercus-900 font-serif">Admin</h3><p className="text-center text-quercus-600 mb-6 text-sm">PIN (1234)</p><form onSubmit={handlePinSubmit} className="space-y-4"><input autoFocus type="password" inputMode="numeric" pattern="[0-9]*" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full text-center text-3xl tracking-widest p-3 border border-quercus-300 rounded-lg" /><div className="flex gap-3"><button type="button" onClick={() => setIsPinModalOpen(false)} className="flex-1 py-3 text-quercus-600 bg-quercus-100 rounded-lg font-bold">Cancelar</button><button type="submit" className="flex-1 py-3 bg-quercus-800 text-white rounded-lg font-bold">Entrar</button></div></form></div></div>)}
      <SommelierModal isOpen={isSommelierOpen} onClose={() => setIsSommelierOpen(false)} menuItems={items} language={language} initialQuery={sommelierQuery} />
      <EditItemModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} item={editingItem} onSave={handleEditSave} onDelete={handleDeleteItem} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportItems} />
      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} logoUrl={logoUrl} />
    </div>
  );
};
export default App;
