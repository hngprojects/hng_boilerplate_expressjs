import { Request, Response } from "express";
import { PaystackService } from "../services/payment.paystack.services";
import { Payment } from "../models";
import AppDataSource from "../data-source";

export class paystackController {
  async startPayment(req: Request, res: Response) {
    const paystackService = new PaystackService();
    try {
      const { email, amount, currency } = req.body;
      const data: any = await paystackService.createSession(email, amount);
      const organization = await paystackService.getOrganizationById(
        req.params.organization_id,
      );
      if (!organization)
        return res.status(404).send({
          status: 404,
          message: "Invalid Organization ID",
        });
      const payment = new Payment();
      payment.amount = amount;
      payment.currency = currency;
      payment.status = data.status === true ? "pending" : "failed";
      payment.provider = "paystack";
      // payment.userId = req.user.id || "c9d25cf6-252c-44df-b705-5a7b42b7abf5";
      payment.reference = data.data.reference;
      payment.organizationId = organization.id;
      payment.payer_email = email;
      payment.description = `A payment of ${payment.amount}${payment.currency} from ${payment.payer_email}`;
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
      const organization = await paystackService.getOrganizationById(
        req.params.organization_id,
      );
      if (!organization)
        return res.status(404).send({
          status: "Unsucessful",
          message: "Invalid Organization ID",
          status_code: 404,
        });
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
      const organization = await paystackService.getOrganizationById(
        req.params.organization_id,
      );
      if (!organization)
        return res.status(404).send({
          status: "Unsucessful",
          message: "Invalid Organization ID",
          status_code: 404,
        });
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
