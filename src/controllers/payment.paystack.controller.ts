import { Request, Response } from "express";
import { PaystackService } from "../services/payment.paystack.services";
import { Payment } from "../models";
import AppDataSource from "../data-source";

export class paystackController {
  async startPayment(req: Request, res: Response) {
    const paystackService = new PaystackService();
    try {
      const { amount, currency } = req.body;
      const data: any = await paystackService.createSession(
        req.user.email,
        amount,
      );
      const payment = new Payment();
      payment.amount = amount;
      payment.currency = currency;
      payment.status = data.status === true ? "pending" : "failed";
      payment.provider = "paystack";
      payment.reference = data.data.reference;
      payment.description = `A payment of ${payment.amount}${payment.currency} via ${payment.provider}`;
      await AppDataSource.manager.save(payment);
      res.status(200).send({ data });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error,
        status: "Internal server error",
        status_code: 500,
      });
    }
  }

  async completePayment(req: Request, res: Response) {
    const paystackService = new PaystackService();
    try {
      const reference = await paystackService.getPaymentReference(
        req.params.payment_id,
      );
      if (typeof reference === "string") {
        const data: any = await paystackService.verifyPayment(reference);
        console.log(data);
        const paymentRepository = AppDataSource.getRepository(Payment);
        const payment = await paymentRepository.findOne({
          where: { id: req.params.payment_id },
        });
        payment.status =
          data.data.status === "success" ? "completed" : "failed";
        await AppDataSource.manager.save(payment);
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(500).send({
        error,
        status: "Internal server error",
        status_code: 500,
      });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    const paystackService = new PaystackService();
    try {
      const reference = await paystackService.getPaymentReference(
        req.params.payment_id,
      );
      if (typeof reference === "string") {
        const data = paystackService.verifyPayment(reference);
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(500).send({
        error,
        status: "Internal server error",
        status_code: 500,
      });
    }
  }

  async getPaymentTransaction(req: Request, res: Response) {
    const paystackService = new PaystackService();
    try {
      const payment = await paystackService.getPaymentById(
        req.params.payment_id,
      );
      if (!payment)
        return res.status(404).send({
          status: "Unsucessful",
          message: "Payment details not found",
          status_code: 404,
        });
      res.status(200).send(payment);
    } catch (error) {
      res.status(500).send({
        error,
        status: "Internal server error",
        status_code: 500,
      });
    }
  }
}
