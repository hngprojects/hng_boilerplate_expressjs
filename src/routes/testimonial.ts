// src/routes/user.ts
import { Router } from "express";
import TestimonialsController from "../controllers/TestimonialsController";
import { authMiddleware } from "../middleware";
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

// CODE BY TOMILOLA OLUWAFEMI
testimonialRoute.get(
  "/testimonials",
  authMiddleware,
  testimonialController.getAllTestimonials.bind(testimonialController)
);
testimonialRoute.delete(
  "/testimonials/:testimonial_id",
  authMiddleware,
  testimonialController.deleteTestimonial.bind(testimonialController)
);

export { testimonialRoute };
