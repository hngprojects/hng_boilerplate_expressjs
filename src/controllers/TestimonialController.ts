import { Request, Response } from "express";
import { TestimonialService } from "../services/TestimonialService";

class TestimonialController {
  private testimonialService: TestimonialService;

  constructor() {
    this.testimonialService = new TestimonialService();
  }

  async getAllTestimonials(req: Request, res: Response) {
    try {
      const testimonials = await this.testimonialService.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
