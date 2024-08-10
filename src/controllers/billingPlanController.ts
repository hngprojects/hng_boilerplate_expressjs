// import { Request, Response, NextFunction } from "express";
// import { billingPlanSchema } from "../utils/request-body-validator";
// import { BillingPlanService } from "../services/billingPlan.service";
// import z from "zod";

// const billingPlanService = new BillingPlanService();

// /**
//  * @swagger
//  * tags:
//  *   name: Billing Plans
//  *   description: Billing plan management
//  */

// /**
//  * @swagger
//  * /api/v1/billing-plans:
//  *   post:
//  *     summary: Create a new billing plan
//  *     tags: [Billing Plans]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Basic Plan"
//  *               price:
//  *                 type: number
//  *                 example: 9.99
//  *             required:
//  *               - name
//  *               - price
//  *     responses:
//  *       201:
//  *         description: Billing plan created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                   example: "b5a9c58e-9f5b-4c6b-a7c3-8d6f473e0f7d"
//  *                 name:
//  *                   type: string
//  *                   example: "Basic Plan"
//  *                 price:
//  *                   type: number
//  *                   example: 9.99
//  *       400:
//  *         description: Invalid input
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       message:
//  *                         type: string
//  *                       path:
//  *                         type: string
//  *                   example:
//  *                     - message: "Name is required"
//  *                       path: "name"
//  *                     - message: "Price must be a positive number"
//  *                       path: "price"
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */

// export const createBillingPlan = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const parsedData = billingPlanSchema.parse(req.body);

//     const billingPlan = await billingPlanService.createBillingPlan(parsedData);

//     res.status(201).json({
//       status_code: 201,
//       message: "Admin created billing plan successfully",
//       data: billingPlan,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ errors: error.errors });
//     }
//     next(error);
//   }
// };
