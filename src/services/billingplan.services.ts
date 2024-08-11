import { Repository } from "typeorm";
import { IBillingPlanService } from "../types";
import { BillingPlan } from "../models/billing-plan";
import AppDataSource from "../data-source";
import { Organization } from "../models";
import { ResourceNotFound } from "../middleware";

export class BillingPlanService implements IBillingPlanService {
  private billingplanRepository: Repository<BillingPlan>;

  constructor() {
    this.billingplanRepository = AppDataSource.getRepository(BillingPlan);
  }
  async createBillingPlan(
    planData: Partial<BillingPlan>,
  ): Promise<BillingPlan[]> {
    if (!planData.organizationId) {
      throw new Error("Organization ID is required.");
    }

    const organization = await AppDataSource.getRepository(
      Organization,
    ).findOne({
      where: { id: planData.organizationId },
    });

    if (!organization) {
      throw new Error("Organization does not exist.");
    }

    const newPlan = this.billingplanRepository.create({
      id: planData.id,
      name: planData.name,
      price: planData.price,
      organizationId: planData.organizationId,
      currency: "USD",
      duration: "monthly",
      features: [],
    });

    await this.billingplanRepository.save(newPlan);

    return [newPlan];
  }

  async getBillingPlan(planId: string): Promise<BillingPlan> {
    const billingPlan = await this.billingplanRepository.findOne({
      where: { id: planId },
    });
    if (!billingPlan) {
      throw new ResourceNotFound(`Billing plan with ID ${planId} not found`);
    }

    return billingPlan;
  }
}
