
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, MenuCategory, MenuType, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSommelierRecommendation = async (
  query: string,
  menuItems: MenuItem[],
  language: Language
): Promise<string> => {
  const availableItems = menuItems.filter(i => i.available);
  const menuContext = availableItems.map(item => {
    return `- ${item.name} (${item.type === 'wine' ? 'Vino' : 'Plato'}): ${item.description}. Precio: ${item.price}€.`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `Eres el sommelier experto del restaurante Quercus. Idioma: ${language}. Basándote SOLO en esta carta: ${menuContext}, recomienda maridajes o describe vinos. Sé elegante, breve y profesional.`,
        temperature: 0.4,
      }
    });
    return response.text || "Lo siento, no puedo procesar la consulta.";
  } catch (error) {
    return "Error de comunicación con el Sommelier.";
  }
};

export const suggestPairingNotes = async (item: Partial<MenuItem>): Promise<{es: string, en: string, fr: string} | null> => {
  if (!item.name) return null;
  const prompt = `Como sommelier, sugiere una nota de maridaje corta (12 palabras máx) para: ${item.name}. Devuelve JSON con campos es, en, fr.`;
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
    return null;
  }
};

export const parseMenuFromText = async (text: string): Promise<MenuItem[]> => {
  const prompt = `Analiza este texto y extrae los platos y vinos como una lista JSON: ${text}`;
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
              type: { type: Type.STRING }
            },
            required: ["name", "price", "category", "type"]
          }
        }
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((it: any, i: number) => ({
      ...it,
      id: `ai_${Date.now()}_${i}`,
      available: true,
      type: it.type === 'wine' ? MenuType.WINE : MenuType.FOOD
    }));
  } catch (error) {
    return [];
  }
};
