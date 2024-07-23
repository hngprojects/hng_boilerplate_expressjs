import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

/**
 * Initiates a payment using Stripe
 * @param req - Express request object
 * @param res - Express response object
 */
export const createPaymentIntentStripe = async (req: Request, res: Response) => {
  try {
    const { payer_type, payer_id, amount, currency } = req.body;

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency,
      payment_method_types: ['card'],
    });

    // Respond with payment details
    res.json({
      payment_id: paymentIntent.id,
      status: paymentIntent.status,
      payment_url: `https://example.com/checkout?paymentId=${paymentIntent.id}`
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
      status_code: 500
    });
  }
};
