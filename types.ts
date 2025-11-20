export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  category: 'savoury' | 'dessert' | 'juice';
  ingredients?: string[];
  isNew?: boolean;
  isHot?: boolean;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}