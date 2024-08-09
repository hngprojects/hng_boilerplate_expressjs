import { BillingService } from "../services/billing-plans.services";
import { BillingPlan } from "../models/billing-plan";
import AppDataSource from "../data-source";
import { Repository } from "typeorm";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
}));

describe("BillingService", () => {
  let billingService: BillingService;
  let billingRepository: Repository<BillingPlan>;

  beforeEach(() => {
    billingRepository = {
      find: jest.fn(),
    } as unknown as Repository<BillingPlan>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      billingRepository,
    );
    billingService = new BillingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBillingPlans", () => {
    it("should return an array of billing plans", async () => {
      // Arrange
      const mockBillingPlans: BillingPlan[] = [
        { id: "1", name: "Basic Plan", price: 10 } as BillingPlan,
        { id: "2", name: "Premium Plan", price: 20 } as BillingPlan,
      ];
      (billingRepository.find as jest.Mock).mockResolvedValue(mockBillingPlans);

      // Act
      const result = await billingService.getAllBillingPlans();

      // Assert
      expect(result).toEqual(mockBillingPlans);
      expect(billingRepository.find).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no billing plans are found", async () => {
      // Arrange
      const mockBillingPlans: BillingPlan[] = [];
      (billingRepository.find as jest.Mock).mockResolvedValue(mockBillingPlans);

      // Act
      const result = await billingService.getAllBillingPlans();

      // Assert
      expect(result).toEqual([]);
      expect(billingRepository.find).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the repository fails to fetch billing plans", async () => {
      // Arrange
      const errorMessage = "Database error";
      (billingRepository.find as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(billingService.getAllBillingPlans()).rejects.toThrow(
        "Could not fetch billing plans",
      );
      expect(billingRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
