// @ts-nocheck

import AppDataSource from "../data-source.ts";
import { User, Organization, Invitation } from "../models/index.ts";
import jwt from "jsonwebtoken";
import { AuthService, OrgService } from "../services/index.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { OrgService } from "../services/organisation.service.ts";
import { OrgController } from "../controllers/OrgController.ts";
import { validateOrgId } from "../middleware/organization.validation.ts";
import { InvalidInput } from "../middleware/error.ts";
import { v4 as uuidv4 } from 'uuid';

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {},
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../models");
jest.mock("jsonwebtoken");
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-token'),
}));

describe("single organization", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let mockManager;

  beforeEach(() => {
    orgService = new OrgService();
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
    const userId = "donalTrump123";
    const orgRes = {
      org_id: "1",
      name: "Org 1",
      description: "Org 1 description",
    };

    mockManager.findOne.mockResolvedValue(orgRes);

    const result = await orgService.getSingleOrg(orgId);

    expect(mockManager.findOne).toHaveBeenCalledWith({
      where: { id: orgId },
      relations: ["users"],
    });
    expect(mockManager.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(orgRes);
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
      "Organisation id is required"
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
      "Valid org_id must be provided"
    );
  });
});


describe("OrgService", () => {
  let orgService: OrgService;
  let mockUserRepository;
  let mockOrganizationRepository;
  let mockInvitationRepository;

  beforeEach(() => {
    orgService = new OrgService();
    mockUserRepository = {
      findOne: jest.fn(),
    };
    mockOrganizationRepository = {
      findOne: jest.fn(),
    };
    mockInvitationRepository = {
      save: jest.fn(),
    };
    AppDataSource.getRepository = jest.fn((model) => {
      switch (model) {
        case User:
          return mockUserRepository;
        case Organization:
          return mockOrganizationRepository;
        case Invitation:
          return mockInvitationRepository;
        default:
          return {};
      }
    });
  });

  it("should throw an error if the user is not an admin", async () => {
    const adminId = "non-admin-user-id";
    const orgId = "organization-id";
    const email = "user@example.com";
    const expiresIn = 3600;

    mockUserRepository.findOne.mockResolvedValue({ id: adminId, role: "user" });

    await expect(
      orgService.createInvitation(adminId, orgId, email, expiresIn)
    ).rejects.toThrow(Unauthorized);
  });

  it("should throw an error if the admin is not found", async () => {
    const adminId = "non-existing-user-id";
    const orgId = "organization-id";
    const email = "user@example.com";
    const expiresIn = 3600;

    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      orgService.createInvitation(adminId, orgId, email, expiresIn)
    ).rejects.toThrow(Unauthorized);
  });

  it("should allow an admin to send an invitation", async () => {
    const adminId = "admin-user-id";
    const orgId = "organization-id";
    const email = "user@example.com";
    const expiresIn = 3600;

    const adminUser = { id: adminId, role: "admin" };
    const organization = { id: orgId, users: [] };
    const user = { id: "user-id", email };

    mockUserRepository.findOne.mockImplementation((query) => {
      if (query.where.id === adminId) {
        return Promise.resolve(adminUser);
      }
      if (query.where.email === email) {
        return Promise.resolve(user);
      }
      return Promise.resolve(null);
    });

    mockOrganizationRepository.findOne.mockResolvedValue(organization);

    const result = await orgService.createInvitation(adminId, orgId, email, expiresIn);

    expect(result).toBeTruthy();
    expect(result.token).toBe('test-token');
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(result.user).toEqual(user);
    expect(result.organization).toEqual(organization);
    expect(mockInvitationRepository.save).toHaveBeenCalledWith(result);
  });

  it("should return null if the organization is not found", async () => {
    const adminId = "admin-user-id";
    const orgId = "non-existing-org-id";
    const email = "user@example.com";
    const expiresIn = 3600;

    const adminUser = { id: adminId, role: "admin" };

    mockUserRepository.findOne.mockResolvedValue(adminUser);
    mockOrganizationRepository.findOne.mockResolvedValue(null);

    const result = await orgService.createInvitation(adminId, orgId, email, expiresIn);

    expect(result).toBeNull();
  });

  it("should return null if the user to invite is not found", async () => {
    const adminId = "admin-user-id";
    const orgId = "organization-id";
    const email = "non-existing-user@example.com";
    const expiresIn = 3600;

    const adminUser = { id: adminId, role: "admin" };
    const organization = { id: orgId, users: [] };

    mockUserRepository.findOne.mockImplementation((query) => {
      if (query.where.id === adminId) {
        return Promise.resolve(adminUser);
      }
      return Promise.resolve(null);
    });

    mockOrganizationRepository.findOne.mockResolvedValue(organization);

    const result = await orgService.createInvitation(adminId, orgId, email, expiresIn);

    expect(result).toBeNull();
  });
});