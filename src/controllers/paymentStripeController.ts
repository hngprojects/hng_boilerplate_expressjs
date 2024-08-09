/**
 * Initiates a payment using Stripe
 * @param req - Express request object
 * @param res - Express response object
 */
import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import log from "../utils/logger";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
// log.info(`Stripe secret key: ${process.env.STRIPE_SECRET_KEY}`);

type PaymentRequest = {
  payer_type: string;
  payer_id: string;
  amount: number;
  currency: string;
};
export const createPaymentIntentStripe = async (
  req: Request,
  res: Response,
) => {
  try {
    const { payer_type, payer_id, amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: ["card"],
    });

    res.json({
      status: "success",
      message: "Payment successful",
      data: {
        user: {
          payer_type: payer_type,
          payment_id: paymentIntent.id,
          status: paymentIntent.status,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
      status_code: 500,
    });
  }
};
