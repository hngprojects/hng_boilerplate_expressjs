import { param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { InvalidInput } from "./error";

export const validateOrgId = [
  param("org_id")
    .notEmpty()
    .withMessage("Organisation id is required")
    .isString()
    .withMessage("Organisation id must be a string")
    .isUUID()
    .withMessage("Valid org_id must be provided")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new InvalidInput(
        `${errors
          .array()
          .map((error) => error.msg)
          .join(", ")}`,
      );
    }
    next();
  },
];
