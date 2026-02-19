export interface Mart {
  id: string;
  name: string;
  image: string; // URL
  rating: number;
  deliveryTime: string;
  minOrder: string;
  deliveryFee: string;
  tags: string[];
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  martId: string;
}

export interface Category {
  id: string;
  name: string;
  image: string; // URL or local asset
}
