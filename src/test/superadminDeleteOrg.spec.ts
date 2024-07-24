// @ts-nocheck
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { AdminOrganisationService } from "../services/admin.services";

jest.mock("../data-source");
jest.mock("../utils/index");

describe("AdminUserService", () => {
  let consoleErrorMock: jest.SpyInstance;
  let adminOrganisationService: AdminOrganisationService;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    adminOrganisationService = new AdminOrganisationService()
  });

  describe("deleteOrganisation", () => {
    it("should delete the organization successfully", async () => {
      const orgId = "org123";

      const mockOrganization = {
        id: orgId,
        name: "Test Organization",
        description: "This is a test organization",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Organization;

      const mockRepository = {
        findOne: jest.fn().mockResolvedValue(mockOrganization),
        remove: jest.fn().mockResolvedValue(mockOrganization),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

      const result = await adminOrganisationService.deleteOrganization(orgId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: orgId } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockOrganization);
      expect(result).toEqual(mockOrganization); // Ensure this matches the expected return value
    });

    it("should throw a 404 error if organization is not found", async () => {
      const orgId = "nonexistentOrg";

      const mockRepository = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

      await expect(adminOrganisationService.deleteOrganization(orgId)).rejects.toThrow(HttpError);
      await expect(adminOrganisationService.deleteOrganization(orgId)).rejects.toThrow("Organization not found");
    });

    it("should throw an error if deletion fails", async () => {
      const orgId = "org123";

      const mockOrganization = {
        id: orgId,
        name: "Test Organization",
        description: "This is a test organization",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Organization;

      const mockRepository = {
        findOne: jest.fn().mockResolvedValue(mockOrganization),
        remove: jest.fn().mockRejectedValue(new Error("Deletion failed")),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

      await expect(adminOrganisationService.deleteOrganization(orgId)).rejects.toThrow(HttpError);
      await expect(adminOrganisationService.deleteOrganization(orgId)).rejects.toThrow("Deletion failed");
    });
  });



});
