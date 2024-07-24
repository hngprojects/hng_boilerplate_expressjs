import { Router } from "express";
import admin from "../controllers/AdminController";
import { authMiddleware, checkPermissions, } from "../middleware";
import { UserRole } from "../enums/userRoles";

const adminRouter = Router();
const adminOrganisationController = new admin.AdminOrganisationController();

adminRouter.patch("/organisation/:id", authMiddleware, 
checkPermissions([UserRole.SUPER_ADMIN]), 
adminOrganisationController.updateOrg.bind(adminOrganisationController));

adminRouter.delete(
    "/organizations/:org_id/delete",
    authMiddleware,
    checkPermissions([UserRole.SUPER_ADMIN]),
    adminOrganisationController.deleteOrganization.bind(adminOrganisationController)
  );
export { adminRouter }; 
