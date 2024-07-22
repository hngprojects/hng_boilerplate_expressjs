// src/middleware/methodNotAllowed.ts
import { Request, Response, NextFunction } from 'express';

const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({ error: 'This method is not allowed.' });
};

export { methodNotAllowed };
