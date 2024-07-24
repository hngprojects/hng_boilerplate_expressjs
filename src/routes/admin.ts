import { Router } from "express";
import admin from "../controllers/AdminController";
import { authMiddleware, checkPermissions, } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { Organization } from "../models";
import { Limiter} from "../utils";


const adminRouter = Router();

const adminOrganisationController = new admin.AdminOrganisationController();
const adminUserController = new admin.AdminUserController();

// Organisation
adminRouter.patch("/organisation/:id", Limiter,authMiddleware, 
checkPermissions([UserRole.SUPER_ADMIN]), 
adminOrganisationController.updateOrg.bind(adminOrganisationController));
adminRouter.post(
    "/users/:user_id/roles", authMiddleware,
    checkPermissions([UserRole.SUPER_ADMIN]),
    adminOrganisationController.setUserRole.bind(adminOrganisationController),
  );
// User
adminRouter.get("/users", Limiter, authMiddleware, 
checkPermissions([UserRole.SUPER_ADMIN]),  
adminUserController.listUsers.bind(adminUserController));



export { adminRouter }; 