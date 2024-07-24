import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../services/payment.services";
import { ResourceNotFound, Unauthorized } from "../middleware/error";

export class PaymentController {
  private paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  async getSinglePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment_id = req.params.id;
      const payment = await this.paymentService.getPaymentById(payment_id);
      if (!payment) {
        return res.status(404).json({
          status: "Unsuccessful",
          message: `Payment with id ${payment_id} not found`,
          status_code: 404,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Payment details",
        status_code: 200,
        data: payment,
      });
    } catch (error) {
      next();
    }
  }
}
