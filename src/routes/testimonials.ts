import { createTestimonialSchema } from "../schemas/testimonials";
import { validateData } from "../middleware/validationMiddleware";
import { TestimonialsController } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const testimonialRoute = Router();
const testimonial = new TestimonialsController();

testimonialRoute.post(
  "/testimonials",
  authMiddleware,
  validateData(createTestimonialSchema),
  testimonial.createTestimonial,
);

testimonialRoute.get(
  "/testimonials",
  authMiddleware,
  testimonial.getAllTestimonials,
);

testimonialRoute.get(
  "/testimonials/:id",
  authMiddleware,
  testimonial.getTestimonial,
);

testimonialRoute.delete(
  "/testimonials/:id",
  authMiddleware,
  testimonial.deleteTestimonial,
);

export { testimonialRoute };
