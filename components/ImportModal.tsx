import React, { useState } from 'react';
import { parseMenuFromText } from '../services/geminiService';
import { MenuItem } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: MenuItem[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const items = await parseMenuFromText(text);
      if (items.length === 0) {
        setError("No se pudieron detectar platos. Asegúrate de pegar el texto con nombres y precios.");
      } else {
        onImport(items);
        setText('');
        onClose();
      }
    } catch (e) {
      setError("Error al procesar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-quercus-800 text-white p-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 className="font-serif text-lg font-bold">Importar Menú desde Texto</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-sm text-quercus-600 mb-4">
            Copia el texto de tu PDF o diseño de Canva (Ctrl+A, Ctrl+C) y pégalo aquí. 
            Nuestra IA detectará automáticamente los platos, precios y categorías.
          </p>
          
          <textarea
            className="w-full h-64 p-4 border border-quercus-300 rounded-lg focus:ring-2 focus:ring-quercus-500 focus:border-quercus-500 font-mono text-sm bg-quercus-50"
            placeholder="Ejemplo:
            
ENTRANTES
Jamón Ibérico - 22€
Croquetas caseras - 12€

PRINCIPALES
Solomillo - 24€..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {error && (
            <div className="mt-3 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 bg-quercus-50 border-t border-quercus-200 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-quercus-600 hover:bg-quercus-200 rounded transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleProcess}
            disabled={isLoading || !text.trim()}
            className="px-6 py-2 bg-quercus-800 text-white rounded hover:bg-quercus-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              'Analizar e Importar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
