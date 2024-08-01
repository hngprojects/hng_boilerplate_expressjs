import { Router } from "express";
import { ContactController } from "../controllers/contactController";

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post(
  "/contact-us",
  contactController.createContact.bind(contactController),
);

contactRouter.get(
  "/contact-us",
  contactController.getAllContact.bind(contactController),
);

export { contactRouter };
