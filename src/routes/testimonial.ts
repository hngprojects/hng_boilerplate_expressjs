import { Router } from "express";
import TestimonialController from "../controllers/TestimonialController";
 
const testimonialRouter = Router();
const testimonialController = new TestimonialController();

testimonialRouter.get("/testimonials", testimonialController.getAllTestimonials.bind(testimonialController));

export default testimonialRouter;