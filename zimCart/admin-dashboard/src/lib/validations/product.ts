import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.number().optional().or(z.literal(0)),
  costPrice: z.number().optional().or(z.literal(0)),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional().or(z.literal("")),
  inventory: z.number().min(0, "Inventory cannot be negative").int(),
  status: z.enum(["In Stock", "Low Stock", "Out of Stock", "Draft"]),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  discountPercentage: z.number().min(0).max(100).optional().or(z.literal(0)),
  isDeal: z.boolean().optional(),
  weight: z.string().optional().or(z.literal("")),
});

export type ProductFormData = z.infer<typeof productSchema>;
