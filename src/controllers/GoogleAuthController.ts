import passport from "../config/google.passport.config";
import { ServerError, Unauthorized } from "../middleware";
import { Request, Response, NextFunction } from "express";

/**
 * @swagger
 * api/v1/auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     description: This endpoint initiates the OAuth 2.0 authentication process with Google. It redirects the user to the Google login page where they can authenticate. Upon successful authentication, Google will redirect the user back to the specified callback URL.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth 2.0 login page
 *         headers:
 *           Location:
 *             description: The URL to which the user is being redirected
 *             schema:
 *               type: string
 *               example: "https://accounts.google.com/o/oauth2/auth"
 *       500:
 *         description: Internal Server Error - An error occurred during the initiation of the authentication process
 */

export const initiateGoogleAuthRequest = passport.authenticate("google", {
  scope: ["openid", "email", "profile"],
});

/**
 * @swagger
 * api/v1/auth/google/callback:
 *   post:
 *     summary: Google OAuth callback
 *     description: This endpoint handles the callback from Google's OAuth2.0 authentication. It processes the user information and generates a JSON Web Token (JWT) for authenticated users.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The body contains user information returned by Google after successful authentication.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                   example: "117189586949299940593"
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: "example@gmail.com"
 *                 name:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: "John Doe"
 *                 picture:
 *                   type: string
 *                   description: URL to the user's profile picture.
 *                   example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     picture:
 *                       type: string
 *       401:
 *         description: Unauthorized - Authentication failed
 *       500:
 *         description: Internal Server Error - An error occurred during the authentication process
 */
// export const googleAuthCallback = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authenticate = passport.authenticate(
//     "google",
//     async (error, user, info) => {
//       const googleAuthService = new GoogleAuthService();
//       try {
//         if (error) {
//           throw new ServerError("Authentication error");
//         }
//         if (!user) {
//           throw new Unauthorized("Authentication failed!");
//         }
//         const isDbUser = await googleAuthService.getUserByGoogleId(user.id);
//         const dbUser = await googleAuthService.handleGoogleAuth(user, isDbUser);
//         res.status(200).json(dbUser);
//       } catch (error) {
//         next(error);
//       }
//     },
//   );
//   authenticate(req, res, next);
// };
