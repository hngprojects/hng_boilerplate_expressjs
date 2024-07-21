import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Testimonial } from "../models/Testimonial";

export default class TestimonialsController {
  /**
   * @swagger
   * tags:
   *   name: Testimonials
   *   description: Testimonial related routes
   */

  /**
   * @swagger
   * api/v1/testimonials:
   *   post:
   *     summary: Create a new testimonial
   *     tags: [Testimonials]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client_name:
   *                 type: string
   *               client_position:
   *                 type: string
   *               testimonial:
   *                 type: string
   *     responses:
   *       201:
   *         description: Testimonial created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                 data:
   *                   type: object
   *       500:
   *         description: Some server error
   */
  public async createTestimonial(req: Request, res: Response) {
    const { client_name, client_position, testimonial } = req.body;

    // Get the user ID from the request
    const userId = (req as Record<string, any>).user.id;

    // Create a new testimonial
    const testimonialInstance = AppDataSource.getRepository(Testimonial).create(
      {
        user_id: userId,
        client_name,
        client_position,
        testimonial,
      }
    );

    // Save the testimonial
    await AppDataSource.getRepository(Testimonial).save(testimonialInstance);

    // Return the testimonial
    res.status(201).json({
      message: "Testimonial created successfully",
      status_code: 201,
      data: testimonialInstance,
    });
  }

  /**
   * @swagger
   * api/v1/testimonials/{id}:
   *   get:
   *     summary: Retrieve a testimonial by ID
   *     tags: [Testimonials]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Testimonial ID
   *     responses:
   *       200:
   *         description: Testimonial retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                 data:
   *                   type: object
   *       404:
   *         description: Testimonial not found
   *       500:
   *         description: Some server error
   */

  public async getTestimonial(req: Request, res: Response) {
    try {
      // Get the user ID from the request
      //   const userId = (req as Record<string, any>).user.id;
      const { testimonial_id } = req.params;

      // Get the testimonial
      const testimonial = await AppDataSource.getRepository(
        Testimonial
      ).findOne({ where: { id: testimonial_id } });

      if (!testimonial) {
        return res
          .status(404)
          .send({ message: "Testimonial not found", status_code: 404 });
      }

      // Return the testimonial
      res.status(200).json({
        message: "Testimonial retrieved successfully",
        status_code: 200,
        data: testimonial,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}
