import { Router } from "express";
import { ContactController } from "../controllers/contactController";

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post(
  "/contact",
  contactController.createContact.bind(contactController),
);

contactRouter.get(
  "/contact",
  contactController.getAllContact.bind(contactController),
);

export { contactRouter };
