import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { InvalidInput } from "./error";

export const validateTestimonial = [
  body("client_name").notEmpty().withMessage("Client name is required"),
  body("client_position").notEmpty().withMessage("Client position is required"),
  body("testimonial").notEmpty().withMessage("Testimonial is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new InvalidInput("Validation failed");
    }
    next();
  },
];
