import { Router } from "express";
import admin from "../controllers/AdminController";
import { authMiddleware, checkPermissions, } from "../middleware";
import { UserRole } from "../enums/userRoles";

const adminRouter = Router();
const adminOrganisationController = new admin.AdminOrganisationController();
const adminUserController = new admin.AdminUserController();


adminRouter.patch("/organisation/:id", authMiddleware, 
checkPermissions([UserRole.SUPER_ADMIN]), 
adminOrganisationController.updateOrg.bind(adminOrganisationController));

adminRouter.patch(
    "/user/:id",
    authMiddleware, // middleware to check authentication
    checkPermissions([UserRole.SUPER_ADMIN]), // middleware to check if the user is super admin
    adminUserController.updateUser.bind(adminUserController) // Use updateUser method
  );


export { adminRouter }; 