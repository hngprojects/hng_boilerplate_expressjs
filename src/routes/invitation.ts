import { Router } from "express";
import { verifyJWT } from "../middleware"; 
import { createInvitation, deactivateInvitation } from "../controllers";

const inviteRoute = Router();

inviteRoute.post("/create-invitation/:orgId", verifyJWT, createInvitation);
inviteRoute.patch("/deactivate", verifyJWT, deactivateInvitation);

export { inviteRoute };
