export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft';

export interface Category {
  id: string;
  name: string;
  image?: string;
  storeId: string;
}

export interface ProductHistory {
  id: string;
  event: string;
  description?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number; 
  costPrice?: number;
  discountPrice?: number;
  compareAtPrice?: number; 
  taxPercentage: number;
  sku: string;
  barcode?: string;
  category: string | Category;
  subCategory?: string;
  inventory: number;
  status: ProductStatus;
  images: string[];
  weight?: string;
  lastUpdated: string;
  sales: number;
  discountPercentage?: number;
  isDeal?: boolean;
  variants?: { type: string; values: string[] }[];
  history?: ProductHistory[];
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  status: ProductStatus | 'All';
}
