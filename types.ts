export type Language = 'es' | 'en' | 'fr';

export enum MenuCategory {
  STARTERS = "Entrantes",
  MAINS = "Principales",
  DESSERTS = "Postres",
  REDS = "Vinos Tintos",
  WHITES = "Vinos Blancos",
  ROSES = "Vinos Rosados",
  SPARKLING = "Cavas y Espumosos"
}

export enum MenuType {
  FOOD = "food",
  WINE = "wine"
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  type: MenuType;
  available: boolean;
  imageKeyword?: string;
  imageUrl?: string;
  stickerUrl?: string; // New field for stickers
  allergens?: string[];
  pairingNote?: string;
  pairingNote_en?: string;
  pairingNote_fr?: string;
  // Multilingual fields
  name_en?: string;
  description_en?: string;
  name_fr?: string;
  description_fr?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}