import {
  signUp,
  verifyOtp,
  login,
  changeUserRole,
  forgotPassword,
  resetPassword,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import {
  googleAuthCallback,
  initiateGoogleAuthRequest,
} from "../controllers/GoogleAuthController";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);
authRoute.post("/login", login);
authRoute.put(
  "/api/v1/organizations/:organization_id/users/:user_id/role",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  changeUserRole,
);

// ---------------------------Google Auth Route Begins-------------------------  //

// For manually testing google auth functionality locally
authRoute.get("/test-google-auth", (req, res) => {
  res.send(
    '<a href="http://localhost:8000/api/v1/auth/google">Authenticate with Google</a>',
  );
});

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Initiates the Google authentication process
 *     tags:
 *       - Auth
 *     responses:
 *       '302':
 *         description: Redirects to Google login page for user authentication
 *         headers:
 *           Location:
 *             description: The URL to which the client is redirected (Google's OAuth2 authorization URL)
 *             schema:
 *               type: string
 *               format: uri
 *       '500':
 *         description: Internal Server Error
 */
authRoute.get("/google", initiateGoogleAuthRequest);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google authentication callback
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The authorization code returned by Google
 *     responses:
 *       '302':
 *         description: Redirects to the dashboard after successful authentication
 *         headers:
 *           Location:
 *             description: The URL to which the client is redirected
 *             schema:
 *               type: string
 *               format: uri
 *       '401':
 *         description: Unauthorized - if authentication fails
 *       '500':
 *         description: Internal Server Error - if something goes wrong during the callback handling
 */
authRoute.get("/google/callback", googleAuthCallback);

// ---------------------------Google Auth Route Ends-------------------------  //

authRoute.post("/forgotPassword", forgotPassword);
authRoute.post("/resetPassword", resetPassword);

export { authRoute };
