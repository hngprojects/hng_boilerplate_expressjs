import { Router } from "express";
import { PreferenceController } from "../controllers/preferences.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/v1/api/organization/:organizationId/preferences",
  authenticateJWT,
  authorizeRole(["superadmin", "owner"]),
  PreferenceController.createPreference
);
router.put(
  "/v1/api/organization/preferences/:preference_id",
  authenticateJWT,
  authorizeRole(["superadmin", "owner"]),
  PreferenceController.updatePreference
);
router.get(
  "/v1/api/organization/:organizationId/preferences",
  authenticateJWT,
  authorizeRole(["superadmin", "owner"]),
  PreferenceController.retrievePreferences
);
router.delete(
  "/v1/api/organization/preferences/:preference_id",
  authenticateJWT,
  authorizeRole(["superadmin", "owner"]),
  PreferenceController.deletePreference
);

export default router;
