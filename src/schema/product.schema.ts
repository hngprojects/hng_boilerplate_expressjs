import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(1, "Price is required"),
  image: z.string().optional(),
  quantity: z.number().min(1, "Quantity is required"),
});

export type ProductSchema = z.infer<typeof productSchema>;
export default { productSchema };
