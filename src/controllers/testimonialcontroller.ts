import { Request, Response } from "express";
import { sendJsonResponse } from "../helpers";
import { TestimonialService } from "../services/testimonialservice";
import { ResourceNotFound } from "../middleware";

const testimonialService = new TestimonialService();

export class TestimonialsController {
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

    const result = await testimonialService.createTestimonial(
      client_name,
      client_position,
      testimonial,
    );
    sendJsonResponse(res, 201, result.message, result.testimonial);
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
    const { testimonial_id } = req.params;

    const { testimonial, message } =
      await testimonialService.getTestimonial(testimonial_id);

    if (!testimonial) {
      throw new ResourceNotFound("Testimonial not Found");
    }

    sendJsonResponse(res, 201, message, { testimonial });
  }

  /**
   * @swagger
   * api/v1/testimonials:
   *   get:
   *     summary: Get all testimonials
   *     tags: [Testimonials]
   *     requestBody:
   *       required: false
   *     responses:
   *       200:
   *         description: Fetch successful
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
   *         description: Internal Server error
   */

  public async getAllTestimonials(req: Request, res: Response) {
    const { testimonials, message } =
      await testimonialService.getAllTestimonials();
    sendJsonResponse(res, 201, message, { testimonials });
  }

  /**
   * @swagger
   * api/v1/testimonials/{id}:
   *   post:
   *     summary: Delete a testimonial
   *     tags: [Testimonials]
   *     responses:
   *       201:
   *         description: Delete successful
   *       404:
   *         description: Testimonial not Found
   *       500:
   *         description: Internal server error
   */

  public async deleteTestimonial(req: Request, res: Response) {
    const { testimonial_id } = req.params;

    const { testimonial, message } =
      await testimonialService.deleteTestimonial(testimonial_id);

    sendJsonResponse(res, 201, message, { testimonial });
  }
}
