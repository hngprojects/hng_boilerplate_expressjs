// src/routes/user.ts
import { Router } from "express";
import TestimonialsController from "../controllers/TestimonialsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateTestimonial } from "../middleware/testimonial.validation";

const testimonialRouter = Router();
const testimonialController = new TestimonialsController();

testimonialRouter.post(
  "/testimonials",
  authMiddleware,
  validateTestimonial,
  testimonialController.createTestimonial.bind(testimonialController)
);
testimonialRouter.get(
  "/testimonials/:testimonial_id",
  authMiddleware,
  testimonialController.getTestimonial.bind(testimonialController)
);

export default testimonialRouter;
