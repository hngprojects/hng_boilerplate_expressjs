import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Testimonial } from "../models/Testimonial";

export default class TestimonialsController {
  public async createTestimonial(req: Request, res: Response) {
    const { client_name, client_position, testimonial } = req.body;

    // Get the user ID from the request
    const userId = (req as Record<string, any>).user.id;

    // Create a new testimonial
    const testimonialInstance = AppDataSource.getRepository(Testimonial).create({
      user_id: userId,
      client_name,
      client_position,
      testimonial,
    });

    // Save the testimonial
    await AppDataSource.getRepository(Testimonial).save(testimonialInstance);

    // Return the testimonial
    res.status(201).json({ message: "Testimonial created successfully", status_code: 201, data: testimonialInstance });
  }

  public async getTestimonial(req: Request, res: Response) {
    try {
      // Get the user ID from the request
      //   const userId = (req as Record<string, any>).user.id;
      const { testimonial_id } = req.params;

      // Get the testimonial
      const testimonial = await AppDataSource.getRepository(Testimonial).findOne({ where: { id: testimonial_id } });

      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial not found", status_code: 404 });
      }

      // Return the testimonial
      res.status(200).json({ message: "Testimonial retrieved successfully", status_code: 200, data: testimonial });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}
