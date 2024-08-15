import AppDataSource from "../data-source";
import { Subscription } from "../models/subcription";
import { Plan } from "../models/plan";

export class PlanService {
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private planRepo = AppDataSource.getRepository(Plan);

  async getCurrentPlan(userId: string) {
    try {
      const subscription = await this.subscriptionRepo.findOne({
        where: { user: { id: userId }, status: "Active" },
        relations: ["plan"],
      });

      if (!subscription) {
        throw new Error("User or subscription not found");
      }

      return {
        planName: subscription.plan.name,
        planPrice: subscription.plan.price,
        features: subscription.plan.features,
        startDate: subscription.startDate,
        renewalDate: subscription.renewalDate,
        status: subscription.status,
      };
    } catch (error) {
      throw new Error("Server error");
    }
  }

  async createPlan(planData: {
    name: string;
    price: number;
    features?: string;
    limitations?: string;
  }) {
    const { name, price, features, limitations } = planData;

    if (!name || typeof price !== "number" || price <= 0) {
      throw new Error("Invalid input");
    }

    const existingPlan = await this.planRepo.findOne({ where: { name } });

    if (existingPlan) {
      throw new Error("Plan already exists");
    }
    const newPlan = this.planRepo.create({
      name,
      price,
      features: [features],
      limitations,
    });
    await this.planRepo.save(newPlan);

    return newPlan;
  }

  async updatePlan(id: string, updateData: Partial<Plan>) {
    try {
      const plan = await this.planRepo.findOne({ where: { id } });

      if (!plan) {
        throw new Error("Plan not found");
      }

      if (
        updateData.price !== undefined &&
        (typeof updateData.price !== "number" || updateData.price <= 0)
      ) {
        throw new Error("Invalid price");
      }

      Object.assign(plan, updateData);

      await this.planRepo.save(plan);

      return plan;
    } catch (error) {
      throw new Error("Server error");
    }
  }

  async comparePlans() {
    try {
      return await this.planRepo.find();
    } catch (error) {
      throw new Error("Server error");
    }
  }

  async deletePlan(id: string) {
    try {
      const plan = await this.planRepo.findOne({ where: { id } });

      if (!plan) {
        throw new Error("Plan not found");
      }

      const hasDependencies = await this.subscriptionRepo.count({
        where: { plan },
      });

      if (hasDependencies > 0) {
        throw new Error("Cannot delete plan with active subscriptions");
      }

      await this.planRepo.remove(plan);

      return { message: "Plan deleted successfully" };
    } catch (error) {
      throw new Error("Server error");
    }
  }
}
