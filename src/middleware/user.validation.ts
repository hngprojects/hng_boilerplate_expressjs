import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { BadRequest } from "./error";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { updateUserTimezoneSchema } from "../schema/user.schema";

// CustomRequest Interface
interface CustomRequest<
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
  TBody = any,
> extends Request {
  params: TParams;
  query: TQuery;
  body: TBody;
}

// Middleware to validate the request
const validateRequest =
  <
    TParams extends ParamsDictionary = ParamsDictionary,
    TQuery extends ParsedQs = ParsedQs,
    TBody = any,
  >(
    schema: ZodSchema,
  ) =>
  (
    req: CustomRequest<TParams, TQuery, TBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Continue to the next middleware or controller
    } catch (error) {
      if (error instanceof ZodError) {
        next(new BadRequest(error.errors.map((e) => e.message).join(", ")));
      } else {
        next(error); // Pass to the global error handler
      }
    }
  };

// Example usage of the validateRequest middleware with the updateUserTimezoneSchema
const validateUpdateUserTimezone = validateRequest(updateUserTimezoneSchema);

export { validateRequest, validateUpdateUserTimezone };
