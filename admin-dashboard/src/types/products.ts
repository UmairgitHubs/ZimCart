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
  baseUnit?: 'piece' | 'kg' | 'g' | 'litre' | 'ml' | 'metre' | 'box';
  lastUpdated: string;
  sales: number;
  discountPercentage?: number;
  isDeal?: boolean;
  variants?: {
    name: string;
    sellingUnit: 'piece' | 'kg' | 'g' | 'litre' | 'ml' | 'box' | 'pack' | 'bag' | 'carton' | 'dozen';
    baseUnitQuantity: number;
    sku: string;
    barcode?: string;
    costPrice: number;
    sellingPrice: number;
    discountPrice?: number;
    stockQuantity: number;
    lowStockThreshold: number;
    isDefault: boolean;
    isActive: boolean;
  }[];
  history?: ProductHistory[];
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  status: ProductStatus | 'All';
}
