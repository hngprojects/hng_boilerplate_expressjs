// src/routes/user.ts
import { Router } from "express";
import { deleteOrganization, createOrganization  } from "../controllers";

const organizationRouter = Router();

organizationRouter.get("/", (req, res) => {
    res.json({
        message: "Hello world"
    })
})

organizationRouter.delete("/:orgId", deleteOrganization);
organizationRouter.post("/", createOrganization);

export { organizationRouter };
