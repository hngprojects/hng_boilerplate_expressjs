/**
 * @swagger
 * /api/v1/send-email:
 *   post:
 *     tags:
 *       - Email
 *     summary: Send an email using a predefined template
 *     description: Submits an email sending request referencing a specific template.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_id:
 *                 type: string
 *                 example: "account-activation-request"
 *               recipient:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               variables:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Activate Your Account"
 *                   activationLinkUrl:
 *                     type: string
 *                     example: "https://example.com"
 *                   user_name:
 *                     type: string
 *                     example: "John Doe"
 *     responses:
 *       202:
 *         description: Email sending request accepted and is being processed in the background.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sending request accepted and is being processed in the background."
 *       400:
 *         description: An invalid request was sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An invalid request was sent."
 *       404:
 *         description: Template not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Template not found."
 *       405:
 *         description: This method is not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This method is not allowed."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */

import { z } from "zod";

export const emailSchema = z.object({
  recipient: z.string().email("Invalid email address"),
  template_id: z.string().min(1, "Template ID is required"),
  variables: z.object({}).optional(),
});
