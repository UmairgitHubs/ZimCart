import { z } from "zod";

export const orderItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().min(1, "Quantity must be at least 1").int("Quantity must be an integer"),
});

export const manualOrderSchema = z.object({
  customerName: z.string().min(2, "Full name must be at least 2 characters"),
  customerPhone: z.string().min(8, "Valid phone number is required"),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  deliveryAddress: z.string().min(5, "Complete address is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type ManualOrderFormData = z.infer<typeof manualOrderSchema>;
