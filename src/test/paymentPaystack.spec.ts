// import request from "supertest";
// import express from "express";
// import { initializePayment } from "../services/payment/paystack.service";
// import { paymentPaystackRouter } from "../routes";
// import AppDataSource from "../data-source";
// import log from "../utils/logger";

// // Mock the initializePayment function
// jest.mock("../services/payment/paystack.service", () => ({
//   initializePayment: jest.fn(),
// }));

// const app = express();
// app.use(express.json());
// app.use("/payments/paystack", paymentPaystackRouter);

// describe("Payment Paystack Controller", () => {
//   beforeAll(async () => {
//     await AppDataSource.initialize();
//   });

//   afterAll(async () => {
//     await AppDataSource.destroy();
//   });

//   describe("POST /payments/paystack/initiate", () => {
//     it("should initiate a payment and return a redirect URL", async () => {
//       const mockPaymentResponse = "https://paystack.com/redirect-url";
//       (initializePayment as jest.Mock).mockResolvedValue(mockPaymentResponse);

//       const response = await request(app)
//         .post("/payments/paystack/initiate")
//         .send({
//           email: "test@example.com",
//           amount: 1000,
//           currency: "NGN",
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({ redirect: mockPaymentResponse });
//       expect(initializePayment).toHaveBeenCalledWith({
//         email: "test@example.com",
//         amount: 1000,
//         currency: "NGN",
//       });
//     });

//     it("should return a 500 error if payment initiation fails", async () => {
//       (initializePayment as jest.Mock).mockRejectedValue(
//         new Error("Payment initiation failed"),
//       );

//       const response = await request(app)
//         .post("/payments/paystack/initiate")
//         .send({
//           email: "test@example.com",
//           amount: 1000,
//           currency: "NGN",
//         });

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({ error: "Error initiating payment" });
//     });
//   });
// });
