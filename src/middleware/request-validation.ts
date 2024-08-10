import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const requestBodyValidator = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = err.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          status_code: 400,
          message: "Invalid request body",
          data: errorDetails,
        });
      }
      next(err);
    }
  };
};

export { requestBodyValidator };
