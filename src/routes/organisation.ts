import { Router} from "express";
import { OrgController } from "../controllers/OrgController";


const orgRouter = Router();
const orgController = new OrgController();

orgRouter.get("/organisations/:org_id", authMiddleware, validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);
orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);



orgRouter.get(
  "/users/:id/organizations",
  orgController.getOrganizations.bind(orgController),
);
export { orgRouter };
