// middlewares/validateProduct.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { InvalidInput } from './error'; 

export const validateUpdateProduct = [
  body('name').optional().notEmpty().withMessage('Name must not be empty string'),
  body('description').optional().notEmpty().withMessage('Description not be empty string'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().notEmpty().withMessage('Category must not be empty string'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
      }
    next();
  },
];
