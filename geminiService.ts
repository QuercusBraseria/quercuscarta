import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, MenuCategory, MenuType, Language } from '../types';

// El API Key se inyecta desde el entorno
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSommelierRecommendation = async (
  query: string,
  menuItems: MenuItem[],
  language: Language
): Promise<string> => {
  const ai = getAI();
  const availableItems = menuItems.filter(i => i.available);
  
  const menuContext = availableItems.map(item => {
    const name = (language === 'en' && item.name_en) ? item.name_en : (language === 'fr' && item.name_fr) ? item.name_fr : item.name;
    const desc = (language === 'en' && item.description_en) ? item.description_en : (language === 'fr' && item.description_fr) ? item.description_fr : item.description;
    const pairing = (language === 'en' && item.pairingNote_en) ? item.pairingNote_en : (language === 'fr' && item.pairingNote_fr) ? item.pairingNote_fr : item.pairingNote;
    return `- ${name} (${item.type === 'wine' ? 'Vino' : 'Plato'}): ${desc}. Precio: ${item.price}€. ${pairing ? `Nota: ${pairing}` : ''}`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `Eres el Sumiller Virtual de "Quercus", un restaurante de alta cocina a la brasa. 
        Tu tono es elegante, experto y acogedor. 
        Responde en ${language === 'es' ? 'Español' : language === 'en' ? 'Inglés' : 'Francés'}.
        REGLA DE ORO: Solo puedes recomendar productos que aparezcan en esta carta:
        ${menuContext}
        
        CASOS DE USO:
        1. Si preguntan por maridaje para un plato: Recomienda 1 o 2 VINOS de la lista.
        2. Si preguntan por maridaje para un vino: Recomienda 1 o 2 PLATOS de la lista.
        3. Si preguntan por algo que no está: Indica amablemente que no está hoy y sugiere la alternativa más cercana disponible.`,
        temperature: 0.5,
      }
    });

    return response.text || "Disculpe, he tenido un pequeño lapsus. ¿Podría repetirme la pregunta?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, mi conexión con la bodega está fallando en este momento.";
  }
};

/**
 * Suggests pairing notes for a specific food item in Spanish, English, and French.
 */
export const suggestPairingNotes = async (item: MenuItem): Promise<{ es: string; en: string; fr: string } | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sugiere una nota de maridaje experta y breve (máximo 15 palabras) para este plato de restaurante de brasa: "${item.name} - ${item.description}".
      Proporciona la respuesta en tres idiomas (Español, Inglés, Francés).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            es: { type: Type.STRING, description: "Nota en español" },
            en: { type: Type.STRING, description: "Note in English" },
            fr: { type: Type.STRING, description: "Note en français" }
          },
          required: ["es", "en", "fr"]
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Pairing Suggestion Error:", error);
    return null;
  }
};

export const parseMenuFromText = async (text: string): Promise<MenuItem[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Convierte este texto en una lista estructurada de platos/vinos para un menú: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING, description: "Entrantes, Principales, Postres, Vinos Tintos, Vinos Blancos..." },
              type: { type: Type.STRING, enum: ["food", "wine"] }
            },
            required: ["name", "price", "category", "type"]
          }
        }
      }
    });
    const rawData = JSON.parse(response.text || '[]');
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `imp_${Date.now()}_${index}`,
      available: true
    }));
  } catch (error) {
    console.error("Import Error:", error);
    return [];
  }
};