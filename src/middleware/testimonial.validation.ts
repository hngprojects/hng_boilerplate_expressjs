import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateTestimonial = [
  body("client_name").notEmpty().withMessage("Client name is required"),
  body("client_position").notEmpty().withMessage("Client position is required"),
  body("testimonial").notEmpty().withMessage("Testimonial is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Validation failed", status_code: 422, errors: errors.array() });
    }
    next();
  },
];
