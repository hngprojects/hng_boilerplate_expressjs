// src/routes/user.ts
import { Router } from "express";
import TestimonialsController from "../controllers/TestimonialsController";
import { authMiddleware } from "../middleware";
import { validateTestimonial } from "../middleware/testimonial.validation";
import testimonialRateLimiter from "../middleware/testimonialRateLimiter";

const testimonialRoute = Router();
const testimonialController = new TestimonialsController();

testimonialRoute.post(
	"/testimonials",
	authMiddleware,
	validateTestimonial,
	testimonialController.createTestimonial.bind(testimonialController)
);

testimonialRoute.get(
	"/testimonials",
	authMiddleware,
	testimonialRateLimiter,
	testimonialController.getAllTestimonial.bind(testimonialController)
);

testimonialRoute.get(
	"/testimonials/:testimonial_id",
	authMiddleware,
	testimonialController.getTestimonial.bind(testimonialController)
);

export { testimonialRoute };
