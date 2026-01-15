
import React, { useState, useEffect } from 'react';
import { MenuItem, MenuType, Language } from '../types';
import { suggestPairingNotes } from '../services/geminiService';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onSave: (item: MenuItem, originalId?: string) => void;
  onDelete: (id: string) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item, onSave, onDelete }) => {
  const [formData, setFormData] = useState<MenuItem | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setActiveLang('es');
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof MenuItem, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleTextChange = (field: 'name' | 'description' | 'pairingNote', value: string) => {
    if (!formData) return;
    const suffix = activeLang === 'es' ? '' : `_${activeLang}`;
    const key = (suffix ? `${field}${suffix}` : field) as keyof MenuItem;
    handleChange(key, value);
  };

  const getTextValue = (field: 'name' | 'description' | 'pairingNote') => {
    if (!formData) return '';
    const suffix = activeLang === 'es' ? '' : `_${activeLang}`;
    const key = (suffix ? `${field}${suffix}` : field) as keyof MenuItem;
    return (formData[key] as string) || '';
  };

  const handleAISuggestPairing = async () => {
    if (!formData.name) {
      alert("Introduce un nombre para el plato antes de generar sugerencias.");
      return;
    }

    setIsGenerating(true);
    const suggestions = await suggestPairingNotes(formData);
    
    if (suggestions) {
      setFormData(prev => prev ? {
        ...prev,
        pairingNote: suggestions.es,
        pairingNote_en: suggestions.en,
        pairingNote_fr: suggestions.fr
      } : null);
    }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-quercus-800 text-white p-5 flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold">
             {formData.name ? 'Editar Elemento' : 'Nuevo Elemento'}
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto bg-quercus-50/20">
          <div className="flex p-1 bg-quercus-100 rounded-xl">
            {(['es', 'en', 'fr'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeLang === lang 
                  ? 'bg-white text-quercus-900 shadow-sm' 
                  : 'text-quercus-400 hover:text-quercus-600'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-bold text-quercus-400 uppercase tracking-widest mb-1 block">Nombre</label>
            <input 
              type="text" 
              value={getTextValue('name')}
              onChange={(e) => handleTextChange('name', e.target.value)}
              className="w-full bg-white border border-quercus-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-quercus-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-quercus-400 uppercase tracking-widest mb-1 block">Descripción</label>
            <textarea 
              rows={2}
              value={getTextValue('description')}
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="w-full bg-white border border-quercus-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-quercus-500 outline-none"
            />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-quercus-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold text-quercus-800 uppercase tracking-widest">Nota Maridaje ({activeLang.toUpperCase()})</label>
              {formData.type === MenuType.FOOD && (
                <button 
                  onClick={handleAISuggestPairing}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-quercus-800 text-white rounded-full text-[9px] font-bold hover:bg-quercus-700 disabled:opacity-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isGenerating ? 'GENERANDO...' : 'SUGERIR CON IA'}
                </button>
              )}
            </div>
            <input 
              type="text" 
              value={getTextValue('pairingNote')}
              onChange={(e) => handleTextChange('pairingNote', e.target.value)}
              className="w-full bg-quercus-50/50 border border-quercus-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-quercus-500 outline-none"
              placeholder="Ideal con un vino blanco seco..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-quercus-400 uppercase tracking-widest mb-1 block">Precio (€)</label>
              <input 
                type="number" 
                step="0.5"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="w-full bg-white border border-quercus-200 rounded-xl p-3 text-sm"
              />
            </div>
            <div className="flex items-center pt-5 justify-end">
              <label className="flex items-center cursor-pointer gap-3">
                <span className="text-xs font-bold text-quercus-600">Disponible</span>
                <input 
                  type="checkbox" 
                  checked={formData.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  className="w-6 h-6 rounded-lg accent-quercus-800"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-quercus-100 flex justify-between">
          <button 
            onClick={() => { if(confirm("¿Eliminar?")) { onDelete(formData.id); onClose(); } }}
            className="px-4 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl"
          >
            Eliminar
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-quercus-400 text-sm font-bold">Cancelar</button>
            <button 
                onClick={() => onSave(formData, item?.id)}
                className="px-8 py-2 bg-quercus-800 text-white text-sm font-bold rounded-xl hover:bg-quercus-900 shadow-lg"
            >
                Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
