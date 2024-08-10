import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const requestBodyValidator = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((error: any) => ({
          path: `${error.path.join(",")}`,
          message: `${error.message}`,
        }));

        return res.status(422).json({
          message: "Invalid request body",
          errors: errorMessages,
        });
      }
      next(err);
    }
  };
};

export { requestBodyValidator };
