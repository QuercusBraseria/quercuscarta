
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
  const [originalId, setOriginalId] = useState<string>('');
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setOriginalId(item.id);
      setActiveLang('es');
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof MenuItem, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleTextChange = (field: 'name' | 'description' | 'pairingNote', value: string) => {
    if (!formData) return;
    
    if (activeLang === 'es') {
      handleChange(field, value);
    } else if (activeLang === 'en') {
      handleChange(`${field}_en` as keyof MenuItem, value);
    } else if (activeLang === 'fr') {
      handleChange(`${field}_fr` as keyof MenuItem, value);
    }
  };

  const getTextValue = (field: 'name' | 'description' | 'pairingNote') => {
    if (!formData) return '';
    
    if (activeLang === 'es') {
      return formData[field] || '';
    } else if (activeLang === 'en') {
      return formData[`${field}_en` as keyof MenuItem] as string || '';
    } else if (activeLang === 'fr') {
      return formData[`${field}_fr` as keyof MenuItem] as string || '';
    }
    return '';
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
    } else {
      alert("No se pudo generar la sugerencia. Revisa tu conexión.");
    }
    setIsGenerating(false);
  };

  const handleDeleteClick = () => {
    const itemName = getTextValue('name') || formData.name || 'Elemento';
    const message = activeLang === 'en' ? `Are you sure you want to delete "${itemName}"?` :
                    activeLang === 'fr' ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ?` :
                    `¿Seguro que quieres eliminar "${itemName}" de la carta?`;

    if (window.confirm(message)) {
      onDelete(originalId || formData.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-quercus-800 text-white p-4 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold">
             {originalId && originalId.startsWith('imported_') ? 'Editar Elemento Importado' : formData.name ? 'Editar Elemento' : 'Nuevo Elemento'}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex border-b border-quercus-200 mb-2">
            {(['es', 'en', 'fr'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeLang === lang 
                  ? 'border-quercus-800 text-quercus-800' 
                  : 'border-transparent text-quercus-400 hover:text-quercus-600'
                }`}
              >
                {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-quercus-600 uppercase mb-1">Nombre</label>
            <input 
              type="text" 
              value={getTextValue('name')}
              onChange={(e) => handleTextChange('name', e.target.value)}
              className="w-full border border-quercus-300 rounded p-2 text-quercus-900 focus:ring-2 focus:ring-quercus-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-quercus-600 uppercase mb-1">Descripción</label>
            <textarea 
              rows={2}
              value={getTextValue('description')}
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="w-full border border-quercus-300 rounded p-2 text-quercus-900 focus:ring-2 focus:ring-quercus-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-quercus-600 uppercase">Nota de Maridaje ({activeLang.toUpperCase()})</label>
              {formData.type === MenuType.FOOD && (
                <button 
                  onClick={handleAISuggestPairing}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-2 py-1 bg-quercus-50 hover:bg-quercus-200 text-quercus-700 rounded-md text-[10px] font-bold border border-quercus-200 transition-all disabled:opacity-50"
                  title="Generar sugerencia trilingüe con IA"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                  {isGenerating ? 'GENERANDO...' : 'SUGERIR CON IA'}
                </button>
              )}
            </div>
            <input 
              type="text" 
              value={getTextValue('pairingNote')}
              onChange={(e) => handleTextChange('pairingNote', e.target.value)}
              className="w-full border border-quercus-300 bg-quercus-50/30 rounded p-2 text-quercus-900 text-sm focus:ring-2 focus:ring-quercus-500"
              placeholder="Ideal con un vino blanco seco..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-quercus-600 uppercase mb-1">Precio (€)</label>
              <input 
                type="number" 
                step="0.5"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="w-full border border-quercus-300 rounded p-2 text-quercus-900 focus:ring-2 focus:ring-quercus-500"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  className="w-5 h-5 text-quercus-800 rounded accent-quercus-800"
                />
                <span className="ml-2 text-sm text-quercus-800 font-medium">Disponible</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-quercus-600 uppercase mb-1">URL Imagen</label>
            <input 
              type="text" 
              value={formData.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full border border-quercus-300 rounded p-2 text-quercus-900 text-xs font-mono"
            />
          </div>

          <div className="bg-quercus-50 p-2 rounded border border-quercus-200">
            <label className="block text-[10px] font-bold text-quercus-400 uppercase mb-1">ID Técnico</label>
            <input 
              type="text" 
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              className="w-full bg-transparent border-none p-0 text-quercus-400 text-[10px] font-mono focus:ring-0"
            />
          </div>
        </div>

        <div className="p-4 bg-quercus-50 border-t border-quercus-200 flex justify-between gap-2">
          <button 
            onClick={handleDeleteClick}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
          >
            Eliminar
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-quercus-600 hover:bg-quercus-200 rounded text-sm font-medium">Cancelar</button>
            <button 
                onClick={() => onSave(formData, originalId)}
                className="px-6 py-2 bg-quercus-800 text-white rounded hover:bg-quercus-700 shadow-sm text-sm font-medium"
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
