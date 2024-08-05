import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateData = (schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
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
