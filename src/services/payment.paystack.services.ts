import https from "https";
import dotenv from "dotenv";
import config from "../config";
import { Organization, Payment, User } from "../models";
import AppDataSource from "../data-source";

dotenv.config();

export class PaystackService {
  private paymentRepository = AppDataSource.getRepository(Payment);
  private orgRepository = AppDataSource.getRepository(Organization);

  createSession(userEmail: string, inputAmount: string): Promise<JSON> {
    const params = JSON.stringify({
      email: userEmail,
      amount: parseInt(inputAmount) * 100,
      channels: ["card"],
    });

    const options: object = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve, reject) => {
      const reqPaystack = https
        .request(options, (resPaystack) => {
          let data = "";

          resPaystack.on("data", (chunk) => {
            data += chunk;
          });

          resPaystack.on("end", () => {
            const refinedData = JSON.parse(data);
            resolve(refinedData);
          });
        })
        .on("error", (error) => {
          reject(error);
        });

      reqPaystack.write(params);
      reqPaystack.end();
    });
  }

  async verifyPayment(reference: string): Promise<JSON> {
    console.log(reference);
    const options: object = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve, reject) => {
      const reqPaystack = https
        .request(options, (resPaystack) => {
          let data = "";

          resPaystack.on("data", (chunk) => {
            data += chunk;
          });

          resPaystack.on("end", () => {
            const refinedData = JSON.parse(data);
            resolve(refinedData);
          });
        })
        .on("error", (error) => {
          console.log(error);
          reject(error);
        });

      reqPaystack.end();
    });
  }

  async getPaymentReference(id: string): Promise<string | Error> {
    const payment = await this.paymentRepository.findOne({ where: { id: id } });
    if (payment.provider !== "paystack")
      return new Error("Payment is of a different provider");
    return payment.reference;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    return payment;
  }

  async getOrganizationById(id: string): Promise<Organization> {
    const organization = await this.orgRepository.findOne({ where: { id } });
    return organization;
  }
}
