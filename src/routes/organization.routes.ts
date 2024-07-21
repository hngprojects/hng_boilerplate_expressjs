// src/routes/user.ts
import { Router } from "express";
import { deleteOrganization, createOrganization  } from "../controllers";
import { authenticateJWT } from "../middleware/auth";

const organizationRouter = Router();

organizationRouter.get("/", (req, res) => {
    res.json({
        message: "Hello world"
    })
})

organizationRouter.delete("/:orgId", authenticateJWT, deleteOrganization);
organizationRouter.post("/", authenticateJWT, createOrganization);

export { organizationRouter };
