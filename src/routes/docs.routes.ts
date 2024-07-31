import { Router } from "express";
import DocsController from "../controllers/docsController";

const docsRouter = Router();
const docsController = new DocsController();

docsRouter.get("/download", docsController.downloadApiDocs);

export { docsRouter };
