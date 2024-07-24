//@ts-nocheck
import { Request, Response } from "express";
import { OrgController } from "../controllers/OrgController";
import { OrgService } from "../services/organisation.service";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import AppDataSource from "../data-source";

jest.mock("../data-source");

describe("OrgService and OrgController", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let userRepositoryMock: any;
  let organizationRepositoryMock: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    orgService = new OrgService();
    orgController = new OrgController();

    userRepositoryMock = {
      findOne: jest.fn(),
    };
    organizationRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
      if (model === User) {
        return userRepositoryMock;
      }
      if (model === Organization) {
        return organizationRepositoryMock;
      }
    });

    req = {
      params: {
        org_id: "org-id",
        user_id: "user-id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("OrgService", () => {
    it("should remove a user from an organization", async () => {
      const userId = "user-id";
      const orgId = "org-id";

      const mockUser = {
        id: userId,
        organizations: [{ id: orgId }],
      };
      const mockOrganization = {
        id: orgId,
        users: [{ id: userId }],
      };

      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

      const result = await orgService.removeUser(orgId, userId);

      expect(result).toEqual(mockUser);
      expect(organizationRepositoryMock.save).toHaveBeenCalledWith({
        ...mockOrganization,
        users: [],
      });
    });

    it("should return null if user does not exist", async () => {
      const userId = "user-id";
      const orgId = "org-id";

      userRepositoryMock.findOne.mockResolvedValue(null);

      const result = await orgService.removeUser(orgId, userId);

      expect(result).toBeNull();
    });

    it("should return null if organization does not exist", async () => {
      const userId = "user-id";
      const orgId = "org-id";

      const mockUser = {
        id: userId,
        organizations: [{ id: orgId }],
      };

      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      organizationRepositoryMock.findOne.mockResolvedValue(null);

      const result = await orgService.removeUser(orgId, userId);

      expect(result).toBeNull();
    });

    it("should return null if user is not part of the organization", async () => {
      const userId = "user-id";
      const orgId = "org-id";

      const mockUser = {
        id: userId,
        organizations: [{ id: "different-org-id" }],
      };
      const mockOrganization = {
        id: orgId,
        users: [{ id: "different-user-id" }],
      };

      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

      const result = await orgService.removeUser(orgId, userId);

      expect(result).toBeNull();
    });
  });
});
