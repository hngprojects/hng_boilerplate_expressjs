import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

/**
 * Validation rules for the payment request using Stripe
 */
export const validatePaymentRequest = [
  body("payer_type")
    .notEmpty()
    .withMessage("payer_type is required")
    .isIn(["user", "organization"])
    .withMessage('payer_type must be either "user" or "organization"'),

  body("payer_id")
    .notEmpty()
    .withMessage("payer_id is required")
    .isEmail()
    .withMessage("payer_id must be a valid email address"),

  body("amount")
    .notEmpty()
    .withMessage("amount is required")
    .isFloat({ gt: 0 })
    .withMessage("amount must be a positive number"),

  body("currency")
    .notEmpty()
    .withMessage("currency is required")
    .isIn(["USD", "EUR", "KSH", "Naira"])
    .withMessage('currency must be either "USD", "EUR", "KSH", or "Naira"'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Bad Request",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
        status_code: 400,
      });
    }
    next();
  },
];
