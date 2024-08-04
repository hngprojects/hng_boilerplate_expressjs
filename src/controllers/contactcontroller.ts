import { Request, Response } from "express";
import { ContactService } from "../services";

const contactService = new ContactService();

/**
 * @swagger
 * /api/v1/contact-us:
 *   post:
 *     summary: Submit a contact form
 *     description: Allows users to submit their contact details and message.
 *     tags:
 *       - Contact
 *     requestBody:
 *       description: Contact details and message
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               phone_number:
 *                 type: string
 *                 example: 1234567890
 *               message:
 *                 type: string
 *                 example: I would like to inquire about your services.
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - message
 *     responses:
 *       201:
 *         description: Contact submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact submitted successfully
 *                 contact:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone_number:
 *                       type: string
 *                       example: 1234567890
 *                     message:
 *                       type: string
 *                       example: I would like to inquire about your services.
 *       400:
 *         description: Bad request, validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [ "Please enter a valid email address." ]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

export class ContactController {
  async createContact(req: Request, res: Response): Promise<void> {
    const { name, email, phone_number, message } = req.body;

    try {
      const contact = await contactService.createContact({
        name,
        email,
        phone_number,
        message,
      });
      res
        .status(201)
        .json({ message: "Message submitted successfully", contact });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
