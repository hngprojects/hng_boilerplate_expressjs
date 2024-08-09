import { Router } from "express";
import admin from "../controllers/AdminController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { Organization } from "../models";
import { Limiter } from "../utils";

const adminRouter = Router();

const adminOrganisationController = new admin.AdminOrganisationController();
const adminUserController = new admin.AdminUserController();
const adminLogController = new admin.AdminLogController();

// Organisation
adminRouter.patch(
  "/admin/organisation/:id",
  Limiter,
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminOrganisationController.updateOrg.bind(adminOrganisationController),
);

// Organisation
adminRouter.delete(
  "/admin/organizations/:org_id/delete",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminOrganisationController.deleteOrganization.bind(
    adminOrganisationController,
  ),
);

// User
adminRouter.get(
  "/admin/users",
  Limiter,
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminUserController.listUsers.bind(adminUserController),
);

// User
adminRouter.patch(
  "/admin/users/:id",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminUserController.updateUser.bind(adminUserController), // Use updateUser method
);

adminRouter.post(
  "/admin/users/:user_id/roles",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminOrganisationController.setUserRole.bind(adminOrganisationController),
);

adminRouter.get(
  "/admin/users/:id",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminUserController.getUserBySuperadmin.bind(adminUserController),
);

// Logs
adminRouter.get(
  "/admin/logs",
  Limiter,
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  adminLogController.getLogs.bind(adminLogController),
);

export { adminRouter };
