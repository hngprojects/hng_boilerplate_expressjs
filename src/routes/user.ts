// src/routes/userRoutes.ts

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       202:
 *         description: User deleted successfully
 *       400:
 *         description: Valid id must be provided
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();
const userController = new UserController();


userRouter.get("/", userController.getAllUsers.bind(userController));
userRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/", userController.getAllUsers.bind(UserController));
userRouter.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser.bind(userController),
);
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };
