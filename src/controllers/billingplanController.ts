import { NextFunction, Request, Response } from "express";
import { BillingPlanService } from "../services/billingplan.services";
import { HttpError } from "../middleware";

export class BillingPlanController {
  private billingPlanService: BillingPlanService;

  constructor() {
    this.billingPlanService = new BillingPlanService();
    this.createBillingPlan = this.createBillingPlan.bind(this);
    this.getBillingPlans = this.getBillingPlans.bind(this);
  }

  /**
   * @swagger
   * /api/v1/billing-plans:
   *   post:
   *     summary: Create a new billing plan
   *     description: Creates a new billing plan with the provided details
   *     tags: [Billing Plan]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - organizationId
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *                 example: "hello"
   *               organizationId:
   *                 type: string
   *                 example: "a73449ef-7d16-4a72-981a-79016f30735c"
   *               price:
   *                 type: number
   *                 example: 5
   *     responses:
   *       201:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: string
   *                   example: "successful"
   *                 status_code:
   *                   type: number
   *                   example: 201
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "7880f784-c86c-4abf-b19c-c25720fbfb7f"
   *                     name:
   *                       type: string
   *                       example: "hello"
   *                     organizationId:
   *                       type: string
   *                       example: "a73449ef-7d16-4a72-981a-79016f30735c"
   *                     price:
   *                       type: number
   *                       example: 5
   */

  async createBillingPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const planData = req.body;
      const createdPlan =
        await this.billingPlanService.createBillingPlan(planData);
      res.status(201).json({
        success: "successful",
        status_code: 201,
        data: createdPlan,
      });
    } catch (error) {
      next(new HttpError(500, error.message));
    }
  }

  /**
   * @swagger
   * /api/v1/billing-plans/{id}:
   *   get:
   *     summary: Get a billing plan by ID
   *     description: Retrieves a specific billing plan by its ID
   *     tags: [Billing Plan]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the billing plan to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: string
   *                   example: "successful"
   *                 status_code:
   *                   type: number
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "6b792203-dc65-475c-8733-2d018b9e3c7c"
   *                     organizationId:
   *                       type: string
   *                       example: "a73449ef-7d16-4a72-981a-79016f30735c"
   *                     name:
   *                       type: string
   *                       example: "hello"
   *                     price:
   *                       type: string
   *                       example: "4.00"
   *                     currency:
   *                       type: string
   *                       example: "USD"
   *                     duration:
   *                       type: string
   *                       example: "monthly"
   *                     description:
   *                       type: string
   *                       nullable: true
   *                       example: null
   *                     features:
   *                       type: array
   *                       items:
   *                         type: string
   *                       example: []
   *       500:
   *         description: Internal Server Error
   */

  async getBillingPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const planId = req.params.id;
      const plan = await this.billingPlanService.getBillingPlan(planId);
      res.status(200).json({
        success: "successful",
        status_code: 200,
        data: plan,
      });
    } catch (error) {
      next(new HttpError(500, error.message));
    }
  }
}
