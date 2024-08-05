import { createContact } from "../controllers";
import { validateData } from "../middleware/validationMiddleware";
import { contactUsSchema } from "../schemas/contact";
import { Router } from "express";

const contactRouter = Router();

contactRouter.post(
  "/contact-us",
  validateData({ body: contactUsSchema }),
  createContact,
);

export { contactRouter };
