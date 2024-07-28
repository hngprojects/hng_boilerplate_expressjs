import { Router } from "express";
import { ContactController } from "../controllers/contactController";

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post(
  "/contact-us",
  contactController.createContact.bind(contactController),
);

export { contactRouter };
