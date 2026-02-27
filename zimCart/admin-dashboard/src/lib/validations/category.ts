import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional(),
  status: z.enum(["Published", "Draft", "Hidden"]),
  parentCategoryId: z.string().optional(),
  displayOrder: z.number().int().min(0, "Order must be a positive number"),
  isFeatured: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
