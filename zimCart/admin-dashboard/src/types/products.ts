export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  category: string;
  subCategory?: string;
  inventory: number;
  status: ProductStatus;
  images: string[];
  weight?: string;
  lastUpdated: string;
  sales: number;
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  status: ProductStatus | 'All';
}
