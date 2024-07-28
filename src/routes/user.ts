import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
import { multerConfig } from "../config/multer";

const upload = multerConfig.single("avatarUrl");

const userRouter = Router();
const userController = new UserController();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Retrieves a list of all users
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 96cf0567-9ca6-4ce0-b9f7-e3fa816fc070
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   role:
 *                     type: string
 *                     example: user
 *       '500':
 *         description: Internal Server Error
 */
userRouter.get("/users/", userController.getAllUsers.bind(UserController));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Deletes a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   example: 202
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       '400':
 *         description: Valid id must be provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Valid id must be provided
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Not Found
 *       '500':
 *         description: Internal Server Error
 */
userRouter.delete(
  "/users/:id",
  authMiddleware,
  userController.deleteUser.bind(userController),
);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Retrieves the profile data of the currently authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User profile details retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 96cf0567-9ca6-4ce0-b9f7-e3fa816fc070
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     profile_id:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *                     avatar_url:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *       '400':
 *         description: Invalid User ID Format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Unauthorized! Invalid User Id Format
 *       '401':
 *         description: Unauthorized! No ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Unauthorized! No ID provided
 *       '404':
 *         description: User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: User Not Found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
userRouter.get("/users/me", authMiddleware, UserController.getProfile);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Updates the profile of a user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user to update
 *       - in: formData
 *         name: avatarUrl
 *         type: file
 *         description: The avatar image to upload
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *                 format: binary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 96cf0567-9ca6-4ce0-b9f7-e3fa816fc070
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 role:
 *                   type: string
 *                   example: user
 *                 profile:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *                     avatarUrl:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Valid id must be provided
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Not Found
 *       '500':
 *         description: Internal Server Error
 */
userRouter.put(
  "/users/:id",
  authMiddleware,
  upload,
  userController.updateUserProfile.bind(userController),
);

export { userRouter };
