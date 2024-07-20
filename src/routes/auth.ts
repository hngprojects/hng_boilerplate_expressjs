import { signUp, verifyOtp } from "../controllers";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);

export { authRoute };
