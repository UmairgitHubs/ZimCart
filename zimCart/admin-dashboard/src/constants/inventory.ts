import { InventoryItem } from "@/types/inventory";

export const WAREHOUSE_LOCATIONS = [
  "Main Hub - Harare",
  "Distribution Center - Bulawayo",
  "Secondary Hub - Gweru",
  "Transit Point - Mutare"
];

export const STOCK_STATUSES: string[] = ["All", "In Stock", "Low Stock", "Out of Stock", "Overstock"];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "INV-5001",
    productId: "PROD-1001",
    productName: "Wireless Noise Cancelling Headphones",
    sku: "AUD-WH-1001",
    category: "Electronics",
    currentStock: 45,
    reservedStock: 12,
    availableStock: 33,
    restockThreshold: 10,
    status: "In Stock",
    warehouseLocation: "Main Hub - Harare",
    lastRestocked: "2026-02-15T08:00:00Z",
    unitPrice: 299.99,
    totalValue: 13499.55,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "INV-5002",
    productId: "PROD-1002",
    productName: "Smart Fitness Watch S2",
    sku: "WTC-S2-1002",
    category: "Electronics",
    currentStock: 8,
    reservedStock: 5,
    availableStock: 3,
    restockThreshold: 15,
    status: "Low Stock",
    warehouseLocation: "Main Hub - Harare",
    lastRestocked: "2026-02-10T11:30:00Z",
    unitPrice: 199.00,
    totalValue: 1592.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "INV-5003",
    productId: "PROD-1003",
    productName: "Organic Arabica Coffee Beans",
    sku: "GRO-CF-1003",
    category: "Grocery",
    currentStock: 120,
    reservedStock: 25,
    availableStock: 95,
    restockThreshold: 50,
    status: "In Stock",
    warehouseLocation: "Distribution Center - Bulawayo",
    lastRestocked: "2026-02-20T14:45:00Z",
    unitPrice: 24.50,
    totalValue: 2940.00,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "INV-5004",
    productId: "PROD-1004",
    productName: "Stainless Steel Water Bottle",
    sku: "HOM-WB-1004",
    category: "Home & Kitchen",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    restockThreshold: 20,
    status: "Out of Stock",
    warehouseLocation: "Secondary Hub - Gweru",
    lastRestocked: "2026-01-30T09:00:00Z",
    unitPrice: 35.00,
    totalValue: 0.00,
    image: "https://images.unsplash.com/photo-1602143307185-83dc08f51609?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "INV-5005",
    productId: "PROD-1005",
    productName: "Cotton Premium T-Shirt",
    sku: "FAS-TS-1005",
    category: "Fashion",
    currentStock: 250,
    reservedStock: 10,
    availableStock: 240,
    restockThreshold: 30,
    status: "Overstock",
    warehouseLocation: "Main Hub - Harare",
    lastRestocked: "2026-02-22T10:00:00Z",
    unitPrice: 29.99,
    totalValue: 7497.50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop"
  }
];
