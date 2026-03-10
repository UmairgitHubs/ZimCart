import { z } from "zod";

const variantSchema = z.object({
  name: z.string().min(2, "Variant name must be at least 2 characters"),
  sellingUnit: z.enum(["piece", "pack", "box", "bag", "kg", "g", "litre", "ml", "carton", "dozen"], {
    errorMap: () => ({ message: "Please select a valid selling unit" })
  }),
  baseUnitQuantity: z.number().gt(0, "Quantity must be greater than 0"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  costPrice: z.number().gt(0, "Cost Price must be greater than 0"),
  sellingPrice: z.number().gt(0, "Selling Price must be greater than 0"),
  discountPrice: z.number().optional(),
  stockQuantity: z.number().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.number().min(1, "Threshold must be at least 1").default(10),
  weight: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.discountPrice !== undefined && data.discountPrice !== 0) {
    return data.discountPrice < data.sellingPrice;
  }
  return true;
}, {
  message: "Discount price must be less than selling price",
  path: ["discountPrice"],
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().min(1, "Brand name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // Base Pricing fields (kept for backend compatibility, sync'd from default variant)
  price: z.number().min(0, "Price must be at least 0").default(0),
  discountPrice: z.number().optional().default(0),
  costPrice: z.number().optional().default(0),
  taxPercentage: z.number().min(0).max(100).default(0),
  
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional().default(""),
  status: z.enum(["In Stock", "Low Stock", "Out of Stock", "Draft"]),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  isDeal: z.boolean().default(false),
  weight: z.string().optional(),
  baseUnit: z.enum(["piece", "kg", "g", "litre", "ml", "metre", "box"]).default("piece"),
  sales: z.number().optional().default(0),
  
  // New Variants structure
  variants: z.array(variantSchema)
    .min(1, "At least one variant is required")
    .refine((variants) => {
      const defaultCount = variants.filter(v => v.isDefault).length;
      return defaultCount === 1;
    }, {
      message: "Exactly one variant must be marked as default",
      path: ["variants"]
    })
});

export type ProductFormData = z.infer<typeof productSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;
