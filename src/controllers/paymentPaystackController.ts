import { Request, Response } from "express";
import { initializePayment, verifyPayment } from "../services";
import log from "../utils/logger";

/**
 * Initializes a payment using Paystack
 * @param req - Express request object
 * @param res - Express response object
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
