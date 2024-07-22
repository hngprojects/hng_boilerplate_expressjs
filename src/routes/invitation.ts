import { Router, NextFunction, Response, Request } from "express";
import { authMiddleware } from "../middleware";
import createHttpError from "http-errors";
import { createInvitation, deactivateInvitation } from "../controllers";

const inviteRoute = Router();

inviteRoute.post("/create-invitation/:orgId", authMiddleware, createInvitation);
inviteRoute.patch("/deactivate", authMiddleware, deactivateInvitation);

const errorHandler = (
  err: createHttpError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({ message: err.message });
};

inviteRoute.use(errorHandler);

export { inviteRoute };
