import { Request, Response } from "express";
import { PlanService } from "../services/super-admin-plans";

const planService = new PlanService();

/**
 * @swagger
 * tags:
 *   - name: Plans
 *     description: Operations related to plans
 */

/**
 * @swagger
 * /api/v1/admin/{userId}/current-plan:
 *   get:
 *     tags:
 *       - Plans
 *     summary: Get the current plan for a user
 *     description: Retrieve the current active plan for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved the current plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 planName:
 *                   type: string
 *                   example: Premium Plan
 *                 planPrice:
 *                   type: number
 *                   example: 99.99
 *                 features:
 *                   type: string
 *                   example: Unlimited access, 24/7 support
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: 2024-08-15
 *                 renewalDate:
 *                   type: string
 *                   format: date
 *                   example: 2024-09-15
 *                 status:
 *                   type: string
 *                   example: Active
 *       404:
 *         description: User or subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User or subscription not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: object
 */
export const getCurrentPlan = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const planData = await planService.getCurrentPlan(userId);
    return res.status(200).json(planData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/v1/admin/plans:
 *   post:
 *     tags:
 *       - Plans
 *     summary: Create a new plan
 *     description: Create a new plan with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *               price:
 *                 type: number
 *                 example: 99.99
 *               features:
 *                 type: string
 *                 example: Unlimited access, 24/7 support
 *               limitations:
 *                 type: string
 *                 example: Limited to 5 devices
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan created successfully
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Invalid input or plan already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input or Plan already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: object
 */
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

/**
 * @swagger
 * /api/v1/admin/{userId}/current-plan:
 *   put:
 *     tags:
 *       - Plans
 *     summary: Update a specific plan
 *     description: Update the details of a specific plan.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plan to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *               price:
 *                 type: number
 *                 example: 99.99
 *               features:
 *                 type: string
 *                 example: Unlimited access, 24/7 support
 *               limitations:
 *                 type: string
 *                 example: Limited to 5 devices
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan updated successfully
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Invalid input or plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input or Plan not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: object
 */
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

/**
 * @swagger
 * /api/v1/admin/plans:
 *   get:
 *     tags:
 *       - Plans
 *     summary: Compare all plans
 *     description: Retrieve and compare all available plans.
 *     responses:
 *       200:
 *         description: Successfully retrieved all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: object
 */
export const comparePlans = async (req: Request, res: Response) => {
  try {
    const plans = await planService.comparePlans();
    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/v1/admin/{userId}/current-plan:
 *   delete:
 *     tags:
 *       - Plans
 *     summary: Delete a specific plan
 *     description: Delete a specific plan if there are no active subscriptions associated with it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plan to delete.
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan deleted successfully
 *       400:
 *         description: Plan not found or has active subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found or has active subscriptions
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: object
 */
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
