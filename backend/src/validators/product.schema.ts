import { z } from 'zod';

export const productBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  discountPrice: z.number().optional().default(0),
  costPrice: z.number().optional().default(0),
  taxPercentage: z.number().min(0).max(100).default(0),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional().default(""),
  inventory: z.number().min(0, "Inventory cannot be negative"),
  status: z.enum(["Draft", "In Stock", "Low Stock", "Out of Stock"]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  discountPercentage: z.number().min(0).max(100).default(0),
  isDeal: z.boolean().default(false),
  weight: z.string().optional().default(""),
  sales: z.number().min(0).optional().default(0),
  variants: z.array(z.object({
    type: z.string(),
    values: z.array(z.string())
  })).optional().default([]),
});

export const productSchema = z.object({
  body: productBodySchema
});

export type ProductInput = z.infer<typeof productBodySchema>;
