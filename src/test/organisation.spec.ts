// @ts-nocheck
import { OrgService } from "../services";
import { Organization, User, UserOrganization } from "../models";
import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";
import { BadRequest } from "../middleware";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/index.ts";

import { authMiddleware } from "../middleware/auth.ts";
import { OrgService } from "../services/organisation.service.ts";
import { OrgController } from "../controllers/OrgController.ts";
import { validateOrgId } from "../middleware/organization.validation.ts";
import { InvalidInput } from "../middleware/error.ts";
import { authMiddleware } from "../middleware";
import { OrgService } from "../services/organisation.service";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {
        save: jest.fn(),
        findOne: jest.fn(),
      },
      getRepository: jest.fn(),
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../models");
jest.mock("jsonwebtoken");

describe("OrgService", () => {
  let orgService: OrgService;
  let mockManager;

  beforeEach(() => {
    orgService = new OrgService();
    mockManager = {
      save: jest.fn(),
      findOne: jest.fn(),
    };
    AppDataSource.manager = mockManager;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockManager);
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
        expect.any(UserOrganization),
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

      mockManager.save.mockRejectedValue(new Error("Client error"));

      await expect(
        orgService.createOrganisation(payload, userId),
      ).rejects.toThrow(BadRequest);
    });
  });

  describe("removeUser", () => {
    it("should remove a user from an organization successfully", async () => {
      const org_id = "org-id-123";
      const user_id = "user-id-123";

      const user = {
        id: user_id,
        organizations: [
          {
            id: org_id,
          },
        ],
      };

      const organization = {
        id: org_id,
        users: [{ id: user_id }],
      };

      mockManager.findOne.mockResolvedValueOnce(user);
      mockManager.findOne.mockResolvedValueOnce(organization);

      const result = await orgService.removeUser(org_id, user_id);

      expect(result).toEqual(user);
    });

    it("should return null if user is not found", async () => {
      const org_id = "org-id-123";
      const user_id = "user-id-123";

      mockManager.findOne.mockResolvedValueOnce(null);

      const result = await orgService.removeUser(org_id, user_id);

      expect(result).toBeNull();
    });

    it("should return null if organization is not found", async () => {
      const org_id = "org-id-123";
      const user_id = "user-id-123";

      const user = {
        id: user_id,
        organizations: [],
      };

      mockManager.findOne.mockResolvedValueOnce(user);
      mockManager.findOne.mockResolvedValueOnce(null);

      const result = await orgService.removeUser(org_id, user_id);

      expect(result).toBeNull();
    });
  });
});

describe("Organization Controller and Middleware", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let mockManager;

  beforeEach(() => {
    orgController = new OrgController();
    mockManager = {
      findOne: jest.fn(),
    };
    AppDataSource.manager = mockManager;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockManager);
  });

  it("check if user is authenticated", async () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
      user: undefined,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      callback(null, { userId: "user123" });
    });

    User.findOne = jest.fn().mockResolvedValue({
      id: "donalTrump123",
      email: "americaPresident@newyork.com",
    });

    await authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe("donalTrump123");
    expect(next).toHaveBeenCalled();
  });

  it("should get a single user org", async () => {
    const orgId = "1";
    const orgRes = {
      org_id: "1",
      name: "Org 1",
      description: "Org 1 description",
    };

    mockManager.findOne.mockResolvedValue(orgRes);

    // const result = await orgService.getSingleOrg(orgId);

    // expect(mockManager.findOne).toHaveBeenCalledWith({
    //   where: { id: orgId },
    //   relations: ["users"],
    // });
    // expect(mockManager.findOne).toHaveBeenCalledTimes(1);
    // expect(result).toEqual(orgRes);
  });

  it("should return 404 if org not found", async () => {
    const orgId = "bidenNewYork123";

    mockManager.findOne.mockResolvedValue(null);

    const req = {
      params: { org_id: orgId },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await orgController.getSingleOrg(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "forbidden",
      message: "Organization not found",
      status_code: 404,
    });
  });

  it("should pass valid UUID for org_id", async () => {
    const req = {
      params: { org_id: "123e4567-e89b-12d3-a456-426614174000" },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    await validateOrgId[0](req, res, next);
    await validateOrgId[1](req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith();
  });

  it("should throw InvalidInput for empty org_id", async () => {
    const req = {
      params: { org_id: "" },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    await validateOrgId[0](req, res, next);

    expect(() => validateOrgId[1](req, res, next)).toThrow(InvalidInput);
    expect(() => validateOrgId[1](req, res, next)).toThrow(
      "Organisation id is required",
    );
  });

  it("should throw InvalidInput for non-UUID org_id", async () => {
    const req = {
      params: { org_id: "donald-trump-for-president" },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    await validateOrgId[0](req, res, next);

    expect(() => validateOrgId[1](req, res, next)).toThrow(InvalidInput);
    expect(() => validateOrgId[1](req, res, next)).toThrow(
      "Valid org_id must be provided",
    );
  });
});
