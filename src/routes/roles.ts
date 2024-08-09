import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createUserRole } from "../controllers";

const roleRouter = Router();

roleRouter.post("/roles", authMiddleware, createUserRole);

export { roleRouter };
