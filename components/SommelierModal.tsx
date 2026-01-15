import React, { useState, useRef, useEffect } from 'react';
import { getSommelierRecommendation } from '../services/geminiService';
import { ChatMessage, MenuItem, Language } from '../types';

interface SommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  language: Language;
  initialQuery?: string;
}

const SommelierModal: React.FC<SommelierModalProps> = ({ isOpen, onClose, menuItems, language, initialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialQuery = useRef(false);

  // Initial Greeting based on Language
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        es: 'Bienvenido a Quercus. Soy su Sommelier virtual. ¿En qué puedo ayudarle? Puedo recomendarle el maridaje perfecto para su plato o describir nuestros vinos.',
        en: 'Welcome to Quercus. I am your virtual Sommelier. How may I assist you? I can recommend the perfect pairing for your dish or describe our wines.',
        fr: 'Bienvenue chez Quercus. Je suis votre Sommelier virtuel. En quoi puis-je vous aider ? Je peux vous recommander l\'accord parfait pour votre plat ou décrire nos vins.'
      };
      setMessages([{ role: 'model', text: greetings[language] }]);
    }
  }, [isOpen, language, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Handle Initial Query (Auto-send)
  useEffect(() => {
    if (isOpen && initialQuery && !hasSentInitialQuery.current) {
       hasSentInitialQuery.current = true;
       handleSend(initialQuery);
    }
    if (!isOpen) {
        hasSentInitialQuery.current = false;
    }
  }, [isOpen, initialQuery]);

  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim() || isLoading) return;

    if (!forcedText) setInput(''); // Clear input if it was user typed
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    const responseText = await getSommelierRecommendation(textToSend, menuItems, language);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-quercus-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-quercus-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">Sommelier AI</h2>
              <p className="text-xs text-quercus-200">
                {language === 'es' ? 'En línea' : language === 'en' ? 'Online' : 'En ligne'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-quercus-50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] p-3 rounded-lg text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-quercus-800 text-white rounded-br-none' 
                    : 'bg-white text-quercus-900 border border-quercus-200 rounded-bl-none'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white text-quercus-500 border border-quercus-200 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1">
                 <span className="w-2 h-2 bg-quercus-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-quercus-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                 <span className="w-2 h-2 bg-quercus-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-quercus-200">
           <div className="flex gap-2">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder={language === 'es' ? 'Escribe tu pregunta...' : language === 'en' ? 'Type your question...' : 'Posez votre question...'}
               className="flex-1 border border-quercus-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-quercus-500 focus:border-quercus-500 outline-none transition-all"
             />
             <button
               onClick={() => handleSend()}
               disabled={!input.trim() || isLoading}
               className="bg-quercus-800 text-white p-2 rounded-full hover:bg-quercus-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SommelierModal;