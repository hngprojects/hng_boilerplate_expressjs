import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateData = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessages = e.errors.map((issue: any) => ({
          message: ` ${issue.path.join(".")} is ${issue.message}`,
        }));

        return res.status(400).json({
          message: "Validation error",
          errors: errorMessages,
        });
      }
      next(e);
    }
  };
};
