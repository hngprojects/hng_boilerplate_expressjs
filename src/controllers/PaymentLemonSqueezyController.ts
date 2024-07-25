/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management with LemonSqueezy
 */

import { Request, Response } from "express";
import crypto from "crypto";
import config from "../config";
import { Payment } from "../models/payment";
import AppDataSource from "../data-source";


/**
 * @swagger
 * /api/v1/payments/lemonsqueezy/initiate:
 *   get:
 *     summary: Initiates a payment using LemonSqueezy
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment initiation link
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: <a href="https://ifeoluwa-hng-stage-5.lemonsqueezy.com/buy/bf9fee27-d226-4637-a32f-013bd717c3b3?embed=1" class="lemonsqueezy-button">Make Payments</a><script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
 *       500:
 *         description: An error occurred while processing the payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the payment
 */

export const makePaymentLemonSqueezy = async (req: Request, res: Response) => {
  try {
    return res.send(
      `<a href="https://ifeoluwa-hng-stage-5.lemonsqueezy.com/buy/bf9fee27-d226-4637-a32f-013bd717c3b3?embed=1" class="lemonsqueezy-button">Make Payments</a><script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>`,
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
};


/**
 * @swagger
 * /api/v1/payments/lemonsqueezy/webhook:
 *   post:
 *     summary: Handles LemonSqueezy webhook notifications
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Webhook received
 *       400:
 *         description: Webhook verification failed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Webhook verification failed
 */

export const LemonSqueezyWebhook = async (req: Request, res: Response) => {
  try {
    const secret = config.LEMONSQUEEZY_SIGNING_KEY;
    const rawBody = req.body;
    if (!rawBody) {
      throw new Error("No body");
    }

    //verify the key signature sent to the webhook
    const signature = req.get("X-Signature");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (
      !signature ||
      !crypto.timingSafeEqual(
        Buffer.from(digest, "hex"),
        Buffer.from(signature, "hex"),
      )
    ) {
      throw new Error("Invalid signature.");
    }

    const data = JSON.parse(rawBody);
    const { subtotal, currency, status, user_email, created_at, updated_at } =
      data.data.attributes;

    const amount = subtotal;
    const payer_email = user_email;
    const formattedAmount = parseFloat(parseFloat(amount).toFixed(2));
    const mappedStatus = status === "paid" ? "completed" : status;

    const paymentRepository = AppDataSource.getRepository(Payment);
    const payment = paymentRepository.create({
      amount: formattedAmount,
      currency,
      status: mappedStatus,
      provider: "lemonsqueezy",
      payer_email,
      created_at,
      updated_at,
    });

    await paymentRepository.save(payment);
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    res.status(400).send("Webhook verification failed");
  }
};
