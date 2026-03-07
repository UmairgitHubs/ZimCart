import { Promotion } from "@/types/promotions";

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: "PROM-001",
    code: "ZIMSUMMER24",
    name: "Summer Mega Sale",
    description: "20% off on all electronics and gadgets.",
    type: "Percentage",
    value: 20,
    minPurchase: 50,
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-08-31T23:59:59Z",
    usageCount: 0,
    usageLimit: 500,
    status: "Scheduled",
    targetCategory: "Electronics"
  },
  {
    id: "PROM-002",
    code: "ZIMWELCOME10",
    name: "New Customer Welcome",
    description: "Flat $10 off for first-time shoppers.",
    type: "Fixed Amount",
    value: 10,
    minPurchase: 30,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    usageCount: 1245,
    usageLimit: undefined,
    status: "Active"
  },
  {
    id: "PROM-003",
    code: "FREESHIPZW",
    name: "Nationwide Free Shipping",
    description: "No delivery charges for orders over $100.",
    type: "Free Shipping",
    value: 0,
    minPurchase: 100,
    startDate: "2026-02-01T00:00:00Z",
    endDate: "2026-03-01T23:59:59Z",
    usageCount: 456,
    usageLimit: 1000,
    status: "Active"
  },
  {
    id: "PROM-004",
    code: "FLASHFASHION",
    name: "Weekend Fashion Flash",
    description: "Exclusive 15% off on the entire apparel collection.",
    type: "Percentage",
    value: 15,
    minPurchase: 0,
    startDate: "2026-02-21T00:00:00Z",
    endDate: "2026-02-23T23:59:59Z",
    usageCount: 89,
    usageLimit: 100,
    status: "Expired",
    targetCategory: "Fashion"
  },
  {
    id: "PROM-005",
    code: "OFFTOPIC25",
    name: "Inactive Promo",
    description: "Special internal testing coupon.",
    type: "Percentage",
    value: 25,
    minPurchase: 200,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-06-01T23:59:59Z",
    usageCount: 0,
    usageLimit: 10,
    status: "Disabled"
  }
];
