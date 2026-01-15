
import React from 'react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl?: string;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, logoUrl }) => {
  if (!isOpen) return null;

  // Get the current URL where the app is hosted
  const currentUrl = window.location.href;
  // Use a reliable public API to generate the QR code image
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=60463b`;

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
      alert("No se pudo descargar la imagen automáticamente. Puedes mantener pulsada la imagen para guardarla.");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-quercus-800 text-white p-4 flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold">Código QR del Menú</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center bg-quercus-50">
          <div className="relative bg-white p-4 rounded-xl shadow-lg border border-quercus-200 mb-6">
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
            {/* Overlay logo if provided */}
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md border-2 border-white overflow-hidden flex items-center justify-center">
                  <img src={logoUrl} alt="Logo Center" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>
          
          <p className="text-center text-sm text-quercus-600 mb-2">
            Escanea para ver la carta digital en:
          </p>
          <p className="text-center text-xs text-quercus-400 font-mono bg-white px-2 py-1 rounded border border-quercus-200 break-all max-w-full">
            {currentUrl}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-quercus-200 flex flex-col gap-3">
          <button 
            onClick={handleDownload}
            className="w-full py-3 bg-quercus-800 text-white rounded-lg font-bold hover:bg-quercus-700 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Imagen QR
          </button>
          <button 
             onClick={() => window.print()}
             className="w-full py-3 text-quercus-600 hover:bg-quercus-100 rounded-lg font-bold transition-colors"
          >
             Imprimir Pantalla
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
