export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
  status: 'Published' | 'Draft' | 'Hidden';
  parentCategory?: string;
  parentCategoryId?: string;
  lastUpdated: string;
  displayOrder: number;
  isFeatured: boolean;
}

export interface CategoryFilters {
  searchTerm: string;
  status: 'All' | 'Published' | 'Draft' | 'Hidden';
}
