// @ts-nocheck

import AppDataSource from "../data-source.ts";
import { User } from "../models/index.ts";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/index.ts";


import { authMiddleware } from "../middleware/auth.ts";
import { OrgService } from "../services/organisation.service.ts";
import { OrgController } from "../controllers/OrgController.ts";
import { validateOrgId } from "../middleware/organization.validation.ts";
import { InvalidInput } from "../middleware/error.ts";

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

describe("getAllOrgs", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let mockRepository;

  beforeEach(() => {
    orgService = new OrgService();
    orgController = new OrgController();

    mockRepository = {
      findAndCount: jest.fn(),
    };

    AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);
  });

  it("should get all organizations with pagination", async () => {
    const organizations = [
      { id: "1", name: "Org 1", description: "Org 1 description" },
      { id: "2", name: "Org 2", description: "Org 2 description" },
    ];
    const total = 2;
    mockRepository.findAndCount.mockResolvedValue([organizations, total]);

    const req = {
      query: { page: "1", limit: "2" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await orgController.getAllOrgs(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      status_code: 200,
      data: organizations,
      pagination: {
        total,
        page: 1,
        limit: 2,
      },
    });
  });

  it("should handle errors", async () => {
    mockRepository.findAndCount.mockRejectedValue(new Error("Failed to get organizations"));

    const req = {
      query: { page: "1", limit: "2" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await orgController.getAllOrgs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to retrieve organizations. Please try again later.",
    });
  });
});