import { BillingPlan } from "../models/billing-plan";
import AppDataSource from "../data-source";
import { BillingPlanInput } from "../utils/request-body-validator";
import { validateOrReject } from "class-validator";
import { HttpError } from "../middleware";

export class BillingPlanService {
  public async createBillingPlan(data: BillingPlanInput): Promise<BillingPlan> {
    try {
      const billingPlan = new BillingPlan();
      billingPlan.name = data.name;
      billingPlan.price = data.price;

      await validateOrReject(billingPlan);

      return await AppDataSource.manager.save(billingPlan);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
