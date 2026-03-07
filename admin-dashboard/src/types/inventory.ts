export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reservedStock: number; // For pending orders
  availableStock: number; // current - reserved
  restockThreshold: number;
  status: StockStatus;
  warehouseLocation: string;
  lastRestocked: string;
  unitPrice: number;
  totalValue: number;
  image?: string;
}

export interface InventoryFilters {
  searchTerm: string;
  category: string;
  status: 'All' | StockStatus;
  warehouse: string;
}
