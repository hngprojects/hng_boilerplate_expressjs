import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const requestBodyValidator = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid request body",
          // errors: err.errors,
        });
      }
      next(err);
    }
  };
};

export { requestBodyValidator };
