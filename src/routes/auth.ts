import { signUp, verifyOtp, login, changeUserRole } from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { googleAuthCallback, initiateGoogleAuthRequest } from "../controllers/GoogleAuthController";



const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);
authRoute.post("/login", login);
authRoute.put(
    "/api/v1/organizations/:organization_id/users/:user_id/role",
    authMiddleware,
    checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    changeUserRole
  );

// ---------------------------Google Auth Route-------------------------  //

// For testing google auth functionality
authRoute.get('/test-google-auth', (req, res) => {
  res.send('<a href="http://localhost:8000/api/v1/auth/google">Authenticate with Google</a>');
});

authRoute.get('/google', initiateGoogleAuthRequest);

authRoute.get('/google/callback', googleAuthCallback);

export { authRoute };
