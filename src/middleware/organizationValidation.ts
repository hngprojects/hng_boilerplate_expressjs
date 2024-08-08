import { NextFunction, Request, Response } from "express";
import { param, validationResult, body } from "express-validator";
import { z } from "zod";
import { User } from "../models";
import { OrgService } from "../services/org.services";
import log from "../utils/logger";
import { InvalidInput } from "./error";

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

export const validateUpdateOrg = [
  param("organization_id")
    .notEmpty()
    .withMessage("Organisation id is required")
    .isString()
    .withMessage("Organisation id must be a string")
    .isUUID()
    .withMessage("Valid organization ID must be provided")
    .trim()
    .escape(),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email must be provided")
    .trim()
    .escape(),
  body("industry")
    .notEmpty()
    .withMessage("Industry is required")
    .isString()
    .withMessage("Industry must be a string")
    .trim()
    .escape(),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string")
    .trim()
    .escape(),
  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string")
    .trim()
    .escape(),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .trim()
    .escape(),
  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string")
    .trim()
    .escape(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "Error",
        status_code: 422,
        message:
          "Valid organization ID, name, email, industry, type, country, address, state, and description must be provided.",
      });
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

    next();
  } catch (error) {
    res.status(500).json({
      status_code: 500,
      message: "Internal server error",
    });
  }
};

export const validateOrgRole = [
  param("org_id")
    .notEmpty()
    .withMessage("Organisation id is required")
    .isString()
    .withMessage("Organisation id must be a string")
    .isUUID()
    .withMessage("Valid organization ID must be provided")
    .trim()
    .escape(),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .isLength({ max: 50 })
    .withMessage("Name must be a string")
    .trim()
    .escape(),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage("Description must be a string")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "Error",
        status_code: 422,
        message:
          "Valid organization ID, name, and description must be provided.",
      });
    }
    next();
  },
];

//TODO: Add validation for update organization
