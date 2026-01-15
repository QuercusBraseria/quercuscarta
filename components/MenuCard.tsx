
import React from 'react';
import { MenuItem, MenuType, Language } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  isEditMode: boolean;
  language: Language;
  onToggleAvailability?: (item: MenuItem) => void;
  onPairingRequest?: (itemName: string) => void;
}

export const AllergenIcon: React.FC<{ name: string }> = ({ name }) => {
  const n = name.toLowerCase();
  let path = null;
  let label = name;
  
  if (n.includes('gluten') || n.includes('trigo')) {
     label = "Gluten";
     path = <path d="M10,21V8.9c0-1.8,1.3-3.3,3-3.5V5c0-2.8-2.2-5-5-5S3,2.2,3,5v14c0,1.1,0.9,2,2,2H10z M5,5 c0-1.7,1.3-3,3-3s3,1.3,3,3v0.5c-1.7,0.2-3,1.7-3,3.5V21H5V5z M19,2c-2.8,0-5,2.2-5,5v14h2V8.9c0-1.8,1.3-3.3,3-3.5V5 C19,3.7,19.9,2.6,21,2.2C20.4,2.1,19.7,2,19,2z"/>;
  } else if (n.includes('huevo') || n.includes('egg')) {
     label = "Huevo / Egg";
     path = <path d="M12 2C7.5 2 4 6.5 4 12c0 5 4 9 9 9s8.5-4 8.5-9c0-6-3.5-10-9.5-10zm0 16c-3 0-5-3-5-7 0-3 2-6 5-6s6 3 6 6c0 4-3 7-6 7z"/>;
  } else if (n.includes('pescado') || n.includes('fish')) {
     label = "Pescado / Fish";
     path = <path d="M21.5 12a1 1 0 00-1-1h-2.16a6 6 0 00-10.74-2.88L3.29 5.29a1 1 0 00-1.41 1.41l3.77 3.77a6 6 0 000 7.06l-3.77 3.77a1 1 0 001.41 1.41l4.31-2.83A6 6 0 0018.34 13H20.5a1 1 0 001-1z"/>;
  } else if (n.includes('molusco') || n.includes('mollusc')) {
     label = "Moluscos / Molluscs";
     path = <path d="M12 2C7.03 2 3 6.03 3 11c0 2.97 1.45 5.61 3.68 7.26l.58-.93A7.95 7.95 0 0 1 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.22-.98 4.2-2.54 5.56l-1.18-1.75c.08-.26.12-.53.12-.81a3.5 3.5 0 0 0-3.5-3.5A3.5 3.5 0 0 0 8.4 14H6.18c.28 1.96 1.62 3.62 3.45 4.38L9 22h6l-.63-3.63c2.72-1.4 4.63-4.22 4.63-7.37 0-4.97-4.03-9-9-9z"/>;
  } else if (n.includes('crust')) {
    label = "Crustáceos / Crustaceans";
    path = <path d="M12 2C6.48 2 2 6.48 2 12c0 2.62.99 5.01 2.63 6.83L6.05 17.4A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.83-.62 3.52-1.68 4.9l1.42 1.42A9.95 9.95 0 0 0 22 12c0-5.52-4.48-10-10-10z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>;
  } else if (n.includes('fruto') || n.includes('nuez') || n.includes('almendra') || n.includes('nut')) {
     label = "Frutos secos / Nuts";
     path = <path d="M15.5 5.5c-2.5 0-4.5 2-4.5 4.5 0 1.2.5 2.3 1.3 3.1l-4 4-1.4-1.4c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l3.5 3.5c.3.3.7.4 1.1.4.4 0 .8-.1 1.1-.4l1.4-1.4 4-4z"/>; 
  } else if (n.includes('lác') || n.includes('milk') || n.includes('queso') || n.includes('dairy')) {
      label = "Lácteos / Dairy";
      path = <path d="M18.5,5h-2c-0.2-1.7-1.7-3-3.5-3S9.7,3.3,9.5,5h-2C6.1,5,5,6.1,5,7.5v11C5,19.9,6.1,21,7.5,21h9c1.4,0,2.5-1.1,2.5-2.5 v-11C19,6.1,17.9,5,18.5,5z M13,4c0.8,0,1.5,0.7,1.5,1.5S13.8,7,13,7s-1.5-0.7-1.5-1.5S12.2,4,13,4z"/>;
  }

  if (!path) return null;

  return (
    <div 
      className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-quercus-50 text-quercus-500 hover:bg-quercus-200 hover:text-quercus-800 transition-all cursor-help focus:outline-none focus:ring-2 focus:ring-quercus-400 focus:bg-quercus-200" 
      tabIndex={0} 
      role="tooltip"
      aria-label={`Alérgeno: ${label}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {path}
      </svg>
      <span role="tooltip" className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-quercus-900 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-50">
         {label}
         <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-quercus-900"></span>
      </span>
    </div>
  );
};

const MenuCard: React.FC<MenuCardProps> = ({ item, onEdit, isEditMode, language, onToggleAvailability, onPairingRequest }) => {
  const isWine = item.type === MenuType.WINE;
  
  const name = (language === 'en' && item.name_en) ? item.name_en : (language === 'fr' && item.name_fr) ? item.name_fr : item.name;
  const description = (language === 'en' && item.description_en) ? item.description_en : (language === 'fr' && item.description_fr) ? item.description_fr : item.description;
  const pairingNote = (language === 'en' && item.pairingNote_en) ? item.pairingNote_en : (language === 'fr' && item.pairingNote_fr) ? item.pairingNote_fr : item.pairingNote;

  const handlePairingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPairingRequest) {
      onPairingRequest(name);
    }
  };

  // Price formatting: remove .00 if it's an integer
  const formattedPrice = item.price % 1 === 0 ? item.price.toFixed(0) : item.price.toFixed(2);

  return (
    <article 
      className={`
        relative group bg-white p-6 md:p-8 lg:p-10 rounded-xl 
        border border-quercus-100/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] 
        hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] hover:border-quercus-200
        transition-all duration-500 ease-out
        flex flex-col h-full
        ${!item.available && !isEditMode ? 'hidden' : ''}
        ${!item.available && isEditMode ? 'opacity-60 grayscale' : ''}
      `}
    >
      {item.stickerUrl && (
        <div className="absolute -top-3 -right-3 z-10 w-16 h-16 md:w-20 md:h-20 rotate-12 drop-shadow-md pointer-events-none">
          <img src={item.stickerUrl} alt="Sticker" className="w-full h-full object-contain" />
        </div>
      )}

      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleAvailability?.(item); }}
            className={`p-2 rounded-full shadow-sm text-xs font-bold transition-colors ${item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            title={item.available ? "Ocultar plato" : "Mostrar plato"}
          >
            {item.available ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
               </svg>
            )}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
            className="p-2 bg-quercus-800 text-white rounded-full shadow-sm hover:bg-quercus-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      )}

      <div className={`flex flex-col flex-1 ${isWine && item.imageUrl ? 'md:flex-row md:items-center md:gap-8' : ''}`}>
        
        {item.imageUrl && (
          <div className={`
             flex-shrink-0 overflow-hidden rounded-lg bg-white
             ${isWine 
                ? 'w-full md:w-1/4 h-64 md:h-full flex justify-center items-center mb-4 md:mb-0' 
                : 'w-full h-56 mb-6 shadow-sm border border-quercus-100'}
          `}>
             <img 
               src={item.imageUrl} 
               alt={name}
               className={`
                 ${isWine ? 'h-full w-auto object-contain mix-blend-multiply p-2' : 'w-full h-full object-cover hover:scale-105 transition-transform duration-700'}
               `}
               loading="lazy"
             />
          </div>
        )}

        <div className="flex-1 flex flex-col h-full">
          <div className="flex justify-between items-baseline gap-4 border-b border-quercus-100/70 pb-3 mb-4">
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-quercus-900 leading-none tracking-wide">
              {name}
            </h3>
            <span className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-quercus-900 whitespace-nowrap tracking-tight">
              {formattedPrice}€
            </span>
          </div>

          <div className="flex-1">
            <p className="font-sans text-base md:text-lg text-quercus-600 font-light leading-relaxed tracking-wide">
              {description}
            </p>
            
            {pairingNote && (
              <div className="mt-4 pl-3 border-l-[3px] border-quercus-300">
                <p className="font-serif italic text-quercus-700 text-lg">
                  {pairingNote}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end pt-6 mt-4 border-t border-transparent">
            <div className="flex flex-wrap gap-2">
              {item.allergens?.map((allergen, idx) => (
                <AllergenIcon key={`${item.id}-alg-${idx}`} name={allergen} />
              ))}
            </div>

            {item.type === MenuType.FOOD && (
               <button 
                  onClick={handlePairingClick}
                  className="group/btn flex items-center gap-2 pl-3 pr-4 py-2 bg-quercus-50 hover:bg-quercus-800 text-quercus-700 hover:text-white rounded-full text-xs font-bold transition-all duration-300 border border-quercus-200 hover:border-quercus-800 hover:shadow-md"
               >
                 <span className="bg-white group-hover/btn:bg-white/20 p-1 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                 </span>
                 <span className="tracking-widest uppercase text-[10px] md:text-xs">
                   {language === 'es' ? 'Maridaje' : language === 'en' ? 'Pairing' : 'Accord'}
                 </span>
               </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
