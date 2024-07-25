import { Request, Response, NextFunction } from "express";

import { body, validationResult } from "express-validator";
// Middleware to validate and sanitize product details
export const validateProductDetails = [
  body("name").trim().escape(),
  body("description").trim().escape(),
  body("category").trim().escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
