// @ts-nocheck
import { BillingPlanService } from "../services/billingPlan.service";
import AppDataSource from "../data-source";
import { BillingPlan } from "../models";
import { HttpError, Unauthorized } from "../middleware";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {},
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../models");
jest.mock("../utils");
jest.mock("../utils/mail");
jest.mock("jsonwebtoken");

describe("BillingPlanService", () => {
  let billingPlanService: BillingPlanService;
  let mockManager;

  beforeEach(() => {
    billingPlanService = new BillingPlanService();

    mockManager = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    AppDataSource.manager = mockManager;
  });

  describe("createBillingPlan", () => {
    it("should create a new billing plan successfully", async () => {
      const payload = {
        name: "Standard Plan",
        price: 29,
      };

      const createdPlan = {
        id: "uuid",
        name: "Standard Plan",
        price: 29,
      };

      mockManager.save.mockResolvedValue(createdPlan);

      const result = await billingPlanService.createBillingPlan(payload);
      console.log(result);
      expect(result).toEqual({
        id: "uuid",
        name: "Standard Plan",
        price: 29,
      });
      expect(mockManager.save).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
    });

    // it("should throw an error if price is not positive", async () => {
    //   const payload = {
    //     name: "Invalid Plan",
    //     price: -10.0,
    //   };

    //   await expect(
    //     billingPlanService.createBillingPlan(payload)
    //   ).rejects.toThrow(HttpError);
    // });

    // it("should throw an error if required fields are missing", async () => {
    //   const payload = {
    //     name: "Incomplete Plan",
    //     // Missing price
    //   };

    //   await expect(
    //     billingPlanService.createBillingPlan(payload)
    //   ).rejects.toThrow(HttpError);
    // });

    // it("should throw Unauthorized error if user is not authenticated", async () => {
    //   // Simulate unauthorized access
    //   jest
    //     .spyOn(billingPlanService, "createBillingPlan")
    //     .mockImplementationOnce(() => {
    //       throw new Unauthorized("Unauthorized");
    //     });

    //   const payload = {
    //     name: "Unauthorized Plan",
    //     price: 19.99,
    //   };

    //   await expect(
    //     billingPlanService.createBillingPlan(payload)
    //   ).rejects.toThrow(Unauthorized);
    // });
  });
});
