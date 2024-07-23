import { Router } from "express";
import AdminOrganisationController from "../controllers/AdminController";
import { authMiddleware, checkPermissions, } from "../middleware";
import { UserRole } from "../enums/userRoles";

const adminRouter = Router();
const adminOrganisationController = new AdminOrganisationController();

adminRouter.patch("/organisation/:id", authMiddleware, 
checkPermissions([UserRole.SUPER_ADMIN]), 
adminOrganisationController.updateOrg.bind(adminOrganisationController));

export { adminRouter }; 