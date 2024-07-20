import express from "express";
import { OrgController } from "../controllers/OrgController";

const router = express.Router();
const orgController = new OrgController();

router.delete("/organizations/:org_id/users/:user_id", (req, res) =>
  orgController.removeUser(req, res),
);

export default router;
