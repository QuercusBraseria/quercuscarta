
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, MenuCategory, MenuType, Language } from '../types';

// Use process.env.API_KEY directly as per the Google GenAI SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSommelierRecommendation = async (
  query: string,
  menuItems: MenuItem[],
  language: Language
): Promise<string> => {
  const availableItems = menuItems.filter(i => i.available);
  
  const menuContext = availableItems.map(item => {
    const name = (language === 'en' && item.name_en) ? item.name_en : (language === 'fr' && item.name_fr) ? item.name_fr : item.name;
    const desc = (language === 'en' && item.description_en) ? item.description_en : (language === 'fr' && item.description_fr) ? item.description_fr : item.description;
    const pairing = (language === 'en' && item.pairingNote_en) ? item.pairingNote_en : (language === 'fr' && item.pairingNote_fr) ? item.pairingNote_fr : item.pairingNote;

    return `- ${name} (${item.type === 'wine' ? 'Vino' : 'Plato'}): ${desc}. Precio: ${item.price}€. ${pairing ? `Nota: ${pairing}` : ''}`;
  }).join('\n');

  const langInstruction = {
    es: "Responderás SIEMPRE en Español.",
    en: "You will ALWAYS respond in English.",
    fr: "Vous répondrez TOUJOURS en Français."
  };

  const systemInstruction = `
    Eres "Quercus AI", el experto sommelier del restaurante Quercus.
    
    ${langInstruction[language]}
    
    TU MISIÓN:
    Recomendar maridajes perfectos utilizando EXCLUSIVAMENTE la carta proporcionada abajo.

    REGLAS DE RESPUESTA:
    1. Si el usuario pregunta por un plato, recomiéndale **1 o 2 vinos específicos** de la lista (nómbralos exactamente como aparecen).
    2. NO des listas largas. Sé selectivo.
    3. Explica BREVEMENTE (máximo 2 frases) la razón técnica del maridaje.
    4. Mantén un tono elegante, servicial y experto.

    CARTA ACTUAL:
    ${menuContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });

    return response.text || "Disculpa, no he podido procesar tu solicitud.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error de conexión con el servicio de IA.";
  }
};

export const suggestPairingNotes = async (item: Partial<MenuItem>): Promise<{es: string, en: string, fr: string} | null> => {
  if (!item.name) return null;

  const prompt = `Como experto sommelier de Quercus, sugiere una nota de maridaje corta y elegante (máximo 12 palabras) para el siguiente plato:
    Nombre: ${item.name}
    Descripción: ${item.description || 'No disponible'}
    
    Devuelve la respuesta en 3 idiomas siguiendo este esquema JSON:
    { "es": "texto en español", "en": "text in english", "fr": "texte en français" }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            es: { type: Type.STRING },
            en: { type: Type.STRING },
            fr: { type: Type.STRING },
          },
          required: ["es", "en", "fr"],
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating pairing notes:", error);
    return null;
  }
};

export const parseMenuFromText = async (text: string): Promise<MenuItem[]> => {
  const prompt = `Analiza el siguiente texto de un menú y extrae los ítems en formato JSON.
    Texto: ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
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
              category: { type: Type.STRING },
              type: { type: Type.STRING },
              allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
              imageKeyword: { type: Type.STRING }
            },
            required: ["name", "price", "category", "type"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `imported_${Date.now()}_${index}`,
      available: true,
      category: mapCategory(item.category),
      type: item.type === 'wine' ? MenuType.WINE : MenuType.FOOD
    }));
  } catch (error) {
    console.error("Error parsing menu:", error);
    return [];
  }
};

function mapCategory(cat: string): MenuCategory {
  const c = cat.toLowerCase();
  if (c.includes('tinto')) return MenuCategory.REDS;
  if (c.includes('blanco')) return MenuCategory.WHITES;
  if (c.includes('rosado')) return MenuCategory.ROSES;
  if (c.includes('espumoso') || c.includes('cava') || c.includes('champagne')) return MenuCategory.SPARKLING;
  if (c.includes('postre') || c.includes('dulce')) return MenuCategory.DESSERTS;
  if (c.includes('entrant') || c.includes('picoteo') || c.includes('tapa')) return MenuCategory.STARTERS;
  return MenuCategory.MAINS;
}
