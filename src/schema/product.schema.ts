import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.1, "Price is required and must be greater than 0"),
  image: z.string(),
  quantity: z.number().min(1, "Quantity is required"),
  cost_price: z.number().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
export default { productSchema };
