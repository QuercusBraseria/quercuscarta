
import React from 'react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl?: string;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, logoUrl }) => {
  if (!isOpen) return null;

  // URL actual para el código QR
  const currentUrl = window.location.href;
  
  // Generamos el QR básico (usamos un color oscuro que combine con Quercus)
  const qrColor = "3d2b1f"; // Un marrón profundo similar al roble
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=${qrColor}&margin=10`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quercus-menu-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error downloading QR", e);
      alert("No se pudo descargar automáticamente. Puedes guardar la imagen manualmente.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-quercus-100 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border-4 border-white">
        
        {/* Header Elegante */}
        <div className="bg-white p-6 pb-2 flex flex-col items-center">
          <div className="w-full flex justify-end mb-2">
            <button onClick={onClose} className="p-2 text-quercus-300 hover:text-quercus-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 className="font-serif text-3xl font-bold text-quercus-900 tracking-tight">QUERCUS</h3>
          <div className="h-px w-16 bg-quercus-300 my-2"></div>
          <p className="text-quercus-600 text-xs font-bold tracking-[0.2em] uppercase">Digital Experience</p>
        </div>

        {/* Área del QR con Logo Overlay */}
        <div className="p-8 flex flex-col items-center justify-center bg-white">
          <div className="relative group bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-quercus-50">
            {/* El QR generado */}
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-56 h-56 md:w-64 md:h-64 object-contain"
            />
            
            {/* Superposición del Logo en el centro */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
                 {logoUrl ? (
                   <img src={logoUrl} alt="Logo Center" className="w-full h-full object-contain" />
                 ) : (
                   <div className="w-full h-full bg-quercus-800 flex items-center justify-center">
                      <span className="text-white font-serif text-2xl font-bold">Q</span>
                   </div>
                 )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-1">
            <p className="text-quercus-800 font-serif italic text-lg">"Escanea para ver nuestra carta"</p>
            <p className="text-quercus-400 text-[10px] uppercase tracking-widest font-bold">Wine & Fine Brasa</p>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="p-6 bg-quercus-50 border-t border-quercus-200 flex flex-col gap-3">
          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-quercus-800 text-white rounded-2xl font-bold hover:bg-quercus-900 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar para Imprimir
          </button>
          
          <p className="text-center text-[9px] text-quercus-400 font-mono mt-2 opacity-50 select-text">
            {currentUrl}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
