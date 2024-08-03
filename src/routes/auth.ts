import { signUpSchema } from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import { signUp } from "../controllers";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/auth/register", validateData(signUpSchema), signUp);
export { authRoute };
