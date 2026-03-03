import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().min(1, "Brand name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Selling Price must be greater than 0"),
  discountPrice: z.number().optional().default(0),
  costPrice: z.number().optional().default(0),
  taxPercentage: z.number().min(0).max(100).default(0),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional().default(""),
  inventory: z.number().min(0, "Inventory cannot be negative").int(),
  status: z.enum(["In Stock", "Low Stock", "Out of Stock", "Draft"]),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  isDeal: z.boolean().optional().default(false),
  weight: z.string().optional().default(""),
  variants: z.array(z.object({
    type: z.string().min(1, "Variant type is required"),
    values: z.array(z.string()).min(1, "At least one value is required")
  })).default([])
});

export type ProductFormData = z.infer<typeof productSchema>;
