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
  image?: string; 
  images: string[];
  price: number | string;
  discountPrice?: number;
  description?: string;
  rating?: number | string;
  reviewsCount?: number | string;
  martId?: string;
  category?: { name: string };
}

export interface Category {
  id: string;
  name: string;
  image: string; // URL or local asset
}
