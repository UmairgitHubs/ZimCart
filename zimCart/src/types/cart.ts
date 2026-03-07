import { Product } from './product';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  variants: Record<string, string> | null;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
