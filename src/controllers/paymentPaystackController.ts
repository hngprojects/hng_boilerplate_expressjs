import { Request, Response } from "express";
import { initializePayment, verifyPayment } from "../services";
import log from "../utils/logger";

/**
 * @swagger
 * /payments/paystack/initiate:
 *   post:
 *     summary: Initiate a payment using Paystack
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               amount:
 *                 type: number
 *                 example: 1000
 *               currency:
 *                 type: string
 *                 example: NGN
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirect:
 *                   type: string
 *                   example: https://paystack.com/redirect-url
 *       500:
 *         description: Error initiating payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error initiating payment
 */
export const initializePaymentPaystack = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await initializePayment(req.body);
    res.json({ redirect: response });
  } catch (error) {
    log.error("Error initiating payment:", error);
    res.status(500).json({ error: "Error initiating payment" });
  }
};

/**
 * Verifies a payment using Paystack
 * @param req - Express request object
 * @param res - Express response object
 */
export const verifyPaymentPaystack = async (req: Request, res: Response) => {
  try {
    const response = await verifyPayment(req.params.reference);
    res.json(response);
  } catch (error) {
    log.error("Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
};
