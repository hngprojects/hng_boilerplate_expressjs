// src/routes/user.ts
import { Router } from "express";
import TestimonialsController from "../controllers/TestimonialsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateTestimonial } from "../middleware/testimonial.validation";

const testimonialRoute = Router();
const testimonialController = new TestimonialsController();

testimonialRoute.post(
  "/testimonials",
  authMiddleware,
  validateTestimonial,
  testimonialController.createTestimonial.bind(testimonialController)
);
testimonialRoute.get(
  "/testimonials/:testimonial_id",
  authMiddleware,
  testimonialController.getTestimonial.bind(testimonialController)
);

export { testimonialRoute };
