import { Router } from "express";
import { ContactController } from "../controllers";
import { validateData } from "../middleware/validationMiddleware";
import { contactSchema } from "../schemas/contact";

const contactRouter = Router();
const contactController = new ContactController();

contactRouter.post(
  "/contact-us",
  validateData(contactSchema),
  contactController.createContact.bind(contactController),
);

export { contactRouter };
