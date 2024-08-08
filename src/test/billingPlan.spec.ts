import { BillingPlanService } from "../services/billingplan.services";
import { BillingPlan } from "../models/billing-plan";
import { ResourceNotFound } from "../middleware";
import AppDataSource from "../data-source";
import { Repository } from "typeorm";
import { Organization } from "../models";

describe("BillingPlanService", () => {
  let billingPlanService: BillingPlanService;
  let mockRepository: jest.Mocked<Repository<BillingPlan>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
    } as any;

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue(mockRepository);

    billingPlanService = new BillingPlanService();
  });

  describe("Get a single billing plan", () => {
    it("should return a billing plan when given a valid ID", async () => {
      const mockBillingPlan: BillingPlan = {
        id: "6b792203-dc65-475c-8733-2d018b9e3c7c",
        name: "Test Plan",
        price: 100,
        currency: "USD",
        duration: "monthly",
        features: [],
        organizationId: "",
        description: "",
        organization: new Organization(),
        payments: [],
      };

      mockRepository.findOne.mockResolvedValue(mockBillingPlan);

      const result = await billingPlanService.getBillingPlan(
        "6b792203-dc65-475c-8733-2d018b9e3c7c",
      );

      expect(result).toEqual(mockBillingPlan);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "6b792203-dc65-475c-8733-2d018b9e3c7c" },
      });
    });

    it("should throw ResourceNotFound when given an invalid ID", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        billingPlanService.getBillingPlan("invalid-id"),
      ).rejects.toThrow(ResourceNotFound);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "invalid-id" },
      });
    });
  });
});
