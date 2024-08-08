import { Request, Response } from "express";
import { ContactService } from "../services/contactService";
import { validateContact } from "../utils/contactValidator";

const contactService = new ContactService();

/**
 * @swagger
 * /api/v1/contact:
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
 *               message:
 *                 type: string
 *                 example: I would like to inquire about your services.
 *             required:
 *               - name
 *               - email
 *               - message
 *     responses:
 *       200:
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
    const { name, email, message } = req.body;

    const validationErrors = validateContact({
      name,
      email,
      message,
    });
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    try {
      const contact = await contactService.createContact({
        name,
        email,
        message,
      });
      res
        .status(200)
        .json({ message: "Message submitted successfully", contact });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/contact:
   *   get:
   *     summary: Retrieve all contact messages
   *     description: Fetches all contact messages submitted via the contact form.
   *     tags:
   *       - Contact
   *     responses:
   *       200:
   *         description: A list of contact messages
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Success
   *                 contacts:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       name:
   *                         type: string
   *                         example: John Doe
   *                       email:
   *                         type: string
   *                         format: email
   *                         example: johndoe@example.com
   *                       message:
   *                         type: string
   *                         example: I would like to inquire about your services.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */

  async getAllContact(req: Request, res: Response) {
    try {
      const contact = await contactService.getAllContactUs();
      res.status(200).json({ message: "Success", contact });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
