import { z } from "zod";

const createTopicSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  content: z.string().min(1, { message: "Content cannot be empty" }),
  author: z
    .string()
    .min(1, { message: "Author cannot be empty" })
    .default("ADMIN"),
});

const updateTopicSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).optional(),
  content: z.string().min(1, { message: "Content cannot be empty" }).optional(),
  author: z
    .string()
    .min(1, { message: "Author cannot be empty" })
    .default("ADMIN")
    .optional(),
});

const deleteTopicSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }), // Assuming ID is a UUID
});

const getTopicSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }), // Assuming ID is a UUID
});

export {
  createTopicSchema,
  updateTopicSchema,
  deleteTopicSchema,
  getTopicSchema,
};
