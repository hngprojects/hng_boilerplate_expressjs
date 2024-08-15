import { Request, Response } from "express";
import { PlanService } from "../services/super-admin-plans";

const planService = new PlanService();

export const getCurrentPlan = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const planData = await planService.getCurrentPlan(userId);
    return res.status(200).json(planData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const createPlan = async (req: Request, res: Response) => {
  const { name, price, features, limitations } = req.body;

  try {
    const newPlan = await planService.createPlan({
      name,
      price,
      features,
      limitations,
    });
    return res.status(201).json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    const statusCode =
      error.message === "Invalid input" ||
      error.message === "Plan already exists"
        ? 400
        : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPlan = await planService.updatePlan(id, updateData);
    return res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    return res
      .status(error.message === "Invalid price" ? 400 : 500)
      .json({ message: error.message });
  }
};

export const comparePlans = async (req: Request, res: Response) => {
  try {
    const plans = await planService.comparePlans();
    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await planService.deletePlan(id);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(
        error.message === "Cannot delete plan with active subscriptions"
          ? 400
          : 500,
      )
      .json({ message: error.message });
  }
};
