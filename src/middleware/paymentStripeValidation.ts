import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Validation rules for the payment request
 */
export const validatePaymentRequest = [
  body('payer_type')
    .isIn(['user', 'organization'])
    .withMessage('Validation error: payer_type must be either "user" or "organization"'),
  body('payer_id')
    .isEmail()
    .withMessage('Validation error: payer_id must be a valid email address'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Validation error: amount must be a positive number'),
  body('currency')
    .isIn(['USD', 'EUR', 'GBP']) // Add more currencies if needed
    .withMessage('Validation error: currency must be one of the supported currencies'),

  /**
   * Middleware to check validation results
   */
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Bad Request",
        message: errors.array().map(err => err.msg).join(', '),
        status_code: 400
      });
    }
    next();
  }
];
