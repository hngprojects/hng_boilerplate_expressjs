import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.services";

const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * api/v1/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mailSent:
 *                   type: string
 *                 newUser:
 *                   type: object
 *                 access_token:
 *                   type: string
 *       409:
 *         description: User already exists
 *       500:
 *         description: Some server error
 */

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mailSent, newUser, access_token } = await authService.signUp(
      req.body,
    );
    res.status(201).json({ mailSent, newUser, access_token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify the user's email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: integer
 *                 description: The OTP sent to the user's email
 *               token:
 *                 type: string
 *                 description: The token received during sign up
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid OTP or verification token has expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, token } = req.body;
    const { message } = await authService.verifyEmail(token as string, otp);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token, user } = await authService.login(req.body);
    res.status(200).json({ access_token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     description: Allows a user to request a password reset link by providing their email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Successfully requested password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the request.
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: The message indicating the result of the request.
 *                   example: Password reset link sent to your email.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error.
 */
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const { message } = await authService.forgotPassword(email);
    res.status(200).json({ status: "sucess", status_code: 200, message });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/resetPassword:
 *   post:
 *     summary: Reset a user's password
 *     description: Allows a user to reset their password by providing a valid reset token and a new password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: new_secure_password
 *     responses:
 *       200:
 *         description: Successfully reset password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The message indicating the result of the password reset.
 *                   example: Password has been reset successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, newPassword } = req.body;
    const { message } = await authService.resetPassword(token, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export { signUp, verifyOtp, login, forgotPassword, resetPassword };
