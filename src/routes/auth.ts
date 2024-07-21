import { signUp, verifyOtp, login } from "../controllers";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);

export { authRoute };
