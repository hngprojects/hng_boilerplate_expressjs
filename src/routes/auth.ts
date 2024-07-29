import {
  signUp,
  verifyOtp,
  login,
  changeUserRole,
  changePassword,
  handleGoogleAuth,
  googleAuthCall,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import {
  googleAuthCallback,
  initiateGoogleAuthRequest,
} from "../controllers/GoogleAuthController";

const authRoute = Router();

authRoute.post("/auth/register", signUp);
authRoute.post("/auth/verify-otp", verifyOtp);
authRoute.post("/auth/login", login);
authRoute.put(
  "/auth/organizations/:organization_id/users/:user_id/role",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  changeUserRole,
);

authRoute.post("/auth/google-signin", handleGoogleAuth);

// For manually testing google auth functionality locally
authRoute.get("/auth/test-google-auth", (req, res) => {
  res.send(
    '<a href="http://localhost:8000/api/v1/auth/google">Authenticate with Google</a>',
  );
});

authRoute.get("/auth/social/google?provider=google", initiateGoogleAuthRequest);

authRoute.get("/auth/google/callback", googleAuthCallback);

authRoute.get("/auth/google", googleAuthCall);

authRoute.patch("/auth/change-password", authMiddleware, changePassword);

export { authRoute };
