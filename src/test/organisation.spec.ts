// @ts-nocheck
import { OrgService } from "../services";
import { Organization, User, UserOrganization } from "../models";
import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";
import { BadRequest } from "../middleware";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/index.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { OrgController } from "../controllers";
import { validateOrgId } from "../middleware/organizationValidation.ts";
import {
  InvalidInput,
  HttpError,
  ResourceNotFound,
} from "../middleware/error.ts";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    }),
    manager: {
      save: jest.fn(),
      findOne: jest.fn(),
    },
    initialize: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock("../models");
jest.mock("jsonwebtoken");

describe("Organization Controller and Middleware", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let mockManager;

  beforeEach(() => {
    orgController = new OrgController();
    mockManager = {
      findOne: jest.fn(),
      save: jest.fn(),
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

describe("Update User Organization", () => {
  let orgService: OrgService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);
    orgService = new OrgService();
  });

  it("should successfully update organization details", async () => {
    const mockOrgId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "user123";
    const updateData = {
      name: "New Organization Name",
      email: "newemail@example.com",
      industry: "Tech",
      type: "Private",
      country: "NGA",
      address: "1234 New HNG",
      state: "Lagos",
      description: "A new description of the organization.",
    };

    const mockOrg = {
      id: mockOrgId,
      ...updateData,
    };

    mockRepository.findOne.mockResolvedValue(mockOrg);
    mockRepository.update.mockResolvedValue(mockOrg);

    const result = await orgService.updateOrganizationDetails(
      mockOrgId,
      userId,
      updateData,
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockOrgId, userOrganizations: { user: { id: userId } } },
    });

    expect(mockRepository.update).toHaveBeenCalledWith(mockOrgId, updateData);
    expect(result).toEqual(mockOrg);
  });

  it("should throw ResourceNotFound if organization does not exist", async () => {
    const mockOrgId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "user123";
    const updateData = {
      name: "New Organization Name",
      email: "newemail@example.com",
      industry: "Tech",
      type: "Private",
      country: "NGA",
      address: "1234 New HNG",
      state: "Lagos",
      description: "A new description of the organization.",
    };

    mockRepository.findOne.mockResolvedValue(null);

    await expect(
      orgService.updateOrganizationDetails(mockOrgId, userId, updateData),
    ).rejects.toThrow(ResourceNotFound);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockOrgId, userOrganizations: { user: { id: userId } } },
    });

    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
