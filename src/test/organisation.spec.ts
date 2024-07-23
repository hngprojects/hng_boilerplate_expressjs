// @ts-nocheck
import { OrgService } from "../services";
import { Organization, UserOrganization } from "../models";
import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";
import { BadRequest } from "../middleware";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {
        save: jest.fn(),
      },
    },
  };
});

describe("OrgService", () => {
  let orgService: OrgService;
  let mockManager;

  beforeEach(() => {
    orgService = new OrgService();
    mockManager = {
      save: jest.fn(),
    };
    AppDataSource.manager = mockManager;
  });

  describe("createOrganisation", () => {
    it("should create a new organisation successfully", async () => {
      const payload = {
        name: "fawaz",
        description: "description",
        email: "sa@gm.com",
        industry: "entertainment",
        type: "music",
        country: "Nigeria",
        address: "address",
        state: "Oyo",
      };
      const userId = "user-id-123";

      const newOrganisation = {
        ...payload,
        owner_id: userId,
        id: "org-id-123",
        slug: "9704ffa3-8d6e-4b5b-aee6-9168a998a67a",
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newUserOrganization = {
        userId: userId,
        organizationId: newOrganisation.id,
        role: UserRole.ADMIN,
      };

      mockManager.save.mockResolvedValueOnce(newOrganisation);
      mockManager.save.mockResolvedValueOnce(newUserOrganization);

      const result = await orgService.createOrganisation(payload, userId);

      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(mockManager.save).toHaveBeenCalledWith(expect.any(Organization));
      expect(mockManager.save).toHaveBeenCalledWith(
        expect.any(UserOrganization)
      );
      expect(result).toEqual({ newOrganisation });
    });

    it("should throw a BadRequest error if saving fails", async () => {
      const payload = {
        name: "fawaz",
        description: "description",
        email: "sa@gm.com",
        industry: "entertainment",
        type: "music",
        country: "Nigeria",
        address: "address",
        state: "Oyo",
      };
      const userId = "user-id-123";

      mockManager.save.mockRejectedValue({
        status: "Bad Request",
        message: "Client error",
        status_code: 400,
      });

      await expect(
        orgService.createOrganisation(payload, userId)
      ).rejects.toThrow();
    });

    it("should throw a BadRequest error if saving fails", async () => {
      const payload = {
        name: "fawaz",
        description: "description",
        email: "sa@gm.com",
        industry: "entertainment",
        type: "music",
        country: "Nigeria",
        address: "address",
        state: "Oyo",
      };
      const userId = "user-id-123";

      mockManager.save.mockRejectedValue({
        status: "Bad Request",
        message: "Client error",
        status_code: 400,
      });

      await expect(
        orgService.createOrganisation(payload, userId)
      ).rejects.toThrow();
    });
  });
});
