import { Category } from "@/types/categories";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "CAT-001",
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge gadgets, smartphones, laptops, and professional home audio systems.",
    productCount: 428,
    status: "Published",
    lastUpdated: "2026-02-24T10:30:00Z",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&auto=format&fit=crop",
    displayOrder: 1,
    isFeatured: true
  },
  {
    id: "CAT-002",
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    description: "Curated collections of trending apparel, footwear, and luxury accessories.",
    productCount: 1240,
    status: "Published",
    lastUpdated: "2026-02-23T15:45:00Z",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=200&auto=format&fit=crop",
    displayOrder: 2,
    isFeatured: true
  },
  {
    id: "CAT-003",
    name: "Home & Living",
    slug: "home-living",
    description: "Premium furniture, smart home appliances, and elegant interior decor items.",
    productCount: 892,
    status: "Published",
    lastUpdated: "2026-02-22T09:20:00Z",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=200&auto=format&fit=crop",
    displayOrder: 3,
    isFeatured: false
  },
  {
    id: "CAT-004",
    name: "Beauty & Wellness",
    slug: "beauty-wellness",
    description: "Dermatologically tested skincare, hair care, and high-end cosmetic brands.",
    productCount: 567,
    status: "Published",
    lastUpdated: "2026-02-21T14:10:00Z",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop",
    displayOrder: 4,
    isFeatured: true
  },
  {
    id: "CAT-005",
    name: "Supermarket & Grocery",
    slug: "grocery",
    description: "Farm-fresh organic produce, dairy, bakery items, and household essentials.",
    productCount: 3450,
    status: "Published",
    lastUpdated: "2026-02-20T11:05:00Z",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop",
    displayOrder: 5,
    isFeatured: true
  },
  {
    id: "CAT-006",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Professional gym equipment, athletic wear, and outdoor adventure gear.",
    productCount: 184,
    status: "Published",
    lastUpdated: "2026-02-19T16:50:00Z",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&auto=format&fit=crop",
    displayOrder: 6,
    isFeatured: false
  },
  {
    id: "CAT-007",
    name: "Automotive Parts",
    slug: "automotive",
    description: "Premium car accessories, maintenance tools, and replacement parts.",
    productCount: 215,
    status: "Draft",
    lastUpdated: "2026-02-18T12:00:00Z",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=200&auto=format&fit=crop",
    displayOrder: 7,
    isFeatured: false
  },
  {
    id: "CAT-008",
    name: "Baby & Kids",
    slug: "baby-kids",
    description: "Safe and sustainable toys, clothing, and nursery essentials for children.",
    productCount: 432,
    status: "Published",
    lastUpdated: "2026-02-17T09:30:00Z",
    image: "https://images.unsplash.com/photo-1519689684481-96a050a3f5a0?q=80&w=200&auto=format&fit=crop",
    displayOrder: 8,
    isFeatured: false
  }
];
