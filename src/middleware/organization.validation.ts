import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import log from "../utils/logger";
import { z } from "zod";
import { param, validationResult } from "express-validator";
import { InvalidInput } from "./error";
import { OrgService } from "../services/org.services";

export const organizationValidation = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationSchema = z.object({
      name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be a string",
      }),
      description: z.string({
        required_error: "description is required",
        invalid_type_error: "description must be a string",
      }),
      email: z.string({
        required_error: "email is required",
        invalid_type_error: "description must be a string",
      }),
      industry: z.string({
        required_error: "industry is required",
        invalid_type_error: "description must be a string",
      }),
      type: z.string({
        required_error: "type is required",
        invalid_type_error: "description must be a string",
      }),
      country: z.string({
        required_error: "country is required",
        invalid_type_error: "description must be a string",
      }),
      address: z.string({
        required_error: "address is required",
        invalid_type_error: "description must be a string",
      }),
      state: z.string({
        required_error: "state is required",
        invalid_type_error: "description must be a string",
      }),
    });
    organisationSchema.parse(req.body);

    next();
  } catch (error) {
    const validationErrors = error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    res.statusCode = 422;
    return res.json({ errors: validationErrors }).status(422);
  }
};

try {
} catch (error) {}

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

export const validateUserToOrg = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { org_id } = req.params;
    const { user } = req;
    console.log(org_id, user.id);

    if (!user || !org_id) {
      return res.status(400).json({
        status_code: 400,
        message: "user or organization id is missing",
      });
    }

    const orgService = new OrgService();
    const userOrg = await orgService.getSingleOrg(org_id, user.id);

    if (!userOrg) {
      return res.status(400).json({
        status_code: 400,
        message: "user not a member of organization",
      });
    }

    console.log(org_id, user, userOrg);
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal server error",
    });
  }
};
