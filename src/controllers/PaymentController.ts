import { Request, Response } from "express";
import { initializePayment, verifyPayment } from "../services";
import { Payment } from "../models";
import dataSource from "../data-source";

export class PaymentController {
  static async initiatePayment(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user.id;
      const paymentDetails = req.body;
      const paymentResponse = await initializePayment({
        ...paymentDetails,
        userId,
      });

      return res.json(paymentResponse);
    } catch (error) {
      return res.status(500).json({ error: "Payment initiation failed" });
    }
  }

  static async verifyPayment(req: Request, res: Response): Promise<Response> {
    try {
      const { transactionId } = req.params;
      const verificationResponse = await verifyPayment(transactionId);

      // const paymentRepository = dataSource.getRepository(Payment);
      // const payment = await paymentRepository.findOneBy({ id: transactionId });

      // if (payment) {
      //   // payment.status = verificationResponse.status === 'successful' ? 'completed' : 'failed';
      //   await paymentRepository.save(payment);
      // }

      return res.json(verificationResponse);
    } catch (error) {
      return res.status(500).json({ error: "Payment verification failed" });
    }
  }
}

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment related operations
 */

/**
 * @swagger
 * /api/v1/payments/flutterwave/initiate:
 *   post:
 *     summary: Initiate a payment with Flutterwave
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_number
 *               - cvv
 *               - expiry_month
 *               - expiry_year
 *               - email
 *               - fullname
 *               - phone_number
 *               - currency
 *               - amount
 *               - payer_id
 *               - payer_type
 *             properties:
 *               card_number:
 *                 type: string
 *               cvv:
 *                 type: string
 *               expiry_month:
 *                 type: string
 *               expiry_year:
 *                 type: string
 *               email:
 *                 type: string
 *               fullname:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               currency:
 *                 type: string
 *               amount:
 *                 type: number
 *               payer_id:
 *                 type: string
 *               payer_type:
 *                 type: string
 *                 enum: [user, organization]
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Payment initiation failed
 */

/**
 * @swagger
 * /api/v1/payments/flutterwave/verify/{transactionId}:
 *   get:
 *     summary: Verify a Flutterwave payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to verify
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Payment verification failed
 */
