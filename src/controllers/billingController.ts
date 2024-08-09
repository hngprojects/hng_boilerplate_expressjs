import { Request, Response } from "express";
import { BillingService } from "../services/billing-plans.services";

const billingService = new BillingService();

export class BillingController {
  async getAllBillings(req: Request, res: Response) {
    try {
      const billing = await billingService.getAllBillingPlans();
      res.status(201).json({ message: "Success", billing });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
