import { Request, Response } from "express";
import { initializePayment, verifyPayment } from "../services";
import log from "../utils/logger";

/**
 * @swagger
 * api/v1/payments/paystack/initiate:
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
 *               organization_id:
 *                 type: string
 *               plan_id:
 *                 type: string
 *               full_name:
 *                 type: string
 *               billing_option:
 *                 type: string
 *                 enum: [monthly, yearly]
 *               redirect_url:
 *                 type: string
 *                 example: http://boilerplate.com/setting
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
 *       400:
 *         description: Billing plan or organization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Billing plan or organization not found
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
    res.json(response);
  } catch (error) {
    console.log(error);
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
