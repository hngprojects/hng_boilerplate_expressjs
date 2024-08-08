import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source";
import { BillingPlan } from "../models/billing-plan";

export class BillingService {
  private billingRepository = AppDataSource.getRepository(BillingPlan);

  public async getAllBillingPlans(): Promise<BillingPlan[]> {
    try {
      return await this.billingRepository.find();
    } catch (error) {
      console.error("Failed to fetch billing plans:", error);
      throw new Error("Could not fetch billing plans");
    }
  }
}
